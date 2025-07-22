import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      type: 'in-person',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: ''
      }
    },
    schedule: {
      startDate: '',
      endDate: '',
      timeCommitment: {
        hoursPerWeek: 1,
        duration: 'one-time',
        availabilityRequired: {
          weekdays: false,
          weekends: false,
          evenings: false,
          mornings: false
        }
      }
    },
    category: '',
    skills: [],
    urgency: 'medium',
    status: 'active',
    contactInfo: {
      email: user?.email || '',
      phone: ''
    },
    volunteersNeeded: 1,
    ageRequirement: {
      minimum: 18,
      maximum: null
    }
  });

  const validateDates = () => {
    const errors = {};
    const now = new Date();
    const startDate = new Date(formData.schedule.startDate);
    const endDate = formData.schedule.endDate ? new Date(formData.schedule.endDate) : null;

    // Validate start date
    if (startDate <= now) {
      errors.startDate = 'Start date must be in the future';
    }

    // Validate end date
    if (endDate && endDate <= startDate) {
      errors.endDate = 'End date must be after start date';
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const parts = name.split('.');
      setFormData(prev => {
        let newData = { ...prev };
        let current = newData;
        
        // Navigate through all parts except the last one
        for (let i = 0; i < parts.length - 1; i++) {
          current[parts[i]] = { ...current[parts[i]] };
          current = current[parts[i]];
        }
        
        // Set the final value
        current[parts[parts.length - 1]] = type === 'checkbox' ? checked : value;
        
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear errors when field is changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value.split(',').map(item => item.trim()).filter(Boolean)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate dates before submission
    const dateErrors = validateDates();
    if (Object.keys(dateErrors).length > 0) {
      setErrors(dateErrors);
      Object.values(dateErrors).forEach(error => toast.error(error));
      return;
    }

    setSaving(true);

    try {
      // Format dates
      const formattedData = {
        ...formData,
        schedule: {
          ...formData.schedule,
          startDate: new Date(formData.schedule.startDate).toISOString(),
          endDate: formData.schedule.endDate ? new Date(formData.schedule.endDate).toISOString() : undefined
        },
        organization: user?.id
      };

      const response = await api.post('/opportunities', formattedData);
      
      if (response.data.success) {
        toast.success('Opportunity created successfully!');
        navigate('/organization/dashboard');
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create opportunity';
      toast.error(errorMessage);
      
      // Handle validation errors from the server
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Opportunity</h1>
          <p className="mt-2 text-sm text-gray-600">
            Fill in the details for the new volunteer opportunity
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white shadow rounded-lg p-6">
          {/* Basic Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="environment">Environment</option>
                <option value="animal-welfare">Animal Welfare</option>
                <option value="community">Community Service</option>
                <option value="elderly-care">Elderly Care</option>
                <option value="youth-development">Youth Development</option>
                <option value="arts-culture">Arts & Culture</option>
                <option value="sports-recreation">Sports & Recreation</option>
                <option value="disaster-relief">Disaster Relief</option>
                <option value="food-security">Food Security</option>
                <option value="homelessness">Homelessness</option>
                <option value="mental-health">Mental Health</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Set to "Active" to make the opportunity immediately available, or "Draft" to save it for later.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Location</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="location.type"
                value={formData.location.type}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="in-person">In Person</option>
                <option value="virtual">Virtual</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {formData.location.type !== 'virtual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    name="location.address.street"
                    value={formData.location.address.street}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="location.address.city"
                    value={formData.location.address.city}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="location.address.state"
                    value={formData.location.address.state}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    name="location.address.zipCode"
                    value={formData.location.address.zipCode}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Schedule */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="schedule.startDate"
                  value={formData.schedule.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="schedule.endDate"
                  value={formData.schedule.endDate}
                  onChange={handleChange}
                  min={formData.schedule.startDate || new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Category and Skills */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Category and Skills</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Required Skills</label>
              <input
                type="text"
                value={formData.skills.join(', ')}
                onChange={(e) => handleArrayChange('skills', e.target.value)}
                placeholder="Enter skills separated by commas"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                  type="email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                  type="tel"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Additional Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Volunteers Needed</label>
                <input
                  type="number"
                  name="volunteersNeeded"
                  value={formData.volunteersNeeded}
                  onChange={handleChange}
                  min="1"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Minimum Age</label>
                <input
                  type="number"
                  name="ageRequirement.minimum"
                  value={formData.ageRequirement.minimum}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Maximum Age (if applicable)</label>
                <input
                  type="number"
                  name="ageRequirement.maximum"
                  value={formData.ageRequirement.maximum || ''}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Opportunity'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOpportunity; 