import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Left - Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                <img src="/imp.jpeg" />
              </div>
              <span className="text-xl font-semibold text-white">MindCare</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your Mind, Your Strength: Nurture Your Mental Health, Embrace Your Happiness, and Unlock Your True Potential
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="https://www.who.int/health-topics/mental-health#tab=tab_1" className="hover:text-white transition-colors">About Mental Health</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              <li><a href="https://nhm.gov.in/index1.php?lang=1&level=2&lid=359&sublinkid=1043&utm_source=chatgpt.com" className="hover:text-white transition-colors">Mental Health Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mental Health Documents</a></li>
              
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-600" />
                <a href="mailto:contactus@mcf.org.in" className="hover:text-white transition-colors">
                  contactus@mcf.org.in
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-600" />
                <a href="tel:+1800-891-4416" className="hover:text-white transition-colors">
                  +1800-891-4416
                </a>
              </li>
              
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          © 2025 MindCare.  <span className="block mt-1">Team - Algo Avengers</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
