import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  UserCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const response = await api.get(`/applications/${id}`);
      if (response.data.success) {
        setApplication(response.data.data);
        setNotes(response.data.data.organizationNotes || '');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error('Failed to fetch application details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      setProcessing(true);
      const response = await api.put(`/applications/${id}/status`, {
        status: newStatus,
        organizationNotes: notes
      });

      if (response.data.success) {
        toast.success(`Application ${newStatus} successfully`);
        setApplication(response.data.data);
      }
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update application status');
    } finally {
      setProcessing(false);
    }
  };

  const handleCommunicationPreferenceUpdate = async (preference) => {
    try {
      setProcessing(true);
      const response = await api.put(`/applications/${id}/communication`, {
        communicationPreference: preference
      });

      if (response.data.success) {
        toast.success('Communication preference updated successfully');
        setApplication(prev => ({
          ...prev,
          communicationPreference: preference
        }));
      }
    } catch (error) {
      console.error('Error updating communication preference:', error);
      toast.error('Failed to update communication preference');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Application not found</h2>
          <p className="mt-2 text-gray-600">The application you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Application Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Submitted on {formatDate(application.createdAt)}
            </p>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6">
            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(application.status)}`}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </span>
            </div>

            {/* Opportunity Details */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Opportunity</h4>
              <Link
                to={`/opportunities/${application.opportunity._id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {application.opportunity.title}
              </Link>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {application.opportunity.location?.address?.city}, {application.opportunity.location?.address?.state}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {formatDate(application.opportunity.schedule?.startDate)}
                </div>
              </div>
            </div>

            {/* Volunteer Details */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Volunteer Information</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{application.volunteer.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{application.volunteer.email}</p>
                </div>
              </div>
            </div>

            {/* Application Message */}
            {application.applicationMessage && (
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Application Message</h4>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {application.applicationMessage}
                </p>
              </div>
            )}

            {/* Organization Notes */}
            {user.role === 'organization' && (
              <div className="mb-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Organization Notes</h4>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this application..."
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            )}

            {/* Communication Section - Show when application is accepted */}
            {application.status === 'accepted' && (
              <div className="mb-8 bg-green-50 p-6 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Communication Details</h4>
                
                {/* Organization Contact Info */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Organization Contact Information</h5>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <a 
                        href={`mailto:${application.organization.email}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {application.organization.email}
                      </a>
                    </div>
                    {application.organization.phone && (
                      <div className="flex items-center">
                        <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <a 
                          href={`tel:${application.organization.phone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {application.organization.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Next Steps</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>Review the opportunity details and requirements</li>
                    <li>Contact the organization using the information above</li>
                    <li>Discuss your availability and start date</li>
                    <li>Ask any questions about the role or requirements</li>
                  </ul>
                </div>

                {/* Communication Preference */}
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Preferred Communication Method</h5>
                  <select
                    value={application.communicationPreference || 'email'}
                    onChange={(e) => handleCommunicationPreferenceUpdate(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="platform">Platform Messages</option>
                  </select>
                </div>
              </div>
            )}

            {/* Action Buttons for Organization */}
            {user.role === 'organization' && application.status === 'pending' && (
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={processing}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Reject
                </button>
                <button
                  onClick={() => handleStatusUpdate('accepted')}
                  disabled={processing}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Accept
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails; 