import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type HeroStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED';

export interface ICTA {
  label: string;
  url: string;
}

export interface IHeroTheme {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export interface IHeroAnimation {
  pathDuration?: number;
  headlineStagger?: number;
  garnishDensity?: number;
}

export interface IHeroScene extends Document {
  headline_he: string;
  sub_he?: string;
  platePath?: string;
  garnishSpriteIds: Types.ObjectId[];
  ctaPrimary?: ICTA;
  ctaSecondary?: ICTA;
  theme?: IHeroTheme;
  animation?: IHeroAnimation;
  status: HeroStatus;
  publishAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CTASchema = new Schema<ICTA>(
  {
    label: {
      type: String,
      required: [true, 'תווית CTA נדרשת'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'כתובת URL של CTA נדרשת'],
      trim: true,
    },
  },
  { _id: false }
);

const HeroThemeSchema = new Schema<IHeroTheme>(
  {
    backgroundColor: {
      type: String,
      default: '#F5E4D2',
    },
    textColor: {
      type: String,
      default: '#1A1A1A',
    },
    accentColor: {
      type: String,
      default: '#D34A2F',
    },
  },
  { _id: false }
);

const HeroAnimationSchema = new Schema<IHeroAnimation>(
  {
    pathDuration: {
      type: Number,
      default: 1.5,
      min: 0.5,
      max: 5,
    },
    headlineStagger: {
      type: Number,
      default: 0.03,
      min: 0.01,
      max: 0.1,
    },
    garnishDensity: {
      type: Number,
      default: 5,
      min: 0,
      max: 10,
    },
  },
  { _id: false }
);

const HeroSceneSchema = new Schema<IHeroScene>(
  {
    headline_he: {
      type: String,
      required: [true, 'כותרת הגיבור בעברית נדרשת'],
      trim: true,
    },
    sub_he: {
      type: String,
      trim: true,
    },
    platePath: {
      type: String,
      trim: true,
    },
    garnishSpriteIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Media',
      default: [],
    },
    ctaPrimary: {
      type: CTASchema,
    },
    ctaSecondary: {
      type: CTASchema,
    },
    theme: {
      type: HeroThemeSchema,
      default: () => ({}),
    },
    animation: {
      type: HeroAnimationSchema,
      default: () => ({}),
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
HeroSceneSchema.index({ status: 1, publishAt: 1 });
HeroSceneSchema.index({ createdAt: -1 });

// Validation method for CTA structure
HeroSceneSchema.methods.validateCTAs = function (): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (this.ctaPrimary) {
    if (!this.ctaPrimary.label) errors.push('תווית CTA ראשי נדרשת');
    if (!this.ctaPrimary.url) errors.push('כתובת URL של CTA ראשי נדרשת');
  }

  if (this.ctaSecondary) {
    if (!this.ctaSecondary.label) errors.push('תווית CTA משני נדרשת');
    if (!this.ctaSecondary.url) errors.push('כתובת URL של CTA משני נדרשת');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Prevent model recompilation in development
const HeroScene: Model<IHeroScene> =
  mongoose.models.HeroScene || mongoose.model<IHeroScene>('HeroScene', HeroSceneSchema);

export default HeroScene;
