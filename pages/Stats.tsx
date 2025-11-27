import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { WEEKLY_STATS } from '../data';

const Stats: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for the pie chart representation
  const likes = 896;
  const dislikes = 384;
  const total = likes + dislikes;
  const likePercentage = Math.round((likes / total) * 100);

  // Calculation for SVG circle dash
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (likePercentage / 100) * circumference;

  const maxCount = Math.max(...WEEKLY_STATS.map(d => d.count));

  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex flex-col min-h-screen bg-background text-text-primary"
    >
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm">
        <button 
            onClick={() => navigate(-1)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-text-primary hover:bg-black/5"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-bold leading-tight tracking-tight text-text-primary flex-1 text-center">
            我的俳句足迹
        </h1>
        <div className="size-10 shrink-0"></div>
      </header>

      <main className="flex-1 flex flex-col gap-6 p-4 pb-32 overflow-y-auto">
        {/* Top Summary Cards */}
        <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2 rounded-2xl p-5 bg-white shadow-sm border border-black/[0.02]">
                <p className="text-text-secondary text-sm font-medium">已滑动的俳句</p>
                <p className="text-text-primary text-2xl font-bold tracking-tight">1,280</p>
            </div>
            <div className="flex-1 flex flex-col gap-2 rounded-2xl p-5 bg-white shadow-sm border border-black/[0.02]">
                <p className="text-text-secondary text-sm font-medium">今日滑动</p>
                <p className="text-text-primary text-2xl font-bold tracking-tight">54</p>
            </div>
        </div>

        {/* Donut Chart Section */}
        <div>
            <h2 className="text-xl font-bold text-text-primary mb-4 px-1">喜欢 / 不喜欢分析</h2>
            <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm border border-black/[0.02]">
                <div className="relative flex h-48 w-48 items-center justify-center self-center">
                    <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                        {/* Background Circle */}
                        <circle 
                            className="stroke-slate-100" 
                            cx="50" 
                            cy="50" 
                            fill="none" 
                            r={radius} 
                            strokeWidth="10" 
                        />
                        {/* Foreground Circle */}
                        <circle 
                            cx="50" 
                            cy="50" 
                            fill="none" 
                            r={radius} 
                            stroke="currentColor" 
                            className="text-primary transition-all duration-1000 ease-out"
                            strokeDasharray={circumference} 
                            strokeDashoffset={strokeDashoffset} 
                            strokeLinecap="round" 
                            strokeWidth="10" 
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-bold text-text-primary">{likePercentage}%</span>
                        <span className="text-sm font-medium text-text-secondary">喜欢</span>
                    </div>
                </div>

                <div className="flex justify-around px-4">
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-primary"></div>
                            <p className="text-sm font-medium text-text-secondary">喜欢</p>
                        </div>
                        <p className="text-lg font-bold text-text-primary">{likes}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-slate-200"></div>
                            <p className="text-sm font-medium text-text-secondary">不喜欢</p>
                        </div>
                        <p className="text-lg font-bold text-text-primary">{dislikes}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Activity Chart Section */}
        <div>
             <h2 className="text-xl font-bold text-text-primary mb-4 px-1">活跃度统计</h2>
             <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm border border-black/[0.02]">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-text-secondary text-sm font-medium">近七日滑动历史</p>
                        <p className="text-text-primary text-3xl font-bold mt-1">312</p>
                    </div>
                    <div className="flex gap-1 mb-1 bg-primary-light px-2 py-1 rounded-md">
                        <p className="text-primary text-xs font-bold leading-normal">+12%</p>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="grid grid-cols-7 gap-3 h-40 items-end mt-4">
                    {WEEKLY_STATS.map((stat, index) => {
                        const heightPercentage = (stat.count / maxCount) * 100;
                        const isSelected = stat.isTarget; 
                        
                        return (
                            <div key={index} className="flex flex-col items-center gap-2 h-full justify-end">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercentage}%` }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={`w-full rounded-t-lg min-h-[4px] ${isSelected ? 'bg-primary' : 'bg-primary-light'}`}
                                />
                                <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-text-secondary'}`}>
                                    {stat.day}
                                </span>
                            </div>
                        );
                    })}
                </div>
             </div>
        </div>
      </main>

      {/* Share Button Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent pointer-events-none flex justify-center z-20">
         <button className="pointer-events-auto flex items-center justify-center gap-2 bg-primary text-white w-full max-w-sm h-14 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:bg-primary-dark transition-colors active:scale-95 transform duration-100">
            <Share2 size={20} />
            <span>分享我的统计数据</span>
         </button>
      </div>
    </motion.div>
  );
};

export default Stats;