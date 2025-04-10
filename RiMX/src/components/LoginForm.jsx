import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { loginUser, sendEmailOTP, verifyEmailOTP } from "../services/api";
import { setCredentials } from "../features/slices/authSlice";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginMethod, setLoginMethod] = useState("password");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = getAuth(app);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setError("Please enter your email");
      return;
    }

    setIsSendingOtp(true);
    try {
      await sendEmailOTP({ email: formData.email });
      setOtpModalOpen(true);
      setOtpError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError("OTP must be 6 digits");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await verifyEmailOTP({ email: formData.email, otp });
      dispatch(setCredentials({ user: response.user, token: response.token }));
      navigate('/WelcomePage');
    } catch (err) {
      setOtpError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await loginUser({
        emailId: formData.email,
        password: formData.password
      });

      if (response?.data?.token) {
        dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
        navigate('/WelcomePage');
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const response = await loginUser({
        emailId: result.user.email,
        password: '' // Not needed for Google auth
      });

      dispatch(setCredentials({
        user: response.user,
        token: response.token
      }));

      navigate('/WelcomePage');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      {/* OTP Verification Modal */}
      {otpModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-purple-500 animate-fade-in">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl font-bold text-white mb-2">Verify Your Email</h3>
              <p className="text-gray-300 mb-4">Enter the 6-digit OTP sent to {formData.email}</p>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  if (e.target.value.length <= 6 && /^\d*$/.test(e.target.value)) {
                    setOtp(e.target.value);
                    setOtpError("");
                  }
                }}
                className="w-full px-4 py-3 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white text-center text-xl tracking-widest"
                placeholder="------"
                maxLength={6}
              />
              {otpError && <p className="text-red-400 text-sm mt-2">{otpError}</p>}
              <button
                onClick={handleVerifyOTP}
                disabled={isVerifyingOtp || otp.length !== 6}
                className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-purple-600 py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-70"
              >
                {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
              </button>
              <button
                onClick={handleSendOTP}
                disabled={isSendingOtp}
                className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm disabled:opacity-70"
              >
                {isSendingOtp ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-6xl flex bg-gray-800/50 rounded-2xl shadow-2xl backdrop-blur-xl border border-purple-500/30 overflow-hidden relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-900/30 to-purple-900/30 w-1/2 relative z-10">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 animate-text-shine">RiMX</span>
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
        
        <div className="w-full md:w-1/2 p-8 md:p-12 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Welcome Back
            </h2>
            <p className="text-gray-300">Continue to your organization dashboard</p>
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 mb-6 py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all duration-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.835 0 3.456.989 4.567 2.548l3.087-3.087A9.955 9.955 0 0012.545 2C7.021 2 2.545 6.477 2.545 12s4.476 10 10 10c5.523 0 10-4.477 10-10a9.95 9.95 0 00-.273-2.291l-9.727 7.53z"
              />
            </svg>
            <span className="text-white font-medium">Continue with Google</span>
          </button>

          {/* Login Method Toggle */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setLoginMethod("password")}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  loginMethod === "password" ? "bg-cyan-600 text-white" : "bg-gray-700/50 text-gray-300"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod("otp")}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  loginMethod === "otp" ? "bg-cyan-600 text-white" : "bg-gray-700/50 text-gray-300"
                }`}
              >
                OTP Login
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-sm">
              {error}
            </div>
          )}

          {loginMethod === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white backdrop-blur-sm"
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
                    className="w-full pl-10 pr-10 py-3 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white backdrop-blur-sm"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-400"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      className="w-4 h-4 rounded bg-gray-700/50 border-gray-600 focus:ring-cyan-500"
                    />
                  </div>
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <Link to="/forgot-password" className="text-sm text-cyan-400 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 flex justify-center items-center disabled:opacity-75"
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
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 bg-gray-700/50 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all text-white backdrop-blur-sm"
                    placeholder="you@company.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOTP}
                className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 flex justify-center items-center disabled:opacity-75"
                disabled={isSendingOtp}
              >
                {isSendingOtp ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending OTP...
                  </>
                ) : "Send OTP"}
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-400 hover:underline font-medium">
              Request access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;