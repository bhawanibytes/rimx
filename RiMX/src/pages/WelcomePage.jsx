import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Building2, 
  Mail, 
  PlusCircle,
  UserPlus,
  LayoutDashboard
} from "lucide-react";

const WelcomePage = () => {
  const [activeTab, setActiveTab] = useState("welcome");

  // Mock data
  const mockPendingInvitations = [
    {
      id: "invite1",
      organizationName: "TechCorp Inc.",
      role: "Project Manager",
      invitedBy: "john.doe@techcorp.com",
      invitedAt: "2023-05-15"
    }
  ];

  const mockOrganizations = [
    {
      id: "org1",
      name: "Acme Corporation",
      role: "Admin",
      memberCount: 24,
      projects: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to RiMX!</h2>
          <p className="text-gray-600">
            Get started by joining an existing organization or creating a new one to begin collaborating with your team.
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
            <button
              onClick={() => setActiveTab("invitations")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "invitations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Invitations
              {mockPendingInvitations.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {mockPendingInvitations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("organizations")}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "organizations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Your Organizations
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "welcome" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Organization Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <PlusCircle className="h-10 w-10 text-blue-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Create New Organization</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Start a new organization and invite team members to collaborate on projects with hierarchical workflows.
                </p>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Create Organization
                </button>
              </div>
            </div>

            {/* Join Organization Card */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-green-300 transition-colors">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <UserPlus className="h-10 w-10 text-green-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">Join Existing Organization</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Join an organization you've been invited to or search for public organizations to request access.
                </p>
                <button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Join Organization
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "invitations" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {mockPendingInvitations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {mockPendingInvitations.map((invitation) => (
                  <li key={invitation.id} className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-4 sm:mb-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {invitation.organizationName}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Role: {invitation.role} • Invited by: {invitation.invitedBy} • {invitation.invitedAt}
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <Mail className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No pending invitations</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any organization invitations at this time.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "organizations" && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {mockOrganizations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {mockOrganizations.map((org) => (
                  <li key={org.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building2 className="h-10 w-10 text-blue-500 mr-4" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{org.name}</h3>
                          <p className="text-sm text-gray-500">
                            {org.role} • {org.memberCount} members • {org.projects} projects
                          </p>
                        </div>
                      </div>
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Enter Dashboard
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You're not currently a member of any organizations. Create a new one or join an existing organization.
                </p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Organization
                  </button>
                  <button
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Join Organization
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default WelcomePage;