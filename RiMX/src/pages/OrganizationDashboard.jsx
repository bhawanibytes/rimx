import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Building,
  Trash2,
  Loader2,
  ChevronDown,
  Check,
  X,
  Mail,
  Edit,
  Plus,
  RefreshCw,
  MoreVertical,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import {
  fetchOrganizationDetails,
  updateOrganization,
  deleteOrganization,
} from '../features/organization/organizationSlice';
import {
  fetchMembers,
  updateMemberRole,
  removeMember,
} from '../features/membership/membershipSlice';
import { inviteUser } from '../features/invitation/invitationSlice';
import { fetchJoinRequestsForOrg, respondToJoinRequest } from '../features/joinRequest/joinRequestSlice';

const OrganizationDashboard = () => {
  const orgId = localStorage.getItem('orgId');
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(null);
  const [showMemberMenu, setShowMemberMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  // Redux state
  const { currentOrganization, loading: orgLoading, error } = useSelector(
    (state) => state.organizations
  );
  const { members, loading: membersLoading } = useSelector(
    (state) => state.memberships
  );
  const { joinRequests, loading: requestsLoading } = useSelector(
    (state) => state.joinRequests
  );

  // Local state
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');

  // Fetch data
  useEffect(() => {
    if (!orgId) {
      navigate('/organizations');
      return;
    }

    const fetchData = async () => {
      try {
        await dispatch(fetchOrganizationDetails(orgId)).unwrap();
        if (activeTab === 'members') {
          await dispatch(fetchMembers(orgId)).unwrap();
        } else if (activeTab === 'requests') {
          await dispatch(fetchJoinRequestsForOrg(orgId)).unwrap();
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, [orgId, activeTab, dispatch, navigate]);

  useEffect(() => {
    if (activeTab === 'requests') {
      dispatch(fetchJoinRequestsForOrg(orgId));
    }
  }, [activeTab, dispatch, orgId]);

  // Update form fields
  useEffect(() => {
    if (currentOrganization) {
      setUpdatedName(currentOrganization.name || '');
      setUpdatedDescription(currentOrganization.description || '');
    }
  }, [currentOrganization]);

  // Reset messages after 3 seconds
  useEffect(() => {
    if (inviteSuccess || inviteError) {
      const timer = setTimeout(() => {
        setInviteSuccess(false);
        setInviteError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [inviteSuccess, inviteError]);

  // Organization actions
  const handleDeleteOrg = async () => {
    try {
      await dispatch(deleteOrganization(orgId)).unwrap();
      navigate('/organizations');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleUpdateOrg = async () => {
    if (!updatedName.trim()) {
      alert('Organization name cannot be empty.');
      return;
    }
    try {
      await dispatch(updateOrganization({
        orgId: currentOrganization?.id,
        updatedData: { name: updatedName, description: updatedDescription },
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Member actions
  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    
    setInviteError(null);
    setInviteSuccess(false);
    
    try {
      await dispatch(inviteUser({
        orgId: orgId,
        email: inviteEmail,
        role: selectedRole,
      })).unwrap();
      setInviteEmail('');
      setIsInviting(false);
      setInviteSuccess(true);
    } catch (error) {
      console.error('Error:', error.message);
      setInviteError(error.message || 'Please invite a valid user. User with this email is not available.');
    }
  };

  const handleAddMembersClick = () => {
    setIsInviting(true);
    setActiveTab('invite');
  };

  const handleUpdateMemberRole = async (memberId, newRole) => {
    try {
      await dispatch(updateMemberRole({
        organizationId: orgId,
        memberId,
        newRole,
      })).unwrap();
      setShowRoleDropdown(null);
      await dispatch(fetchMembers(orgId));
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await dispatch(removeMember({
          organizationId: orgId,
          memberId,
        })).unwrap();
        await dispatch(fetchMembers(orgId));
      } catch (error) {
        console.error('Error:', error.message);
      }
    }
  };

  const handleRespondToJoinRequest = async (requestId, response) => {
    try {
      await dispatch(respondToJoinRequest({
        requestId,
        response,
      })).unwrap();
      await dispatch(fetchJoinRequestsForOrg(orgId));
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // UI Components
  const RoleBadge = ({ role }) => {
    const roleColors = {
      owner: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      admin: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      member: 'bg-green-500/10 text-green-400 border-green-500/30',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${roleColors[role] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (orgLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    );
  }

  if (!currentOrganization) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <p className="text-gray-400">No organization found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-blue-400 hover:text-blue-300">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Building className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{currentOrganization.name}</h1>
              <p className="text-sm text-gray-400">
                {members?.length || 0} members • Created {new Date(currentOrganization.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            {currentOrganization.owner?.id === userId && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md w-full"
            >
              <h3 className="text-xl font-bold mb-4">Delete Organization</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to permanently delete this organization and all its data?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteOrg}
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-colors"
                >
                  Delete Organization
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'members', icon: Users, label: 'Members' },
              { id: 'invite', icon: UserPlus, label: 'Invite Members' },
              { id: 'requests', icon: Clock, label: 'Join Requests' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Organization Details</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center text-blue-400 hover:text-blue-300"
                    >
                      {isEditing ? (
                        <>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </>
                      )}
                    </button>
                  </div>

                  {isEditing ? (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                        <input
                          type="text"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                          value={updatedDescription}
                          onChange={(e) => setUpdatedDescription(e.target.value)}
                          rows={4}
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 text-gray-300 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleUpdateOrg}
                          className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                        >
                          Update Organization
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Name</h3>
                          <p className="text-xl text-white">{currentOrganization.name}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Description</h3>
                          <p className="text-gray-300">
                            {currentOrganization.description || 'No description provided'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Owner</h3>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                              {currentOrganization.owner?.name?.charAt(0) || 'O'}
                            </div>
                            <p className="text-white">{currentOrganization.owner?.name || 'N/A'}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Members</h3>
                          <p className="text-white">{members?.length || 0} total members</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Created At</h3>
                          <p className="text-gray-300">
                            {new Date(currentOrganization.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Organization Members</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => dispatch(fetchMembers(orgId))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddMembersClick}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Members
                      </motion.button>
                    </div>
                  </div>

                  {membersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : members?.length > 0 ? (
                    <div className="space-y-4">
                      {members.map((member) => (
                        <motion.div
                          key={member.user._id}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
                              {member.user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{member.user.name}</h3>
                              <p className="text-sm text-gray-400">{member.user.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <button
                                onClick={() => setShowRoleDropdown(showRoleDropdown === member.user._id ? null : member.user._id)}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                              >
                                <RoleBadge role={member.role} />
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              </button>
                              
                              {showRoleDropdown === member.user._id && (
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-700">
                                  <div className="py-1">
                                    {['admin', 'projectManager', 'employee'].map((role) => (
                                      <button
                                        key={role}
                                        onClick={() => handleUpdateMemberRole(member.user._id, role)}
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                          member.role === role 
                                            ? 'bg-blue-500/10 text-blue-400' 
                                            : 'text-gray-300 hover:bg-gray-700'
                                        }`}
                                        disabled={member.role === role || (role === 'owner' && currentOrganization.owner?._id !== userId)}
                                      >
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {member.user._id !== userId && (
                              <button
                                onClick={() => handleRemoveMember(member.user._id)}
                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-4 text-lg font-medium text-white">No Members Available</h3>
                      <p className="mt-1 text-gray-400">You haven't added any members to this organization yet</p>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddMembersClick}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                      >
                        Invite Members
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invite Members Tab */}
            {activeTab === 'invite' && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Invite Members</h2>
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsInviting(!isInviting)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                      >
                        {isInviting ? (
                          <>
                            <X className="h-5 w-5 mr-2" /> Cancel
                          </>
                        ) : (
                          <>
                            <Plus className="h-5 w-5 mr-2" /> New Invite
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {inviteSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-green-500/10 text-green-400 rounded-lg border border-green-500/20"
                    >
                      <div className="flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        <span>Invitation sent successfully!</span>
                      </div>
                    </motion.div>
                  )}

                  {inviteError && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"
                    >
                      <div className="flex items-center">
                        <X className="h-5 w-5 mr-2" />
                        <span>{inviteError}</span>
                      </div>
                    </motion.div>
                  )}

                  {isInviting && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-8 p-6 bg-gray-700/30 border border-gray-600 rounded-lg"
                    >
                      <form onSubmit={handleInviteUser} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                          <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                          <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="admin">Admin</option>
                            <option value="projectManager">Project Manager</option>
                            <option value="employee">Employee</option>
                            {currentOrganization.owner?._id === userId && (
                              <option value="owner">Owner</option>
                            )}
                          </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setIsInviting(false)}
                            className="px-6 py-3 text-gray-300 bg-gray-700/50 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            Cancel
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                          >
                            Invite
                          </motion.button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {!isInviting && (
                    <div className="text-center py-12">
                      <UserPlus className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-4 text-lg font-medium text-white">Invite New Members</h3>
                      <p className="mt-1 text-gray-400">Use the button above to invite new members to your organization</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Join Requests Tab */}
{activeTab === 'requests' && (
  <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Pending Join Requests</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => dispatch(fetchJoinRequestsForOrg(orgId))}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {requestsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : joinRequests?.length > 0 ? (
        <div className="space-y-4">
          {joinRequests.map((request) => (
            <motion.div
              key={request._id}
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
                  {request.user?.firstName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {request.user?.firstName && request.user?.lastName
                      ? `${request.user.firstName} ${request.user.lastName}`
                      : 'Unknown User'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {request.user?.emailId|| 'No email provided'}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <RoleBadge role={request.role} />
                    <span className="text-xs text-gray-500">
                      Requested {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRespondToJoinRequest(request._id, 'approve')}
                  className="flex items-center px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                >
                  <Check className="h-4 w-4 mr-1" /> Approve
                </button>
                <button
                  onClick={() => handleRespondToJoinRequest(request._id, 'reject')}
                  className="flex items-center px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-4 text-lg font-medium text-white">No Pending Requests</h3>
          <p className="mt-1 text-gray-400">There are no pending requests to join your organization</p>
        </div>
      )}
    </div>
  </div>
)}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default OrganizationDashboard;