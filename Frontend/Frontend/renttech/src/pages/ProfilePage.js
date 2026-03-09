import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ChangePassword from '../components/ChangePassword';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!name.trim()) {
        throw new Error('A név nem lehet üres');
      }

      const result = await updateUserProfile(user.id, { name });
      
      if (result.success) {
        setSuccess('Profil sikeresen frissítve!');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profilePageContainer">
      <div className="profileFormWrapper">
        <h2 className="profileTitle">Profilom</h2>
        
        {error && <div className="errorMessage">{error}</div>}
        {success && <div className="successMessage">{success}</div>}
        
        <div className="profileInfo">
          <div className="infoRow">
            <span className="infoLabel">Felhasználói ID:</span>
            <span className="infoValue">{user?.id}</span>
          </div>
          <div className="infoRow">
            <span className="infoLabel">Regisztráció dátuma:</span>
            <span className="infoValue">
              {new Date(user?.createdAt).toLocaleDateString('hu-HU')}
            </span>
          </div>
          <div className="infoRow">
            <span className="infoLabel">Szerepkör:</span>
            <span className="infoValue roleBadge">
              {user?.role === 'ADMIN' ? 'Adminisztrátor' : 'Felhasználó'}
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="profileForm">
          <div className="formGroup">
            <label htmlFor="name" className="formLabel">Teljes név</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="formInput"
              required
            />
          </div>
          
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">Email cím</label>
            <input
              id="email"
              type="email"
              value={email}
              readOnly
              className="formInput readonly"
            />
            <small className="readonlyHint">Az email cím nem módosítható</small>
          </div>
          
          <button 
            type="submit" 
            className="profileButton"
            disabled={loading || name === user?.name}
          >
            {loading ? 'Mentés...' : 'Profil frissítése'}
          </button>
        </form>

        <ChangePassword />
        
        <div className="profileLinks">
          <a href="/" className="backLink">← Vissza a főoldalra</a>
        </div>
      </div>
    </div>
  );
}