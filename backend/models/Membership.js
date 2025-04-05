import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: [true, 'Organization reference is required']
  },
  role: {
    type: String,
    enum: {
      values: ['admin', 'projectManager', 'employee', 'teamLead', 'member'],
      message: 'Invalid role specified'
    },
    default: 'employee'
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastActive: {
    type: Date
  }
}, {
  timestamps: true // adds createdAt and updatedAt automatically
});

// Compound index to ensure unique membership
membershipSchema.index({ user: 1, organization: 1 }, { unique: true });

// Index for frequently queried fields
membershipSchema.index({ organization: 1, role: 1 });
membershipSchema.index({ user: 1, lastActive: -1 });

export default mongoose.model('Membership', membershipSchema);