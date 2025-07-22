import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [volunteerStats, setVolunteerStats] = useState({
    totalHours: 0,
    completedOpportunities: 0,
    upcomingOpportunities: 0,
    favoriteCategories: []
  });
  const [volunteerHistory, setVolunteerHistory] = useState([]);
  const [upcomingOpportunities, setUpcomingOpportunities] = useState([]);
  const [ratings, setRatings] = useState({
    received: [],
    given: []
  });

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    interests: user?.interests?.join(', ') || '',
    availability: user?.availability || '',
    location: user?.location || '',
    profileImage: user?.profileImage || '',
    preferredCommunication: user?.preferredCommunication || 'email',
    notificationPreferences: user?.notificationPreferences || {
      email: true,
      sms: false,
      push: true
    }
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Fetch volunteer statistics
        const statsResponse = await api.get('/users/volunteer-stats');
        if (statsResponse.data.success) {
          setVolunteerStats(statsResponse.data.data);
        }

        // Fetch volunteer history
        const historyResponse = await api.get('/users/volunteer-history');
        if (historyResponse.data.success) {
          setVolunteerHistory(historyResponse.data.data);
        }

        // Fetch ratings
        try {
          const ratingsResponse = await api.get('/applications/ratings');
          if (ratingsResponse.data.success) {
            setRatings(ratingsResponse.data.data);
          }
        } catch (ratingError) {
          console.error('Error fetching ratings:', ratingError);
          // Don't show error toast for ratings as it's not critical
          setRatings({ received: [], given: [] });
        }

        // Fetch upcoming opportunities
        const upcomingResponse = await api.get('/users/upcoming-opportunities');
        if (upcomingResponse.data.success) {
          setUpcomingOpportunities(upcomingResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notificationPreferences: {
          ...prev.notificationPreferences,
          [name.split('.')[1]]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(interest => interest.trim()).filter(Boolean)
      };

      const response = await api.put('/users/profile', updatedData);
      
      if (response.data.success) {
        setUser(response.data.data);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileTab = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        {isEditing && (
          <button
            type="button"
            className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
          >
            Change Photo
          </button>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={true}
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="City, State"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={!isEditing}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Skills and Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Skills
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter skills separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Interests
          </label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter interests separated by commas"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>
      </div>

      {/* Availability and Communication Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Availability
          </label>
          <select
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">Select availability</option>
            <option value="weekdays">Weekdays</option>
            <option value="weekends">Weekends</option>
            <option value="evenings">Evenings</option>
            <option value="mornings">Mornings</option>
            <option value="flexible">Flexible</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Communication
          </label>
          <select
            name="preferredCommunication"
            value={formData.preferredCommunication}
            onChange={handleChange}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="sms">SMS</option>
          </select>
        </div>
      </div>

      {/* Notification Preferences */}
      {isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Preferences
          </label>
          <div className="space-y-2">
            {Object.entries(formData.notificationPreferences).map(([key, value]) => (
              <label key={key} className="flex items-center">
                <input
                  type="checkbox"
                  name={`notificationPreferences.${key}`}
                  checked={value}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">
                  {key} Notifications
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </form>
  );

  const renderVolunteerHistoryTab = () => (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Hours', value: volunteerStats.totalHours },
          { label: 'Completed Opportunities', value: volunteerStats.completedOpportunities },
          { label: 'Upcoming Opportunities', value: volunteerStats.upcomingOpportunities },
          { label: 'Impact Score', value: '85' }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">{stat.label}</div>
            <div className="mt-1 text-2xl font-semibold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Ratings Section */}
      <div className="space-y-6">
        {/* Ratings Received */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ratings Received</h3>
          <div className="space-y-4">
            {ratings.received.map((rating, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{rating.opportunity.title}</h4>
                    <p className="text-sm text-gray-500">{rating.organization.name}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= rating.score ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({rating.score}/5)
                      </span>
                    </div>
                    {rating.feedback && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        "{rating.feedback}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {ratings.received.length === 0 && (
              <p className="text-sm text-gray-500">No ratings received yet.</p>
            )}
          </div>
        </div>

        {/* Ratings Given */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ratings Given</h3>
          <div className="space-y-4">
            {ratings.given.map((rating, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-medium text-gray-900">{rating.opportunity.title}</h4>
                    <p className="text-sm text-gray-500">{rating.organization.name}</p>
                    <div className="mt-2 flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xl ${
                              star <= rating.score ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        ({rating.score}/5)
                      </span>
                    </div>
                    {rating.feedback && (
                      <p className="mt-2 text-sm text-gray-600 italic">
                        "{rating.feedback}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {ratings.given.length === 0 && (
              <p className="text-sm text-gray-500">No ratings given yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Volunteer History */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {volunteerHistory.map((activity, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-500">{activity.organization}</p>
                  <p className="text-sm text-gray-500">{activity.date}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  {activity.hours} hours
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUpcomingTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingOpportunities.map((opportunity, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h4 className="text-base font-medium text-gray-900">{opportunity.title}</h4>
            <p className="text-sm text-gray-500 mt-1">{opportunity.organization}</p>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {opportunity.date}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/opportunities/${opportunity.id}`}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View Details
              </Link>
              <span className="text-sm text-gray-500">{opportunity.timeCommitment}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg">
        {/* Header */}
        <div className="border-b border-gray-200">
          <div className="px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            {!isEditing && activeTab === 'profile' && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="px-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'profile', label: 'Profile' },
                { id: 'history', label: 'Volunteer History' },
                { id: 'upcoming', label: 'Upcoming Opportunities' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'history' && renderVolunteerHistoryTab()}
          {activeTab === 'upcoming' && renderUpcomingTab()}
        </div>
      </div>
    </div>
  );
};

export default Profile; 