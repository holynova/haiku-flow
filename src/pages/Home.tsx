import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from '../components/SwipeCard';
import { useHaikuStats } from '../hooks/useHaikuStats';
import { useDeck } from '../hooks/useDeck';
import { HomeHeader } from '../components/HomeHeader';
import { ActionButtons } from '../components/ActionButtons';

export const Home = () => {
  const { cards, recycleCard } = useDeck();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { recordAction } = useHaikuStats();
  const [hearts, setHearts] = useState<number[]>([]);

  // We artificially limit cards to show stack effect without rendering everything
  const activeCards = cards.slice(0, 2);

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
            recycleCard(card.id);
        }
        setSwipeDirection(null);
    }, 200);
  };

  const handleManualSwipe = (direction: 'left' | 'right') => {
    if (cards.length === 0) return;
    const topCard = cards[0];
    handleSwipe(topCard.id, direction);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="flex flex-col h-full w-full bg-background text-text-primary overflow-hidden relative"
    >
      <HomeHeader />

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
                            swipeResult={isFront ? swipeDirection : null}
                            onSwipe={(dir) => handleSwipe(haiku.id, dir)}
                        />
                    );
                })}
            </AnimatePresence>
        </div>
      </div>

      <ActionButtons 
        onSwipeLeft={() => handleManualSwipe('left')}
        onSwipeRight={() => handleManualSwipe('right')}
        disabled={cards.length === 0}
        hearts={hearts}
        onHeartComplete={removeHeart}
      />
    </motion.div>
  );
};

export default Home;