import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { VideoHistory } from "../../components/VideoHistory/VideoHistory";
import { MapComponent } from "../../components/Map/Map";
import { MapProvider } from "../../contexts/MapContext";

export const HomePage = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if the user's system is in dark mode
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showVideoHistory, setShowVideoHistory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = (isDark: boolean) => {
      setIsDarkMode(isDark);
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    };

    // Initial check
    updateTheme(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e: MediaQueryListEvent) => {
      updateTheme(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

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