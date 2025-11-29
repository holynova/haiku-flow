import { useState, useEffect } from 'react';
import { haikuList } from '../data';

export interface Haiku {
  id: number;
  japanese: string;
  romaji?: string;
  english?: string;
  author: string;
  authorJp?: string;
  tags?: string[];
}

const STORAGE_KEY_DECK = 'haiku-flow-deck-ids';

export const useDeck = () => {
  const [cards, setCards] = useState<Haiku[]>([]);

  useEffect(() => {
    if (cards.length > 0) return;

    const savedDeckIds = localStorage.getItem(STORAGE_KEY_DECK);
    
    if (savedDeckIds) {
      try {
        const ids = JSON.parse(savedDeckIds) as number[];
        if (ids.length > 0) {
          const restoredDeck = ids
            .map(id => haikuList.find(h => h.id === id))
            .filter((h): h is Haiku => !!h);
          
          if (restoredDeck.length > 0) {
            setCards(restoredDeck);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to parse saved deck', e);
      }
    }

    // Fallback: Generate new deck
    console.log('Generating new deck. Total haikus:', haikuList.length);
    const filtered = haikuList.filter(h => {
      const lines = h.japanese.split('\n'); // Try single backslash first
      const linesEscaped = h.japanese.split('\\n'); // Try double backslash
      const actualLines = lines.length > 1 ? lines : linesEscaped;
      
      const isMatch = h.japanese.length >= 8 && actualLines.length >= 3;
      if (!isMatch && Math.random() < 0.01) {
         console.log('Filtered out:', h.japanese, 'Length:', h.japanese.length, 'Lines:', actualLines.length);
      }
      return isMatch;
    });
    console.log('Filtered deck size:', filtered.length);
    
    const shuffled = shuffleArray([...filtered]);
    setCards(shuffled as Haiku[]);
    localStorage.setItem(STORAGE_KEY_DECK, JSON.stringify(shuffled.map(c => c.id)));
  }, [cards.length]);

  const recycleCard = (id: number) => {
    setCards((prev) => {
      const cardToMove = prev.find((card) => card.id === id);
      if (!cardToMove) return prev;
      
      const newCards = [...prev.filter((card) => card.id !== id), cardToMove];
      localStorage.setItem(STORAGE_KEY_DECK, JSON.stringify(newCards.map(c => c.id)));
      return newCards;
    });
  };

  return { cards, recycleCard };
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
