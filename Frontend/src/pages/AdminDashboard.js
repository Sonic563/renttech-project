import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';
import ImageUpload from '../components/ImageUpload';
import ModalSelect from '../components/ModalSelect';

const API_BASE_URL = 'http://localhost:8080';

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('devices');
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState({
    devices: true,
    users: true,
    bookings: true,
  });
  const [error, setError] = useState(null);

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  const [form, setForm] = useState({
    id: null,
    name: '',
    description: '',
    extraDescription: '',
    category: 'laptop',
    dailyPrice: '',
    availability: 'ELÉRHETŐ',
    imageId: null,
    imageUrl: null,
  });

  const toFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url}`;
  };

  const toBackendImageUrl = (url) => {
    if (!url) return null;
    return url.replace(API_BASE_URL, '');
  };

  const categories = [
    { value: 'laptop', label: 'Laptopok' },
    { value: 'camera', label: 'Kamerák' },
    { value: 'projector', label: 'Projektorok' },
    { value: 'vr', label: 'VR eszközök' },
    { value: 'audio', label: 'Hangtechnika' },
    { value: 'tablet', label: 'Tabletek' },
    { value: 'other', label: 'Egyéb eszközök' },
  ];

  const categoryLabelMap = {
    laptop: 'Laptopok',
    camera: 'Fényképezőgépek',
    projector: 'Projektorok',
    vr: 'VR eszközök',
    audio: 'Hangrendszerek',
    tablet: 'Tabletek',
    other: 'Egyéb',
  };

  const statusOptions = [
    { value: 'ELÉRHETŐ', label: 'Elérhető' },
    { value: 'KÖLCSÖNZÖTT', label: 'Kölcsönzött' },
    { value: 'NEM_ELÉRHETŐ', label: 'Nem elérhető' },
  ];

  const mapCategory = (cat) => {
    const normalized = String(cat || '').trim().toLowerCase();
    const map = {
      laptop: 'laptop',
      laptopok: 'laptop',
      kamera: 'camera',
      kamerák: 'camera',
      camera: 'camera',
      fényképezőgépek: 'camera',
      fenykepezogepek: 'camera',
      projector: 'projector',
      projektor: 'projector',
      projektorok: 'projector',
      vr: 'vr',
      'vr eszközök': 'vr',
      'vr eszkozok': 'vr',
      audio: 'audio',
      hang: 'audio',
      hangtechnika: 'audio',
      hangrendszerek: 'audio',
      tablet: 'tablet',
      tabletek: 'tablet',
      other: 'other',
      egyeb: 'other',
      egyéb: 'other',
      'egyéb eszközök': 'other',
      'egyeb eszkozok': 'other',
    };
    return map[normalized] || 'other';
  };

  const insertAtCursor = (text) => {
    const textarea = document.getElementById('extraDescription');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = form.extraDescription.substring(0, start);
    const after = form.extraDescription.substring(end);

    const newValue = before + text + after;

    setForm({ ...form, extraDescription: newValue });

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
    }, 0);
  };

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await fetch('/api/assets');
        const data = await res.json();

        setDevices(
          data.map((d) => ({
            id: d.id,
            name: d.name,
            description: d.description || '',
            extraDescription: d.extraDescription || '',
            category: mapCategory(d.category?.name || 'laptop'),
            dailyPrice: d.dailyPrice || 0,
            deposit: d.deposit || 0,
            availability: d.availability || 'ELÉRHETŐ',
            stock: 1,
            imageId: d.imageId ?? null,
            imageUrl: toFullImageUrl(d.imageUrl),
          }))
        );
      } catch (err) {
        setError(err.message);
        const saved = JSON.parse(localStorage.getItem('adminDevices') || '[]');
        setDevices(saved);
      } finally {
        setLoading((prev) => ({ ...prev, devices: false }));
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (activeTab !== 'users') return;
      try {
        const res = await fetch('/api/users', { headers: authHeaders });
        if (res.ok) setUsers(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    fetchUsers();
  }, [activeTab, authHeaders]);

  const fetchBookings = useCallback(async () => {
    if (activeTab !== 'bookings') return;

    setLoading((prev) => ({ ...prev, bookings: true }));
    setError(null);

    try {
      const res = await fetch('/api/bookings', { headers: authHeaders });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Foglalások lekérése sikertelen');
      }

      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  }, [activeTab, authHeaders]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Státusz frissítés sikertelen');
      }

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm('Biztosan törlöd ezt a foglalást (DB-ből)?')) return;

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Törlés sikertelen');
      }

      setBookings((prev) => prev.filter((x) => x.id !== bookingId));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleImageUploaded = (imageData) => {
    setForm((prev) => ({
      ...prev,
      imageId: imageData.id,
      imageUrl: toFullImageUrl(imageData.imageUrl),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/assets/${editing.id}` : '/api/assets';

      const payload = {
        id: editing?.id ?? null,
        name: form.name,
        description: form.description,
        extraDescription: form.extraDescription,
        dailyPrice: Number(form.dailyPrice),
        availability: form.availability,
        category: { name: categoryLabelMap[form.category] ?? categoryLabelMap.other },
        imageId: form.imageId,
        imageUrl: toBackendImageUrl(form.imageUrl),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error('Asset save error:', txt);
        setError(txt);
        return;
      }

      const saved = await res.json();

      const normalized = {
        id: saved.id,
        name: saved.name,
        description: saved.description || '',
        extraDescription: saved.extraDescription || '',
        category: mapCategory(saved.category?.name || form.category),
        dailyPrice: saved.dailyPrice || Number(form.dailyPrice) || 0,
        deposit: saved.deposit || 0,
        availability: saved.availability || form.availability,
        stock: 1,
        imageId: saved.imageId ?? form.imageId ?? null,
        imageUrl: toFullImageUrl(saved.imageUrl ?? form.imageUrl),
      };

      if (editing) {
        setDevices((prev) =>
          prev.map((d) => (d.id === editing.id ? normalized : d))
        );
      } else {
        setDevices((prev) => [...prev, normalized]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Biztosan törlöd?')) return;

    try {
      await fetch(`/api/assets/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });

      setDevices((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: '',
      description: '',
      extraDescription: '',
      category: 'laptop',
      dailyPrice: '',
      availability: 'ELÉRHETŐ',
      imageId: null,
      imageUrl: null,
    });

    setShowForm(false);
    setEditing(null);
  };

  if (loading.devices && activeTab === 'devices') {
    return (
      <div className="loading">
        <div className="loader"></div>
        <p>Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="adminDashboard">
      <div className="adminHeader">
        <h1>Admin Felület</h1>
        <p>Üdv, {user?.name || 'Admin'}!</p>
        {error && <div className="errorMessage">⚠️ {error}</div>}
      </div>

      <div className="adminTabs">
        {['devices', 'bookings', 'users'].map((tab) => (
          <button
            key={tab}
            className={`tabButton ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'devices' && '📦 Eszközök '}
            {tab === 'bookings' && '📋 Foglalások '}
            {tab === 'users' && '👥 Felhasználók '}
          </button>
        ))}
      </div>

      <div className="adminContent">
        {activeTab === 'devices' && (
          <div className="devicesTab">
            <div className="tabHeader">
              <h2>Eszközök kezelése</h2>

              <button
                onClick={() => (showForm ? resetForm() : setShowForm(true))}
                className="addButton"
              >
                {showForm ? '❌ Mégse' : '➕ Új eszköz'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="deviceForm">
                <div className="formRow">
                  <div className="formGroup">
                    <label>Név *</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label>Kategória *</label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    >
                      {categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="formGroup">
                  <label>Rövid leírás *</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows="3"
                    placeholder="1-2 mondatos rövid leírás. Ez jelenik meg a kártyákon."
                    required
                  />
                </div>

                <div className="adminToolbar">
                  <button type="button" onClick={() => insertAtCursor('** **')}>
                    Félkövér
                  </button>

                  <button type="button" onClick={() => insertAtCursor('* *')}>
                    Dőlt szöveg
                  </button>

                  <button type="button" onClick={() => insertAtCursor('## \n')}>
                    Cím
                  </button>

                  <button type="button" onClick={() => insertAtCursor('- \n')}>
                    Lista
                  </button>
                </div>

                <div className="formGroup">
                  <label>Részletes leírás</label>
                  <textarea
                    id="extraDescription"
                    name="extraDescription"
                    value={form.extraDescription}
                    onChange={(e) =>
                      setForm({ ...form, extraDescription: e.target.value })
                    }
                    rows="9"
                    placeholder={`Írhatsz ide bármit, sortörésekkel.

Példa:
Felbontás: 24 MP
Videó: Full HD
Tartozékok: akkumulátor, töltő, táska`}
                  />
                </div>

                <ImageUpload
                  value={form}
                  onImageUploaded={handleImageUploaded}
                  onError={(msg) => setError(msg)}
                />

                <div className="formRow">
                  <div className="formGroup">
                    <label>Napi ár *</label>
                    <input
                      type="number"
                      name="dailyPrice"
                      value={form.dailyPrice}
                      onChange={(e) =>
                        setForm({ ...form, dailyPrice: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label>Státusz</label>
                    <select
                      name="availability"
                      value={form.availability}
                      onChange={(e) =>
                        setForm({ ...form, availability: e.target.value })
                      }
                    >
                      {statusOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="submitButton">
                  {editing ? '💾 Mentés' : '➕ Hozzáadás'}
                </button>
              </form>
            )}

            <div className="devicesList">
              {devices.length === 0 ? (
                <p>Nincsenek eszközök</p>
              ) : (
                devices.map((d) => (
                  <div key={d.id} className="deviceItem">
                    <div className="deviceInfo">
                      <h3>{d.name}</h3>
                      <p>{categories.find((c) => c.value === d.category)?.label}</p>
                      <p>{d.description}</p>

                      <div className="deviceDetails">
                        <span>{d.dailyPrice} Ft/nap</span>
                        {d.deposit > 0 && <span>Óvadék: {d.deposit} Ft</span>}
                        <span className={`status ${d.availability}`}>
                          {statusOptions.find((s) => s.value === d.availability)?.label}
                        </span>
                      </div>
                    </div>

                    <div className="deviceActions">
                      <button
                        onClick={() => {
                          setEditing(d);
                          setForm({
                            id: d.id,
                            name: d.name || '',
                            description: d.description || '',
                            extraDescription: d.extraDescription || '',
                            category: mapCategory(d.category),
                            dailyPrice: d.dailyPrice || '',
                            availability: d.availability || 'ELÉRHETŐ',
                            imageId: d.imageId ?? null,
                            imageUrl: toFullImageUrl(d.imageUrl),
                          });
                          setShowForm(true);
                        }}
                      >
                        ✏️
                      </button>

                      <button onClick={() => handleDelete(d.id)}>🗑️</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bookingsTab">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <h2>Foglalások ({bookings.length})</h2>

              <button type="button" onClick={fetchBookings} className="addButton">
                🔄 Frissítés
              </button>
            </div>

            {loading.bookings ? (
              <p>Betöltés...</p>
            ) : bookings.length === 0 ? (
              <p>Nincsenek foglalások</p>
            ) : (
              <div className="bookingsList">
                {bookings.map((b) => (
                  <div key={b.id} className="bookingCard">
                    <div className="bookingCardHeader">
                      <div>
                        <div className="bookingDeviceName">{b.deviceName || '-'}</div>
                        <div className="bookingUser">
                          {b.userName ? b.userName : b.userEmail || '-'}
                        </div>
                      </div>

                      <div className={`bookingBadge ${String(b.status || '').toLowerCase()}`}>
                        {b.status || '-'}
                      </div>
                    </div>

                    <div className="bookingGrid">
                      <div className="bookingLabel">Kezdet</div>
                      <div className="bookingValue">{b.startDate || '-'}</div>

                      <div className="bookingLabel">Vége</div>
                      <div className="bookingValue">{b.endDate || '-'}</div>

                      <div className="bookingLabel">Napok</div>
                      <div className="bookingValue">{b.days ?? '-'}</div>

                      <div className="bookingLabel">Összeg</div>
                      <div className="bookingValue">{b.totalPrice ?? '-'} Ft</div>

                      <div className="bookingLabel">Foglalás ideje</div>
                      <div className="bookingValue">{b.bookingDate || '-'}</div>

                      <div className="bookingLabel">Megrendelő</div>
                      <div className="bookingValue">{b.customerName || '-'}</div>

                      <div className="bookingLabel">Telefon</div>
                      <div className="bookingValue">{b.phone || '-'}</div>

                      <div className="bookingLabel">Fizetés</div>
                      <div className="bookingValue">
                        {(b.paymentMethod || '').toUpperCase() === 'CARD'
                          ? 'Bankkártya'
                          : 'Utánvét'}
                        {' · '}
                        {(b.paymentStatus || '').toUpperCase() === 'PAID'
                          ? 'Fizetve'
                          : 'Fizetésre vár'}
                      </div>

                      <div className="bookingLabel">Szállítás</div>
                      <div className="bookingValue">
                        {(b.deliveryMethod || '').toUpperCase() === 'COURIER'
                          ? 'Futár'
                          : 'Személyes átvétel'}
                      </div>

                      <div className="bookingLabel">Cím</div>
                      <div className="bookingValue">
                        {(b.deliveryMethod || '').toUpperCase() === 'COURIER'
                          ? `${b.shippingZip || ''} ${b.shippingCity || ''}, ${b.shippingAddress || ''}`.trim()
                          : '-'}
                      </div>

                      <div className="bookingLabel">Megjegyzés</div>
                      <div className="bookingValue">{b.note || '-'}</div>
                    </div>

                    <div className="bookingActionsRow">
                      <div style={{ minWidth: 220 }}>
                        <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
                          Státusz kézi állítás
                        </div>

                        <ModalSelect
                          value={b.status || 'függőben'}
                          onChange={(newStatus) => updateBookingStatus(b.id, newStatus)}
                          options={[
                            { value: 'függőben', label: 'Függőben' },
                            { value: 'elfogadva', label: 'Elfogadva' },
                            { value: 'elutasítva', label: 'Elutasítva' },
                            { value: 'szállítás alatt', label: 'Szállítás alatt' },
                            { value: 'teljesítve', label: 'Teljesítve' },
                            { value: 'lemondva', label: 'Lemondva' },
                          ]}
                        />
                      </div>

                      <button
                        type="button"
                        className="deleteButton bookingActionSpacer"
                        onClick={() => deleteBooking(b.id)}
                      >
                        🗑️ Törlés
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="usersTab">
            <h2>Felhasználók ({users.length})</h2>

            {users.map((u) => (
              <div key={u.id} className="userItem">
                <h4>{u.fullName || u.name}</h4>
                <p>
                  {u.email} - {u.role}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}