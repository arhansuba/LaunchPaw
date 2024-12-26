import React from "react";
import { Routes, Route } from "react-router-dom";
import {
  Rocket,
  Coins,
  BarChart3,
  Users,
  BookOpen,
  LayoutDashboard,
  Store,
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Launch from "./pages/Launch";
import Trade from "./pages/Trade";
import Rankings from "./pages/Rankings";
import Dashboard from "./pages/Dashboard";
import Docs from "./pages/Docs";
import Marketplace from "./pages/Marketplace";
import MemePage from "./pages/MemePage";
import Faucet from "./pages/Faucet";
import BalanceApp from "./balance-app/page";
import Explorer from "./basic-explorer/page";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/token/:tokenAddress" element={<MemePage />} />
          <Route path="/faucet" element={<Faucet />} />
          <Route path="/balance-app" element={<BalanceApp />} />
          <Route path="/basic-explorer" element={<Explorer />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
