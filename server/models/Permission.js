import mongoose from 'mongoose';

const PermissionLevels = new mongoose.Schema({
    0: 'admin',
    1: 'order_createAble',
    2: 'member',
});

export default mongoose.model('PermissionLevels', PermissionLevels);
