import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  name_he: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name_he: {
      type: String,
      required: [true, 'שם הקטגוריה בעברית נדרש'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'מזהה ייחודי (slug) נדרש'],
      lowercase: true,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
CategorySchema.index({ slug: 1 }, { unique: true });
CategorySchema.index({ order: 1 });

// Pre-save hook to generate slug if not provided
CategorySchema.pre('save', async function (next) {
  if (this.isModified('name_he') && !this.slug) {
    // Basic Hebrew to Latin transliteration for slug
    // This will be improved with the slugify utility later
    this.slug = this.name_he
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  }
  next();
});

// Prevent model recompilation in development
const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
