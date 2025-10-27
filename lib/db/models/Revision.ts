import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IRevision extends Document {
  entityType: string;
  entityId: Types.ObjectId;
  snapshot: Record<string, any>;
  changedBy: string;
  createdAt: Date;
}

const RevisionSchema = new Schema<IRevision>(
  {
    entityType: {
      type: String,
      required: [true, 'סוג הישות נדרש'],
      enum: ['Dish', 'Bundle', 'Menu', 'Page', 'HeroScene', 'Settings'],
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: [true, 'מזהה הישות נדרש'],
      index: true,
    },
    snapshot: {
      type: Schema.Types.Mixed,
      required: [true, 'נתוני צילום המצב נדרשים'],
    },
    changedBy: {
      type: String,
      required: [true, 'מזהה המשנה נדרש'],
      default: 'admin',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound index for efficient querying
RevisionSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

// Limit revisions per entity (keep only last 20)
RevisionSchema.post('save', async function () {
  const Revision = mongoose.models.Revision;

  // Count revisions for this entity
  const count = await Revision.countDocuments({
    entityType: this.entityType,
    entityId: this.entityId,
  });

  // If more than 20, delete the oldest ones
  if (count > 20) {
    const toDelete = count - 20;
    const oldestRevisions = await Revision.find({
      entityType: this.entityType,
      entityId: this.entityId,
    })
      .sort({ createdAt: 1 })
      .limit(toDelete)
      .select('_id');

    const idsToDelete = oldestRevisions.map((r) => r._id);
    await Revision.deleteMany({ _id: { $in: idsToDelete } });
  }
});

// Static method to create a revision
RevisionSchema.statics.createRevision = async function (
  entityType: string,
  entityId: Types.ObjectId,
  snapshot: Record<string, any>,
  changedBy: string = 'admin'
): Promise<IRevision> {
  return await this.create({
    entityType,
    entityId,
    snapshot,
    changedBy,
  });
};

// Static method to get revisions for an entity
RevisionSchema.statics.getRevisions = async function (
  entityType: string,
  entityId: Types.ObjectId,
  limit: number = 20
): Promise<IRevision[]> {
  return await this.find({ entityType, entityId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to restore a revision
RevisionSchema.statics.restoreRevision = async function (
  revisionId: Types.ObjectId
): Promise<Record<string, any>> {
  const revision = await this.findById(revisionId);
  if (!revision) {
    throw new Error('גרסה לא נמצאה');
  }
  return revision.snapshot;
};

// Prevent model recompilation in development
const Revision: Model<IRevision> =
  mongoose.models.Revision || mongoose.model<IRevision>('Revision', RevisionSchema);

export default Revision;
