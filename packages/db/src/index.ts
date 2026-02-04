import { PrismaClient } from "./generated/prisma/index.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
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
    // Prisma 7: Requires adapter for PostgreSQL
    const pool = new Pool({ connectionString: databaseUrl });
    const adapter = new PrismaPg(pool);
    
    prisma = new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
      errorFormat: "minimal" // Reduce verbose error output
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

export async function disconnectDB(): Promise<void> {
  if (!isConnected || !prisma) return;

  await prisma.$disconnect();
  prisma = null;
  isConnected = false;
  console.log("Database disconnected");
}

export function getPrisma(): PrismaClient {
  if (!prisma) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return prisma;
}

// Export PrismaClient and all Prisma types directly
export { PrismaClient, Prisma } from "./generated/prisma/index.js";
export type { 
  Admin, 
  Event, 
  EventLead, 
  Provider, 
  EventStatus
} from "./generated/prisma/index.js";

