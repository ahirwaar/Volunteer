import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  UserGroupIcon,
  GlobeAltIcon,
  HandRaisedIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

const About = () => {
  const stats = [
    { label: 'Active Volunteers', value: '1,000+' },
    { label: 'Partner Organizations', value: '100+' },
    { label: 'Opportunities Posted', value: '500+' },
    { label: 'Hours Contributed', value: '10,000+' },
  ];

  const values = [
    {
      icon: <HeartIcon className="h-6 w-6" />,
      title: "Compassion",
      description: "We believe in the power of empathy and understanding to create meaningful connections between volunteers and those in need."
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: "Community",
      description: "Building strong communities through volunteer work and fostering lasting relationships between helpers and those they assist."
    },
    {
      icon: <GlobeAltIcon className="h-6 w-6" />,
      title: "Impact",
      description: "Making a real difference in people's lives through targeted volunteer efforts and sustainable community programs."
    },
    {
      icon: <HandRaisedIcon className="h-6 w-6" />,
      title: "Accessibility",
      description: "Ensuring volunteer opportunities are accessible to everyone who wants to make a difference in their community."
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: "Trust",
      description: "Maintaining the highest standards of safety and reliability in all volunteer interactions and opportunities."
    },
    {
      icon: <SparklesIcon className="h-6 w-6" />,
      title: "Innovation",
      description: "Continuously improving our platform to better serve volunteers and organizations in their mission to help others."
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600 py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-64 object-cover rounded-lg shadow-lg"
            src="/images/elderly-care.jpg"
            alt="Volunteers helping elderly people"
          />
          <div className="absolute inset-0 bg-blue-600 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            About Volunteer Connect
          </h1>
          <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering communities through meaningful volunteer opportunities and 
            connecting passionate individuals with causes that matter.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We believe in the power of volunteerism to transform communities and enrich lives. 
            Our platform connects passionate volunteers with meaningful opportunities, making it 
            easier than ever to contribute to causes that matter. By bridging the gap between 
            willing helpers and those in need, we're building stronger, more connected communities.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
                <p className="text-3xl font-extrabold text-blue-600">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Our Values</h2>
          <p className="mt-4 text-lg text-gray-600">
            The principles that guide us in connecting volunteers with meaningful opportunities.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="text-blue-600">{value.icon}</div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{value.title}</h3>
              <p className="mt-2 text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to Make a Difference?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join our community today and start your volunteer journey.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/opportunities"
                className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-blue-500 transition-colors"
              >
                Browse Opportunities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;