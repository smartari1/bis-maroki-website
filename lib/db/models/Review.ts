import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Review/Testimonial Model
 * Used for customer testimonials displayed on the home page SocialProof section
 */

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId;
  customerName: string; // Hebrew name
  customerInitials?: string; // For avatar (auto-generated if not provided)
  rating: number; // 1-5 stars
  testimonialText: string; // Hebrew testimonial
  isFeatured: boolean; // True = show in large carousel, False = show in grid
  status: 'DRAFT' | 'PUBLISHED';
  order: number; // For manual sorting (lower = first)
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    customerName: {
      type: String,
      required: [true, 'שם הלקוח נדרש'],
      trim: true,
      maxlength: [100, 'שם הלקוח לא יכול להיות יותר מ-100 תווים'],
    },
    customerInitials: {
      type: String,
      trim: true,
      maxlength: [3, 'ראשי תיבות לא יכולים להיות יותר מ-3 תווים'],
    },
    rating: {
      type: Number,
      required: [true, 'דירוג נדרש'],
      min: [1, 'הדירוג המינימלי הוא 1'],
      max: [5, 'הדירוג המקסימלי הוא 5'],
      default: 5,
    },
    testimonialText: {
      type: String,
      required: [true, 'טקסט המלצה נדרש'],
      trim: true,
      minlength: [10, 'ההמלצה חייבת להיות לפחות 10 תווים'],
      maxlength: [500, 'ההמלצה לא יכולה להיות יותר מ-500 תווים'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['DRAFT', 'PUBLISHED'],
        message: 'סטטוס לא חוקי',
      },
      default: 'DRAFT',
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
reviewSchema.index({ status: 1, order: 1 }); // For fetching published reviews in order
reviewSchema.index({ isFeatured: 1, status: 1, order: 1 }); // For featured reviews

// Pre-save hook to auto-generate initials if not provided
reviewSchema.pre('save', function (next) {
  if (!this.customerInitials && this.customerName) {
    // Extract first letter of each word (up to 2 letters)
    const words = this.customerName.trim().split(/\s+/);
    this.customerInitials = words
      .slice(0, 2)
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }
  next();
});

// Check if model already exists to avoid OverwriteModelError
const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', reviewSchema);

export default Review;
