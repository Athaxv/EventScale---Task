import { model, Model, Schema, type Document } from "mongoose";

export interface IAdmin extends Document {
    name: string;
    email: string;
    avatar: string | null;
    provider: "google" | "email";
    providerId: string | null;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    avatar: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        enum: ["google", "email"],
        default: "email"
    },
    providerId: {
        type: String,
        default: null
    },
    password: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

export const Admin: Model<IAdmin> = model<IAdmin>("Admin", AdminSchema);