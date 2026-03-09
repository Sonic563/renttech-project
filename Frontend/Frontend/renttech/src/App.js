import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DeviceListPage from './pages/DeviceListPage';
import DeviceDetailsPage from './pages/DeviceDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import UserBookings from './pages/UserBookings';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <div className="App">
            <Navbar />
            <main className="mainContent">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/devices" element={<DeviceListPage />} />
                <Route path="/devices/:id" element={<DeviceDetailsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Védett route-ok */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <UserBookings />
                  </ProtectedRoute>
                } />
                
                {/* Admin route */}
                <Route path="/admin/*" element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* 404 oldal */}
                <Route path="*" element={<div className="notFound">Oldal nem található</div>} />
              </Routes>
            </main>
          </div>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;