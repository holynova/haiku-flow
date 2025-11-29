import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import {Stats} from './pages/Stats';
import { Favorites } from './pages/Favorites';
import { AnimatePresence } from 'framer-motion';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  // Use explicit basename for GitHub Pages in production, otherwise use default
  const basename = import.meta.env.PROD ? '/haiku-flow/' : '/';
  
  return (
    <Router basename={basename}>
      <div className="w-full h-dvh bg-background text-text-primary font-sans antialiased overflow-hidden">
        <AnimatedRoutes />
      </div>
    </Router>
  );
};

export default App;