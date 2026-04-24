import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ChangePassword.css';

export default function ChangePassword() {
  const { user, changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!formData.currentPassword.trim()) {
      setError('A jelenlegi jelszó megadása kötelező');
      return false;
    }

    if (!formData.newPassword.trim()) {
      setError('Az új jelszó megadása kötelező');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Az új jelszónak legalább 6 karakter hosszúnak kell lennie');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.newPassword)) {
      setError('Az új jelszónak tartalmaznia kell kisbetűt, nagybetűt és számot');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Az új jelszavak nem egyeznek');
      return false;
    }

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

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await changePassword(user.id, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (!result.success) {
        throw new Error(result.message || 'Hiba történt a jelszó változtatás közben');
      }

      setSuccess('Jelszó sikeresen megváltoztatva!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (submitError) {
      setError(
        submitError.message || 'Nem sikerült megváltoztatni a jelszót. Kérlek, próbáld újra!',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="passwordWrapper">
      {error && <div className="errorMessage">{error}</div>}
      {success && <div className="successMessage">{success}</div>}

      <form onSubmit={handleSubmit} className="passwordForm">
        <div className="formGroup">
          <label className="currentPasswordText">Jelenlegi jelszó</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="••••••••"
            className="formInput"
          />
        </div>

        <div className="formGroup">
          <label>Új jelszó</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Legalább 6 karakter"
            className="formInput"
          />
        </div>

        <div className="formGroup">
          <label>Új jelszó megerősítése</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Jelszó újra"
            className="formInput"
          />
        </div>

        <button className="profileButton" disabled={loading}>
          {loading ? 'Mentés...' : 'Jelszó megváltoztatása'}
        </button>
      </form>
    </div>
  );
}
