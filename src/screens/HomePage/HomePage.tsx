import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";

export const HomePage = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleDarkModeChange = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
  };

  const handleHistoryClick = () => {
    navigate('/video-history');
  };

  const handleControlConsultarClick = (itemLabel: string) => {
    navigate(`/control/${itemLabel}`);
  };

  return (
    <div className="theme-aware-bg flex flex-row justify-center w-full h-screen">
      <div className="w-full h-full">
        <div className={`h-full relative ${isDarkMode ? 'bg-zinc-900' : 'bg-[url(/image-1.png)] bg-cover bg-[50%_50%]'}`}>
          <div className="absolute top-[50%] left-[17px] -translate-y-1/2">
            <Sidebar 
              onDarkModeChange={handleDarkModeChange} 
              onHistoryClick={handleHistoryClick}
              onControlConsultarClick={handleControlConsultarClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};