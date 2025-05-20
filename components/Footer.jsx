// components/Footer.jsx
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-6 h-6 mr-2 relative">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 36C27.9411 36 36 27.9411 36 18C36 8.05887 27.9411 0 18 0C8.05887 0 0 8.05887 0 18C0 27.9411 8.05887 36 18 36Z" fill="#7C5DFA"/>
                  <path d="M18 27C23.5228 27 28 22.5228 28 17C28 11.4772 23.5228 7 18 7C12.4772 7 8 11.4772 8 17C8 22.5228 12.4772 27 18 27Z" fill="#9277FF"/>
                </svg>
              </div>
              <span>HomeFinder</span>
            </h3>
            <p className="text-gray-400 mb-4">Making your property search simple, efficient, and enjoyable.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="LinkedIn">
                <Linkedin />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/buy" className="text-gray-400 hover:text-white transition">Buy</Link></li>
              <li><Link href="/rent" className="text-gray-400 hover:text-white transition">Rent</Link></li>
              <li><Link href="/sell" className="text-gray-400 hover:text-white transition">Sell</Link></li>
              <li><Link href="/assistant" className="text-gray-400 hover:text-white transition">AI Assistant</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Mortgage Calculator</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Neighborhood Guides</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Home Buying Guide</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Selling Tips</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Main Street, Los Angeles, CA 90001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <a href="tel:+11234567890" className="text-gray-400 hover:text-white transition">(123) 456-7890</a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <a href="mailto:info@homefinder.com" className="text-gray-400 hover:text-white transition">info@homefinder.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} HomeFinder. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}