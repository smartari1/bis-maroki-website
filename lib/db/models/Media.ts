import mongoose, { Schema, Document, Model } from 'mongoose';

export type MediaKind = 'IMAGE' | 'VIDEO' | 'SVG' | 'AUDIO';

export interface IFocalPoint {
  x: number; // 0-1 (percentage)
  y: number; // 0-1 (percentage)
}

export interface IMedia extends Document {
  kind: MediaKind;
  fileKey: string;
  url: string;
  width?: number;
  height?: number;
  duration?: number;
  alt_he?: string;
  focalPoint?: IFocalPoint;
  thumbnailUrl?: string;
  blurDataUrl?: string;
  meta?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    kind: {
      type: String,
      enum: {
        values: ['IMAGE', 'VIDEO', 'SVG', 'AUDIO'],
        message: 'סוג המדיה חייב להיות IMAGE, VIDEO, SVG או AUDIO',
      },
      required: [true, 'סוג המדיה נדרש'],
    },
    fileKey: {
      type: String,
      required: [true, 'מפתח הקובץ (R2 key) נדרש'],
    },
    url: {
      type: String,
      required: [true, 'כתובת URL ציבורית נדרשת'],
    },
    width: {
      type: Number,
      required: function () {
        return this.kind === 'IMAGE' || this.kind === 'VIDEO';
      },
    },
    height: {
      type: Number,
      required: function () {
        return this.kind === 'IMAGE' || this.kind === 'VIDEO';
      },
    },
    duration: {
      type: Number,
      required: function () {
        return this.kind === 'VIDEO' || this.kind === 'AUDIO';
      },
    },
    alt_he: {
      type: String,
      trim: true,
    },
    focalPoint: {
      x: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5,
      },
      y: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5,
      },
    },
    thumbnailUrl: {
      type: String,
    },
    blurDataUrl: {
      type: String,
    },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MediaSchema.index({ fileKey: 1 }, { unique: true });
MediaSchema.index({ kind: 1 });
MediaSchema.index({ createdAt: -1 });

// Method to generate variant URL
MediaSchema.methods.getVariantUrl = function (variant: 'thumb' | 'card' | 'hero'): string {
  const sizes = {
    thumb: 200,
    card: 800,
    hero: 1600,
  };

  // This is a placeholder - actual implementation will depend on R2 setup
  return `${this.url}?w=${sizes[variant]}`;
};

// Prevent model recompilation in development
const Media: Model<IMedia> =
  mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);

export default Media;
