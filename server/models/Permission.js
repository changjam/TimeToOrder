import mongoose from 'mongoose';

const PermissionLevels = new mongoose.Schema({
    'admin': 0,
    'order_manager': 1,
    'member': 2,
});

export default mongoose.model('PermissionLevels', PermissionLevels);
