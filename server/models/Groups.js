import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  members: [
      {
          id: { type: String , required: true },
          permission_level: { type: String, default: "member", required: true },
          joinAt: { type: Date, default: Date.now }
      }
  ],
  name: { type: String, required: true },
  creator: { type: String , required: true },
  createdAt: { type: Date, default: Date.now },
  historicalOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }]
});

GroupSchema.index({ name: 1, creator: 1 }, { unique: true });

export default mongoose.model('Groups', GroupSchema);
