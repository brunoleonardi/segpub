import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { VideoHistory } from "../../components/VideoHistory/VideoHistory";
import { MapComponent } from "../../components/Map/Map";
import { MapProvider } from "../../contexts/MapContext";

export const HomePage = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showVideoHistory, setShowVideoHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user's system is in dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial state
    setIsDarkMode(mediaQuery.matches);

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    };

    // Add listener for theme changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial theme
    document.body.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light');

    // Cleanup listener
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const handleDarkModeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  };

  const handleHistoryClick = () => {
    setShowVideoHistory(true);
  };

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
                onDarkModeChange={handleDarkModeChange} 
                onHistoryClick={handleHistoryClick}
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