import { Play, Pause, ArrowLeft, ChevronRight, Clock, Zap, BarChart2, Users, Lock, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const DemoPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const iframe = document.getElementById('youtube-iframe');
    if (iframe) {
      if (isPlaying) {
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-900/80 to-purple-900/80 w-2/5">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">RiMX</span> Platform Demo
            </h1>
            <p className="text-gray-300 mb-8 text-lg">
              Experience the power of our all-in-one management solution
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-blue-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Quick Overview</h3>
                  <p className="text-sm text-gray-300">5-minute guided tour of key features</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-purple-900/30 rounded-lg">
                  <Zap className="h-5 w-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Core Features</h3>
                  <p className="text-sm text-gray-300">See what makes RiMX stand out</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-green-900/30 rounded-lg">
                  <BarChart2 className="h-5 w-5 text-green-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Real Impact</h3>
                  <p className="text-sm text-gray-300">Transform your workflow today</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto">
              <Link to="/signup" className="inline-flex items-center justify-between w-full bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 group transition-all">
                <span className="text-blue-300 group-hover:text-blue-200 font-medium">Ready to get started?</span>
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white" />
              </Link>
              
              <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium mt-6">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        
        {/* Right Side - Video Demo */}
        <div className="w-full md:w-3/5 p-8 md:p-10">
          <div className="text-center mb-6 md:hidden">
            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Platform Demo
            </h2>
          </div>

          {/* Enhanced YouTube Video Player */}
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-w-16 aspect-h-9 mb-8 group" style={{ minHeight: '500px' }}>
            <iframe
              id="youtube-iframe"
              src="https://www.youtube.com/embed/IxwLHnKm8bg?si=Ou78gQpMiCvPEji3&enablejsapi=1&modestbranding=1&rel=0"
              className="w-full h-full absolute inset-0"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              title="RiMX Platform Demo"
              referrerPolicy="strict-origin-when-cross-origin"
            ></iframe>
            
            {/* Custom Play Button */}
            <button 
              onClick={togglePlay}
              className={`absolute inset-0 m-auto flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 ${
                isPlaying 
                  ? 'opacity-0 group-hover:opacity-100 bg-gray-900/70 scale-90' 
                  : 'bg-blue-600/90 backdrop-blur-sm scale-100'
              } border border-gray-600/50`}
            >
              {isPlaying ? (
                <Pause className="h-10 w-10 text-white" fill="currentColor" />
              ) : (
                <Play className="h-10 w-10 text-white ml-1" fill="currentColor" />
              )}
            </button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 p-5 rounded-xl border border-gray-700 hover:border-blue-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-blue-900/20 rounded-lg">
                  <Users className="h-6 w-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Team Collaboration</h3>
                  <p className="text-sm text-gray-400">Real-time project management with role-based access controls</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-800/30 p-5 rounded-xl border border-gray-700 hover:border-purple-500/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-purple-900/20 rounded-lg">
                  <Settings className="h-6 w-6 text-purple-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Admin Dashboard</h3>
                  <p className="text-sm text-gray-400">Comprehensive controls and analytics for administrators</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-900/40 rounded-xl p-6 border border-gray-700/50 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-400" />
              Enterprise-Grade Security
            </h3>
            <p className="text-gray-300 mb-4">
              RiMX employs bank-level encryption, regular security audits, and compliance with industry standards to keep your data safe.
            </p>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-start gap-2">
                <div className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5">✓</div>
                <span>256-bit SSL encryption for all data transfers</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5">✓</div>
                <span>SOC 2 Type II certified infrastructure</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5">✓</div>
                <span>Regular third-party security audits</span>
              </li>
            </ul>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link 
              to="/signup" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-4 px-8 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20"
            >
              Start Your Free 14-Day Trial
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
            <p className="text-gray-400 text-sm mt-3">
              No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;