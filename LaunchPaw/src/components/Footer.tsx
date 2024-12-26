import React from 'react';
import { Twitter, MessageCircle, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-md border-t border-purple-500/20 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MemeVerse</h3>
            <p className="text-gray-400">
              The ultimate launchpad for the next generation of meme tokens.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/launch" className="hover:text-purple-400 transition">Launch Token</a></li>
              <li><a href="/trade" className="hover:text-purple-400 transition">Trade</a></li>
              <li><a href="/rankings" className="hover:text-purple-400 transition">Rankings</a></li>
              <li><a href="/docs" className="hover:text-purple-400 transition">Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/docs" className="hover:text-purple-400 transition">Whitepaper</a></li>
              <li><a href="/docs" className="hover:text-purple-400 transition">FAQ</a></li>
              <li><a href="/docs" className="hover:text-purple-400 transition">Terms of Service</a></li>
              <li><a href="/docs" className="hover:text-purple-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                <MessageCircle className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} MemeVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;