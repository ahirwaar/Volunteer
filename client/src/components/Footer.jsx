import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Footer = () => {
  const { isAuthenticated, user } = useAuth();

  const volunteerLinks = [
    { name: 'Browse Opportunities', href: '/opportunities' },
    { name: 'My Dashboard', href: '/dashboard' },
    { name: 'My Applications', href: '/dashboard#applications' },
    { name: 'My Profile', href: '/profile' },
  ];

  const organizationLinks = [
    { name: 'Organization Dashboard', href: '/organization/dashboard' },
    { name: 'Post Opportunity', href: '/opportunities/create' },
    { name: 'Manage Opportunities', href: '/organization/dashboard#opportunities' },
    { name: 'View Applications', href: '/organization/dashboard#applications' },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', href: '/admin/dashboard' },
    { name: 'Manage Users', href: '/admin/dashboard#users' },
    { name: 'Manage Organizations', href: '/admin/dashboard#organizations' },
    { name: 'All Opportunities', href: '/admin/dashboard#opportunities' },
  ];

  const generalLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const authLinks = isAuthenticated
    ? []
    : [
        { name: 'Login', href: '/login' },
        { name: 'Register', href: '/register' },
        { name: 'Forgot Password', href: '/forgot-password' },
      ];

  const getRoleSpecificLinks = () => {
    if (!isAuthenticated) return [];
    if (user?.role === 'admin') return adminLinks;
    if (user?.role === 'organization') return organizationLinks;
    return volunteerLinks;
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* General Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {generalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Links or Role-specific Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {isAuthenticated ? 'Quick Access' : 'Account'}
            </h3>
            <ul className="space-y-2">
              {(isAuthenticated ? getRoleSpecificLinks() : authLinks).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/opportunities"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Find Opportunities
                </Link>
              </li>
              <li>
                <Link
                  to="/organizations"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Organizations
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaEnvelope className="h-5 w-5 mr-2" />
                <a
                  href="mailto:pankajahirwar571@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  pankajahirwar571@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <FaPhone className="h-5 w-5 mr-2" />
                <a
                  href="tel:+919343709766"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  +91 9343709766
                </a>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                <span className="text-gray-300">
                  NIC GPM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300">
              © {currentYear} Volunteer Connect. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 