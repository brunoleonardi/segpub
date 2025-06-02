import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { HomePage } from './screens/HomePage';
import { ControlTablePage } from './screens/ControlTablePage';
import { DetailsPage } from './screens/RegisterPage/DetailsPage';
import { RegisterPage } from './screens/RegisterPage';

export const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/control/:section" element={<ControlTablePage />} />
            <Route path="/details/:section/:id" element={<DetailsPage />} />
            <Route path="/register/:section" element={<RegisterPage />} />
        </Routes>
    );
}