import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { Haiku } from '../types';
import { X, Heart } from 'lucide-react';

interface SwipeCardProps {
  haiku: Haiku;
  onSwipe: (direction: 'left' | 'right') => void;
  isFront: boolean;
}

const SwipeCard: React.FC<SwipeCardProps> = ({ haiku, onSwipe, isFront }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const [constrained, setConstrained] = useState(true);

  // Rotation depends on X movement for natural feel
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  
  // Opacity indicators for Like/Nope overlays
  const likeOpacity = useTransform(x, [20, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -150], [0, 1]);

  // Determine card color tint based on swipe
  const borderTint = useTransform(x, [-150, 0, 150], ["#FF6B6B", "transparent", "#3E946A"]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocity = info.velocity.x;

    if (info.offset.x > threshold || velocity > 500) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe('right');
    } else if (info.offset.x < -threshold || velocity < -500) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe('left');
    } else {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  useEffect(() => {
    if (!isFront) {
        controls.set({ x: 0, opacity: 1, scale: 0.95, y: 10 });
    } else {
        controls.start({ scale: 1, y: 0, opacity: 1 });
    }
  }, [isFront, controls]);


  return (
    <motion.div
      ref={cardRef}
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: isFront ? 10 : 5,
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'grab',
      }}
      drag={isFront ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={isFront ? { scale: 1 } : { scale: 0.95, y: 10 }}
      whileTap={{ cursor: 'grabbing', scale: 1.02 }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <motion.div 
        className="relative w-full h-full bg-white rounded-3xl shadow-card flex flex-col items-center justify-center p-8 text-center overflow-hidden border-4"
        style={{ borderColor: isFront ? borderTint : 'transparent' }}
      >
         {/* Like/Nope Overlays */}
        {isFront && (
            <>
                <motion.div 
                    style={{ opacity: likeOpacity }}
                    className="absolute top-8 right-8 z-20 transform rotate-12 border-4 border-primary text-primary rounded-lg px-4 py-2 font-bold text-2xl uppercase"
                >
                    LIKE
                </motion.div>
                <motion.div 
                    style={{ opacity: nopeOpacity }}
                    className="absolute top-8 left-8 z-20 transform -rotate-12 border-4 border-danger text-danger rounded-lg px-4 py-2 font-bold text-2xl uppercase"
                >
                    NOPE
                </motion.div>
            </>
        )}

        <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full">
            <div className="space-y-4">
                <h2 className="text-3xl font-serif font-bold text-text-primary leading-relaxed whitespace-pre-wrap">
                    {haiku.japanese}
                </h2>
                <p className="text-text-secondary text-sm font-medium">— {haiku.authorJp}</p>
            </div>

            <div className="w-12 h-1 bg-primary-light rounded-full"></div>

            <div className="space-y-2 max-w-xs">
                <p className="text-text-secondary text-lg italic font-serif">
                    {haiku.english}
                </p>
            </div>
        </div>
        
        <div className="mt-auto pb-4">
             <p className="text-xs text-text-secondary uppercase tracking-widest opacity-50">Swipe to decide</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SwipeCard;
