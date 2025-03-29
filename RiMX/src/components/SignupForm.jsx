import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff, Check } from "lucide-react";
import { signupUser } from "../services/api";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setError(null);
  };

  const passwordStrength = () => {
    if (!formData.password) return 0;
    let strength = 0;
    if (formData.password.length >= 8) strength += 1;
    if (/[A-Z]/.test(formData.password)) strength += 1;
    if (/[0-9]/.test(formData.password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (!formData.acceptTerms) {
      setError("You must accept the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailId: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      const response = await signupUser(userData);
      console.log("Signup successful:", response);
      
      // Set success state and message
      setSuccess(true);
      setSuccessMessage(response.data?.message || "Account created successfully! Redirecting to login...");
      
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      {/* Success Popup Modal */}
      {success && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-green-500 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
              <p className="text-gray-300 mb-6">{successMessage}</p>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-green-500 h-1.5 rounded-full animate-progress" 
                  style={{ animationDuration: '3s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Left Side - Promotional Content */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-900/80 to-purple-900/80 w-1/2">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">RiMX</span>
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Join our organization management platform and streamline your team's workflow.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <p className="ml-3 text-gray-300">
                  <span className="font-medium text-white">Secure Access</span> - Your data is protected
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <p className="ml-3 text-gray-300">
                  <span className="font-medium text-white">Easy Onboarding</span> - Get started quickly
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check className="h-5 w-5 text-green-400" />
                </div>
                <p className="ml-3 text-gray-300">
                  <span className="font-medium text-white">Team Ready</span> - Join your organization
                </p>
              </div>
            </div>
            
            <div className="mt-12">
              <p className="text-gray-400">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-400 hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Create Account
            </h2>
            <p className="text-gray-400">Get started with your organization account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                    placeholder="John"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="Doe"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="you@company.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="9876543210"
                  minLength={10}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-400"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="mt-2">
                <div className="flex mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`h-1 flex-1 mr-1 rounded-full ${
                        i <= passwordStrength() 
                          ? ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'][passwordStrength()-1]
                          : 'bg-gray-700'
                      }`}
                    ></div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  {!formData.password && 'Enter a password'}
                  {formData.password && (
                    ['Weak', 'Fair', 'Good', 'Strong'][passwordStrength()-1]
                  )}
                </p>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-400"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600 focus:ring-blue-500"
                  required
                  disabled={isLoading}
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                I agree to the <Link to="/terms" className="text-blue-400 hover:underline">Terms and Conditions</Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 px-4 rounded-lg font-medium transition-colors flex justify-center items-center ${
                isLoading || !formData.acceptTerms ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading || !formData.acceptTerms}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400 md:hidden">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;