import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type DishAvailability = 'AVAILABLE' | 'OUT_OF_STOCK' | 'SEASONAL';
export type DishStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface IRichText {
  type: string;
  content: any[];
}

export interface INutrition {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}

export interface IDishOptions {
  allowCustomization?: boolean;
  addons?: Array<{
    name_he: string;
    price: number;
  }>;
}

export interface IDish extends Document {
  title_he: string;
  slug: string;
  menuIds: Types.ObjectId[];
  categoryIds: Types.ObjectId[];
  description_he?: IRichText;
  price: number;
  currency: string;
  spiceLevel: number;
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  allergens: string[];
  mediaIds: Types.ObjectId[];
  badges: string[];
  availability: DishAvailability;
  nutrition?: INutrition;
  options?: IDishOptions;
  seoId?: Types.ObjectId;
  status: DishStatus;
  publishAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DishSchema = new Schema<IDish>(
  {
    title_he: {
      type: String,
      required: [true, 'כותרת המנה בעברית נדרשת'],
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
    menuIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Menu',
      default: [],
      index: true,
    },
    categoryIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Category',
      default: [],
      index: true,
    },
    description_he: {
      type: Schema.Types.Mixed,
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'מחיר נדרש'],
      min: [0, 'מחיר לא יכול להיות שלילי'],
    },
    currency: {
      type: String,
      default: 'ILS',
      uppercase: true,
    },
    spiceLevel: {
      type: Number,
      min: 0,
      max: 3,
      default: 0,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    allergens: {
      type: [String],
      default: [],
    },
    mediaIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Media',
      default: [],
    },
    badges: {
      type: [String],
      default: [],
    },
    availability: {
      type: String,
      enum: {
        values: ['AVAILABLE', 'OUT_OF_STOCK', 'SEASONAL'],
        message: 'זמינות חייבת להיות AVAILABLE, OUT_OF_STOCK או SEASONAL',
      },
      default: 'AVAILABLE',
    },
    nutrition: {
      type: {
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number,
        fiber: Number,
      },
      default: null,
    },
    options: {
      type: Schema.Types.Mixed,
      default: null,
    },
    seoId: {
      type: Schema.Types.ObjectId,
      ref: 'SeoMeta',
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
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
DishSchema.index({ slug: 1 }, { unique: true });
DishSchema.index({ status: 1, publishAt: 1 });
DishSchema.index({ menuIds: 1, status: 1 });
DishSchema.index({ categoryIds: 1, status: 1 });

// Pre-save hook for slug generation
DishSchema.pre('save', async function (next) {
  if (this.isModified('title_he') && !this.slug) {
    // Basic Hebrew to Latin transliteration for slug
    // This will be improved with the slugify utility later
    const baseSlug = this.title_he
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    // Ensure uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Dish.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

// Validation method
DishSchema.methods.validatePublish = function (): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!this.title_he) errors.push('כותרת נדרשת');
  if (!this.slug) errors.push('מזהה ייחודי נדרש');
  if (this.price <= 0) errors.push('מחיר תקין נדרש');
  if (!this.categoryIds || this.categoryIds.length === 0) errors.push('לפחות קטגוריה אחת נדרשת');
  if (this.mediaIds.length === 0) errors.push('לפחות תמונה אחת נדרשת');

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Prevent model recompilation in development
const Dish: Model<IDish> = mongoose.models.Dish || mongoose.model<IDish>('Dish', DishSchema);

export default Dish;
