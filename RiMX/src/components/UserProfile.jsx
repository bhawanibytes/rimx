import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Edit,
  Shield,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  Globe,
  MapPin,
  Lock,
  LogOut,
  Zap,
  ArrowLeft,
  Check,
  X,
  Loader2,
  Building,
  Users
} from 'lucide-react';
import { updateUserProfile } from '../features/auth/authSlice';
import api from '../services/api';

const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [apiStatus, setApiStatus] = useState({ type: null, message: null });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    address: '',
    country: '',
    dateOfBirth: '',
    bio: ''
  });
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailId || '',
        mobileNumber: user.mobileNumber || '',
        address: user.address || '',
        country: user.country || '',
        dateOfBirth: user.dateOfBirth || '',
        bio: user.bio || ''
      });
      
      // Fetch user's organizations
      const fetchUserOrganizations = async () => {
        try {
          const response = await api.get('/v1/org/user/organizations');
          setOrganizations(response.data.organizations);
          setLoadingOrgs(false);
        } catch (error) {
          setApiStatus({ type: 'error', message: 'Failed to load organizations' });
          setLoadingOrgs(false);
        }
      };
      
      fetchUserOrganizations();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      setIsEditing(false);
      setApiStatus({ type: 'success', message: 'Profile updated successfully' });
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const StatusMessage = ({ type, message }) => {
    if (!message) return null;

    const bgColors = {
      success: 'bg-green-500/10 border-green-500/20 text-green-400',
      error: 'bg-red-500/10 border-red-500/20 text-red-400',
      info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-6 p-4 rounded-lg border ${bgColors[type]} flex items-center`}
      >
        {type === 'success' ? (
          <Check className="h-5 w-5 mr-3" />
        ) : (
          <X className="h-5 w-5 mr-3" />
        )}
        <span>{message}</span>
      </motion.div>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center">
                <Zap className="h-5 w-5 text-yellow-400 animate-pulse" />
                <span className="ml-2 font-bold text-yellow-400">RiMX</span>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <User className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">User Profile</h1>
              <p className="text-sm text-gray-400">
                Manage your personal information and organizations
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Status Messages */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4">
        <StatusMessage type={apiStatus.type} message={apiStatus.message} />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden"
        >
          <div className="p-8">
            {isEditing ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <div className="flex items-center px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-300">{user.emailId}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Contact admin to change email</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 text-gray-300 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    Save Changes
                  </button>
                </div>
              </motion.form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-400" />
                    Personal Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Full Name</h3>
                      <p className="text-white">
                        {user.firstName} {user.lastName}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Email</h3>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-white">{user.emailId}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Mobile Number</h3>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-white">{user.mobileNumber || 'Not specified'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Date of Birth</h3>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-white">{formatDate(user.dateOfBirth)}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Country</h3>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-white">{user.country || 'Not specified'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Address</h3>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <p className="text-white">{user.address || 'Not specified'}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-1">Bio</h3>
                      <p className="text-gray-300">
                        {user.bio || 'No bio provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organizations and Security */}
                <div className="space-y-8">
                  {/* Organizations */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <Building className="h-5 w-5 mr-2 text-blue-400" />
                      Organizations
                    </h2>
                    {loadingOrgs ? (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                      </div>
                    ) : organizations.length > 0 ? (
                      <div className="space-y-3">
                        {organizations.map((org) => (
                          <motion.div
                            key={org._id}
                            whileHover={{ scale: 1.01 }}
                            className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg"
                          >
                            <h3 className="font-medium text-white">{org.organization.name}</h3>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-xs text-gray-400 flex items-center">
                                <Shield className="h-3 w-3 mr-1" />
                                {org.role}
                              </span>
                              {org.department && (
                                <span className="text-xs text-gray-400 flex items-center">
                                  <Briefcase className="h-3 w-3 mr-1" />
                                  {org.department.name}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                localStorage.setItem('orgId', org.organization._id);
                                navigate('/organization-dashboard');
                              }}
                              className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-all duration-300"
                            >
                              View Organization
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-700/20 rounded-lg border border-dashed border-gray-600">
                        <Users className="mx-auto h-8 w-8 text-gray-500" />
                        <p className="mt-2 text-gray-400">You're not a member of any organizations</p>
                      </div>
                    )}
                  </div>

                  {/* Security */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <Lock className="h-5 w-5 mr-2 text-blue-400" />
                      Security
                    </h2>
                    <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                      <h3 className="font-medium text-white mb-2">Change Password</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Update your password to keep your account secure
                      </p>
                      <button
                        onClick={() => navigate('/change-password')}
                        className="px-4 py-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-all duration-300"
                      >
                        Change Password
                      </button>
                    </div>
                    <div className="p-4 bg-gray-700/30 border border-red-500/30 rounded-lg">
                      <h3 className="font-medium text-white mb-2">Danger Zone</h3>
                      <p className="text-sm text-gray-400 mb-3">
                        Permanently delete your account and all associated data
                      </p>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                            // Handle account deletion
                          }
                        }}
                        className="px-4 py-2 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-all duration-300"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default UserProfile;