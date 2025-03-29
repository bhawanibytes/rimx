import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Organization = mongoose.model('Organization', OrganizationSchema);
export default Organization;