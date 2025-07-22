import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const [userResponse, applicationsResponse] = await Promise.all([
          axios.get(`/api/users/${id}`),
          axios.get(`/api/applications/user/${id}`)
        ]);

        setUser(userResponse.data);
        setApplications(applicationsResponse.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user details');
        if (err.response?.status === 404) {
          navigate('/not-found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserDetails();
    }
  }, [id, navigate]);

  const handleApplicationStatus = async (applicationId, newStatus) => {
    try {
      setProcessing(true);
      const response = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success(`Application ${newStatus} successfully`);
        // Update the application status in the local state
        setApplications(applications.map(app =>
          app._id === applicationId
            ? { ...app, status: newStatus }
            : app
        ));
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error('Failed to update application status');
    } finally {
      setProcessing(false);
    }
  };

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
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* User Profile Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-500 capitalize mt-1">Role: {user?.role}</p>
            </div>
            {user?.profileImage && (
              <img
                src={user.profileImage}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
          </div>

          {user?.bio && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">About</h3>
              <p className="text-gray-700 mt-2">{user.bio}</p>
            </div>
          )}

          {user?.skills?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user?.interests?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Applications Section */}
        {(currentUser?.role === 'admin' || currentUser?.id === user?.id) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Application History</h2>
            {applications.length === 0 ? (
              <p className="text-gray-600">No applications found.</p>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {application.opportunity.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {application.opportunity.organization.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            application.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : application.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                        {currentUser?.role === 'admin' && application.status === 'pending' && (
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => handleApplicationStatus(application._id, 'accepted')}
                              disabled={processing}
                              className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleApplicationStatus(application._id, 'rejected')}
                              disabled={processing}
                              className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">{application.message}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Applied on: {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails; 