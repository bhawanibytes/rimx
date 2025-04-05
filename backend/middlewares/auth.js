import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Error response helper
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
};

// Main authentication middleware
const auth = async (req, res, next) => {
  try {
    console.log("Request headers:", req.headers); // Debugging
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log("Token received in middleware:", token); // Debugging

    if (!token) {
      return errorResponse(res, 401, 'Authentication required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded); // Debugging

    const user = await User.findOne({ _id: decoded.id }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'User not found or inactive');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error("Authentication error:", err.message);
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 401, 'Invalid token');
    }
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 401, 'Token expired');
    }
    errorResponse(res, 500, 'Authentication failed');
  }
};

// Role-based access control (to be used after auth)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Role ${req.user.role} is not authorized`);
    }
    next();
  };
};

const authorizeOrganizationAccess = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const userId = req.user._id;

    const membership = await Membership.findOne({ organization: orgId, user: userId });
    if (!membership) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    req.membership = membership; // Attach membership details to the request
    next();
  } catch (error) {
    console.error('Authorization error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export { auth, authorizeOrganizationAccess };
export default auth;