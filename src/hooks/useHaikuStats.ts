import { useState, useEffect } from 'react';
import { DailyStat } from '../types';
import { haikuList } from '../data';

interface UserAction {
  haikuId: string;
  action: 'like' | 'dislike';
  timestamp: number;
}

const STORAGE_KEY = 'haiku-flow-stats';

export const useHaikuStats = () => {
  const [actions, setActions] = useState<UserAction[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        setActions(JSON.parse(storedData));
      } catch (e) {
        console.error('Failed to parse stats from localStorage', e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (actions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
    }
  }, [actions]);

  const recordAction = (haikuId: string, action: 'like' | 'dislike') => {
    const newAction: UserAction = {
      haikuId,
      action,
      timestamp: Date.now(),
    };
    setActions((prev) => [...prev, newAction]);
  };

  const getStats = () => {
    const totalSwipes = actions.length;
    const likes = actions.filter((a) => a.action === 'like').length;
    const dislikes = actions.filter((a) => a.action === 'dislike').length;

    // Calculate today's swipes
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySwipes = actions.filter((a) => a.timestamp >= today.getTime()).length;

    // Calculate weekly activity
    const weeklyActivity: DailyStat[] = [];
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const startOfDay = d.getTime();
      
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      const endOfDay = nextDay.getTime();

      const count = actions.filter(
        (a) => a.timestamp >= startOfDay && a.timestamp < endOfDay
      ).length;

      weeklyActivity.push({
        day: days[d.getDay()],
        count: count,
        isTarget: i === 0, // Highlight today
      });
    }

    return {
      totalSwipes,
      todaySwipes,
      likes,
      dislikes,
      weeklyActivity,
    };
  };

  const getLikedHaikus = () => {
    const likedIds = new Set(
      actions
        .filter((a) => a.action === 'like')
        .map((a) => a.haikuId)
    );
    
    return haikuList.filter((haiku) => likedIds.has(haiku.id.toString()));
  };

  const removeLike = (haikuId: string) => {
    setActions((prev) => prev.filter((a) => !(a.haikuId === haikuId && a.action === 'like')));
  };

  return {
    recordAction,
    getStats,
    getLikedHaikus,
    removeLike,
  };
};
