import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProtectedRoute.css';

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  redirectTo = '/login',
  fallback = null 
}) {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  // Mentjük az aktuális útvonalat, hogy vissza tudjunk irányítani
  const saveCurrentPath = () => {
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
  };

  // Töltés közben mutatunk egy szép spinner-t
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>Betöltés...</p>
      </div>
    );
  }

  // Ha nincs bejelentkezve, átirányítjuk a login oldalra
  if (!isAuthenticated) {
    saveCurrentPath();
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Ha admin jogosultság szükséges, de a felhasználó nem admin
  if (requireAdmin && !isAdmin) {
    return (
      <Navigate 
        to="/" 
        state={{ 
          error: 'Nincs jogosultságod az oldal megtekintéséhez!' 
        }} 
        replace 
      />
    );
  }

  // Ha a felhasználó admin, de nem admin oldalra akar menni
  if (!requireAdmin && isAdmin && location.pathname === '/admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Minden rendben, megjelenítjük a gyermek komponenst
  return children;
}

// Opcionális: AdminRoute komponens a könnyebb használathoz
export const AdminRoute = ({ children }) => (
  <ProtectedRoute requireAdmin={true}>
    {children}
  </ProtectedRoute>
);

// Opcionális: UserRoute komponens a könnyebb használathoz
export const UserRoute = ({ children }) => (
  <ProtectedRoute requireAdmin={false}>
    {children}
  </ProtectedRoute>
);