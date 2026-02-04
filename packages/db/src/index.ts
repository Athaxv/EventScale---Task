import { PrismaClient } from "./generated/prisma/index.js";
import "dotenv/config";

let prisma: PrismaClient | null = null;
let isConnected = false;

export async function connectDB(connectionString?: string): Promise<void> {
  if (isConnected && prisma) {
    console.log("Database already connected");
    return;
  }

  const databaseUrl = connectionString || process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL not provided");
  }

  try {
    // Prisma 7: Connection URL is read from prisma.config.ts or DATABASE_URL env var
    // We can override it by setting the env var before creating the client
    if (connectionString && connectionString !== process.env.DATABASE_URL) {
      process.env.DATABASE_URL = connectionString;
    }
    
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
    });

    // Test connection
    await prisma.$connect();

    isConnected = true;
    console.log("✅ NeonDB (PostgreSQL) connected via Prisma");
  } catch (error) {
    console.error("Failed to connect to NeonDB:", error);
    isConnected = false;
    throw error;
  }
}

// Export Prisma types (with aliases to avoid conflicts)
export type { 
  Admin as PrismaAdmin, 
  Event as PrismaEvent, 
  EventLead as PrismaEventLead, 
  Provider, 
  EventStatus 
} from "./generated/prisma/index.js";

