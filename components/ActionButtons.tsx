import React from 'react';
import { Heart, X } from 'lucide-react';
import { FloatingHeart } from './FloatingHeart';

interface ActionButtonsProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  disabled: boolean;
  hearts: number[];
  onHeartComplete: (id: number) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSwipeLeft, 
  onSwipeRight, 
  disabled, 
  hearts, 
  onHeartComplete 
}) => {
  return (
    <div className="shrink-0 mb-8 px-6 flex items-center justify-center gap-6 z-20 relative">
      <button 
          onClick={onSwipeLeft}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-text-secondary hover:text-danger hover:bg-danger-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
          <X size={32} strokeWidth={2.5} />
      </button>

      <div className="relative">
        <button 
            onClick={onSwipeRight}
            disabled={disabled}
            className="w-16 h-16 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Heart size={32} fill="currentColor" strokeWidth={0} />
        </button>
        
        {/* Floating Hearts Container */}
        <div className="absolute bottom-0 left-0 w-full h-0 flex justify-center overflow-visible pointer-events-none">
           {hearts.map((id) => (
              <FloatingHeart key={id} id={id} onComplete={onHeartComplete} />
           ))}
        </div>
      </div>
    </div>
  );
};
