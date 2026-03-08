import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-orange-500" size={22} />
            RustDetector
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            AI-powered industrial rust detection and predictive maintenance
            system designed to reduce downtime and minimize operational costs.
          </p>
        </div>

        {/* Features */}
        <div>
          <h3 className="text-white font-semibold mb-3">Core Features</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <Cpu size={16} className="text-orange-500" />
              Real-time Rust Detection
            </li>
            <li>Predictive Maintenance Insights</li>
            <li>Cost Optimization Analytics</li>
            <li>Industrial Equipment Monitoring</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p className="text-sm text-gray-400">
            Industrial AI Solutions Division
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm">
            <Mail size={16} className="text-orange-500" />
            support@rustdetector
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        © {new Date().getFullYear()} RustDetector. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
