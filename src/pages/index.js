import Link from 'next/link';
import Layout from '@/components/Layout';
import { FaQrcode, FaEdit, FaMobile, FaChartLine, FaCloud, FaLock } from 'react-icons/fa';

export default function Home() {
  const features = [
    {
      icon: <FaQrcode className="h-6 w-6" />,
      title: 'Dynamic QR Code Menus',
      description: 'Generate unique QR codes for your restaurant that customers can scan to view your digital menu.'
    },
    {
      icon: <FaEdit className="h-6 w-6" />,
      title: 'Easy Menu Management',
      description: 'Update your menu items, prices, and descriptions in real-time through our user-friendly dashboard.'
    },
    {
      icon: <FaMobile className="h-6 w-6" />,
      title: 'Mobile-First Design',
      description: 'Beautiful, responsive menus that look great on any device, providing an optimal viewing experience.'
    },
    {
      icon: <FaChartLine className="h-6 w-6" />,
      title: 'Analytics & Insights',
      description: 'Track menu views, popular items, and customer engagement to optimize your offerings.'
    },
    {
      icon: <FaCloud className="h-6 w-6" />,
      title: 'Cloud-Based Solution',
      description: 'Access your menu dashboard from anywhere, with automatic backups and updates.'
    },
    {
      icon: <FaLock className="h-6 w-6" />,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security to protect your data, with 99.9% uptime guarantee.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '₹999',
      period: '/month',
      features: [
        'Up to 50 menu items',
        'Basic QR code customization',
        'Menu analytics',
        'Email support',
        'Mobile-friendly menu',
        'Real-time menu updates'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '₹1,999',
      period: '/month',
      features: [
        'Unlimited menu items',
        'Advanced QR code customization',
        'Detailed analytics',
        'Priority support',
        'Custom branding',
        'Multiple menu categories',
        'Seasonal menu planning'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Multiple restaurant locations',
        'API access',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integration',
        'Advanced security features',
        'Training sessions'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-black sm:text-5xl md:text-6xl">
              Transform Your Restaurant Menu
              <span className="block text-primary-light">Into a Digital Experience</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Create beautiful, dynamic digital menus with QR codes. Update in real-time, track analytics, and provide a contactless experience for your customers.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/auth/login" className="btn-primary">
                Get Started Free
              </Link>
              <Link href="/menu/explore" className="btn-secondary">
                Explore Menus
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need to Go Digital
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful features to help you manage your digital menu effortlessly
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-base text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the perfect plan for your restaurant
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-lg shadow-sm overflow-hidden ${
                  plan.popular ? 'border-2 border-primary ring-2 ring-primary ring-opacity-50' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium">
                    Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="ml-1 text-xl font-medium text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link
                      href="/auth/login"
                      className={`block w-full text-center px-6 py-3 border border-transparent rounded-md ${
                        plan.popular
                          ? 'text-white bg-primary hover:bg-primary-dark'
                          : 'text-primary bg-primary-50 hover:bg-primary-100'
                      } font-medium`}
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-black sm:text-4xl">
              Ready to Transform Your Menu?
            </h2>
            <p className="mt-4 text-xl text-primary-100">
              Join thousands of restaurants already using our platform
            </p>
            <div className="mt-8">
              <Link href="/auth/login" className="bg-orange-500 text-white px-6 py-3 rounded-md">
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
