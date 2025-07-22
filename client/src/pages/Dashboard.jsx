import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [applicationMessage, setApplicationMessage] = useState('');
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/my');
      if (response.data.success) {
        // Filter out any null or invalid applications
        const validApplications = response.data.data.filter(app => 
          app && app._id && app.opportunity && app.organization
        );
        setApplications(validApplications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in again to view your applications');
      } else {
        toast.error(error.response?.data?.message || 'Failed to fetch applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (application) => {
    setSelectedApplication(application);
    setApplicationMessage(application.applicationMessage || '');
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (application) => {
    setSelectedApplication(application);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedApplication) return;

    try {
      setEditing(true);
      const response = await api.put(`/applications/${selectedApplication._id}`, {
        applicationMessage
      }, { auth: true });
      
      if (response.data.success) {
        toast.success('Application updated successfully');
        setApplications(applications.map(app => 
          app._id === selectedApplication._id 
            ? { ...app, applicationMessage } 
            : app
        ));
        setIsEditModalOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to update application');
      }
    } catch (err) {
      console.error('Edit error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedApplication) return;

    try {
      setDeleting(true);
      const response = await api.delete(`/applications/${selectedApplication._id}`, { auth: true });
      
      if (response.data.success) {
        toast.success('Application deleted successfully');
        setApplications(applications.filter(app => app._id !== selectedApplication._id));
        setIsDeleteModalOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to delete application');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleViewClick = (application) => {
    // Navigate to application details page
    window.location.href = `/applications/${application._id}`;
  };

  const handleRateClick = (application) => {
    setSelectedApplication(application);
    setRating(0);
    setFeedback('');
    setIsRatingModalOpen(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedApplication) return;

    try {
      setSubmittingRating(true);
      const response = await api.put(`/applications/${selectedApplication._id}/rate`, {
        score: rating,
        feedback: feedback
      });
      
      if (response.data.success) {
        toast.success('Rating submitted successfully');
        // Update the application in the local state
        setApplications(applications.map(app => 
          app._id === selectedApplication._id 
            ? { ...app, rating: { organizationRating: { score: rating, feedback: feedback } } }
            : app
        ));
        setIsRatingModalOpen(false);
      }
    } catch (err) {
      console.error('Submit rating error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSubmittingRating(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="mt-2 text-sm text-gray-600">
            Track and manage your volunteer applications
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/opportunities"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Browse Opportunities
            </h3>
            <p className="text-gray-600">
              Find new volunteer opportunities that match your interests.
            </p>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <UserCircleIcon className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Update Profile
            </h3>
            <p className="text-gray-600">
              Keep your volunteer profile up to date with your skills and availability.
            </p>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <CalendarIcon className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Your Impact
            </h3>
            <p className="text-gray-600">
              {applications.filter(app => app.status === 'completed').length} opportunities completed
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-500 mb-4">Start your volunteering journey today!</p>
            <Link
              to="/opportunities"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Opportunities
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="divide-y divide-gray-200">
              {applications.map((application) => application && (
                <div key={application._id} className="bg-white p-6 rounded-lg shadow mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {application.opportunity?.title || 'Untitled Opportunity'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Organization: {application.organization?.name || 'Unknown Organization'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Applied on: {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        application.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : application.status === 'accepted'
                          ? 'bg-blue-100 text-blue-800'
                          : application.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>

                  {/* Show rating if application is completed and has a rating */}
                  {application.status === 'completed' && application.rating?.volunteerRating && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900">Organization's Rating</h4>
                      <div className="mt-2 flex items-center">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-xl ${
                                star <= application.rating.volunteerRating.score
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({application.rating.volunteerRating.score}/5)
                        </span>
                      </div>
                      {application.rating.volunteerRating.feedback && (
                        <p className="mt-2 text-sm text-gray-600">
                          "{application.rating.volunteerRating.feedback}"
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex justify-end space-x-4">
                    <button
                      onClick={() => handleViewClick(application)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    {application.status === 'completed' && !application.rating?.organizationRating && (
                      <button
                        onClick={() => handleRateClick(application)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Rate Organization
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Edit Application</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <textarea
                value={applicationMessage}
                onChange={(e) => setApplicationMessage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
                rows="4"
                placeholder="Add or update your message to the organization..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEdit}
                  disabled={editing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {editing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Application</h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete your application for "{selectedApplication?.opportunity.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete Application'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {isRatingModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Rate Organization</h3>
                <button
                  onClick={() => setIsRatingModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating</label>
                  <div className="mt-1 flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl ${
                          rating >= star ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Feedback</label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Share your experience with this organization..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSubmitRating}
                    disabled={!rating || submittingRating}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submittingRating ? 'Submitting...' : 'Submit Rating'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 