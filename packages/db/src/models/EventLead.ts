import { Schema, model, type Model, type Document } from "mongoose";
import type { Types } from "mongoose";

export interface IEventLead extends Document {
  email: string;
  event: Types.ObjectId; 
  consent: boolean;
  redirectedAt?: Date; 
  originalEventUrl: string; 
  createdAt: Date;
  updatedAt: Date;
}

const EventLeadSchema = new Schema<IEventLead>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    consent: {
      type: Boolean,
      required: true,
      default: false
    },
    redirectedAt: {
      type: Date
    },
    originalEventUrl: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
EventLeadSchema.index({ email: 1 });
EventLeadSchema.index({ event: 1 });
EventLeadSchema.index({ consent: 1 });
EventLeadSchema.index({ createdAt: 1 });
EventLeadSchema.index({ event: 1, email: 1 });

export const EventLead: Model<IEventLead> = model<IEventLead>("EventLead", EventLeadSchema);

