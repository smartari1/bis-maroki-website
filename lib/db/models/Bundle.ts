import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import slugify from 'slugify';

export type BundleStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface IRichText {
  type: string;
  content: any[];
}

export interface IBundleIncludes {
  mains: number;
  salads: number;
  desserts: number;
}

export interface IBundle extends Document {
  title_he: string;
  slug: string;
  description_he?: IRichText;
  basePricePerPerson: number;
  minPersons: number;
  maxPersons?: number;
  includes: IBundleIncludes;
  allowedDishIds: Types.ObjectId[];
  mediaIds: Types.ObjectId[];
  seoId?: Types.ObjectId;
  status: BundleStatus;
  publishAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BundleSchema = new Schema<IBundle>(
  {
    title_he: {
      type: String,
      required: [true, 'כותרת המגש בעברית נדרשת'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'מזהה ייחודי (slug) נדרש'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description_he: {
      type: Schema.Types.Mixed,
      default: null,
    },
    basePricePerPerson: {
      type: Number,
      required: [true, 'מחיר לאדם נדרש'],
      min: [0, 'מחיר לא יכול להיות שלילי'],
    },
    minPersons: {
      type: Number,
      default: 10,
      min: [1, 'מינימום סועדים חייב להיות לפחות 1'],
    },
    maxPersons: {
      type: Number,
      default: null,
    },
    includes: {
      mains: {
        type: Number,
        required: [true, 'מספר עיקריות נדרש'],
        min: [0, 'מספר עיקריות לא יכול להיות שלילי'],
      },
      salads: {
        type: Number,
        required: [true, 'מספר סלטים נדרש'],
        min: [0, 'מספר סלטים לא יכול להיות שלילי'],
      },
      desserts: {
        type: Number,
        required: [true, 'מספר קינוחים נדרש'],
        min: [0, 'מספר קינוחים לא יכול להיות שלילי'],
      },
    },
    allowedDishIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Dish',
      default: [],
    },
    mediaIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Media',
      default: [],
    },
    seoId: {
      type: Schema.Types.ObjectId,
      ref: 'SeoMeta',
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PUBLISHED', 'SCHEDULED'],
        message: 'סטטוס חייב להיות DRAFT, PUBLISHED או SCHEDULED',
      },
      default: 'DRAFT',
      index: true,
    },
    publishAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'bundles',
  }
);

// Indexes
BundleSchema.index({ status: 1, publishAt: 1 });
BundleSchema.index({ slug: 1 }, { unique: true });

// Auto-generate slug if not provided
BundleSchema.pre('save', async function (next) {
  if (!this.slug && this.title_he) {
    // Transliterate Hebrew to Latin for slug
    const baseSlug = slugify(this.title_he, {
      lower: true,
      strict: true,
      replacement: '-',
    });

    // Ensure uniqueness
    let slug = baseSlug;
    let counter = 1;
    const BundleModel = this.constructor as Model<IBundle>;
    while (await BundleModel.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }

  // Validate minPersons <= maxPersons if maxPersons is set
  if (this.maxPersons && this.minPersons > this.maxPersons) {
    throw new Error('מינימום סועדים לא יכול להיות גדול ממקסימום סועדים');
  }

  next();
});

// Export model
const Bundle: Model<IBundle> =
  mongoose.models.Bundle || mongoose.model<IBundle>('Bundle', BundleSchema);

export default Bundle;
