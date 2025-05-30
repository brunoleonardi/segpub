import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './screens/HomePage';
import { ControlTablePage } from './screens/ControlTablePage';
import { RegisterPage } from './screens/RegisterPage';
import { MapProvider } from './contexts/MapContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DetailsPage } from './screens/RegisterPage/DetailsPage';

export default function App() {
  return (
    <ThemeProvider>
      <MapProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/control/:section" element={<ControlTablePage />} />
            <Route path="/details/:section/:id" element={<DetailsPage />} />
            <Route path="/register/:section" element={<RegisterPage />} />
          </Routes>
        </BrowserRouter>
      </MapProvider>
    </ThemeProvider>
  );
}