import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone : {type: String, required: true },
  address : {type: String, required: true },
  types : {type: Array , required: true },
  image : String,
  createdAt: { type: Date, default: Date.now },
  creator:{type: String, required: true },
});

export default mongoose.model('Restaurants', RestaurantSchema);
