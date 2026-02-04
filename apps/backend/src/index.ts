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
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());

const prisma = getPrisma();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({ error: "Google Client ID not configured" });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
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

app.get("/events", async (req, res) => {
    try {
        const events = await prisma.event.findMany({
            where: {
                isApproved: true
            },
            orderBy: {
                dateTimeStart: "asc"
            }
        });
        res.status(200).json(events);
    } catch (error) {
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
        const event = await prisma.event.update({
            where: { id: eventId },
            data: { isApproved: true }
        });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ error: "Failed to update event" });
    }
})

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});