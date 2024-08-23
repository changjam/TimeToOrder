import mongoose from 'mongoose';

const User_sessionSchema = new mongoose.Schema({
    user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true},
    name: { type: String, required: true},
    actions: { type: String, required: true},
    createdAt: { type: Date, default: Date.now ,require: true},
});

export default mongoose.model('User_session', User_sessionSchema);
