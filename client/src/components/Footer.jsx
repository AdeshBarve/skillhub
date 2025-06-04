import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex flex-col md:flex-row justify-between items-center">
        
        {/* Left side: Logo or title */}
        <div className="text-lg font-bold text-white mb-4 md:mb-0">
          SkillHub
        </div>

        {/* Center: Navigation Links */}
        <div className="flex space-x-6 mb-4 md:mb-0">
                          <Link to="/contact" className="hover:text-blue-400">Contact</Link>
                                   <Link to="/about" className="hover:text-blue-400">About</Link>
                          
          {/* <a href="/contact" className="hover:text-white transition">Contact</a> */}
        </div>

        {/* Right side: Copyright */}
        <div className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} SkillHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
