import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl flex bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-900/80 to-purple-900/80 w-1/3">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">RiMX</span> Terms
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Please review our terms carefully before using our services.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <p className="ml-3 text-gray-300">
                  <span className="font-medium text-white">Transparent</span> - Clear and fair terms
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <p className="ml-3 text-gray-300">
                  <span className="font-medium text-white">Secure</span> - Your rights protected
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <Link to="/signup" className="inline-flex items-center text-blue-400 hover:underline font-medium">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign Up
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Side - Terms Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12 overflow-y-auto max-h-screen">
          <div className="text-center mb-8 md:hidden">
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Terms & Conditions
            </h2>
          </div>

          <div className="prose prose-invert prose-sm max-w-none text-gray-300">
            <h3 className="text-xl font-semibold text-blue-400 mb-4">1. Acceptance of Terms</h3>
            <p className="mb-6">
              By accessing or using the RiMX platform ("Service"), you agree to be bound by these Terms. 
              If you disagree with any part, you may not access the Service.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">2. User Responsibilities</h3>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              <li>You must be at least 18 years old to use this Service</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
              <li>You agree not to use the Service for any illegal purpose</li>
              <li>You will not transmit any harmful code or attempt unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">3. Data Privacy</h3>
            <p className="mb-6">
              Your use of the Service is subject to our Privacy Policy. We collect and use your information 
              as described in that policy, which may be updated from time to time.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">4. Intellectual Property</h3>
            <p className="mb-6">
              All content and software associated with the Service are the property of RiMX or its licensors 
              and are protected by copyright and other intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">5. Limitation of Liability</h3>
            <p className="mb-6">
              RiMX shall not be liable for any indirect, incidental, special or consequential damages resulting 
              from the use or inability to use the Service.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">6. Service Modifications</h3>
            <p className="mb-6">
              We reserve the right to modify or discontinue the Service at any time without notice. We shall 
              not be liable to you or any third party for any modification, suspension or discontinuance.
            </p>

            <h3 className="text-xl font-semibold text-blue-400 mb-4">7. Governing Law</h3>
            <p className="mb-6">
              These Terms shall be governed by the laws of [Your Country/State] without regard to its conflict 
              of law provisions.
            </p>

            <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 mt-8">
              <h4 className="font-medium text-purple-300 mb-2">Last Updated: {new Date().toLocaleDateString()}</h4>
              <p className="text-sm">
                By continuing to use our Service, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms and Conditions.
              </p>
            </div>

            <div className="mt-8 flex justify-center md:justify-start">
              <Link 
                to="/signup" 
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-2 px-6 rounded-lg font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;