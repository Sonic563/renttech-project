import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ placeholder = "Keresés eszközök között..." }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam !== null) {
      setSearchTerm(decodeURIComponent(searchParam));
    } else {
      setSearchTerm('');
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/devices?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
   
      navigate('/devices');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };



  return (
    <div className="searchBar">
      <form onSubmit={handleSubmit} className="searchForm">
        <div className="searchInputWrapper">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="searchInput"
            aria-label="Keresés"
          />
      
          <button 
            type="submit" 
            className="searchButton"
            aria-label="Keresés"
          >
            🔍
          </button>
        </div>
      </form>
    </div>
  );
}