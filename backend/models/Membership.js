import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'manager', 'hr', 'projectManager', 'teamLead', 'employee', 'member'],
    required: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
  },
  permissions: {
    type: [String], // List of permissions
    default: [],
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