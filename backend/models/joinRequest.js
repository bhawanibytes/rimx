import mongoose from 'mongoose';

const JoinRequestSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['member', 'projectManager', 'teamLead'], // Allowed roles
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'], // Status of the request
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const JoinRequest = mongoose.model('JoinRequest', JoinRequestSchema);

export default JoinRequest;