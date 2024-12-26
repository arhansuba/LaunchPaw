import React from "react";
import { Rocket, Coins, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import AvalancheScene from "../components/AvalancheScene";
import CustomCursor from "../components/CustomCursor";
import Chatbot from "../components/ChatBot";

const Home = () => {
  return (
    <>
      <CustomCursor />
      <AvalancheScene />
      <div className="space-y-20 relative">
        {/* Hero Section */}
        <section className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Launch Your Meme Token
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              The most advanced and secure platform for launching the next
              generation of meme tokens on MemeSubnet.
            </p>
            <div className="flex items-center justify-center mb-4">
              <img
                src="https://cryptologos.cc/logos/avalanche-avax-logo.svg?v=035"
                alt="Avalanche Logo"
                className="h-8 w-8 mr-2"
              />
              <span className="text-lg font-medium text-gray-300">
                Powered by Avalanche
              </span>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/launch"
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-full font-medium hover:opacity-90 transition"
                >
                  Launch Token
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/marketplace"
                  className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full font-medium hover:bg-white/20 transition"
                >
                  Start Trading
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center">
            <motion.h3
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-purple-400 mb-2"
            >
              $1.2M+
            </motion.h3>
            <p className="text-gray-400">Total Value Locked</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center">
            <motion.h3
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-purple-400 mb-2"
            >
              250+
            </motion.h3>
            <p className="text-gray-400">Tokens Launched</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 text-center">
            <motion.h3
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-bold text-purple-400 mb-2"
            >
              10K+
            </motion.h3>
            <p className="text-gray-400">Active Users</p>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Why Choose MemeVerse?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Rocket,
                title: "Easy Launch",
                desc: "Launch your token in minutes with our intuitive interface.",
              },
              {
                icon: Shield,
                title: "Secure Platform",
                desc: "Built on MemeSubnet with advanced security features.",
              },
              {
                icon: Coins,
                title: "Native Liquidity",
                desc: "Access to built-in liquidity pools for instant trading.",
              },
              {
                icon: Zap,
                title: "Fast Trading",
                desc: "Lightning-fast transactions with minimal fees.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl p-6"
              >
                <feature.icon className="h-12 w-12 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-20"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-md rounded-3xl p-12">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Launch Your Token?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of successful projects launched on MemeVerse.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/launch"
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-full font-medium hover:opacity-90 transition inline-block"
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </motion.section>
        <Chatbot />
      </div>
    </>
  );
};

export default Home;
