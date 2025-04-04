import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization reference is required']
  },
  role: {
    type: String,
    enum: ['admin', 'projectManager', 'employee'],
    required: [true, 'Role is required']
  },
  token: {
    type: String,
    required: true,
    unique: true // Mongoose will automatically create a unique index for this field
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
invitationSchema.index({ email: 1, organization: 1 });
invitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired

// Prevent duplicate pending invitations
invitationSchema.index(
  { email: 1, organization: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

export default mongoose.model('Invitation', invitationSchema);