import React from 'react';
import { useParams } from 'react-router-dom';
import { ControlTable } from '../../components/ControlTable';
import { useTheme } from '../../contexts/ThemeContext';

export const ControlTablePage = () => {
  const { section } = useParams();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-zinc-900' : 'bg-[#EFF4FA]'}`}>
      <ControlTable title={section || ''} />
    </div>
  );
};