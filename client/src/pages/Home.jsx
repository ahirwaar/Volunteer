import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  HandRaisedIcon,
  HeartIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const features = [
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: "Connect with Purpose",
      description: "Join a community of volunteers and organizations dedicated to making a difference in elderly care."
    },
    {
      icon: <CalendarIcon className="h-6 w-6" />,
      title: "Flexible Scheduling",
      description: "Choose opportunities that fit your schedule, whether it's one-time events or recurring commitments."
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: "Local Impact",
      description: "Find volunteer opportunities in your area and make a difference in your local community."
    },
    {
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      title: "Easy Communication",
      description: "Stay connected with organizations and volunteers through our integrated messaging system."
    },
    {
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      title: "Verified Organizations",
      description: "All organizations are verified to ensure safe and meaningful volunteer experiences."
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Track Your Impact",
      description: "Monitor your volunteer hours and see the real difference you're making in people's lives."
    }
  ];

  const howItWorks = [
    {
      role: "For Volunteers",
      steps: [
        "Create your volunteer profile",
        "Browse available opportunities",
        "Apply for positions that interest you",
        "Get matched with organizations",
        "Start making a difference"
      ]
    },
    {
      role: "For Organizations",
      steps: [
        "Register your organization",
        "Create detailed opportunity listings",
        "Review volunteer applications",
        "Manage your volunteer team",
        "Track volunteer impact"
      ]
    }
  ];

  const testimonials = [
    {
      quote: "Volunteering through this platform has been incredibly rewarding. I've met amazing people and made a real difference in my community.",
      author: "Sarah Johnson",
      role: "Volunteer",
      image: "/images/testimonial-1.jpg"
    },
    {
      quote: "As an organization, we've found dedicated volunteers who share our mission. The platform has streamlined our volunteer management process.",
      author: "Michael Chen",
      role: "Organization Director",
      image: "/images/testimonial-2.jpg"
    },
    {
      quote: "The support and companionship from volunteers has made such a positive impact on our elderly residents' lives.",
      author: "Emma Thompson",
      role: "Care Home Manager",
      image: "/images/testimonial-3.jpg"
    }
  ];

  const featuredOpportunities = [
    {
      title: "Senior Companion Program",
      organization: "Golden Years Care Home",
      location: "San Francisco, CA",
      commitment: "4-6 hours/week",
      image: "/images/senior-companion.jpg"
    },
    {
      title: "Technology Teaching Assistant",
      organization: "Digital Seniors Initiative",
      location: "Remote",
      commitment: "2-3 hours/week",
      image: "/images/tech-teaching.jpg"
    },
    {
      title: "Meal Delivery Volunteer",
      organization: "Meals on Wheels",
      location: "Multiple Locations",
      commitment: "3-4 hours/week",
      image: "/images/meal-delivery.jpg"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900">
        <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              Connect with Meaningful Volunteer Opportunities
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              Make a difference in your community by connecting with organizations and causes that matter to you.
            </p>
            <div className="space-x-4">
              <Link
                to="/opportunities"
                className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              >
                Browse Opportunities
                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
          <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
            {/* You can add an image here */}
            <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 dark:bg-gray-800">
        <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
          <div className="max-w-screen-md mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
              Why Choose Our Platform?
            </h2>
            <p className="text-gray-500 sm:text-xl dark:text-gray-400">
              We make it easy to find and connect with meaningful volunteer opportunities in your community.
            </p>
          </div>
          <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
            {[
              {
                title: "Easy to Use",
                description: "Find and apply to opportunities with just a few clicks.",
                icon: "🎯"
              },
              {
                title: "Verified Organizations",
                description: "All organizations are vetted to ensure legitimate opportunities.",
                icon: "✓"
              },
              {
                title: "Track Your Impact",
                description: "Monitor your volunteer hours and impact in the community.",
                icon: "📊"
              }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-blue-100 lg:h-12 lg:w-12 dark:bg-blue-900">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold dark:text-white">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            {[
              { number: "2,500+", label: "Active Volunteers" },
              { number: "150+", label: "Partner Organizations" },
              { number: "10,000+", label: "Hours Contributed" },
              { number: "500+", label: "Communities Served" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
            <p className="text-gray-600 dark:text-gray-300">Getting started is easy - follow these simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and tell us about your interests, skills, and availability."
              },
              {
                step: "2",
                title: "Find Opportunities",
                description: "Browse and search for volunteer opportunities that match your preferences."
              },
              {
                step: "3",
                title: "Make an Impact",
                description: "Connect with organizations and start making a difference in your community."
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 h-full">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Community Says</h2>
            <p className="text-gray-600 dark:text-gray-300">Real stories from volunteers and organizations</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "I've found so many meaningful opportunities to give back to my community through this platform.",
                author: "Sarah Johnson",
                role: "Volunteer"
              },
              {
                quote: "The platform has helped us connect with dedicated volunteers who share our mission.",
                author: "Michael Chen",
                role: "Organization Director"
              },
              {
                quote: "The impact tracking feature helps me see how my contributions make a difference.",
                author: "Emily Rodriguez",
                role: "Regular Volunteer"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-2xl">{"🗣"}</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 dark:bg-blue-800 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Connected</h2>
            <p className="text-blue-100 mb-8">Get updates about new opportunities and community impact</p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">Join our community today and start your volunteer journey</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 