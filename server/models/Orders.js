import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  order_name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  order_open_time: { type: Date, default: Date.now, required: true },
  order_lock_time: { type: Date, default: function() {return new Date(this.order_open_time.getTime() + 60 * 60 * 1000);}, required: true },
  creator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants', required: true },
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true },
  status: {
    type: String,
    enum: ['Available', 'Locked', 'In_Progress', 'Finished', 'Canceled'],
    default: 'Locked',
  },
  notes: { type: String, default: '' },
});

export default mongoose.model('Orders', OrderSchema);
