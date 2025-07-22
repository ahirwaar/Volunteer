import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">401</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Unauthorized Access</h2>
        <p className="text-gray-600 mt-2">
          You don't have permission to access this page.
        </p>
        <div className="mt-8 space-x-4">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Back to Dashboard
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Home
            </Link>
          )}
          <Link
            to="/opportunities"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Browse Opportunities
          </Link>
        </div>
        <div className="mt-12">
          <p className="text-gray-500">
            Need help?{' '}
            <Link to="/contact" className="text-blue-500 hover:text-blue-600">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 