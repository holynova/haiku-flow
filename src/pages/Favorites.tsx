import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, LayoutGrid, List, Bookmark, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHaikuStats } from '../hooks/useHaikuStats';

export const Favorites = () => {
  const navigate = useNavigate();
  const { getLikedHaikus, removeLike } = useHaikuStats();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const likedHaikus = getLikedHaikus();

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (window.confirm('确定要删除吗？')) {
      removeLike(id.toString());
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* Header */}
      <div className="shrink-0 pt-[max(1rem,env(safe-area-inset-top))] px-4 bg-[#F8FAFC] z-10">
        <div className="relative flex items-center justify-center mb-6 mt-2">
          <button 
            onClick={() => navigate(-1)}
            className="absolute left-0 p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-gray-800">我的记录</h1>
        </div>

        {/* View Toggle */}
        <div className="bg-[#E0F2D8] p-1 rounded-full flex mb-6 mx-4">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-[#5F6F52] hover:text-gray-800'
            }`}
          >
            <List size={16} />
            <span>列表视图</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === 'grid' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-[#5F6F52] hover:text-gray-800'
            }`}
          >
            <LayoutGrid size={16} />
            <span>网格视图</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {likedHaikus.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>还没有喜欢的俳句</p>
            <p className="text-sm mt-2">去首页滑一滑吧</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-3">
            {likedHaikus.map((haiku) => (
              <div 
                key={haiku.id}
                className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm border border-gray-100 active:scale-[0.99] transition-transform group relative"
              >
                <div className="w-10 h-10 rounded-full bg-[#E0F2D8] flex items-center justify-center shrink-0">
                  <Bookmark className="text-[#5F6F52] fill-[#5F6F52]" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-serif font-medium truncate mb-1 text-lg">
                    {haiku.japanese.split('\\n')[0]}
                  </p>
                  <p className="text-gray-500 text-xs">
                    — {haiku.author}
                  </p>
                </div>
                
                <button 
                  onClick={(e) => handleDelete(e, haiku.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {likedHaikus.map((haiku) => (
              <div 
                key={haiku.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col aspect-square justify-between active:scale-[0.98] transition-transform relative group"
              >
                <div className="flex justify-between items-start">
                  <div className="invisible"></div> {/* Spacer for alignment */}
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleDelete(e, haiku.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                    <Bookmark className="text-[#E0F2D8] fill-[#E0F2D8]" size={20} />
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-gray-800 font-serif font-medium leading-relaxed whitespace-pre-wrap text-sm line-clamp-3">
                    {haiku.japanese.replace(/\\n/g, '\n')}
                  </p>
                </div>
                <p className="text-gray-400 text-xs text-center mt-2">
                  {haiku.author}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
