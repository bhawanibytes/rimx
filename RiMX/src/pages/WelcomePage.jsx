import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Building2,
  Mail,
  PlusCircle,
  UserPlus,
  LayoutDashboard,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  fetchUserOrganizations,
  createOrganization,
  clearOrganizationError,
} from "../features/organization/organizationSlice";
import {
  fetchPendingInvitations,
  respondToInvitation,
  clearInvitationError,
} from "../features/invitation/invitationSlice";

const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState("welcome");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { user } = useSelector((state) => state.auth);
  const {
    userOrganizations,
    loading: orgsLoading,
    error: orgsError,
  } = useSelector((state) => state.organizations);
  const {
    pendingInvitations,
    loading: invitesLoading,
    error: invitesError,
  } = useSelector((state) => state.invitations);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === "organizations") {
      dispatch(fetchUserOrganizations());
    } else if (activeTab === "invitations") {
      dispatch(fetchPendingInvitations());
    }
  }, [activeTab, dispatch]);

  // Clear errors when unmounting
  useEffect(() => {
    return () => {
      dispatch(clearOrganizationError());
      dispatch(clearInvitationError());
    };
  }, [dispatch]);

  useEffect(() => {
    console.log("User from Redux state:", user);
  }, [user]);

  // Handlers
  const handleCreateOrg = async () => {
    if (!user || !user.name) {
      console.error("User is not defined or does not have a name.");
      return;
    }

    try {
      console.log("Creating organization for user:", user);
      const result = await dispatch(
        createOrganization({
          name: `Team ${user.name}'s Organization`,
        })
      ).unwrap();
      console.log("Organization created successfully:", result);
      navigate(`/OrganizationDashboard`);
    } catch (error) {
      console.error("Organization creation failed:", error);
    }
  };

  const handleJoinOrg = () => navigate("/organizations/join");
  const handleEnterDashboard = (orgId) => navigate(`/org/${orgId}/dashboard`);

  const handleRespondToInvite = async (inviteId, accept) => {
    try {
      await dispatch(respondToInvitation({ inviteId, accept })).unwrap();
    } catch (error) {
      console.error("Failed to respond to invitation:", error);
    }
  };

  // UI Components
  const LoadingSpinner = () => (
    <div className="flex justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );

  const ErrorMessage = ({ error, onRetry }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{error}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
        >
          Retry
        </button>
      )}
    </div>
  );

  // Tab Content Components
  const WelcomeTabContent = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Create Organization Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <PlusCircle className="h-10 w-10 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">
              Create New Organization
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Start a new organization and invite team members to collaborate on
            projects.
          </p>
          {orgsError && <ErrorMessage error={orgsError} />}
          <button
            onClick={handleCreateOrg}
            disabled={orgsLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {orgsLoading ? "Creating..." : "Create Organization"}
          </button>
        </div>
      </div>

      {/* Join Organization Card */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-green-300 transition-colors">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <UserPlus className="h-10 w-10 text-green-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">
              Join Existing Organization
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Join an organization you've been invited to or request access to
            public ones.
          </p>
          <button
            onClick={handleJoinOrg}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Join Organization
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h2>
          <p className="text-gray-600">
            {userOrganizations.length > 0
              ? "Manage your organizations or join new ones to collaborate."
              : "Get started by joining an existing organization or creating a new one."}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("welcome")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "welcome"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Welcome
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "welcome" && <WelcomeTabContent />}
      </main>
    </div>
  );
};

export default WelcomePage;