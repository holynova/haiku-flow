import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-full h-full min-h-screen bg-background text-text-primary font-sans antialiased">
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default App;