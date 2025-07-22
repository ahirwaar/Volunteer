import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const Privacy = () => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  const Section = ({ id, title, children }) => {
    const isExpanded = expandedSections[id] !== false; // Default to expanded

    return (
      <motion.section
        variants={sectionVariants}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 mb-6"
      >
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex justify-between items-center text-left focus:outline-none group"
        >
          <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h2>
          {isExpanded ? (
            <ChevronUpIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
          ) : (
            <ChevronDownIcon className="h-6 w-6 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
          )}
        </button>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      </motion.section>
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.h1
          className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Privacy Policy
        </motion.h1>
        
        <motion.p
          className="text-gray-600 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Last updated: {new Date().toLocaleDateString()}
        </motion.p>

        <div className="space-y-6">
          <Section id="intro" title="1. Introduction">
            <div className="mt-4 prose max-w-none">
              <p className="text-gray-700 leading-relaxed hover:text-gray-900 transition-colors duration-200">
                Welcome to Volunteer Connect. We are committed to protecting your privacy and ensuring
                the security of your personal information. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our platform.
              </p>
            </div>
          </Section>

          <Section id="collection" title="2. Information We Collect">
            <div className="mt-4 space-y-4">
              <div className="transform hover:scale-102 transition-transform duration-200">
                <h3 className="text-xl font-medium mb-3 text-blue-600">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li className="hover:text-gray-900 transition-colors duration-200">Account information (name, email, password)</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Profile information (phone number, address, skills, interests)</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Volunteer applications and related documents</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Organization details and opportunity listings</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Communications with us or other users</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Feedback and survey responses</li>
          </ul>
              </div>

              <div className="transform hover:scale-102 transition-transform duration-200">
                <h3 className="text-xl font-medium mb-3 text-blue-600">2.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li className="hover:text-gray-900 transition-colors duration-200">Device information (IP address, browser type, operating system)</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Usage data (pages visited, actions taken, time spent)</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Location information (if permitted by your device)</li>
                  <li className="hover:text-gray-900 transition-colors duration-200">Cookies and similar tracking technologies</li>
          </ul>
              </div>
            </div>
          </Section>

          <Section id="usage" title="3. How We Use Your Information">
            <div className="mt-4 space-y-4">
              <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
              <div className="grid gap-4">
                {[
                  {
                    title: 'Core Service Functionality',
                    items: [
                      'Creating and managing your account',
                      'Matching volunteers with opportunities',
                      'Processing applications',
                      'Facilitating communication'
                    ]
                  },
                  {
                    title: 'Platform Improvement',
                    items: [
                      'Analyzing usage patterns',
                      'Developing new features',
                      'Troubleshooting issues'
                    ]
                  },
                  {
                    title: 'Communication',
                    items: [
                      'Sending service updates',
                      'Providing support',
                      'Marketing (with consent)'
                    ]
                  }
                ].map((category, index) => (
                  <motion.div
                    key={category.title}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="font-semibold text-blue-600 mb-2">{category.title}</h4>
                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                      {category.items.map((item, i) => (
                        <li key={i} className="hover:text-gray-900 transition-colors duration-200">{item}</li>
                      ))}
          </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          <Section id="sharing" title="4. Information Sharing and Disclosure">
            <div className="mt-4 space-y-4">
              <motion.div
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-gray-700 mb-4">We share your information only in specific circumstances:</p>
                <ul className="space-y-4">
                  {[
                    {
                      title: 'With Organizations',
                      description: 'When you apply for volunteer opportunities, your profile and application information is shared with the respective organization.'
                    },
                    {
                      title: 'Service Providers',
                      description: 'We may share data with trusted service providers who assist in operating our platform (e.g., hosting, analytics, email delivery).'
                    },
                    {
                      title: 'Legal Requirements',
                      description: 'When required by law or to protect our rights, safety, and property.'
                    }
                  ].map((item, index) => (
                    <li key={index} className="hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                      <h4 className="font-semibold text-blue-600">{item.title}</h4>
                      <p className="text-gray-700 mt-1">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </Section>

          <Section id="security" title="5. Data Security">
            <div className="mt-4">
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-gray-700 mb-4">
                  We implement industry-standard security measures to protect your data, including:
                </p>
                <ul className="grid gap-3">
                  {[
                    'Encryption of data in transit and at rest',
                    'Regular security assessments and updates',
                    'Access controls and authentication measures',
                    'Secure data storage and backup procedures'
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                      whileHover={{ x: 10 }}
                    >
                      <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
                      <span className="text-gray-700">{item}</span>
                    </motion.li>
                  ))}
          </ul>
              </motion.div>
            </div>
          </Section>

          <Section id="contact" title="9. Contact Us">
            <div className="mt-4">
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg"
                whileHover={{ scale: 1.02 }}
              >
                <p className="text-gray-700 mb-4">
                  If you have questions, concerns, or requests related to this Privacy Policy or
                  your personal information, please contact us at:
                </p>
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                  <motion.p
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    whileHover={{ x: 10 }}
                  >
                    <span className="font-semibold mr-2">Email:</span>
                    <a href="mailto:pankajahirwar571@gmail.com">pankajahirwar571@gmail.com</a>
                  </motion.p>
                  <motion.p
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    whileHover={{ x: 10 }}
                  >
                    <span className="font-semibold mr-2">Phone:</span>
                    <a href="tel:+919343709766">+91 9343709766</a>
                  </motion.p>
                  <motion.p
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    whileHover={{ x: 10 }}
                  >
                    <span className="font-semibold mr-2">Address:</span>
                    <span>NIC GPM</span>
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </Section>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy; 