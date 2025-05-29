import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoHistory } from '../../components/VideoHistory/VideoHistory';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const VideoHistoryPage = () => {
  const navigate = useNavigate();
  const {isDarkMode} = useTheme()

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-[#EFF4FA]'}`}>
      <div className="p-6">
        <button 
          onClick={() => navigate('/')}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>
      <VideoHistory onClose={() => navigate('/')} />
    </div>
  );
};