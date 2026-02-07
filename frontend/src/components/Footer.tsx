import { Button } from "./ui/button";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👋</span>
              </div>
              <span className="text-white">SignSpeak</span>
            </div>
            <p className="text-gray-400 text-sm">
              Breaking communication barriers through AI-powered sign language translation and learning.
            </p>
            <div className="flex gap-3">
              <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Use Cases</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">API</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Mobile App</a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Press Kit</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Community</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Guidelines</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2025 SignSpeak. All rights reserved.
            </p>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <select className="bg-gray-800 text-gray-300 rounded-lg px-3 py-1 text-sm border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
                <option>Deutsch</option>
                <option>日本語</option>
                <option>中文</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@signspeak.com" className="text-sm hover:text-white transition-colors">
                support@signspeak.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
