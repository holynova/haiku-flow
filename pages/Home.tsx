import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, X, RotateCcw, BarChart2 } from 'lucide-react';
import SwipeCard from '../components/SwipeCard';
import { haikuList } from '../data';
import { AnimatePresence, motion } from 'framer-motion';
import { useHaikuStats } from '../hooks/useHaikuStats';

// Assuming Haiku type is defined elsewhere or inferred from HAIKUS
interface Haiku {
  id: number;
  text: string[];
  author: string;
}

const FloatingHeart = ({ id, onComplete }: { id: number; onComplete: (id: number) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 0.5 }}
      animate={{ opacity: 0, y: -100, scale: 1.5 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute pointer-events-none text-red-500 z-50"
      style={{ bottom: '80px', right: '40px' }} // Adjust position relative to the button
    >
      <Heart size={32} fill="currentColor" />
    </motion.div>
  );
};

export const Home = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<Haiku[]>([]);
  const [history, setHistory] = useState<Haiku[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { recordAction } = useHaikuStats();
  const [hearts, setHearts] = useState<number[]>([]);

  // Shuffle and load cards on mount
  useEffect(() => {
    const filtered = haikuList.filter(h => {
      const lines = h.japanese.split('\\n');
      return h.japanese.length >= 8 && lines.length >= 3;
    });
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, []);

  // We artificially limit cards to show stack effect without rendering everything
  const activeCards = cards.slice(0, 2);

  const removeCard = (id: number, action: 'left' | 'right') => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    if (action === 'right') {
      console.log('Liked haiku:', id);
    } else {
      console.log('Disliked haiku:', id);
    }
  };

  const addHeart = () => {
    setHearts((prev) => [...prev, Date.now()]);
  };

  const removeHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h !== id));
  };

  const handleSwipe = (id: number, dir: 'left' | 'right') => {
    setSwipeDirection(dir);
    
    if (dir === 'right') {
      addHeart();
    }

    // Allow animation to play
    setTimeout(() => {
        const card = cards.find(c => c.id === id);
        if (card) {
            const action = dir === 'right' ? 'like' : 'dislike';
            recordAction(card.id.toString(), action);
            removeCard(card.id, dir);
            setHistory(prev => [...prev, card]);
        }
        setSwipeDirection(null);
    }, 200);
  };

  const handleManualSwipe = (direction: 'left' | 'right') => {
    if (cards.length === 0) return;
    const topCard = cards[0];
    handleSwipe(topCard.id, direction);
  };

  const handleReset = () => {
    const shuffled = [...haikuList].sort(() => Math.random() - 0.5);
    setCards(shuffled);
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
      <div className="shrink-0 mb-8 px-6 flex items-center justify-center gap-6 z-20 relative">
        <button 
            onClick={() => handleManualSwipe('left')}
            disabled={cards.length === 0}
            className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <X size={32} strokeWidth={2.5} />
        </button>

        <div className="relative">
          <button 
              onClick={() => handleManualSwipe('right')}
              disabled={cards.length === 0}
              className="w-16 h-16 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
              <Heart size={32} fill="currentColor" strokeWidth={0} />
          </button>
          
          {/* Floating Hearts Container */}
          <div className="absolute bottom-0 left-0 w-full h-0 flex justify-center overflow-visible pointer-events-none">
             {hearts.map((id) => (
                <FloatingHeart key={id} id={id} onComplete={removeHeart} />
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;