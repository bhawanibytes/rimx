import { Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-12 px-4 md:px-12 bg-gray-900">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="text-2xl font-bold text-white flex items-center mb-4">
            <Zap className="text-blue-500 mr-2" /> RiMX
          </div>
          <p className="text-gray-400 mb-4">
            The intelligent work management platform for modern teams.
          </p>
          <div className="flex space-x-4">
            {['Twitter', 'LinkedIn', 'Facebook', 'GitHub'].map((social, index) => (
              <a key={index} href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Product</h4>
          <ul className="space-y-2">
            {['Features', 'Pricing', 'Integrations', 'Roadmap'].map((item, index) => (
              <li key={index}>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Resources</h4>
          <ul className="space-y-2">
            {['Documentation', 'Blog', 'Webinars', 'Community'].map((item, index) => (
              <li key={index}>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2">
            {['About Us', 'Careers', 'Contact', 'Press'].map((item, index) => (
              <li key={index}>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm mb-4 md:mb-0">
          © 2023 RiMX. All rights reserved.
        </p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">Privacy Policy</a>
          <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">Terms of Service</a>
          <a href="#" className="text-gray-500 hover:text-gray-400 text-sm transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;