import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart } from 'lucide-react';

export const HomeHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-6 pb-4 pt-[max(1rem,env(safe-area-inset-top))] shrink-0 z-20">
      <button onClick={() => navigate('/stats')} className="p-2 rounded-full hover:bg-black/5 text-text-secondary transition-colors">
          <User size={24} />
      </button>
      <h1 className="text-xl font-bold tracking-tight text-primary-dark font-sans">Haiku</h1>
      <button 
          onClick={() => navigate('/favorites')}
          className="p-2 rounded-full hover:bg-black/5 text-primary transition-colors"
      >
          <Heart size={24} className="text-primary" />
      </button>
    </header>
  );
};
