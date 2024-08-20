import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Menus', MenuSchema);
