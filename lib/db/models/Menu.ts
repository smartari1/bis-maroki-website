import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type MenuScope = 'HOME' | 'RESTAURANT' | 'CATERING' | 'EVENTS' | 'CUSTOM';
export type MenuItemKind = 'DISH' | 'BUNDLE';

export interface IMenuItem {
  kind: MenuItemKind;
  refId: Types.ObjectId;
  label?: string;
  priceOverride?: number;
}

export interface IMenu extends Document {
  title: string;
  slug: string;
  scope: MenuScope;
  items: IMenuItem[];
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    kind: {
      type: String,
      enum: {
        values: ['DISH', 'BUNDLE'],
        message: 'סוג פריט התפריט חייב להיות DISH או BUNDLE',
      },
      required: [true, 'סוג פריט התפריט נדרש'],
    },
    refId: {
      type: Schema.Types.ObjectId,
      required: [true, 'מזהה הפניה נדרש'],
      refPath: 'items.kind',
    },
    label: {
      type: String,
      trim: true,
    },
    priceOverride: {
      type: Number,
      min: [0, 'דריסת מחיר לא יכולה להיות שלילית'],
    },
  },
  { _id: false }
);

const MenuSchema = new Schema<IMenu>(
  {
    title: {
      type: String,
      required: [true, 'כותרת התפריט נדרשת'],
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
    scope: {
      type: String,
      enum: {
        values: ['HOME', 'RESTAURANT', 'CATERING', 'EVENTS', 'CUSTOM'],
        message: 'תחום התפריט חייב להיות HOME, RESTAURANT, CATERING, EVENTS או CUSTOM',
      },
      required: [true, 'תחום התפריט נדרש'],
      index: true,
    },
    items: {
      type: [MenuItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MenuSchema.index({ slug: 1 }, { unique: true });
MenuSchema.index({ scope: 1 });

// Pre-save hook for slug generation
MenuSchema.pre('save', async function (next) {
  if (this.isModified('title') && !this.slug) {
    const baseSlug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    // Ensure uniqueness
    let slug = baseSlug;
    let counter = 1;
    while (await mongoose.models.Menu.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    this.slug = slug;
  }
  next();
});

// Method to validate item references
MenuSchema.methods.validateItems = async function (): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  for (let i = 0; i < this.items.length; i++) {
    const item = this.items[i];
    const Model = item.kind === 'DISH' ? mongoose.models.Dish : mongoose.models.Bundle;

    const exists = await Model.findById(item.refId);
    if (!exists) {
      errors.push(`${item.kind} עם מזהה ${item.refId} לא נמצא באינדקס ${i}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Prevent model recompilation in development
const Menu: Model<IMenu> = mongoose.models.Menu || mongoose.model<IMenu>('Menu', MenuSchema);

export default Menu;
