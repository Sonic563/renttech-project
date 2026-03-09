import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState({ devices: true, users: true, bookings: true });
  const [error, setError] = useState(null);
  
  const [form, setForm] = useState({
    name: '', description: '', category: 'laptop', dailyPrice: '', 
    deposit: '', availability: 'ELÉRHETŐ', stock: 1
  });

  const categories = [
    { value: 'laptop', label: 'Laptopok' },
    { value: 'camera', label: 'Kamerák' },
    { value: 'projector', label: 'Projektorok' },
    { value: 'vr', label: 'VR eszközök' },
    { value: 'audio', label: 'Hangtechnika' },
    { value: 'tablet', label: 'Tabletek' }
  ];

  const statusOptions = [
    { value: 'ELÉRHETŐ', label: 'Elérhető' },
    { value: 'KÖLCSÖNZÖTT', label: 'Kölcsönzött' },
    { value: 'NEM_ELÉRHETŐ', label: 'Nem elérhető' }
  ];

  const mapCategory = (cat) => {
    const map = {
      'Laptopok': 'laptop', 'Fényképezőgépek': 'camera', 'Projektorok': 'projector',
      'Hangrendszerek': 'audio', 'VR eszközök': 'vr', 'Tabletek': 'tablet'
    };
    return map[cat] || cat || 'other';
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('/api/assets');
        const data = await res.json();
        setDevices(data.map(d => ({
          id: d.id, name: d.name, description: d.description || '',
          category: mapCategory(d.category?.name || 'laptop'),
          dailyPrice: d.dailyPrice || 0, deposit: d.deposit || 0,
          availability: d.availability || 'ELÉRHETŐ', stock: 1
        })));
      } catch (err) {
        setError(err.message);
        const saved = JSON.parse(localStorage.getItem('adminDevices') || '[]');
        setDevices(saved);
      } finally {
        setLoading(prev => ({ ...prev, devices: false }));
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab !== 'users') return;
      try {
        const res = await fetch('/api/users');
        if (res.ok) setUsers(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };
    fetchUsers();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/assets/${editing.id}` : '/api/assets';
      const res = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category: { id: 1 }, owner: { id: 1 } })
      });
      const saved = await res.json();
      
      if (editing) {
        setDevices(devices.map(d => d.id === editing.id ? { ...form, id: saved.id } : d));
      } else {
        setDevices([...devices, { ...form, id: saved.id || Date.now() }]);
      }
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Biztosan törlöd?')) return;
    try {
      await fetch(`/api/assets/${id}`, { method: 'DELETE' });
      setDevices(devices.filter(d => d.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm({ name: '', description: '', category: 'laptop', dailyPrice: '', deposit: '', availability: 'ELÉRHETŐ', stock: 1 });
    setShowForm(false);
    setEditing(null);
  };

  const stats = {
    totalDevices: devices.length,
    availableDevices: devices.filter(d => d.availability === 'ELÉRHETŐ').length,
    rentedDevices: devices.filter(d => d.availability === 'KÖLCSÖNZÖTT').length,
    totalUsers: users.length,
    monthlyRevenue: devices.reduce((sum, d) => 
      d.availability === 'KÖLCSÖNZÖTT' ? sum + (d.dailyPrice * 30) : sum, 0
    )
  };

  if (loading.devices && activeTab === 'devices') {
    return <div className="loading"><div className="loader"></div><p>Betöltés...</p></div>;
  }

  return (
    <div className="adminDashboard">
      <div className="adminHeader">
        <h1>Admin Felület</h1>
        <p>Üdv, {user?.name || 'Admin'}!</p>
        {error && <div className="errorMessage">⚠️ {error}</div>}
      </div>

      <div className="adminTabs">
        {['devices', 'bookings', 'users', 'stats'].map(tab => (
          <button key={tab} className={`tabButton ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'devices' && '📦'} {tab === 'bookings' && '📋'} {tab === 'users' && '👥'} {tab === 'stats' && '📊'}
            {tab === 'devices' && ` Eszközök (${devices.length})`}
            {tab === 'bookings' && ` Foglalások (${bookings.length})`}
            {tab === 'users' && ` Felhasználók (${users.length})`}
            {tab === 'stats' && ' Statisztikák'}
          </button>
        ))}
      </div>

      <div className="adminContent">
        {activeTab === 'devices' && (
          <div className="devicesTab">
            <div className="tabHeader">
              <h2>Eszközök kezelése</h2>
              <button onClick={() => showForm ? resetForm() : setShowForm(true)} className="addButton">
                {showForm ? '❌ Mégse' : '➕ Új eszköz'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="deviceForm">
                <div className="formRow">
                  <div className="formGroup">
                    <label>Név *</label>
                    <input name="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="formGroup">
                    <label>Kategória *</label>
                    <select name="category" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                      {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="formGroup">
                  <label>Leírás *</label>
                  <textarea name="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="3" required />
                </div>
                <div className="formRow">
                  <div className="formGroup">
                    <label>Napi ár *</label>
                    <input type="number" name="dailyPrice" value={form.dailyPrice} onChange={e => setForm({...form, dailyPrice: e.target.value})} required />
                  </div>
                  <div className="formGroup">
                    <label>Óvadék</label>
                    <input type="number" name="deposit" value={form.deposit} onChange={e => setForm({...form, deposit: e.target.value})} />
                  </div>
                  <div className="formGroup">
                    <label>Státusz</label>
                    <select name="availability" value={form.availability} onChange={e => setForm({...form, availability: e.target.value})}>
                      {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="submitButton">{editing ? '💾 Mentés' : '➕ Hozzáadás'}</button>
              </form>
            )}

            <div className="devicesList">
              {devices.length === 0 ? <p>Nincsenek eszközök</p> : 
                devices.map(d => (
                  <div key={d.id} className="deviceItem">
                    <div className="deviceInfo">
                      <h3>{d.name}</h3>
                      <p>{categories.find(c => c.value === d.category)?.label}</p>
                      <p>{d.description}</p>
                      <div className="deviceDetails">
                        <span>{d.dailyPrice} Ft/nap</span>
                        {d.deposit > 0 && <span>Óvadék: {d.deposit} Ft</span>}
                        <span className={`status ${d.availability}`}>
                          {statusOptions.find(s => s.value === d.availability)?.label}
                        </span>
                      </div>
                    </div>
                    <div className="deviceActions">
                      <button onClick={() => { setEditing(d); setForm(d); setShowForm(true); }}>✏️</button>
                      <button onClick={() => handleDelete(d.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookingsTab">
            <h2>Foglalások ({bookings.length})</h2>
            {bookings.length === 0 ? <p>Nincsenek foglalások</p> : 
              bookings.map(b => <div key={b.id} className="bookingItem"><p>{b.asset?.name} - {b.user?.email}</p></div>)
            }
          </div>
        )}

        {activeTab === 'users' && (
          <div className="usersTab">
            <h2>Felhasználók ({users.length})</h2>
            {users.map(u => (
              <div key={u.id} className="userItem">
                <h4>{u.fullName || u.name}</h4>
                <p>{u.email} - {u.role}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="statsTab">
            <h2>Statisztikák</h2>
            <div className="statsGrid">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} className="statCard">
                  <h3>{key === 'totalDevices' && 'Összes eszköz'}</h3>
                  <h3>{key === 'availableDevices' && 'Elérhető'}</h3>
                  <h3>{key === 'rentedDevices' && 'Kölcsönzött'}</h3>
                  <h3>{key === 'totalUsers' && 'Felhasználók'}</h3>
                  <h3>{key === 'monthlyRevenue' && 'Bevétel'}</h3>
                  <p className="statNumber">{typeof value === 'number' ? value.toLocaleString() + (key === 'monthlyRevenue' ? ' Ft' : '') : value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}