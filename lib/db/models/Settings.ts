import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IBrand {
  name_he: string;
  logoId?: Types.ObjectId;
}

export interface ISocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface IContact {
  phone?: string;
  whatsapp?: string;
  email?: string;
  socialLinks?: ISocialLinks;
}

export interface ILocation {
  address_he?: string;
  lat?: number;
  lng?: number;
}

export interface IHours {
  sunday?: string;
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
}

export interface ILegal {
  termsUrl?: string;
  privacyUrl?: string;
  termsText_he?: string;
  privacyText_he?: string;
}

export interface IUI {
  rtl: boolean;
  theme?: Record<string, any>;
}

export interface IPlateConfig {
  magnetStrength: number;
  cursorSize: number;
  reducedMotionDefault: boolean;
}

export interface ISettings extends Document {
  brand: IBrand;
  contact?: IContact;
  location?: ILocation;
  hours?: IHours;
  legal?: ILegal;
  ui: IUI;
  plateConfig?: IPlateConfig;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name_he: {
      type: String,
      required: [true, 'שם המותג בעברית נדרש'],
      trim: true,
    },
    logoId: {
      type: Schema.Types.ObjectId,
      ref: 'Media',
    },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    facebook: {
      type: String,
      trim: true,
    },
    instagram: {
      type: String,
      trim: true,
    },
    tiktok: {
      type: String,
      trim: true,
    },
    youtube: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const ContactSchema = new Schema<IContact>(
  {
    phone: {
      type: String,
      trim: true,
    },
    whatsapp: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    socialLinks: {
      type: SocialLinksSchema,
      default: () => ({}),
    },
  },
  { _id: false }
);

const LocationSchema = new Schema<ILocation>(
  {
    address_he: {
      type: String,
      trim: true,
    },
    lat: {
      type: Number,
      min: -90,
      max: 90,
    },
    lng: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  { _id: false }
);

const HoursSchema = new Schema<IHours>(
  {
    sunday: String,
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
  },
  { _id: false }
);

const LegalSchema = new Schema<ILegal>(
  {
    termsUrl: String,
    privacyUrl: String,
    termsText_he: String,
    privacyText_he: String,
  },
  { _id: false }
);

const UISchema = new Schema<IUI>(
  {
    rtl: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const PlateConfigSchema = new Schema<IPlateConfig>(
  {
    magnetStrength: {
      type: Number,
      default: 0.3,
      min: 0,
      max: 1,
    },
    cursorSize: {
      type: Number,
      default: 60,
      min: 20,
      max: 200,
    },
    reducedMotionDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    brand: {
      type: BrandSchema,
      required: [true, 'מידע על המותג נדרש'],
    },
    contact: {
      type: ContactSchema,
      default: () => ({}),
    },
    location: {
      type: LocationSchema,
      default: () => ({}),
    },
    hours: {
      type: HoursSchema,
      default: () => ({}),
    },
    legal: {
      type: LegalSchema,
      default: () => ({}),
    },
    ui: {
      type: UISchema,
      default: () => ({ rtl: true }),
    },
    plateConfig: {
      type: PlateConfigSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

// Singleton pattern enforcement - only allow one settings document
SettingsSchema.pre('save', async function (next) {
  const count = await mongoose.models.Settings.countDocuments({ _id: { $ne: this._id } });
  if (count > 0) {
    throw new Error('מותר רק מסמך הגדרות אחד. אנא עדכן את המסמך הקיים.');
  }
  next();
});

// Static method to get or create settings
SettingsSchema.statics.getSingleton = async function (): Promise<ISettings> {
  let settings = await this.findOne();

  if (!settings) {
    // Create default settings
    settings = await this.create({
      brand: {
        name_he: 'ביס מרוקאי',
      },
      ui: {
        rtl: true,
      },
      plateConfig: {
        magnetStrength: 0.3,
        cursorSize: 60,
        reducedMotionDefault: false,
      },
    });
  }

  return settings;
};

// Prevent model recompilation in development
const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
