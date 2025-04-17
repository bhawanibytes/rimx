import { Mail, Phone, MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-900/80 to-purple-900/80 w-1/3">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">RiMX</span> Support
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              We're here to help you with any questions or issues.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-300">
                  <span className="font-medium text-white">Email:</span> support@rimx.com
                </p>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-300">
                  <span className="font-medium text-white">Phone:</span> +1 (555) 123-4567
                </p>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-gray-300">
                  <span className="font-medium text-white">HQ:</span> 123 Tech Street, San Francisco, CA
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Link to="/" className="inline-flex items-center text-blue-400 hover:underline font-medium">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Side - Contact Form */}
        <div className="w-full md:w-2/3 p-8 md:p-12">
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Contact Us
            </h2>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="John"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <select className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Billing Question</option>
                <option>Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
              <textarea
                rows="4"
                className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                placeholder="Your message here..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;