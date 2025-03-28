import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { loginUser } from "../services/api";
import { setCredentials } from "../redux/slices/authSlice";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      });
      
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token
      }));

      navigate('/welcome');
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Left Side - Promotional Content */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-900/80 to-purple-900/80 w-1/2">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">RiMX</span>
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Streamline your team collaboration with hierarchical workflows and role-based access.
            </p>
            
            <div className="space-y-4">
              {[
                "Role-based access control",
                "Real-time team collaboration",
                "Secure data encryption"
              ].map((feature) => (
                <div key={feature} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <p className="ml-3 text-gray-300">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Sign In
            </h2>
            <p className="text-gray-400">Access your organization dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 px-4 rounded-lg font-medium transition-colors flex justify-center items-center disabled:opacity-75"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline font-medium">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;