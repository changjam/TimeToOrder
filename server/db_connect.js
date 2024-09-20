import mongoose from 'mongoose';

export default async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/TimeToOrder');
    console.log('DB connect successfully');
  } catch (err) {
    console.error('DB connect failed', err);
  }
};