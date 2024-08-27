import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
  members: [
      {
          id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
          permission_level: { type: Number, default: 2, required: true }
      }
  ],
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  created_at: { type: Date, default: Date.now },
  historicalOrderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orders' }]
});

export default mongoose.model('Groups', GroupSchema);
