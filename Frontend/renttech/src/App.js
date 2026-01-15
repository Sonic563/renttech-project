import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import DeviceListPage from './pages/DeviceListPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DeviceDetailsPage from './pages/DeviceDetailsPage';

import './App.css';


function App() {
  return(
    <BrowserRouter>
    <Navbar/>
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/devices" element={<DeviceListPage />} />
        <Route path="/devices/:id" element={<DeviceDetailsPage />} />
        
    </Routes>
    </BrowserRouter>
  );
}

export default App;
