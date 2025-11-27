import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, X, RotateCcw, BarChart2 } from 'lucide-react';
import SwipeCard from '../components/SwipeCard';
import { haikuList, HAIKUS } from '../data';
import { AnimatePresence, motion } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState(HAIKUS);
  const [history, setHistory] = useState<string[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // We artificially limit cards to show stack effect without rendering everything
  const activeCards = cards.slice(0, 2);

  const handleSwipe = (id: string, direction: 'left' | 'right') => {
    setSwipeDirection(direction);
    
    // Allow animation to play
    setTimeout(() => {
        setCards(prev => prev.filter(c => c.id !== id));
        setHistory(prev => [...prev, id]);
        setSwipeDirection(null);
    }, 200);
  };

  const handleManualSwipe = (direction: 'left' | 'right') => {
    if (cards.length === 0) return;
    const topCard = cards[0];
    
    // We can't easily trigger the drag animation from outside without ref complexity,
    // so we'll just trigger the logic and let the card component unmount/animate out if possible,
    // or just remove it. For a "tinder-like" button press, usually we pass a prop or ref.
    // However, for simplicity here, we will just remove it. 
    // A more advanced version would use an imperative handle on the SwipeCard.
    handleSwipe(topCard.id, direction);
  };

  const handleReset = () => {
    setCards(haikuList);
    setHistory([]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-screen w-full bg-background text-text-primary overflow-hidden relative"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shrink-0 z-20">
        <button className="p-2 rounded-full hover:bg-black/5 text-text-secondary transition-colors">
            <User size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-primary-dark font-sans">Haiku</h1>
        <button 
            onClick={() => navigate('/stats')}
            className="p-2 rounded-full hover:bg-black/5 text-primary transition-colors"
        >
            <Heart size={24} fill="currentColor" className="opacity-100" />
        </button>
      </header>

      {/* Card Stack Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 my-4">
        <div className="relative w-full aspect-[3/4] max-h-[600px]">
            <AnimatePresence>
                {activeCards.map((haiku, index) => {
                    const isFront = index === 0;
                    return (
                        <SwipeCard 
                            key={haiku.id} 
                            haiku={haiku} 
                            isFront={isFront}
                            onSwipe={(dir) => handleSwipe(haiku.id, dir)}
                        />
                    );
                })}
            </AnimatePresence>
            
            {cards.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <p className="text-xl text-text-secondary font-serif">
                        No more haikus for today.
                    </p>
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-primary text-primary rounded-full shadow-sm hover:bg-primary-light transition-colors"
                    >
                        <RotateCcw size={20} />
                        <span>Start Over</span>
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="shrink-0 mb-8 px-6 flex items-center justify-center gap-6 z-20">
        <button 
            onClick={() => handleManualSwipe('left')}
            disabled={cards.length === 0}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <X size={32} strokeWidth={2.5} />
        </button>

        <button 
            onClick={() => handleManualSwipe('right')}
            disabled={cards.length === 0}
            className="w-16 h-16 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Heart size={32} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
    </motion.div>
  );
};

export default Home;