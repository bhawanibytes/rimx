import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building, 
  PlusCircle, 
  Users, 
  MailCheck, 
  MailX, 
  ArrowRight,
  LogOut
} from 'lucide-react';
import { setOrganizations, setInvites } from '../redux/slices/orgSlice';
import { logout } from '../redux/slices/authSlice';
import { 
  fetchUserOrgs, 
  fetchUserInvites, 
  acceptInviteAPI,
  rejectInviteAPI,
  createOrganizationAPI 
} from '../services/api';

const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState('organizations');
  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState({
    createOrg: false,
    acceptInvite: false,
    rejectInvite: false,
    joinOrg: false
  });
  const [errors, setErrors] = useState({
    orgName: '',
    inviteCode: ''
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { organizations, pendingInvites } = useSelector((state) => state.org);

  // Redirect if no user
  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [orgs, invites] = await Promise.all([
          fetchUserOrgs(user.id),
          fetchUserInvites(user.id)
        ]);
        dispatch(setOrganizations(orgs));
        dispatch(setInvites(invites));
        
        // Auto-select tab based on data
        if (orgs.length > 0) setActiveTab('organizations');
        else if (invites.length > 0) setActiveTab('invites');
        else setActiveTab('getstarted');
      } catch (err) {
        console.error("Failed to load data:", err);
      }
    };

    loadData();
  }, [user, dispatch]);

  const handleAcceptInvite = async (inviteId) => {
    setIsLoading(prev => ({ ...prev, acceptInvite: true }));
    try {
      const acceptedOrg = await acceptInviteAPI(inviteId);
      dispatch(setOrganizations([...organizations, acceptedOrg]));
      dispatch(setInvites(pendingInvites.filter(invite => invite.id !== inviteId)));
    } catch (err) {
      console.error("Accept failed:", err);
    } finally {
      setIsLoading(prev => ({ ...prev, acceptInvite: false }));
    }
  };

  const handleRejectInvite = async (inviteId) => {
    setIsLoading(prev => ({ ...prev, rejectInvite: true }));
    try {
      await rejectInviteAPI(inviteId);
      dispatch(setInvites(pendingInvites.filter(invite => invite.id !== inviteId)));
    } catch (err) {
      console.error("Reject failed:", err);
    } finally {
      setIsLoading(prev => ({ ...prev, rejectInvite: false }));
    }
  };

  const handleCreateOrganization = async (e) => {
    e.preventDefault();
    if (!orgName.trim()) {
      setErrors({ ...errors, orgName: "Name is required" });
      return;
    }

    setIsLoading(prev => ({ ...prev, createOrg: true }));
    try {
      const newOrg = await createOrganizationAPI(orgName);
      dispatch(setOrganizations([...organizations, newOrg]));
      navigate(`/organization/${newOrg.id}`);
    } catch (err) {
      setErrors({ 
        ...errors, 
        orgName: err.response?.data?.message || "Creation failed" 
      });
    } finally {
      setIsLoading(prev => ({ ...prev, createOrg: false }));
    }
  };

  const handleJoinOrganization = async () => {
    if (!inviteCode.trim()) {
      setErrors({ ...errors, inviteCode: "Code is required" });
      return;
    }

    setIsLoading(prev => ({ ...prev, joinOrg: true }));
    try {
      // Implement your join API call here
      alert(`Simulating join with code: ${inviteCode}`);
      // const org = await joinOrganizationAPI(inviteCode);
      // dispatch(setOrganizations([...organizations, org]));
    } catch (err) {
      setErrors({ 
        ...errors, 
        inviteCode: err.response?.data?.message || "Invalid code" 
      });
    } finally {
      setIsLoading(prev => ({ ...prev, joinOrg: false }));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {user?.name.split(' ')[0]}!
                </h1>
                <p className="mt-1 opacity-90">
                  {organizations.length > 0 
                    ? `You have ${organizations.length} organization(s)`
                    : pendingInvites.length > 0
                      ? `You have ${pendingInvites.length} pending invite(s)`
                      : "Let's get you started"}
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-md hover:bg-white/30 text-sm"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {organizations.length > 0 && (
                <button
                  onClick={() => setActiveTab('organizations')}
                  className={`py-3 px-4 text-center border-b-2 font-medium text-sm flex items-center gap-1 ${
                    activeTab === 'organizations' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  Organizations
                </button>
              )}
              {pendingInvites.length > 0 && (
                <button
                  onClick={() => setActiveTab('invites')}
                  className={`py-3 px-4 text-center border-b-2 font-medium text-sm flex items-center gap-1 ${
                    activeTab === 'invites' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MailCheck className="h-4 w-4" />
                  Invites
                </button>
              )}
              <button
                onClick={() => setActiveTab('getstarted')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm flex items-center gap-1 ${
                  activeTab === 'getstarted' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <PlusCircle className="h-4 w-4" />
                Get Started
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Organizations Tab */}
            {activeTab === 'organizations' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Your Organizations</h2>
                {organizations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    You're not part of any organizations yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {organizations.map((org) => (
                      <div 
                        key={org.id}
                        onClick={() => navigate(`/organization/${org.id}`)}
                        className="border rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <Building className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{org.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {org.role} • {org.memberCount} members
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                            Enter <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Invites Tab */}
            {activeTab === 'invites' && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800">Pending Invitations</h2>
                {pendingInvites.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No pending invitations.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingInvites.map((invite) => (
                      <div key={invite.id} className="border rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-purple-100 p-2 rounded-full">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{invite.organization.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Invited as {invite.role} by {invite.inviter.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Expires: {new Date(invite.expiresAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end gap-2">
                          <button
                            onClick={() => handleRejectInvite(invite.id)}
                            disabled={isLoading.rejectInvite}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
                          >
                            {isLoading.rejectInvite ? 'Declining...' : 'Decline'}
                          </button>
                          <button
                            onClick={() => handleAcceptInvite(invite.id)}
                            disabled={isLoading.acceptInvite}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
                          >
                            {isLoading.acceptInvite ? 'Accepting...' : 'Accept'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Get Started Tab */}
            {activeTab === 'getstarted' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Get Started</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Create Organization */}
                  <div className="border rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <PlusCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-medium">Create New Organization</h3>
                    </div>
                    <form onSubmit={handleCreateOrganization} className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Organization Name
                        </label>
                        <input
                          type="text"
                          value={orgName}
                          onChange={(e) => {
                            setOrgName(e.target.value);
                            setErrors({ ...errors, orgName: '' });
                          }}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.orgName ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Your company name"
                        />
                        {errors.orgName && (
                          <p className="mt-1 text-sm text-red-600">{errors.orgName}</p>
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading.createOrg}
                        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading.createOrg ? 'Creating...' : 'Create Organization'}
                      </button>
                    </form>
                  </div>

                  {/* Join Organization */}
                  <div className="border rounded-lg p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <h3 className="font-medium">Join Existing Organization</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Invitation Code
                        </label>
                        <input
                          type="text"
                          value={inviteCode}
                          onChange={(e) => {
                            setInviteCode(e.target.value);
                            setErrors({ ...errors, inviteCode: '' });
                          }}
                          className={`w-full px-3 py-2 border rounded-md ${
                            errors.inviteCode ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter code provided"
                        />
                        {errors.inviteCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.inviteCode}</p>
                        )}
                      </div>
                      <button
                        onClick={handleJoinOrganization}
                        disabled={isLoading.joinOrg}
                        className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                      >
                        {isLoading.joinOrg ? 'Joining...' : 'Join Organization'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;