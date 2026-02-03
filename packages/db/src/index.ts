import mongoose, { type ConnectOptions } from "mongoose";

let isConnected = false;

export async function connectDB(uri: string): Promise<void> {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  if (!uri) {
    throw new Error("MONGODB_URI not provided");
  }

  try {
    await mongoose.connect(uri, {
      dbName: "events_platform"
    } as ConnectOptions);

    isConnected = true;
    console.log("✅ MongoDB connected");

    // Handle connection events
    const connection = mongoose.connection as any;
    connection.on("error", (err: Error) => {
      console.error("MongoDB connection error:", err);
      isConnected = false;
    });

    connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isConnected = false;
    });

    connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
      isConnected = true;
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    isConnected = false;
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;

  await mongoose.disconnect();
  isConnected = false;
  console.log("MongoDB disconnected");
}

export { mongoose };

// Export models
export * from "./models/Event";
export * from "./models/EventLead";
export * from "./models/Admin";
