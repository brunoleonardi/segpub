import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { VideoHistory } from "../../components/VideoHistory/VideoHistory";
import { MapComponent } from "../../components/Map/Map";
import { MapProvider } from "../../contexts/MapContext";
import { useTheme } from '../../contexts/ThemeContext';

export const HomePage = (): JSX.Element => {
  const [showVideoHistory, setShowVideoHistory] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  const handleControlConsultarClick = (itemLabel: string) => {
    navigate(`/control/${itemLabel}`);
  };

  return (
    <MapProvider>
      <div className="theme-aware-bg flex flex-row justify-center w-full h-screen overflow-hidden">
        <div className="w-full h-full relative">
          <div className={`h-full ${isDarkMode ? 'bg-zinc-900' : ''}`}>
            <MapComponent isDarkMode={isDarkMode} />
            <div className="absolute top-[50%] left-[17px] -translate-y-1/2 z-10">
              <Sidebar 
                onDarkModeChange={toggleDarkMode} 
                onHistoryClick={() => setShowVideoHistory(true)}
                onControlConsultarClick={handleControlConsultarClick}
              />
            </div>
            {showVideoHistory && (
              <VideoHistory 
                isDarkMode={isDarkMode} 
                onClose={() => setShowVideoHistory(false)} 
              />
            )}
          </div>
        </div>
      </div>
    </MapProvider>
  );
};