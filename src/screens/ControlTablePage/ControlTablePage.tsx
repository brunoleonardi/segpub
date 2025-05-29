import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ControlTable } from '../../components/ControlTable';
import { ArrowLeft } from 'lucide-react';

export const ControlTablePage = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-[#EFF4FA]'}`}>
      <div className="p-6">
        {/* <button 
          onClick={() => navigate('/')}
          className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isDarkMode 
              ? 'bg-zinc-800 text-gray-300 hover:bg-zinc-700' 
          }`}
        > */}
          <ArrowLeft size={20} />
          <span>Voltar</span>
        </button>
      </div>
      <ControlTable isDarkMode={isDarkMode} title={section || ''} />
    </div>
  );
};