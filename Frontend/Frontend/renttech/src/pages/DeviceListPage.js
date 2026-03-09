import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DeviceCard from '../components/DeviceCard';
import { assetAPI } from '../services/Api';
import './DeviceListPage.css';

// Kategóriák definíciója - UGYANAZ
const categories = [
  { id: 'all', name: 'Összes', icon: '📦' },
  { id: 'laptop', name: 'Laptopok', icon: '💻' },
  { id: 'camera', name: 'Kamerák', icon: '📷' },
  { id: 'projector', name: 'Projektorok', icon: '📽️' },
  { id: 'vr', name: 'VR eszközök', icon: '🕶️' },
  { id: 'audio', name: 'Hangtechnika', icon: '🔊' },
  { id: 'tablet', name: 'Tabletek', icon: '📱' }
];

export default function DeviceListPage() {
  const location = useLocation();
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // CSAK EZ VÁLTOZOTT - fetch helyett assetAPI
  useEffect(() => {
    const loadDevices = async () => {
      try {
        setLoading(true);
        const data = await assetAPI.getAll();
        
        const formatted = data.map(device => ({
          id: device.id,
          name: device.name || 'Névtelen eszköz',
          description: device.description || 'Leírás nem elérhető',
          category: mapCategory(device.category?.name || device.category),
          price: device.dailyPrice || device.price || 0,
          imageUrl: getImageUrl(device),
          status: device.availability === 'ELÉRHETŐ' ? 'available' : 'unavailable'
        }));
        
        setDevices(formatted);
        setFilteredDevices(formatted.filter(d => d.status === 'available'));
      } catch (err) {
        setError(err.message);
        const saved = JSON.parse(localStorage.getItem('adminDevices') || '[]');
        setDevices(saved);
        setFilteredDevices(saved.filter(d => d.status === 'available'));
      } finally {
        setLoading(false);
      }
    };
    loadDevices();
  }, []);

  const mapCategory = (cat) => {
    const map = {
      'Laptopok': 'laptop', 'Fényképezőgépek': 'camera', 
      'Projektorok': 'projector', 'Hangrendszerek': 'audio',
      'VR eszközök': 'vr', 'Tabletek': 'tablet'
    };
    return map[cat] || cat || 'other';
  };

  const getImageUrl = (device) => {
    if (device.imageUrl) return device.imageUrl;
    const images = {
      laptop: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
      camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
      projector: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      audio: 'https://images.unsplash.com/photo-1529641484336-ef35148bab06?w=400&h=300&fit=crop',
      vr: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=300&fit=crop',
      tablet: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'
    };
    return images[device.category] || 'https://via.placeholder.com/400x300?text=Device';
  };

  // URL paraméterek - UGYANAZ
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    
    if (searchParam) setSearchQuery(decodeURIComponent(searchParam));
    if (categoryParam && categories.find(c => c.id === categoryParam)) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Szűrés - UGYANAZ
  useEffect(() => {
    if (loading) return;
    
    let result = devices.filter(d => d.status === 'available');
    
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
      );
    }
    
    result = result.filter(d => d.price >= priceRange[0] && d.price <= priceRange[1]);
    
    result.sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return a.name.localeCompare(b.name, 'hu');
    });
    
    setFilteredDevices(result);
  }, [devices, selectedCategory, searchQuery, sortBy, priceRange, loading]);

  // Ár tartomány - UGYANAZ
  useEffect(() => {
    if (devices.length) {
      const prices = devices.map(d => d.price);
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  }, [devices]);

  if (loading) {
    return (
      <div className="deviceListPage loading">
        <div className="loader"></div>
        <p>Eszközök betöltése...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="deviceListPage error">
        <div className="errorIcon">⚠️</div>
        <h3>Hiba az eszközök betöltésekor</h3>
        <p>{error}</p>
      </div>
    );
  }

  // UI TELJESEN UGYANAZ marad
  return (
    <div className="deviceListPage">
      <div className="pageHeader">
        <h1>Eszközök Bérlése</h1>
        <p className="subtitle">Válassz a legjobb technikai eszközök közül</p>
      </div>

      <div className="filtersSection">
        <div className="categoryFilters">
          {categories.map(category => (
            <button
              key={category.id}
              className={`categoryFilter ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="categoryIcon">{category.icon}</span>
              <span className="categoryName">{category.name}</span>
            </button>
          ))}
        </div>

        <div className="advancedFilters">
          <div className="filterGroup">
            <label htmlFor="sortSelect">Rendezés:</label>
            <select 
              id="sortSelect"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="filterSelect"
            >
              <option value="name">Név szerint (A-Z)</option>
              <option value="price_asc">Ár szerint (olcsó előre)</option>
              <option value="price_desc">Ár szerint (drága előre)</option>
            </select>
          </div>

          <div className="filterGroup priceFilter">
            <label>Ár tartomány:</label>
            <div className="priceInputs">
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setPriceRange([val, priceRange[1]]);
                }}
                min="0"
                className="priceInput"
                placeholder="Min"
              />
              <span className="priceSeparator">-</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setPriceRange([priceRange[0], val]);
                }}
                min={priceRange[0]}
                className="priceInput"
                placeholder="Max"
              />
              <span className="priceUnit">Ft</span>
            </div>
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="searchResultsInfo">
          <div className="searchInfoContent">
            <span className="searchLabel">Keresési eredmények:</span>
            <span className="searchQuery">"{searchQuery}"</span>
            <span className="resultsCount">{filteredDevices.length} találat</span>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="clearSearchBtn"
            >
              Szűrők törlése
            </button>
          </div>
        </div>
      )}

      <div className="devicesContainer">
        {filteredDevices.length > 0 ? (
          <div className="deviceGrid">
            {filteredDevices.map(device => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        ) : (
          <div className="noResults">
            <div className="noResultsIcon">🔍</div>
            <h3>Nincs találat</h3>
            <p>Próbálj másik keresési kifejezést vagy változtasd meg a szűrőket.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                const prices = devices.map(d => d.price);
                setPriceRange([Math.min(...prices), Math.max(...prices)]);
              }}
              className="resetFiltersBtn"
            >
              Összes eszköz mutatása
            </button>
          </div>
        )}
      </div>

      <div className="pageInfo">
        <p>
          <strong>{filteredDevices.length}</strong> elérhető eszköz a(z) <strong>{devices.length}</strong> közül
        </p>
      </div>
    </div>
  );
}