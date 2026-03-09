import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ChangePassword.css';

export default function ChangePassword() {
  const { user, updateUserProfile, token } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Töröljük a hibaüzenetet, amikor a felhasználó gépel
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    // Jelenlegi jelszó ellenőrzése
    if (!formData.currentPassword.trim()) {
      setError('A jelenlegi jelszó megadása kötelező');
      return false;
    }

    // Új jelszó ellenőrzése
    if (!formData.newPassword.trim()) {
      setError('Az új jelszó megadása kötelező');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Az új jelszónak legalább 6 karakter hosszúnak kell lennie');
      return false;
    }

    // Jelszó erősség ellenőrzése (opcionális)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.newPassword)) {
      setError('Az új jelszónak tartalmaznia kell kisbetűt, nagybetűt és számot');
      return false;
    }

    // Jelszó megerősítés ellenőrzése
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Az új jelszavak nem egyeznek');
      return false;
    }

    // Ellenőrizzük, hogy az új jelszó különbözik-e a régitől
    if (formData.newPassword === formData.currentPassword) {
      setError('Az új jelszó nem lehet azonos a jelenlegivel');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validáció
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Jelszó változtatási kérelem küldése...');
      
      // Jelszó változtatás az API-n keresztül
      const result = await updateUserProfile(user.id, { 
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword 
      });
      
      console.log('✅ Jelszó változtatás eredménye:', result);
      
      if (result.success) {
        setSuccess('Jelszó sikeresen megváltoztatva!');
        // Űrlap alaphelyzetbe állítása
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(result.message || 'Hiba történt a jelszó változtatás közben');
      }
    } catch (error) {
      console.error('❌ Jelszó változtatási hiba:', error);
      setError(error.message || 'Nem sikerült megváltoztatni a jelszót. Kérlek, próbáld újra!');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="changePasswordContainer">
      <h3>Jelszó megváltoztatása</h3>
      
      {/* Hibaüzenet */}
      {error && (
        <div className="errorMessage">
          <span className="errorIcon">⚠️</span>
          {error}
        </div>
      )}
      
      {/* Sikerüzenet */}
      {success && (
        <div className="successMessage">
          <span className="successIcon">✅</span>
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="changePasswordForm">
        {/* Jelenlegi jelszó */}
        <div className="formGroup">
          <label htmlFor="currentPassword">Jelenlegi jelszó</label>
          <div className="passwordInputWrapper">
            <input
              id="currentPassword"
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Jelenlegi jelszó"
              className="passwordInput"
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="passwordToggle"
              onClick={() => togglePasswordVisibility('current')}
              tabIndex="-1"
            >
              {showPasswords.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        
        {/* Új jelszó */}
        <div className="formGroup">
          <label htmlFor="newPassword">Új jelszó</label>
          <div className="passwordInputWrapper">
            <input
              id="newPassword"
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Legalább 6 karakter"
              minLength="6"
              className="passwordInput"
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="passwordToggle"
              onClick={() => togglePasswordVisibility('new')}
              tabIndex="-1"
            >
              {showPasswords.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        
        {/* Jelszó megerősítés */}
        <div className="formGroup">
          <label htmlFor="confirmPassword">Új jelszó megerősítése</label>
          <div className="passwordInputWrapper">
            <input
              id="confirmPassword"
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Jelszó újra"
              className="passwordInput"
              disabled={loading}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="passwordToggle"
              onClick={() => togglePasswordVisibility('confirm')}
              tabIndex="-1"
            >
              {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {/* Jelszó erősség jelző */}
        {formData.newPassword && (
          <div className="passwordStrength">
            <div className="strengthBar">
              <div 
                className={`strengthIndicator ${getPasswordStrength(formData.newPassword)}`}
                style={{ width: `${getPasswordStrengthPercent(formData.newPassword)}%` }}
              ></div>
            </div>
            <span className="strengthText">
              {getPasswordStrengthText(formData.newPassword)}
            </span>
          </div>
        )}
        
        {/* Jelszó követelmények */}
        <div className="passwordRequirements">
          <p>Jelszó követelmények:</p>
          <ul>
            <li className={formData.newPassword.length >= 6 ? 'valid' : ''}>
              Legalább 6 karakter hosszú
            </li>
            <li className={/[a-z]/.test(formData.newPassword) ? 'valid' : ''}>
              Tartalmaz kisbetűt
            </li>
            <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
              Tartalmaz nagybetűt
            </li>
            <li className={/\d/.test(formData.newPassword) ? 'valid' : ''}>
              Tartalmaz számot
            </li>
          </ul>
        </div>
        
        <button 
          type="submit" 
          className="changePasswordButton"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Feldolgozás...
            </>
          ) : (
            'Jelszó megváltoztatása'
          )}
        </button>
      </form>

      {/* Információs panel */}
      <div className="passwordInfo">
        <p className="infoNote">
          <span className="infoIcon">ℹ️</span>
          A jelszó megváltoztatása után a következő bejelentkezésnél már az új jelszót kell használnod.
        </p>
      </div>
    </div>
  );
}

// Segédfüggvények a jelszó erősségének meghatározásához
const getPasswordStrength = (password) => {
  if (!password) return 'weak';
  
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
  
  if (strength <= 2) return 'weak';
  if (strength <= 3) return 'medium';
  if (strength <= 4) return 'good';
  return 'strong';
};

const getPasswordStrengthPercent = (password) => {
  const strength = getPasswordStrength(password);
  switch(strength) {
    case 'weak': return 20;
    case 'medium': return 40;
    case 'good': return 70;
    case 'strong': return 100;
    default: return 0;
  }
};

const getPasswordStrengthText = (password) => {
  const strength = getPasswordStrength(password);
  switch(strength) {
    case 'weak': return 'Gyenge jelszó';
    case 'medium': return 'Közepes jelszó';
    case 'good': return 'Jó jelszó';
    case 'strong': return 'Erős jelszó';
    default: return '';
  }
};