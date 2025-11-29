import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart } from 'lucide-react';

export const HomeHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 py-4 shrink-0 z-20">
      <button onClick={() => navigate('/stats')} className="p-2 rounded-full hover:bg-black/5 text-text-secondary transition-colors">
          <User size={24} />
      </button>
      <h1 className="text-xl font-bold tracking-tight text-primary-dark font-sans">Haiku</h1>
      <button 
          onClick={() => navigate('/favorites')}
          className="p-2 rounded-full hover:bg-black/5 text-primary transition-colors"
      >
          <Heart size={24} fill="currentColor" className="opacity-100" />
      </button>
    </header>
  );
};
