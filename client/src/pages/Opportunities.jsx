import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, UserGroupIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../services/api';
import toast from 'react-hot-toast';

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    urgency: '',
    status: '',
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({});
  const [searchInput, setSearchInput] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const categories = [
    'education',
    'environment',
    'health',
    'community',
    'technology',
    'arts',
    'sports',
    'other'
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600 bg-green-100' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600 bg-yellow-100' },
    { value: 'high', label: 'High', color: 'text-orange-600 bg-orange-100' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600 bg-red-100' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'draft', label: 'Draft' },
    { value: '', label: 'All' }
  ];

  // Validate and sanitize search input
  const validateSearchInput = useCallback((input) => {
    return input.replace(/[^\w\s]/gi, '').trim();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const sanitizedSearch = validateSearchInput(searchInput);
      setFilters(prev => ({ ...prev, search: sanitizedSearch, page: 1 }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput, validateSearchInput]);

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    try {
      setIsFiltering(true);
      setError('');
      const queryParams = new URLSearchParams();
      
      // Only add non-empty filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          // Handle city filter specifically for location
          if (key === 'city') {
            queryParams.append('city', value);
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await api.get(`/opportunities?${queryParams}`);
      
      if (response.data.success) {
        setOpportunities(response.data.data || []);
        setPagination(response.data.pagination || {});
      } else {
        throw new Error(response.data.message || 'Failed to fetch opportunities');
      }
    } catch (err) {
      console.error('Fetch opportunities error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch opportunities. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setOpportunities([]);
    } finally {
      setIsFiltering(false);
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      category: '',
      city: '',
      urgency: '',
      status: '',
      page: 1,
      limit: 12
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const getUrgencyStyle = (urgency) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level ? level.color : 'text-gray-600 bg-gray-100';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Volunteer Opportunities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make a difference in your community by helping elderly individuals with daily tasks and companionship.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filter Opportunities</h3>
            {(searchInput || filters.category || filters.city || filters.urgency || filters.status !== 'active') && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {isFiltering && searchInput && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="Enter city..."
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency
              </label>
              <select
                value={filters.urgency}
                onChange={(e) => handleFilterChange('urgency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Urgency Levels</option>
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-gray-50 py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Results Info */}
            {!error && (
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  {pagination.total ? (
                    <>
                      Showing {((pagination.current - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(pagination.current * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} opportunities
                      {(searchInput || filters.category || filters.city || filters.urgency || filters.status !== 'active') && (
                        <span className="text-blue-600"> (filtered)</span>
                      )}
                    </>
                  ) : (
                    'No opportunities found'
                  )}
                </p>
              </div>
            )}

            {/* Opportunities Grid */}
            {opportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {opportunities.map((opportunity) => (
                  <div key={opportunity._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Urgency Badge */}
                    <div className="p-4 pb-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyStyle(opportunity.urgency)}`}>
                        {opportunity.urgency === 'urgent' && (
                          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                        )}
                        {urgencyLevels.find(l => l.value === opportunity.urgency)?.label || 'Unknown'}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {opportunity.title}
                      </h3>

                      {/* Organization */}
                      <div className="flex items-center mb-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {opportunity.organization?.organizationName || opportunity.organization?.name}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center mb-2">
                        <MapPinIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {opportunity.location?.address?.city}, {opportunity.location?.address?.state}
                        </span>
                      </div>

                      {/* Time Commitment */}
                      <div className="flex items-center mb-4">
                        <ClockIcon className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">
                          {opportunity.schedule?.isRecurring ? 'Recurring' : 'One-time'} -
                          {opportunity.schedule?.recurringPattern?.frequency ? 
                            ` ${opportunity.schedule.recurringPattern.frequency}` : 
                            ` ${formatDate(opportunity.schedule?.startDate)}`}
                        </span>
                      </div>

                      {/* Category Tag */}
                      <div className="mb-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {opportunity.category.charAt(0).toUpperCase() + opportunity.category.slice(1)}
                        </span>
                      </div>

                      {/* Action Button */}
                      <Link
                        to={`/opportunities/${opportunity._id}`}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No opportunities found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or check back later for new opportunities.
                </p>
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.current === 1 || isFiltering}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1 || isFiltering}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.current <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.current >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.current - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={isFiltering}
                        className={`px-3 py-2 text-sm font-medium rounded-md 
                          ${pagination.current === pageNum 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'} 
                          disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.pages || isFiltering}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(pagination.pages)}
                  disabled={pagination.current === pagination.pages || isFiltering}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Opportunities; 