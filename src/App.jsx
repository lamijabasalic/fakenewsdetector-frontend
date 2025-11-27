import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Dataset from "./pages/Dataset";
import Metrics from "./pages/Metrics";

function Navigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
            Fake News Detector
          </Link>
          <div className="flex space-x-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive("/")
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/dataset"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive("/dataset")
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              }`}
            >
              Dataset
            </Link>
            <Link
              to="/metrics"
              className={`px-4 py-2 rounded-lg transition-all ${
                isActive("/metrics")
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
              }`}
            >
              Metrics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-800/90 backdrop-blur-lg border-t border-gray-700 mt-12">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Bosnian Fake News Detector — Master rad (NLP &amp; Machine Learning)
        </p>
        <p className="text-center text-gray-500 text-xs mt-2">
          Projekat za istraživanje detekcije lažnih vijesti na bosanskom jeziku i podršku razvoju alata za medijsku pismenost.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dataset" element={<Dataset />} />
            <Route path="/metrics" element={<Metrics />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
