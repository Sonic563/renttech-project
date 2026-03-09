import { useState } from 'react';
import { useAuth } from '../context/AuthContext';  
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="loginPageContainer">
      <div className="loginFormWrapper">
        <h2 className="loginTitle">Bejelentkezés</h2>
        
        {error && <div className="errorMessage">{error}</div>}
        
        <form onSubmit={handleSubmit} className="loginForm">
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">Email cím</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="formInput"
              required
              placeholder="pelda@email.hu"
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="password" className="formLabel">Jelszó</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="formInput"
              required
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="loginButton"
            disabled={loading}
          >
            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
          </button>
        </form>
        
        <div className="loginLinks">
          <p>
            Nincs még fiókod?{' '}
            <Link to="/register" className="linkButton">Regisztrálj most!</Link>
          </p>
          <p>
            <Link to="/" className="backLink">← Vissza a főoldalra</Link>
          </p>
        </div>
        
        <div className="demoCredentials">
          <h4>Demo belépési adatok:</h4>
          <p>
            <strong>Admin:</strong><br />
            Email: admin@rentech.hu<br />
            Jelszó: admin123
          </p>
          <p style={{ marginTop: '10px' }}>
            <strong>Új felhasználó:</strong><br />
            Regisztrálj a "Regisztrálj most!" gombbal
          </p>
        </div>
      </div>
    </div>
  );
}