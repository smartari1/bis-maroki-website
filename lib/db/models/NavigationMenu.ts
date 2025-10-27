import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INavItem {
  label_he: string;
  url: string;
  target?: string;
}

export interface INavigationMenu extends Document {
  name: string;
  items: INavItem[];
  createdAt: Date;
  updatedAt: Date;
}

const NavItemSchema = new Schema<INavItem>(
  {
    label_he: {
      type: String,
      required: [true, 'תווית פריט הניווט בעברית נדרשת'],
      trim: true,
    },
    url: {
      type: String,
      required: [true, 'כתובת URL של פריט הניווט נדרשת'],
      trim: true,
    },
    target: {
      type: String,
      enum: ['_self', '_blank', '_parent', '_top'],
      default: '_self',
    },
  },
  { _id: false }
);

const NavigationMenuSchema = new Schema<INavigationMenu>(
  {
    name: {
      type: String,
      required: [true, 'שם תפריט הניווט נדרש'],
      trim: true,
      unique: true,
    },
    items: {
      type: [NavItemSchema],
      default: [],
      validate: {
        validator: function (items: INavItem[]) {
          return items.length > 0;
        },
        message: 'תפריט הניווט חייב לכלול לפחות פריט אחד',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index
NavigationMenuSchema.index({ name: 1 }, { unique: true });

// Validation method for URL format
NavigationMenuSchema.methods.validateUrls = function (): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  this.items.forEach((item: INavItem, index: number) => {
    // Basic URL validation
    const urlPattern = /^(\/|https?:\/\/)/;
    if (!urlPattern.test(item.url)) {
      errors.push(`פורמט URL לא תקין בפריט ${index}: ${item.url}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Prevent model recompilation in development
const NavigationMenu: Model<INavigationMenu> =
  mongoose.models.NavigationMenu ||
  mongoose.model<INavigationMenu>('NavigationMenu', NavigationMenuSchema);

export default NavigationMenu;
