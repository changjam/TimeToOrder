import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, require: true},
    joinedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Groups' }]
});

export default mongoose.model('Users', UserSchema);
