import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek');
      return;
    }

    if (password.length < 6) {
      setError('A jelszónak legalább 6 karakter hosszúnak kell lennie');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, confirmPassword);
    
    if (result.success) {
      setSuccess('Sikeres regisztráció! Átirányítás...');
      setTimeout(() => navigate('/'), 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="registerPageContainer">
      <div className="registerFormWrapper">
        <h2 className="registerTitle">Regisztráció</h2>
        
        {error && <div className="errorMessage">{error}</div>}
        {success && <div className="successMessage">{success}</div>}
        
        <form onSubmit={handleSubmit} className="registerForm">
          <div className="formGroup">
            <label htmlFor="name" className="formLabel">Teljes név</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="formInput"
              required
              placeholder="Kiss János"
            />
          </div>
          
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
              placeholder="Legalább 6 karakter"
              minLength="6"
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="confirmPassword" className="formLabel">Jelszó megerősítése</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="formInput"
              required
              placeholder="Jelszó újra"
            />
          </div>
          
          <button 
            type="submit" 
            className="registerButton"
            disabled={loading}
          >
            {loading ? 'Regisztrálás...' : 'Regisztrálás'}
          </button>
        </form>
        
        <div className="registerLinks">
          <p>
            Már van fiókod?{' '}
            <Link to="/login" className="linkButton">Jelentkezz be!</Link>
          </p>
          <p>
            <Link to="/" className="backLink">← Vissza a főoldalra</Link>
          </p>
        </div>
      </div>
    </div>
  );
}