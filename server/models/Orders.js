import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  order_name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  order_open_time: { type: Date, default: Date.now, required: true },
  order_lock_time: { type: Date, default: function() {return new Date(this.order_open_time.getTime() + 60 * 60 * 1000);}, required: true },
  creator_id: { type: String , required: true },
  creator_name: { type: String , required: true },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants', required: true },
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true },
  orders: [
    {
      name: { type: String, required: true },
      totalAmount: { type: Number, required: true},
      orderedItems: { type: Array, required: true },
      user_id: { type: String, required: true },
      orderTime: { type: Date, default: Date.now, required: true }
    }
],
  status: {
    type: String,
    enum: ['Available', 'Locked', 'In_Progress', 'Finished', 'Canceled'],
    default: 'Locked',
  },
  notes: { type: String, default: '' },
});

export default mongoose.model('Orders', OrderSchema);
