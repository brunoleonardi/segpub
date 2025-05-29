import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './screens/HomePage';
import { ControlTablePage } from './screens/ControlTablePage';
import { RegisterPage } from './screens/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/control/:section" element={<ControlTablePage />} />
        <Route path="/register/:section" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}