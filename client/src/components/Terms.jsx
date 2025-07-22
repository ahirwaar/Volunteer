import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  HandRaisedIcon,
  UserIcon,
  DocumentTextIcon,
  ScaleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const Terms = () => {
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

  const Section = ({ id, title, icon: Icon, children }) => {
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
          <div className="flex items-center">
            <Icon className="h-6 w-6 text-blue-500 mr-3" />
            <h2 className="text-2xl font-semibold group-hover:text-blue-600 transition-colors duration-200">
              {title}
            </h2>
          </div>
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

  const sections = [
    {
      id: 'acceptance',
      title: '1. Acceptance of Terms',
      icon: ShieldCheckIcon,
      content: (
        <motion.div
          className="mt-4 space-y-4"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-gray-700 leading-relaxed">
            By accessing and using this platform, you accept and agree to be bound by the terms
            and provision of this agreement. These terms constitute a legally binding agreement
            between you and Volunteer Connect.
          </p>
        </motion.div>
      )
    },
    {
      id: 'accounts',
      title: '2. User Accounts',
      icon: UserIcon,
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-gray-700 mb-4">
            To use certain features of the platform, you must register for an account.
            You agree to:
          </p>
          <motion.ul className="grid gap-3">
            {[
              'Provide accurate and complete information',
              'Maintain the security of your account credentials',
              'Promptly update any changes to your information',
              'Accept responsibility for all activities under your account'
            ].map((item, index) => (
              <motion.li
                key={index}
                className="flex items-center bg-gray-50 p-3 rounded-lg"
                whileHover={{ x: 10, backgroundColor: '#F3F4F6' }}
                transition={{ duration: 0.2 }}
              >
                <div className="h-2 w-2 bg-blue-500 rounded-full mr-3" />
                <span className="text-gray-700">{item}</span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )
    },
    {
      id: 'opportunities',
      title: '3. Volunteer Opportunities',
      icon: HandRaisedIcon,
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-gray-700 mb-4">
            Organizations posting volunteer opportunities agree to:
          </p>
          <div className="grid gap-4">
            {[
              {
                title: 'Accurate Information',
                description: 'Provide detailed and truthful descriptions of opportunities'
              },
              {
                title: 'Safe Environment',
                description: 'Maintain a safe and supportive volunteer environment'
              },
              {
                title: 'Legal Compliance',
                description: 'Comply with all applicable laws and regulations'
              },
              {
                title: 'Timely Response',
                description: 'Respond to volunteer applications promptly and professionally'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm"
                whileHover={{ scale: 1.02, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-semibold text-blue-600">{item.title}</h4>
                <p className="text-gray-700 mt-1">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'conduct',
      title: '4. User Conduct',
      icon: UserGroupIcon,
      content: (
        <div className="mt-4 space-y-4">
          <p className="text-gray-700 mb-4">
            Users agree not to:
          </p>
          <motion.div
            className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg"
            whileHover={{ scale: 1.01 }}
          >
            <ul className="grid gap-3">
              {[
                'Post false or misleading information',
                'Harass or discriminate against other users',
                'Violate any applicable laws or regulations',
                'Attempt to gain unauthorized access to the platform',
                'Share account credentials with others',
                'Use the platform for commercial purposes without authorization'
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="h-2 w-2 bg-red-400 rounded-full mr-3" />
                  <span className="text-gray-700">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      )
    },
    {
      id: 'intellectual',
      title: '5. Intellectual Property',
      icon: DocumentTextIcon,
      content: (
        <motion.div
          className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg"
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-gray-700 leading-relaxed">
            All content on this platform, unless user-generated, is the property of the
            platform and is protected by copyright and other intellectual property laws.
            This includes but is not limited to text, graphics, logos, images, and software.
          </p>
        </motion.div>
      )
    },
    {
      id: 'liability',
      title: '6. Limitation of Liability',
      icon: ScaleIcon,
      content: (
        <motion.div
          className="mt-4 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg"
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-gray-700 leading-relaxed mb-4">
            The platform is provided "as is" without any warranties. We are not responsible
            for the actions of users or organizations on the platform.
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 italic">
              Users acknowledge and agree that their use of the platform is at their own risk.
            </p>
          </div>
        </motion.div>
      )
    },
    {
      id: 'changes',
      title: '7. Changes to Terms',
      icon: ArrowPathIcon,
      content: (
        <motion.div
          className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg"
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-gray-700 leading-relaxed mb-4">
            We reserve the right to modify these terms at any time. Users will be notified
            of any changes through the platform.
          </p>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </motion.div>
      )
    }
  ];

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
          Terms of Service
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
          {sections.map((section) => (
            <Section
              key={section.id}
              id={section.id}
              title={section.title}
              icon={section.icon}
            >
              {section.content}
            </Section>
          ))}
        </div>

        <motion.div
          className="mt-12 bg-white p-6 rounded-lg shadow-sm text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-700">
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <div className="mt-4 space-y-2">
            <motion.p
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              whileHover={{ x: 10 }}
            >
              <a href="mailto:pankajahirwar571@gmail.com">pankajahirwar571@gmail.com</a>
            </motion.p>
            <motion.p
              className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
              whileHover={{ x: 10 }}
            >
              <a href="tel:+919343709766">+91 9343709766</a>
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Terms; 