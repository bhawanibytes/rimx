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
  Check,
  X,
  Edit,
  Plus,
  RefreshCw,
  ArrowLeft,
  Clock,
  Settings,
  User,
  Shield,
  Briefcase,
  LogOut,
  FolderPlus,
  Zap,
  AlertTriangle,
  Mail,
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
import { 
  assignMemberToDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchDepartments
} from '../features/departments/departmentSlice';
// import api from '../services/api';

const OrganizationDashboard = () => {
  const orgId = localStorage.getItem('orgId');
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateDept, setShowCreateDept] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [updatedName, setUpdatedName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptDescription, setNewDeptDescription] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [apiStatus, setApiStatus] = useState({ type: null, message: null });
  const [redirectMessage, setRedirectMessage] = useState(false);
  const [showDeleteOrgConfirm, setShowDeleteOrgConfirm] = useState(false);
  const [showDeleteDeptConfirm, setShowDeleteDeptConfirm] = useState(false);
  const [showRoleUpdate, setShowRoleUpdate] = useState(false);
  const [selectedRoleUpdate, setSelectedRoleUpdate] = useState('member');

  // Redux state
  const { currentOrganization, loading: orgLoading } = useSelector(
    (state) => state.organizations
  );
  const { members, loading: membersLoading } = useSelector(
    (state) => state.memberships
  );
  const { joinRequests, loading: requestsLoading } = useSelector(
    (state) => state.joinRequests
  );
  const { departments, loading: deptLoading } = useSelector(
    (state) => state.departments
  );
  
  const isOwner = currentOrganization?.owner?.id === userId;
  const isAdmin = members?.find(m => m.user._id === userId)?.role === 'admin' || isOwner;

  // Fetch data
  useEffect(() => {
    if (!orgId) {
      navigate('/organizations');
      return;
    }

    const fetchData = async () => {
      try {
        await dispatch(fetchOrganizationDetails(orgId)).unwrap();
        await dispatch(fetchDepartments(orgId)).unwrap();
        
        if (activeTab === 'members') {
          await dispatch(fetchMembers(orgId)).unwrap();
        } else if (activeTab === 'requests') {
          await dispatch(fetchJoinRequestsForOrg(orgId)).unwrap();
        }
      } catch (error) {
        setApiStatus({ type: 'error', message: error.message });
      }
    };

    fetchData();
  }, [orgId, activeTab, dispatch, navigate]);

  useEffect(() => {
    if (currentOrganization) {
      setUpdatedName(currentOrganization.name || '');
      setUpdatedDescription(currentOrganization.description || '');
    }
  }, [currentOrganization]);

  useEffect(() => {
    if (apiStatus.message) {
      const timer = setTimeout(() => {
        setApiStatus({ type: null, message: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [apiStatus]);

  useEffect(() => {
    const fetchDepartmentsData = async () => {
      try {
        await dispatch(fetchDepartments(orgId)).unwrap();
      } catch (error) {
        setApiStatus({ type: 'error', message: 'Failed to load departments' });
      }
    };

    if (orgId) {
      fetchDepartmentsData();
    }
  }, [orgId, dispatch]);

  const handleDeleteOrg = async () => {
    try {
      await dispatch(deleteOrganization(orgId)).unwrap();
      navigate('/welcomePage');
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const handleUpdateOrg = async () => {
    if (!updatedName.trim()) {
      setApiStatus({ type: 'error', message: 'Organization name cannot be empty' });
      return;
    }
    try {
      await dispatch(updateOrganization({
        orgId: currentOrganization?.id,
        updatedData: { name: updatedName, description: updatedDescription },
      })).unwrap();
      setIsEditing(false);
      setApiStatus({ type: 'success', message: 'Organization updated successfully' });
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      setApiStatus({ type: 'error', message: 'Please enter a valid email' });
      return;
    }
  
    try {
      await dispatch(
        inviteUser({
          orgId,
          email: inviteEmail,
          role: selectedRole,
          department: selectedDepartment || null, // Pass null if no department is selected
        })
      ).unwrap();
      setInviteEmail('');
      setSelectedDepartment('');
      setApiStatus({ type: 'success', message: 'Invitation sent successfully' });
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const handleCreateDepartment = async () => {
    if (!newDeptName.trim()) {
      setApiStatus({ type: 'error', message: 'Department name cannot be empty' });
      return;
    }
  
    try {
      await dispatch(
        createDepartment({
          name: newDeptName,
          description: newDeptDescription,
        orgId, // Ensure orgId is passed correctly
        })
      ).unwrap();
  
      setShowCreateDept(false);
      setNewDeptName('');
      setNewDeptDescription('');
      setApiStatus({ type: 'success', message: 'Department created successfully' });
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const handleUpdateDepartment = async () => {
    if (!newDeptName.trim()) {
      setApiStatus({ type: 'error', message: 'Department name cannot be empty' });
      return;
    }
  
    try {
      await dispatch(updateDepartment({
        deptId: editingDept._id,
        updatedData: { 
          name: newDeptName, 
          description: newDeptDescription 
        }
      })).unwrap();
      setEditingDept(null);
      setNewDeptName('');
      setNewDeptDescription('');
      setApiStatus({ type: 'success', message: 'Department updated successfully' });
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const handleDeleteDepartment = (deptId) => {
    setEditingDept({ _id: deptId });
    setShowDeleteDeptConfirm(true);
  };

  const confirmDeleteDepartment = async () => {
    try {
      await dispatch(deleteDepartment(editingDept._id)).unwrap(); // Use the department ID
      setShowDeleteDeptConfirm(false);
      setEditingDept(null);
      setApiStatus({ type: 'success', message: 'Department deleted successfully' });
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    } finally {
      setShowDeleteDeptConfirm(false);
      setEditingDept(null);
    }
  };

  const handleBulkDepartmentChange = async () => {
    if (!selectedDepartment || selectedMembers.length === 0) {
      setApiStatus({ type: "error", message: "Please select members and a department" });
      return;
    }
  
    try {
      await Promise.all(
        selectedMembers.map((memberId) =>
          dispatch(
            assignMemberToDepartment({
              orgId,
              deptId: selectedDepartment,
              memberId,
            })
          ).unwrap()
        )
      );
  
      // Refresh members list
      await dispatch(fetchMembers(orgId)).unwrap();
  
      setSelectedMembers([]);
      setSelectedDepartment("");
      setApiStatus({ type: "success", message: "Members department updated successfully" });
    } catch (error) {
      setApiStatus({ type: "error", message: error.message || "Failed to update department." });
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await dispatch(removeMember({ orgId, memberId })).unwrap();
      await dispatch(fetchMembers(orgId));
      setApiStatus({ type: 'success', message: 'Member removed successfully' });
      if (memberId === userId) {
        setRedirectMessage(true);
        setTimeout(() => navigate('/WelcomePage'), 2000);
      }
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const handleRespondToJoinRequest = async (requestId, action) => {
    try {
      await dispatch(respondToJoinRequest({ orgId, requestId, response: action })).unwrap();
      setApiStatus({
        type: 'success',
        message: action === 'approve' ? 'Request approved' : 'Request rejected'
      });
      dispatch(fetchJoinRequestsForOrg(orgId));
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const toggleMemberSelection = (memberId) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };

  const handleBulkRoleUpdate = async () => {
    try {
      await Promise.all(
        selectedMembers.map(memberId => 
          dispatch(updateMemberRole({
            orgId,
            memberId,
            newRole: selectedRoleUpdate
          }))
        )
      );
      
      setSelectedMembers([]);
      setShowRoleUpdate(false);
      setApiStatus({ 
        type: 'success', 
        message: `Members updated to ${selectedRoleUpdate} role successfully` 
      });
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };
  
  const handleBulkRemoveMembers = async () => {
    try {
      await Promise.all(
        selectedMembers.map(memberId => 
          dispatch(removeMember({ orgId, memberId }))
        )
      );
      
      setSelectedMembers([]);
      setApiStatus({ 
        type: 'success', 
        message: `${selectedMembers.length} member${selectedMembers.length > 1 ? 's' : ''} removed successfully` 
      });
      
      // Refresh members list
      dispatch(fetchMembers(orgId));
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    }
  };

  const RoleBadge = ({ role }) => {
    const roleColors = {
      owner: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      admin: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      manager: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      hr: 'bg-pink-500/10 text-pink-400 border-pink-500/30',
      projectManager: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      teamLead: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      employee: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      member: 'bg-green-500/10 text-green-400 border-green-500/30',
    };

    return (
      <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
        roleColors[role] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'
      }`}>
        <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
      </div>
    );
  };

  const DepartmentBadge = ({ department }) => {
    if (!department) {
      return (
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/30">
          No Department
        </div>
      );
    }
  
    return (
      <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
        {department.name}
      </div>
    );
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

  const MemberCard = ({ member }) => {
    const memberDepartment = departments.find((dept) => dept._id === member.department?._id);
  
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`flex items-center justify-between p-4 bg-gray-700/30 border ${
          selectedMembers.includes(member.user._id)
            ? "border-blue-500"
            : "border-gray-600"
        } rounded-lg mb-4`}
      >
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {(isAdmin || isOwner) && (
            <input
              type="checkbox"
              checked={selectedMembers.includes(member.user._id)}
              onChange={() => toggleMemberSelection(member.user._id)}
              className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
            />
          )}
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
            {member.user?.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <h3 className="font-medium text-white truncate">
              {member.user?.firstName} {member.user?.lastName}
            </h3>
            <p className="text-sm text-gray-400 truncate">{member.user?.emailId}</p>
          </div>
        </div>
  
        <div className="flex items-center space-x-4">
          {memberDepartment ? (
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {memberDepartment.name}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/30">
              No Department
            </div>
          )}
          <RoleBadge role={member.role} />
        </div>
      </motion.div>
    );
  };
  
  const RequestCard = ({ request }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="flex items-center justify-between p-4 bg-gray-700/30 border border-gray-600 rounded-lg mb-4"
    >
      <div className="flex items-center space-x-4 flex-1 min-w-0">
        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
          {request.user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="min-w-0">
          <h3 className="font-medium text-white truncate">
            {request.user?.firstName} {request.user?.lastName}
          </h3>
          <p className="text-sm text-gray-400 truncate">{request.user?.emailId}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <RoleBadge role={request.role} />
        {isOwner && (
          <div className="flex space-x-2">
            <button
              onClick={() => handleRespondToJoinRequest(request._id, 'approve')}
              className="px-3 py-1.5 text-sm bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 rounded-lg"
            >
              Approve
            </button>
            <button
              onClick={() => handleRespondToJoinRequest(request._id, 'reject')}
              className="px-3 py-1.5 text-sm bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  const ProblemCard = ({ problem }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg mb-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white truncate">{problem.title}</h3>
          <p className="text-sm text-gray-400 mt-1">{problem.description}</p>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-xs text-gray-400">
              Created: {new Date(problem.createdAt).toLocaleDateString()}
            </span>
            <span className="text-xs text-gray-400">
              Status: <span className={`${problem.status === 'open' ? 'text-green-400' : 'text-yellow-400'}`}>
                {problem.status}
              </span>
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => alert(`Problem details: ${problem.description}`)}
            className="px-3 py-1.5 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg"
          >
            Show Details
          </button>
          <button
            onClick={() => alert(`Contacting ${problem.createdBy?.name || 'creator'} about this issue`)}
            className="px-3 py-1.5 text-sm bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg"
          >
            Contact
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center text-xs text-gray-400">
        <div className="h-6 w-6 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 mr-2">
          {problem.createdBy?.firstName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <span>
          {problem.createdBy?.firstName} {problem.createdBy?.lastName} • {problem.department?.name || 'No Department'}
        </span>
      </div>
    </motion.div>
  );

  const DepartmentCard = ({ department }) => (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg mb-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-white">{department.name}</h3>
          <p className="text-sm text-gray-400 mt-1">
            {department.description || 'No description provided'}
          </p>
        </div>
        {isOwner && (
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditingDept(department);
                setNewDeptName(department.name);
                setNewDeptDescription(department.description);
              }}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteDepartment(department._id)}
              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (orgLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
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

  const confirmDeleteOrg = async () => {
    try {
      await dispatch(deleteOrganization(orgId)).unwrap();
      navigate('/welcomePage');
    } catch (error) {
      setApiStatus({ type: 'error', message: error.message });
    } finally {
      setShowDeleteOrgConfirm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/WelcomePage" className="text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center">
                <Building className="h-6 w-6 text-blue-400" />
                <Zap className="h-4 w-4 text-yellow-400 -ml-2 -mt-3 animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">RiMX</h1>
                <p className="text-sm text-gray-400">Organization Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            {isOwner ? (
              <button
                onClick={() => setShowDeleteOrgConfirm(true)}
                className="flex items-center px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            ) : (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to leave this organization?')) {
                    handleRemoveMember(userId);
                  }
                }}
                className="flex items-center px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Leave
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* Status Messages */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-xl px-4">
        <StatusMessage type={apiStatus.type} message={apiStatus.message} />
        {redirectMessage && (
          <StatusMessage type="info" message="Left! Redirecting to WelcomePage..." />
        )}
      </div>

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
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Department Modal */}
      <AnimatePresence>
        {(showCreateDept || editingDept) && (
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
              <h3 className="text-xl font-bold mb-4">
                {editingDept ? 'Edit Department' : 'Create New Department'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="Enter department name"
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newDeptDescription}
                    onChange={(e) => setNewDeptDescription(e.target.value)}
                    placeholder="Enter department description"
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCreateDept(false);
                      setEditingDept(null);
                      setNewDeptName('');
                      setNewDeptDescription('');
                    }}
                    className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingDept ? handleUpdateDepartment : handleCreateDepartment}
                    className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    {editingDept ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Organization Confirmation Modal */}
      <AnimatePresence>
        {showDeleteOrgConfirm && (
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
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteOrgConfirm(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteOrg}
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all"
                >
                  Delete Organization
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Department Confirmation Modal */}
      <AnimatePresence>
        {showDeleteDeptConfirm && (
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
              <h3 className="text-xl font-bold mb-4">Delete Department</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to permanently delete this department?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteDeptConfirm(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteDepartment}
                  className="px-4 py-2 text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-lg hover:from-red-600 hover:to-pink-700 transition-all"
                >
                  Delete Department
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto py-2 scrollbar-hide">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'members', icon: Users, label: 'Members' },
              { id: 'departments', icon: Briefcase, label: 'Departments' },
              // { id: 'problems', icon: AlertTriangle, label: 'Problems' },
              { id: 'invite', icon: UserPlus, label: 'Invite' },
              { id: 'requests', icon: Clock, label: 'Requests' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </motion.button>
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
                      className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
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
                        <button
                          onClick={handleUpdateOrg}
                          className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                        >
                          Update
                        </button>
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
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Departments</h3>
                          <div className="flex flex-wrap gap-2">
                            {departments.length > 0 ? (
                              <>
                                <span className="text-white">{departments.length} departments:</span>
                                {departments.slice(0, 3).map(dept => (
                                  <span key={dept._id} className="px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs">
                                    {dept.name}
                                  </span>
                                ))}
                                {departments.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-600/20 text-gray-400 rounded-full text-xs">
                                    +{departments.length - 3} more
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-gray-400">No departments created</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-400 mb-2">Owner</h3>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                              {currentOrganization.owner?.name?.charAt(0) || 'O'}
                            </div>
                            <div>
                              <p className="text-white">{currentOrganization.owner?.name || 'N/A'}</p>
                              <p className="text-xs text-gray-400">{currentOrganization.owner?.email || ''}</p>
                            </div>
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
                        title="Refresh"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      {(isAdmin || isOwner) && (
                        <>
                          <button
                            onClick={() => { setIsInviting(true); setActiveTab('invite'); }}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500
                                                        to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                          >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Members
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {(isAdmin || isOwner) && selectedMembers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-gray-700/30 border border-blue-500/30 rounded-lg"
                    >
                      <div className="flex flex-col space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-blue-400 mb-1">
                            {selectedMembers.length} member{selectedMembers.length > 1 ? 's' : ''} selected
                          </h3>
                          <p className="text-xs text-gray-400">
                            You can change the department for these selected members
                          </p>
                        </div>
                        
                        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 items-start sm:items-center">
                          <div className="flex-1 w-full">
                            <label className="block text-xs font-medium text-gray-400 mb-1">Select Department</label>
                            <select
                              value={selectedDepartment}
                              onChange={(e) => setSelectedDepartment(e.target.value)}
                              className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white text-sm"
                            >
                              <option value="">-- Select Department --</option>
                              {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                  {dept.name}
                                </option>
                              ))}
                              <option value="remove">Remove from Department</option>
                            </select>
                          </div>
                          
                          <div className="flex space-x-3 w-full sm:w-auto">
                            <button
                              onClick={handleBulkDepartmentChange}
                              disabled={!selectedDepartment}
                              className={`px-4 py-2 text-sm rounded-lg flex-1 ${
                                selectedDepartment 
                                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                              } transition-colors`}
                            >
                              Update Department
                            </button>
                            <button
                              onClick={() => setSelectedMembers([])}
                              className="px-3 py-2 text-gray-300 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                              title="Clear selection"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {selectedDepartment === 'remove' && (
                          <div className="text-xs text-yellow-400 mt-2">
                            <AlertTriangle className="inline h-3 w-3 mr-1" />
                            This will remove selected members from their current department
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {membersLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : members?.length > 0 ? (
                    <div className="space-y-3">
                      {members.map((member) => (
                        <MemberCard key={member.user._id} member={member} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-4 text-lg font-medium text-white">No Members Found</h3>
                      <p className="mt-1 text-gray-400">Start by inviting new members to your organization</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Departments</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => dispatch(fetchDepartments(orgId))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                        title="Refresh"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                      {(isAdmin || isOwner) && (
                        <button
                          onClick={() => setShowCreateDept(true)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all"
                        >
                          <FolderPlus className="h-5 w-5 mr-2" />
                          Create Department
                        </button>
                      )}
                    </div>
                  </div>

                  {deptLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : departments?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {departments.map((dept) => (
                        <DepartmentCard key={dept._id} department={dept} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-4 text-lg font-medium text-white">No Departments Found</h3>
                      <p className="mt-1 text-gray-400">Create your first department to organize your members</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Problems Tab */}
            {/* {activeTab === 'problems' && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Reported Problems</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => dispatch(fetchProblems(orgId))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                        title="Refresh"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {problemsLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : problems?.length > 0 ? (
                    <div className="space-y-3">
                      {problems.map((problem) => (
                        <ProblemCard key={problem._id} problem={problem} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertTriangle className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-4 text-lg font-medium text-white">No Problems Reported</h3>
                      <p className="mt-1 text-gray-400">All systems operational</p>
                    </div>
                  )}
                </div>
              </div>
            )} */}

            {/* Invite Members Tab */}
            {activeTab === 'invite' && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Invite New Members</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setIsInviting(!isInviting)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
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
                      </button>
                    </div>
                  </div>

                  {isInviting ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
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
                            <option value="">Select Role</option>
                            <option value="owner">Owner</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="hr">HR</option>
                            <option value="projectManager">Project Manager</option>
                            <option value="teamLead">Team Lead</option>
                            <option value="employee">Employee</option>
                            <option value="member">Member</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                          <select
                            value={selectedDepartment}
                            onChange={(e) => setSelectedDepartment(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                              <option key={dept._id} value={dept._id}>
                                {dept.name}
                              </option>
                            ))}
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
                          <button
                            type="submit"
                            className="px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
                          >
                            Send Invitation
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <UserPlus className="mx-auto h-12 w-12 text-gray-500" />
                      <h3 className="mt-4 text-lg font-medium text-white">Invite New Members</h3>
                      <p className="mt-1 text-gray-400">Use the button above to begin inviting new members</p>
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
                    <h2 className="text-2xl font-bold text-white">Join Requests</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => dispatch(fetchJoinRequestsForOrg(orgId))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                        title="Refresh"
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
                    <div className="space-y-3">
                      {joinRequests.map((request) => (
                        <RequestCard key={request._id} request={request} />
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