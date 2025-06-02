import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { VideoHistory } from "../../components/VideoHistory/VideoHistory";
import { MapComponent } from "../../components/Map/Map";
import { MapProvider } from "../../contexts/MapContext";
import { useTheme } from '../../contexts/ThemeContext';

export const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <MapProvider>
      <div className="theme-aware-bg flex flex-row justify-center w-full h-screen overflow-hidden">
        <div className="w-full h-full relative">
          <div className={`h-full ${isDarkMode ? 'bg-zinc-900' : ''}`}>
            <MapComponent />
            
          </div>
        </div>
      </div>
    </MapProvider>
  );
};