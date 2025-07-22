import { useAuth } from '../contexts/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  HeartIcon,
  ClockIcon,
  BuildingOfficeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const UserDetails = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">User not found</h2>
            <p className="mt-2 text-gray-600">Please log in to view your details.</p>
          </div>
        </div>
      </div>
    );
  }

  const renderSection = (icon, title, content) => {
    if (!content) return null;
    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="mt-1 text-sm text-gray-900">{content}</p>
        </div>
      </div>
    );
  };

  const renderArraySection = (icon, title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex flex-wrap gap-2">
            {items.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">User Details</h2>
            <p className="mt-1 text-sm text-gray-600">Personal and account information.</p>
          </div>

          {/* Content */}
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
              {renderSection(
                <UserIcon className="h-5 w-5 text-gray-400" />,
                "Full Name",
                user.name
              )}
              {renderSection(
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />,
                "Email",
                user.email
              )}
              {renderSection(
                <PhoneIcon className="h-5 w-5 text-gray-400" />,
                "Phone",
                user.phone || "Not provided"
              )}
              {renderSection(
                <MapPinIcon className="h-5 w-5 text-gray-400" />,
                "Location",
                user.location || "Not provided"
              )}
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Profile Information</h3>
              {renderSection(
                <GlobeAltIcon className="h-5 w-5 text-gray-400" />,
                "Bio",
                user.bio || "No bio provided"
              )}
              {renderArraySection(
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />,
                "Skills",
                user.skills
              )}
              {renderArraySection(
                <HeartIcon className="h-5 w-5 text-gray-400" />,
                "Interests",
                user.interests
              )}
              {renderSection(
                <ClockIcon className="h-5 w-5 text-gray-400" />,
                "Availability",
                user.availability ? user.availability.charAt(0).toUpperCase() + user.availability.slice(1) : "Not specified"
              )}
            </div>

            {/* Organization Information (if applicable) */}
            {user.role === 'organization' && user.organizationProfile && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Organization Information</h3>
                {renderSection(
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />,
                  "Organization Name",
                  user.organizationProfile.organizationName
                )}
                {renderSection(
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" />,
                  "Website",
                  user.organizationProfile.website || "Not provided"
                )}
                {renderSection(
                  <UserIcon className="h-5 w-5 text-gray-400" />,
                  "Organization Type",
                  user.organizationProfile.organizationType ? 
                    user.organizationProfile.organizationType.charAt(0).toUpperCase() + 
                    user.organizationProfile.organizationType.slice(1) : 
                    "Not specified"
                )}
              </div>
            )}

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Account Information</h3>
              {renderSection(
                <UserIcon className="h-5 w-5 text-gray-400" />,
                "Account Type",
                user.role.charAt(0).toUpperCase() + user.role.slice(1)
              )}
              {renderSection(
                <ClockIcon className="h-5 w-5 text-gray-400" />,
                "Member Since",
                new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 