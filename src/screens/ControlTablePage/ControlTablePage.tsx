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

      <ControlTable isDarkMode={isDarkMode} title={section || ''} />
    </div>
  );
};