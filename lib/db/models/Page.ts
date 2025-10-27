import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type PageType = 'HOME' | 'ABOUT' | 'RESTAURANT' | 'CATERING' | 'EVENTS';
export type PageStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';
export type BlockType =
  | 'Hero'
  | 'StoryRail'
  | 'MenuSampler'
  | 'SocialProof'
  | 'LocationCTA'
  | 'RichText'
  | 'Marquee';
export type EntranceDirection = 'right' | 'left' | 'top' | 'bottom';

export interface IAnimationPreset {
  duration: number;
  ease: string;
  stagger: number;
  entranceDirection: EntranceDirection;
  clipMask: boolean;
  parallaxDepth: number;
  pin: boolean;
}

export interface IPageSection {
  id: string;
  type: BlockType;
  order: number;
  visibility: boolean;
  animationPreset?: IAnimationPreset;
  data: Record<string, any>;
}

export interface IPage extends Document {
  page: PageType;
  sections: IPageSection[];
  seoId?: Types.ObjectId;
  status: PageStatus;
  publishAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AnimationPresetSchema = new Schema<IAnimationPreset>(
  {
    duration: {
      type: Number,
      default: 0.6,
      min: 0,
      max: 5,
    },
    ease: {
      type: String,
      default: 'power2.out',
    },
    stagger: {
      type: Number,
      default: 0.1,
      min: 0,
      max: 1,
    },
    entranceDirection: {
      type: String,
      enum: ['right', 'left', 'top', 'bottom'],
      default: 'right',
    },
    clipMask: {
      type: Boolean,
      default: false,
    },
    parallaxDepth: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    pin: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const PageSectionSchema = new Schema<IPageSection>(
  {
    id: {
      type: String,
      required: [true, 'מזהה המקטע נדרש'],
    },
    type: {
      type: String,
      enum: {
        values: ['Hero', 'StoryRail', 'MenuSampler', 'SocialProof', 'LocationCTA', 'RichText', 'Marquee'],
        message: 'סוג בלוק לא תקין',
      },
      required: [true, 'סוג הבלוק נדרש'],
    },
    order: {
      type: Number,
      required: [true, 'סדר המקטע נדרש'],
      min: 0,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    animationPreset: {
      type: AnimationPresetSchema,
      default: () => ({}),
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const PageSchema = new Schema<IPage>(
  {
    page: {
      type: String,
      enum: {
        values: ['HOME', 'ABOUT', 'RESTAURANT', 'CATERING', 'EVENTS'],
        message: 'סוג העמוד חייב להיות HOME, ABOUT, RESTAURANT, CATERING או EVENTS',
      },
      required: [true, 'סוג העמוד נדרש'],
      unique: true,
      index: true,
    },
    sections: {
      type: [PageSectionSchema],
      default: [],
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
PageSchema.index({ page: 1 }, { unique: true });
PageSchema.index({ status: 1, publishAt: 1 });

// Method to validate block structure
PageSchema.methods.validateBlocks = function (): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for duplicate section IDs
  const ids = this.sections.map((s: IPageSection) => s.id);
  const duplicates = ids.filter((id: string, index: number) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    errors.push(`נמצאו מזהי מקטע כפולים: ${duplicates.join(', ')}`);
  }

  // Check for duplicate orders
  const orders = this.sections.map((s: IPageSection) => s.order);
  const dupOrders = orders.filter((order: number, index: number) => orders.indexOf(order) !== index);
  if (dupOrders.length > 0) {
    errors.push(`נמצאו מספרי סדר כפולים: ${dupOrders.join(', ')}`);
  }

  // Validate each section has required data based on type
  this.sections.forEach((section: IPageSection, index: number) => {
    if (!section.data || Object.keys(section.data).length === 0) {
      errors.push(`מקטע ${index} (${section.type}) חסר נתונים`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Method to reorder sections
PageSchema.methods.reorderSections = function (): void {
  this.sections.sort((a: IPageSection, b: IPageSection) => a.order - b.order);
};

// Prevent model recompilation in development
const Page: Model<IPage> = mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);

export default Page;
