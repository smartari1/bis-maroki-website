import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ISeoMeta extends Document {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImageId?: Types.ObjectId;
  noindex: boolean;
  jsonLd?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const SeoMetaSchema = new Schema<ISeoMeta>(
  {
    title: {
      type: String,
      trim: true,
      maxlength: [60, 'כותרת SEO לא צריכה לעבור 60 תווים'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [160, 'תיאור SEO לא צריך לעבור 160 תווים'],
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    ogImageId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
    noindex: {
      type: Boolean,
      default: false,
    },
    jsonLd: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Validation method for SEO best practices
SeoMetaSchema.methods.validateSeo = function (): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!this.title) {
    warnings.push('כותרת SEO חסרה');
  } else if (this.title.length < 30) {
    warnings.push('כותרת SEO קצרה מדי (מומלץ מינימום 30 תווים)');
  }

  if (!this.description) {
    warnings.push('תיאור SEO חסר');
  } else if (this.description.length < 50) {
    warnings.push('תיאור SEO קצר מדי (מומלץ מינימום 50 תווים)');
  }

  if (!this.ogImageId) {
    warnings.push('תמונת Open Graph חסרה');
  }

  return {
    valid: warnings.length === 0,
    warnings,
  };
};

// Prevent model recompilation in development
const SeoMeta: Model<ISeoMeta> =
  mongoose.models.SeoMeta || mongoose.model<ISeoMeta>('SeoMeta', SeoMetaSchema);

export default SeoMeta;
