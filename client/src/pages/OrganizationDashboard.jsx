import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

const OrganizationDashboard = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [processingAction, setProcessingAction] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchOpportunities();
    fetchApplications();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoadingOpportunities(true);
      setError('');
      
      // Check if user is authenticated and is an organization
      if (!user || user.role !== 'organization') {
        throw new Error('You must be logged in as an organization to view this page');
      }

      const response = await api.get('/opportunities/my');
      if (response.data.success) {
        setOpportunities(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch opportunities');
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch opportunities';
      setError(errorMessage);
      toast.error(errorMessage);
      
      // If unauthorized, trigger the auth error handler
      if (error.response?.status === 401) {
        window.dispatchEvent(new CustomEvent('unauthorized'));
      }
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoadingApplications(true);
      const response = await api.get('/applications/organization');
      if (response.data.success) {
        setApplications(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to fetch applications');
      toast.error('Failed to fetch applications');
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setIsViewModalOpen(true);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      setProcessingAction(true);
      const response = await api.put(`/applications/${applicationId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success(`Application ${newStatus} successfully`);
        setApplications(applications.map(app => 
          app._id === applicationId 
            ? { ...app, status: newStatus } 
            : app
        ));
        setIsViewModalOpen(false);
      } else {
        throw new Error(response.data.message || `Failed to ${newStatus} application`);
      }
    } catch (err) {
      console.error('Update status error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setProcessingAction(false);
    }
  };

  const handleDeleteOpportunity = async (opportunityId) => {
    try {
      const response = await api.delete(`/opportunities/${opportunityId}`);
      if (response.data.success) {
        toast.success('Opportunity deleted successfully');
        fetchOpportunities(); // Refresh the list
        setShowDeleteConfirm(false);
        setSelectedOpportunity(null);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete opportunity');
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const handleSubmitRating = async (applicationId) => {
    try {
      setSubmittingRating(true);
      const response = await api.put(`/applications/${applicationId}/rate`, {
        score: rating,
        feedback: feedback
      });
      
      if (response.data.success) {
        toast.success('Rating submitted successfully');
        setApplications(applications.map(app => 
          app._id === applicationId 
            ? { ...app, rating: { volunteerRating: { score: rating, feedback: feedback } } }
            : app
        ));
        setIsViewModalOpen(false);
      }
    } catch (err) {
      console.error('Submit rating error:', err);
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loadingOpportunities || loadingApplications) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Organization Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your opportunities and applications
            </p>
          </div>
          <Link
            to="/create-opportunity"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Opportunity
          </Link>
        </div>

        {/* Opportunities Section */}
        <div className="mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">My Opportunities</h2>
            <p className="mt-1 text-sm text-gray-600">
              Manage your posted volunteer opportunities
            </p>
          </div>

          {/* Opportunities Grid */}
          {opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opportunity) => opportunity && (
                <div key={opportunity._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {opportunity.title || 'Untitled Opportunity'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(opportunity.status || 'active')}`}>
                        {opportunity.status || 'active'}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {opportunity.location?.address?.city || 'No city'}, {opportunity.location?.address?.state || 'No state'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        {opportunity.schedule?.startDate ? formatDate(opportunity.schedule.startDate) : 'No date set'}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {opportunity.volunteersNeeded || 0} volunteer{(opportunity.volunteersNeeded || 0) !== 1 ? 's' : ''} needed
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/opportunities/${opportunity._id}`)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-2" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/opportunities/${opportunity._id}?edit=true`)}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <PencilIcon className="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOpportunity(opportunity);
                          setShowDeleteConfirm(true);
                        }}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No opportunities posted yet</h3>
              <p className="text-gray-500">Start by creating your first volunteer opportunity.</p>
            </div>
          )}
        </div>

        {/* Applications Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Applications</h2>
          
          {applications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
              <p className="text-gray-500">
                When volunteers apply to your opportunities, they will appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="divide-y divide-gray-200">
                {applications.map((application) => application && application.opportunity && (
                  <div key={application._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {application.opportunity.title || 'Untitled Opportunity'}
                        </h3>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">
                            Volunteer: {application.volunteer?.name || 'Unknown Volunteer'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied on {application.createdAt ? formatDate(application.createdAt) : 'Unknown date'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(
                            application.status || 'pending'
                          )}`}
                        >
                          {application.status || 'pending'}
                        </span>
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View application details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedOpportunity && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-center mb-4">
                <TrashIcon className="h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Delete Opportunity</h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Are you sure you want to delete "{selectedOpportunity.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedOpportunity(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteOpportunity(selectedOpportunity._id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Application Modal */}
        {isViewModalOpen && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedApplication(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Volunteer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Volunteer Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <p className="text-gray-900">{selectedApplication.volunteer.name}</p>
                        <p className="text-sm text-gray-500">Name</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <EyeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <a 
                          href={`mailto:${selectedApplication.volunteer.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedApplication.volunteer.email}
                        </a>
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                    </div>

                    {selectedApplication.volunteer.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <a 
                            href={`tel:${selectedApplication.volunteer.phone}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {selectedApplication.volunteer.phone}
                          </a>
                          <p className="text-sm text-gray-500">Phone</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Message */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Message</h4>
                  <p className="mt-1 text-gray-900 whitespace-pre-line">
                    {selectedApplication.message || "No message provided"}
                  </p>
                </div>

                {/* Application Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeColor(
                      selectedApplication.status
                    )}`}
                  >
                    {selectedApplication.status}
                  </span>
                </div>

                {/* Application Date */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Applied On</h4>
                  <p className="text-gray-900">{formatDate(selectedApplication.createdAt)}</p>
                </div>

                {selectedApplication.status === 'completed' && !selectedApplication.rating?.organizationRating && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Rate Volunteer</h4>
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
                          placeholder="Share your experience working with this volunteer..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleSubmitRating(selectedApplication._id)}
                          disabled={!rating || submittingRating}
                          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {submittingRating ? 'Submitting...' : 'Submit Rating'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                {selectedApplication.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication._id, 'rejected')}
                      disabled={processingAction}
                      className="mr-3 px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {processingAction ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication._id, 'accepted')}
                      disabled={processingAction}
                      className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {processingAction ? 'Processing...' : 'Accept'}
                    </button>
                  </>
                )}
                {selectedApplication.status === 'accepted' && (
                <button
                    onClick={() => handleUpdateStatus(selectedApplication._id, 'completed')}
                    disabled={processingAction}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {processingAction ? 'Processing...' : 'Mark as Completed'}
                </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationDashboard; 