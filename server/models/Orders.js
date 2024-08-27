import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants', required: true },
  groupIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groups' }],
  deadline: Date ,
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  status: {
    type: String,
    enum: ['Available', 'Locked', 'Finished'],
    default: 'Available',
  },
  notes: { type: String, default: '' },
});

export default mongoose.model('Orders', OrderSchema);
