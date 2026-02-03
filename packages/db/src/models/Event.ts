import { Schema, model, type Model, type Document } from "mongoose";
import type { Types } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  summary: string;
  venueName: string;
  venueAddress: string;
  city: string;
  category: string;
  dateTime: {
    start: Date;
    end: Date;
    timezone: string;
  };
  imageUrl?: string;
  posterUrl?: string;
  sourceWebsite: string;
  originalUrl: string;
  lastScrapedAt?: Date;
  status: "new" | "updated" | "inactive" | "imported";
  importedAt?: Date;
  importedBy?: Types.ObjectId;
  importNotes?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  approve: () => Promise<IEvent>;
  reject: () => Promise<IEvent>;
}

export interface IEventModel extends Model<IEvent> {
  findApproved: () => Promise<IEvent[]>;
  findPending: () => Promise<IEvent[]>;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    venueName: {
      type: String,
      required: true,
      trim: true
    },
    venueAddress: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true,
      default: "Sydney"
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    dateTime: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      },
      timezone: {
        type: String,
        required: true,
        default: "Australia/Sydney"
      }
    },
    imageUrl: {
      type: String
    },
    posterUrl: {
      type: String
    },
    sourceWebsite: {
      type: String,
      required: true,
      trim: true
    },
    originalUrl: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    lastScrapedAt: {
      type: Date
    },
    status: {
      type: String,
      enum: ["new", "updated", "inactive", "imported"],
      default: "new"
    },
    importedAt: {
      type: Date
    },
    importedBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin"
    },
    importNotes: {
      type: String,
      trim: true
    },
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes
EventSchema.index({ status: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ city: 1 });
EventSchema.index({ isApproved: 1 });
EventSchema.index({ importedBy: 1 });
EventSchema.index({ lastScrapedAt: 1 });
EventSchema.index({ importedAt: 1 });
EventSchema.index({ sourceWebsite: 1 });
EventSchema.index({ originalUrl: 1 });
EventSchema.index({ "dateTime.start": 1 });
EventSchema.index({ isApproved: 1, status: 1 });
EventSchema.index({ city: 1, isApproved: 1, status: 1 });
EventSchema.index({ sourceWebsite: 1, lastScrapedAt: 1 });

// Instance method to approve an event
EventSchema.methods.approve = function () {
  this.isApproved = true;
  return this.save();
};

// Instance method to reject/unapprove an event
EventSchema.methods.reject = function () {
  this.isApproved = false;
  return this.save();
};

// Static method to find all approved (publicly accessible) events
EventSchema.statics.findApproved = function () {
  return this.find({ isApproved: true, status: { $ne: "inactive" } });
};

// Static method to find pending approval events
EventSchema.statics.findPending = function () {
  return this.find({ isApproved: false });
};

export const Event: IEventModel = model<IEvent, IEventModel>("Event", EventSchema);

