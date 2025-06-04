import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HomePage } from './screens/HomePage';
import { ControlTablePage } from './screens/ControlTablePage';
import { RegisterPage } from './screens/RegisterPage';
import { MapProvider } from './contexts/MapContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DetailsPage } from './screens/RegisterPage/DetailsPage';
import { Sidebar } from './components/Sidebar';
import { MobileSidebar } from './components/Sidebar/MobileSidebar';
import { VideoHistory } from './components/VideoHistory/VideoHistory';
import { useEffect, useState } from 'react';
import { Router } from './Routes';
import { useIsMobile } from './hooks/useIsMobile';
import { HistoryProvider } from './contexts/HistoryProvider';

export default function App() {
  const [showVideoHistory, setShowVideoHistory] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleControlConsultarClick = (itemLabel: string) => {
    navigate(`/control/${itemLabel}`);
  };

  // useEffect(() => {
  //   if (isMobile) {
  //     navigate('/')
  //   }
  // }, [isMobile])

  return (
    <ThemeProvider>
      <HistoryProvider>
        <MapProvider>
          <Router />

          {isMobile ? (
            <MobileSidebar
              onHistoryClick={() => setShowVideoHistory(true)}
              onControlConsultarClick={handleControlConsultarClick}
            />
          ) : (
            <div className="absolute top-[50%] left-[10px] -translate-y-1/2 z-10">
              <Sidebar
                onHistoryClick={() => setShowVideoHistory(true)}
                onControlConsultarClick={handleControlConsultarClick}
              />
            </div>
          )}

          {showVideoHistory && (
            <VideoHistory onClose={() => setShowVideoHistory(false)} />
          )}
        </MapProvider>
      </HistoryProvider>
    </ThemeProvider>
  );
}