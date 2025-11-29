import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { ThumbsUp, ArrowLeft } from 'lucide-react';
import { useHaikuStats } from '../hooks/useHaikuStats';
import { useNavigate } from 'react-router-dom';

export const Stats = () => {
  const { getStats } = useHaikuStats();
  const navigate = useNavigate();
  const stats = getStats();

  const pieData = [
    { name: '喜欢', value: stats.likes },
    { name: '不喜欢', value: stats.dislikes },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 pt-[max(1rem,env(safe-area-inset-top))] px-4 bg-[#F8FAFC] z-10">
        <div className="relative flex items-center justify-center mb-8 mt-2">
          <button 
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">我的俳句足迹</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col justify-center h-32"
          >
            <span className="text-gray-500 text-sm mb-2">已滑动的俳句</span>
            <div className="text-3xl font-bold text-gray-800">{stats.totalSwipes.toLocaleString()}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 flex flex-col justify-center h-32"
          >
            <span className="text-gray-500 text-sm mb-2">今日滑动</span>
            <div className="text-3xl font-bold text-gray-800">{stats.todaySwipes.toLocaleString()}</div>
          </motion.div>
        </div>

        {/* Like/Dislike Ratio */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ThumbsUp size={20} className="text-emerald-500" />
            <span>喜好分布</span>
          </h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-sm text-gray-500">喜欢率</div>
              <div className="text-xl font-bold text-emerald-500">
                {stats.totalSwipes > 0 ? Math.round((stats.likes / stats.totalSwipes) * 100) : 0}%
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-gray-600">喜欢 ({stats.likes})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-600">不喜欢 ({stats.dislikes})</span>
            </div>
          </div>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">本周活跃度</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyActivity}>
                <XAxis 
                  dataKey="day" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.weeklyActivity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isTarget ? '#10B981' : '#E5E7EB'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};