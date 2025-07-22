import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let endpoints = [];

        if (user.role === 'volunteer') {
          endpoints = [
            '/api/applications/my-applications',
            '/api/opportunities/recommended',
          ];
        } else if (user.role === 'organization') {
          endpoints = [
            '/api/opportunities/my',
            '/api/applications/organization-applications'
          ];
        } else if (user.role === 'admin') {
          endpoints = [
            '/api/opportunities',
            '/api/applications',
            '/api/stats/dashboard',
          ];
        }

        const responses = await Promise.all(
          endpoints.map(endpoint => axios.get(endpoint))
        );

        if (user.role === 'volunteer') {
          setApplications(responses[0].data);
          setOpportunities(responses[1].data);
        } else if (user.role === 'organization') {
          setOpportunities(responses[0].data);
          setApplications(responses[1].data);
        } else if (user.role === 'admin') {
          setOpportunities(responses[0].data);
          setApplications(responses[1].data);
          setStats(responses[2].data);
        }

        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const renderVolunteerDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Applications</h2>
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications yet.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h3 className="font-medium text-gray-900">
                    {application.opportunity.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {application.opportunity.organization.name}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recommended Opportunities
          </h2>
          {opportunities.length === 0 ? (
            <p className="text-gray-600">No recommendations available.</p>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <Link
                  key={opportunity._id}
                  to={`/opportunities/${opportunity._id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                  <p className="text-sm text-gray-600">{opportunity.organization.name}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Location: {opportunity.location}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderOrganizationDashboard = () => (
    <>
      <div className="flex justify-end mb-6">
        <Link
          to="/opportunities/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Post New Opportunity
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Posted Opportunities
          </h2>
          {opportunities.length === 0 ? (
            <p className="text-gray-600">No opportunities posted yet.</p>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <Link
                  key={opportunity._id}
                  to={`/opportunities/${opportunity._id}/edit`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                  <p className="text-sm text-gray-600">
                    Applications: {opportunity.applications?.length || 0}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        opportunity.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Posted: {new Date(opportunity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Applications
          </h2>
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications received yet.</p>
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {application.opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Applicant: {application.user.name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderAdminDashboard = () => (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.totalApplications}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Accepted</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {stats.acceptedApplications}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">
            {stats.pendingApplications}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900">Rejected</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {stats.rejectedApplications}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Opportunities
          </h2>
          {opportunities.length === 0 ? (
            <p className="text-gray-600">No opportunities available.</p>
          ) : (
            <div className="space-y-4">
              {opportunities.slice(0, 5).map((opportunity) => (
                <Link
                  key={opportunity._id}
                  to={`/opportunities/${opportunity._id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h3 className="font-medium text-gray-900">{opportunity.title}</h3>
                  <p className="text-sm text-gray-600">
                    {opportunity.organization.name}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        opportunity.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Posted: {new Date(opportunity.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Applications
          </h2>
          {applications.length === 0 ? (
            <p className="text-gray-600">No applications available.</p>
          ) : (
            <div className="space-y-4">
              {applications.slice(0, 5).map((application) => (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {application.opportunity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {application.user.name} → {application.opportunity.organization.name}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        application.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Applied: {new Date(application.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        {user.role === 'volunteer' && renderVolunteerDashboard()}
        {user.role === 'organization' && renderOrganizationDashboard()}
        {user.role === 'admin' && renderAdminDashboard()}
      </div>
    </div>
  );
};

export default Dashboard; 