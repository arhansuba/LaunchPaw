import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Rocket, Store, Droplets } from "lucide-react";
import WalletButton from "./WalletButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-black/50 backdrop-blur-md border-b border-purple-500/20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
              LaunchPaw
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/marketplace"
              className="text-gray-300 hover:text-purple-400 transition"
            >
              Marketplace
            </Link>
            <Link
              to="/launch"
              className="text-gray-300 hover:text-purple-400 transition"
            >
              Launch
            </Link>
            <Link
              to="/rankings"
              className="text-gray-300 hover:text-purple-400 transition"
            >
              Rankings
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-purple-400 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/docs"
              className="text-gray-300 hover:text-purple-400 transition"
            >
              Docs
            </Link>
            <Link
              to="/balance-app"
              className="text-gray-300 hover:text-purple-400 transition"
            >
              Balance
            </Link>

            <Link
              to="/basic-explorer"
              className="text-gray-300 hover:text-purple-400 transition"
            >
              Explorer
            </Link>
            <Link
              to="/faucet"
              className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition"
            >
              <Droplets className="h-4 w-4" />
              <span>Faucet</span>
            </Link>
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/marketplace"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Marketplace
              </Link>
              <Link
                to="/launch"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Launch
              </Link>
              <Link
                to="/rankings"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Rankings
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/docs"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Docs
              </Link>
              <Link
                to="/balance-app"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Balance
              </Link>
              <Link
                to="/basic-wallet"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Portfolio
              </Link>
              <Link
                to="/basic-explorer"
                className="text-gray-300 hover:text-purple-400 transition"
              >
                Explorer
              </Link>
              <Link
                to="/faucet"
                className="flex items-center space-x-1 text-gray-300 hover:text-purple-400 transition"
              >
                <Droplets className="h-4 w-4" />
                <span>Faucet</span>
              </Link>
              <WalletButton />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
