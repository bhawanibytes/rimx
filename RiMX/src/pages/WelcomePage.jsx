import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, PlusCircle } from "lucide-react";
import {
  Building,
  Mail,
  Users,
  UserPlus,
  Check,
  X,
  Loader2,
  LayoutDashboard,
  Eye,
  Clock,
} from "lucide-react";
import {
  fetchUserOrganizations,
  fetchAllOrganizations,
  createOrganization,
  clearOrganizationError,
} from "../features/organization/organizationSlice";
import { sendJoinRequest } from "../features/joinRequest/joinRequestSlice";
import {
  fetchPendingInvitations,
  respondToInvitation,
} from "../features/invitation/invitationSlice";

const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState("organizations");
  const [selectedRole, setSelectedRole] = useState("member");
  const [showRoleDropdown, setShowRoleDropdown] = useState(null);
  const [message, setMessage] = useState({ text: "", isSuccess: false });
  const [requestedOrgs, setRequestedOrgs] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orgId = localStorage.getItem("orgId");

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const {
    userOrganizations,
    joinableOrganizations,
    loading: orgLoading,
    error: orgError,
  } = useSelector((state) => state.organizations);
  const {
    pendingInvitations,
    loading: invitesLoading,
    error: invitesError,
  } = useSelector((state) => state.invitations);
  const { error: joinRequestError } = useSelector((state) => state.joinRequests);

  // Check if user owns any organizations
  const userOwnsOrganization = userOrganizations?.some(org => org.role === 'owner');

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === "organizations") {
      dispatch(fetchUserOrganizations(orgId));
    } else if (activeTab === "invitations") {
      if (user?.id) {
        dispatch(fetchPendingInvitations(user.id));
      }
    } else if (activeTab === "join") {
      dispatch(fetchAllOrganizations());
    }
  }, [activeTab, dispatch, user?.id, orgId]);

  // Clear organization error when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearOrganizationError());
    };
  }, [dispatch]);

  // Show join request errors if they exist
  useEffect(() => {
    if (joinRequestError) {
      const errorMessage = typeof joinRequestError === 'string' 
        ? joinRequestError 
        : joinRequestError.message || 'Request failed';
      
      showMessage(errorMessage, false);
      
      if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes("already requested")) {
        const orgId = errorMessage.match(/organization (\w+)/)?.[1];
        if (orgId) {
          setRequestedOrgs(prev => [...prev, orgId]);
        }
      }
    }
  }, [joinRequestError]);

  // Show message and auto-hide after 3 seconds
  const showMessage = (text, isSuccess = true) => {
    setMessage({ text, isSuccess });
    setTimeout(() => setMessage({ text: "", isSuccess: false }), 3000);
  };

  // Handle organization creation
  const handleCreateOrg = async () => {
    if (!user || !user.name) {
      showMessage("User information not available!", false);
      return;
    }

    try {
      const result = await dispatch(
        createOrganization({
          name: `Team ${user.name}'s Organization`,
        })
      ).unwrap();
      showMessage("Organization created successfully!");
      navigate(`/OrganizationDashboard`);
    } catch (error) {
      showMessage(error || "Organization creation failed!", false);
    }
  };

  // Handle organization actions
  const handleOrgAction = (orgId, action) => {
    if (action === 'overview') {
      localStorage.setItem('orgId', orgId);
      navigate('/OrganizationDashboard');
    }
  };

  // Handle invitation responses
  const handleRespondToInvite = async (inviteId, accept) => {
    try {
      const response = await dispatch(
        respondToInvitation({ invitationId: inviteId, accept })
      ).unwrap();
      
      showMessage(`Invitation ${accept ? 'accepted' : 'rejected'} successfully!`);
      
      if (user?.id) {
        dispatch(fetchPendingInvitations(user.id));
      }
    } catch (error) {
      showMessage(
        error?.message || `Failed to ${accept ? 'accept' : 'reject'} invitation!`, 
        false
      );
    }
  };

  // Handle join requests
  const handleJoinRequest = async (orgId) => {
    try {
      const response = await dispatch(
        sendJoinRequest({
          organizationId: orgId,
          role: selectedRole,
        })
      ).unwrap();
      
      if (response?.success || typeof response === 'string') {
        showMessage(response?.message || 'Join request sent successfully!');
        setRequestedOrgs(prev => [...prev, orgId]);
        setShowRoleDropdown(null);
      } else {
        showMessage(response?.message || 'Failed to send join request!', false);
      }
    } catch (error) {
      const errorMessage = typeof error === 'string' 
        ? error 
        : error?.message || 'Failed to send join request!';
      
      showMessage(errorMessage, false);
        
      if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes("already requested")) {
        setRequestedOrgs(prev => [...prev, orgId]);
      }
    }
  };

  // UI Components
  const RoleBadge = ({ role }) => {
    const roleColors = {
      owner: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      admin: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      member: "bg-green-500/10 text-green-400 border-green-500/30",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
        roleColors[role] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
      }`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const InvitationCard = ({ invite, onRespond }) => {
    const [responseStatus, setResponseStatus] = useState(null);
    const [isResponding, setIsResponding] = useState(false);
    const orgName = invite.organizationName || 'Unknown Organization';
    const inviterName = invite.inviterName || 'Unknown User';

    const handleResponse = async (accept) => {
      setIsResponding(true);
      try {
        await onRespond(invite._id, accept);
        setResponseStatus(accept ? 'accepted' : 'rejected');
      } finally {
        setIsResponding(false);
      }
    };

    // If we've already responded, show the status
    if (responseStatus || invite.status !== 'pending') {
      const status = responseStatus || invite.status;
      return (
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
              {orgName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-white">{orgName}</h3>
              <p className="text-sm text-gray-400">
                Invited as: <RoleBadge role={invite.role} />
              </p>
              <p className="text-xs text-gray-500 mt-1">
                From: {inviterName}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <span className={`px-4 py-2 rounded-lg ${
              status === 'accepted'
                ? "bg-green-600/10 text-green-400 border border-green-600/20"
                : "bg-red-600/10 text-red-400 border border-red-600/20"
            }`}>
              {status === 'accepted' ? "Accepted" : "Rejected"}
            </span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
            {orgName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-white">{orgName}</h3>
            <p className="text-sm text-gray-400">
              Invited as: <RoleBadge role={invite.role} />
            </p>
            <p className="text-xs text-gray-500 mt-1">
              From: {inviterName}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isResponding ? (
            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          ) : (
            <>
              <button
                onClick={() => handleResponse(true)}
                className="flex items-center px-4 py-2 bg-green-600/10 text-green-400 border border-green-600/20 rounded-lg hover:bg-green-600/20 transition-colors"
              >
                <Check className="h-4 w-4 mr-1" /> Accept
              </button>
              <button
                onClick={() => handleResponse(false)}
                className="flex items-center px-4 py-2 bg-red-600/10 text-red-400 border border-red-600/20 rounded-lg hover:bg-red-600/20 transition-colors"
              >
                <X className="h-4 w-4 mr-1" /> Reject
              </button>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const InvitationActivityCard = ({ invite }) => {
    const orgName = invite.organizationName || 'Unknown Organization';
    const inviterName = invite.inviterName || 'Unknown User';
    const isAccepted = invite.status === 'accepted';
    const date = new Date(invite.updatedAt || Date.now()).toLocaleString();

    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
            {orgName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-white">{orgName}</h3>
            <p className="text-sm text-gray-400">
              Invited as: <RoleBadge role={invite.role} />
            </p>
            <p className="text-xs text-gray-500 mt-1">
              From: {inviterName} • {date}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`px-4 py-2 rounded-lg ${
            isAccepted 
              ? "bg-green-600/10 text-green-400 border border-green-600/20"
              : "bg-red-600/10 text-red-400 border border-red-600/20"
          }`}>
            {isAccepted ? "Accepted" : "Rejected"}
          </span>
        </div>
      </motion.div>
    );
  };

  const CreateOrganizationCard = () => (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="flex flex-col items-center justify-center p-8 bg-gray-700/30 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500/50 transition-all cursor-pointer"
      onClick={handleCreateOrg}
    >
      <PlusCircle className="h-12 w-12 text-blue-400 mb-4" />
      <h3 className="text-lg font-medium text-white mb-2">Create New Organization</h3>
      <p className="text-sm text-gray-400 text-center">
        Start a new organization and invite team members to collaborate on projects.
      </p>
      {orgLoading && (
        <div className="mt-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
        </div>
      )}
    </motion.div>
  );

  const RequestedOrganizationCard = ({ org }) => {
    const date = new Date().toLocaleString();
    
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
      >
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
            {org.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium text-white">{org.name}</h3>
            <p className="text-sm text-gray-400">
              Requested as: <RoleBadge role={selectedRole} />
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Requested on: {date}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <span className="px-4 py-2 bg-yellow-600/10 text-yellow-400 border border-yellow-600/20 rounded-lg">
            Pending Approval
          </span>
        </div>
      </motion.div>
    );
  };

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
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Building className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome to RiMX</h1>
              <p className="text-sm text-gray-400">
                {user?.name ? `Welcome back, ${user.name}` : "Your organization management hub"}
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateOrg}
            disabled={orgLoading || userOwnsOrganization}
            className={`flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors ${userOwnsOrganization ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            {orgLoading ? "Creating..." : "New Organization"}
          </button>
        </div>
      </motion.header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: "organizations", icon: Users, label: "My Organizations" },
              { id: "invitations", icon: Mail, label: "Invitations" },
              { id: "join", icon: UserPlus, label: "Join Organizations" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white hover:border-gray-500"
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
        {/* Messages */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-4 p-4 rounded-lg border ${
                message.isSuccess
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Organizations Tab */}
            {activeTab === "organizations" && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">My Organizations</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => dispatch(fetchUserOrganizations(orgId))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {orgLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Only show create org card if user doesn't own any orgs */}
                      {!userOwnsOrganization && <CreateOrganizationCard />}
                      
                      {userOrganizations?.length > 0 ? (
                        userOrganizations.map((org) => (
                          <motion.div
                            key={org._id}
                            whileHover={{ scale: 1.01 }}
                            className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
                                {org.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-medium text-white">{org.name}</h3>
                                <p className="text-sm text-gray-400">
                                  {org.role ? <RoleBadge role={org.role} /> : 'Member'}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleOrgAction(org._id, 'dashboard')}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                              >
                                <LayoutDashboard className="h-4 w-4 mr-1" />
                                Dashboard
                              </button>
                              <button
                                onClick={() => handleOrgAction(org._id, 'overview')}
                                className="text-blue-500 hover:underline"
                              >
                                Overview
                              </button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="md:col-span-2 text-center py-12">
                          <Building className="mx-auto h-12 w-12 text-gray-500" />
                          <h3 className="mt-4 text-lg font-medium text-white">No Organizations</h3>
                          <p className="mt-1 text-gray-400">You're not a member of any organizations yet</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Invitations Tab */}
            {activeTab === "invitations" && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Invitations</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => user?.id && dispatch(fetchPendingInvitations(user.id))}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {invitesLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <>
                      {/* Pending Invitations Section */}
                      <div className="mb-12">
                        <h3 className="text-lg font-medium text-white mb-4">Pending Invitations</h3>
                        {pendingInvitations?.filter(invite => invite.status === 'pending').length > 0 ? (
                          <div className="space-y-4">
                            {pendingInvitations
                              .filter(invite => invite.status === 'pending')
                              .map((invite) => (
                                <InvitationCard 
                                  key={invite._id} 
                                  invite={invite} 
                                  onRespond={handleRespondToInvite} 
                                />
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-gray-700 rounded-lg">
                            <Mail className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-4 text-lg font-medium text-white">No Pending Invitations</h3>
                            <p className="mt-1 text-gray-400">You don't have any pending invitations</p>
                          </div>
                        )}
                      </div>

                      {/* Recent Activities Section */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Recent Activities</h3>
                        {pendingInvitations?.filter(invite => invite.status !== 'pending').length > 0 ? (
                          <div className="space-y-4">
                            {pendingInvitations
                              .filter(invite => invite.status !== 'pending')
                              .map((invite) => (
                                <InvitationActivityCard 
                                  key={invite._id} 
                                  invite={invite} 
                                />
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 border border-gray-700 rounded-lg">
                            <Mail className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-4 text-lg font-medium text-white">No Recent Activities</h3>
                            <p className="mt-1 text-gray-400">Your invitation responses will appear here</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Join Organizations Tab */}
            {activeTab === "join" && (
              <div className="bg-gray-800/50 rounded-xl border border-gray-700 backdrop-blur-sm overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Join Organizations</h2>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => dispatch(fetchAllOrganizations())}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                      >
                        <RefreshCw className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {orgLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <>
                      {/* Requested Organizations Section */}
                      {requestedOrgs.length > 0 && (
                        <div className="mb-8">
                          <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                            <Clock className="h-5 w-5 mr-2" /> Your Requests
                          </h3>
                          <div className="space-y-4">
                            {joinableOrganizations
                              ?.filter(org => requestedOrgs.includes(org._id))
                              .map(org => (
                                <RequestedOrganizationCard 
                                  key={org._id} 
                                  org={org} 
                                />
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Available Organizations Section */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Available Organizations</h3>
                        {joinableOrganizations?.length > 0 ? (
                          <div className="space-y-4">
                            {joinableOrganizations
                              ?.filter(org => !requestedOrgs.includes(org._id))
                              .map((org) => (
                                <motion.div
                                  key={org._id}
                                  whileHover={{ scale: 1.01 }}
                                  className="flex items-center justify-between p-5 bg-gray-700/30 border border-gray-600 rounded-lg hover:border-blue-500/50 transition-all"
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 text-lg font-medium">
                                      {org.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-white">{org.name}</h3>
                                      <p className="text-sm text-gray-400">
                                        Created {new Date(org.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    {showRoleDropdown === org._id ? (
                                      <div className="flex space-x-2">
                                        <select
                                          value={selectedRole}
                                          onChange={(e) => setSelectedRole(e.target.value)}
                                          className="px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                        >
                                          <option value="member">Member</option>
                                          <option value="projectManager">Project Manager</option>
                                          <option value="teamLead">Team Lead</option>
                                        </select>
                                        <button
                                          onClick={() => handleJoinRequest(org._id)}
                                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                                        >
                                          Send Request
                                        </button>
                                        <button
                                          onClick={() => setShowRoleDropdown(null)}
                                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                                        >
                                          <X className="h-5 w-5" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => setShowRoleDropdown(org._id)}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
                                      >
                                        Join
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <UserPlus className="mx-auto h-12 w-12 text-gray-500" />
                            <h3 className="mt-4 text-lg font-medium text-white">No Organizations Available</h3>
                            <p className="mt-1 text-gray-400">There are no organizations available to join right now</p>
                          </div>
                        )}
                      </div>
                    </>
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

export default WelcomePage;