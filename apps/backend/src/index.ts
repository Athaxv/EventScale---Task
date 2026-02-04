import "dotenv/config";
import express from "express";
import cors from "cors";
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

app.get("/", async (req, res) => {
    res.status(200).json({ message: "Hello World" });
});

app.get("/admin/events", async (req, res) => {
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

app.post("/admin/event/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Event ID is required" });
        }
        const event = await prisma.event.update({
            where: { id },
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