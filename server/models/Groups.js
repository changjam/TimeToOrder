import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  members: [
    {
      permissionLevel: {
        type: Number,
        enum: [0, 1, 2],
        required: true,
      },
    },
  ],
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  createdAt: { type: Date, default: Date.now },
  historicalOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }],
});

export default mongoose.model('Groups', GroupSchema);
