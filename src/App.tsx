import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './screens/HomePage';
import { ControlTablePage } from './screens/ControlTablePage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/control/:section" element={<ControlTablePage />} />
      </Routes>
    </BrowserRouter>
  );
}