import "dotenv/config";
import express from "express";
import cors from "cors";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { connectDB, getPrisma } from "@repo/db";

// Connect to database
await connectDB();

const app = express();

// Middleware
// app.use(cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials: true
// }));

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://event-task-frontend.vercel.app'
    ]
}))
app.use(express.json());

const prisma = getPrisma();

// Initialize Google OAuth client (will be undefined if not configured)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
    console.warn('⚠️  WARNING: GOOGLE_CLIENT_ID is not set in environment variables');
}
const client = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

// Middleware to verify JWT token
const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { adminId: string };

        // Verify admin exists
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.adminId }
        });

        if (!admin) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        (req as any).admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

app.get("/", async (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

// Google OAuth login endpoint
app.post("/auth/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ error: "Google credential is required" });
        }

        // Verify the Google token
        if (!GOOGLE_CLIENT_ID || !client) {
            console.error('GOOGLE_CLIENT_ID is not configured in backend .env file');
            return res.status(500).json({
                error: "Google Client ID not configured. Please set GOOGLE_CLIENT_ID in apps/backend/.env"
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(401).json({ error: "Invalid Google token" });
        }

        const { sub: providerId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ error: "Email not provided by Google" });
        }

        // Find or create admin
        let admin = await prisma.admin.findUnique({
            where: { email }
        });

        if (!admin) {
            // Create new admin if doesn't exist
            admin = await prisma.admin.create({
                data: {
                    email,
                    name: (name || email.split('@')[0]) as string,
                    avatar: picture || null,
                    provider: 'google',
                    providerId: providerId || null,
                }
            });
        } else {
            // Update existing admin if needed
            admin = await prisma.admin.update({
                where: { id: admin.id },
                data: {
                    name: name || admin.name,
                    avatar: picture || admin.avatar,
                    provider: 'google',
                    providerId: providerId || admin.providerId,
                }
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { adminId: admin.id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                avatar: admin.avatar,
            },
            token,
        });
    } catch (error: any) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: "Failed to authenticate with Google" });
    }
});

// Verify token endpoint
app.get("/auth/verify", verifyToken, async (req, res) => {
    const admin = (req as any).admin;
    res.status(200).json({
        admin: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            avatar: admin.avatar,
        }
    });
});

app.get("/admin/events", verifyToken, async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                isApproved: false
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch events" });
    }
})

// Public endpoint: Get only approved events for marketplace
app.get("/events", async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                isApproved: true, // Only return approved events
                status: {
                    not: 'inactive' // Exclude inactive events
                }
            },
            orderBy: {
                dateTimeStart: "asc"
            }
        });
        res.status(200).json(events);
    } catch (error) {
        console.error('Failed to fetch approved events:', error);
        res.status(500).json({ error: "Failed to fetch approved events" });
    }
})

app.get('/admin/imported/events', verifyToken, async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                isApproved: true
            }
        })
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch imported events" });
    }
})

app.post("/admin/event/:id", verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Event ID is required" });
        }
        const eventId = id as string;
        const admin = (req as any).admin; // Get admin from verifyToken middleware

        const event = await prisma.event.update({
            where: { id: eventId },
            data: {
                isApproved: true,
                status: 'imported',
                importedAt: new Date(),
                importedBy: admin.email || admin.name || 'Admin'
            }
        });
        res.status(200).json(event);
    } catch (error) {
        console.error('Failed to import event:', error);
        res.status(500).json({ error: "Failed to update event" });
    }
})

// Create event lead (save email when user clicks "Get Tickets")
app.post("/events/:id/lead", async (req, res) => {
    try {
        const { id } = req.params;
        const { email, consent, originalEventUrl } = req.body;

        if (!id || Array.isArray(id)) {
            return res.status(400).json({ error: "Event ID is required" });
        }

        if (!email || !email.trim()) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const eventId = id as string;

        // Verify event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Check if lead already exists for this email and event
        const existingLead = await prisma.eventLead.findFirst({
            where: {
                eventId: eventId,
                email: email.trim().toLowerCase()
            }
        });

        if (existingLead) {
            // Update existing lead
            const updatedLead = await prisma.eventLead.update({
                where: { id: existingLead.id },
                data: {
                    consent: consent || false,
                    originalEventUrl: originalEventUrl || event.originalUrl,
                    redirectedAt: new Date()
                }
            });
            return res.status(200).json(updatedLead);
        }

        // Create new lead
        const lead = await prisma.eventLead.create({
            data: {
                email: email.trim().toLowerCase(),
                eventId: eventId,
                consent: consent || false,
                originalEventUrl: originalEventUrl || event.originalUrl,
                redirectedAt: new Date()
            }
        });

        res.status(201).json(lead);
    } catch (error: any) {
        console.error('Failed to create event lead:', error);
        if (error.code === 'P2002') {
            return res.status(409).json({ error: "Lead already exists" });
        }
        res.status(500).json({ error: "Failed to save lead" });
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});