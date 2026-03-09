import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CategorySection.css";

const categories = [
  { id: "laptop", name: "Laptopok", icon: "💻", description: "Professzionális laptopok munkához és tanuláshoz" },
  { id: "camera", name: "Kamerák", icon: "📷", description: "Fényképezőgépek és videókamerák" },
  { id: "projector", name: "Projektorok", icon: "📽️", description: "Prezentációkhoz és otthoni mozihoz" },
  { id: "vr", name: "VR eszközök", icon: "🕶️", description: "Virtuális valóság szemüvegek" },
  { id: "audio", name: "Hangtechnika", icon: "🔊", description: "Hangszórók, fejhallgatók, karaoke" },
  { id: "tablet", name: "Tabletek", icon: "📱", description: "iPad és Android táblagépek" },
  { id: "gaming", name: "Gaming", icon: "🎮", description: "Játékkonzolok és kiegészítők" },
  { id: "accessories", name: "Kiegészítők", icon: "🔌", description: "Töltők, kábelek, állványok" }
];

export default function CategorySection({ 
  initiallyOpen = false,
  onCategorySelect,
  showCount = true,
  variant = "default" // default, compact, featured
}) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categoryCounts, setCategoryCounts] = useState({});
  const sectionRef = useRef(null);
  const location = useLocation();

  // Aktív kategória beállítása URL alapján
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get('category');
    if (categoryParam && categories.some(c => c.id === categoryParam)) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory(null);
    }
  }, [location.search]);

  // Kategória számlálók betöltése (opcionális)
  useEffect(() => {
    if (showCount) {
      const fetchCategoryCounts = async () => {
        try {
          // Itt lekérhetnéd az API-ból, hogy hány eszköz van kategóriánként
          // const response = await assetAPI.getCategoryCounts();
          // setCategoryCounts(response);
          
          // Demo adatok
          setCategoryCounts({
            laptop: 12,
            camera: 8,
            projector: 6,
            vr: 4,
            audio: 10,
            tablet: 7,
            gaming: 5,
            accessories: 15
          });
        } catch (error) {
          console.error("Hiba a kategória számlálók betöltésekor:", error);
        }
      };
      
      fetchCategoryCounts();
    }
  }, [showCount]);

  // Klikk a kategóriára
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    if (onCategorySelect) {
      onCategorySelect(categoryId);
    }
    // Mobil nézetben bezárhatjuk a menüt
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  // Kattintás a komponensen kívülre
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sectionRef.current && !sectionRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reszponzív viselkedés
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  // Kategória ikon és szín kiválasztása
  const getCategoryStyle = (categoryId) => {
    const styles = {
      laptop: { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", lightBg: "#e8eaf6" },
      camera: { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", lightBg: "#ffe0e0" },
      projector: { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", lightBg: "#e0f2fe" },
      vr: { gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", lightBg: "#e0f7e8" },
      audio: { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", lightBg: "#fff3e0" },
      tablet: { gradient: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)", lightBg: "#e0f7fa" },
      gaming: { gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)", lightBg: "#ffe0e0" },
      accessories: { gradient: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)", lightBg: "#ede7f6" }
    };
    return styles[categoryId] || styles.laptop;
  };

  return (
    <div 
      ref={sectionRef} 
      className={`categorySection categorySection-${variant}`}
    >
      {/* Header */}
      <div className="categorySectionHeader">
        <h2 className="categorySectionTitle">
          <span className="titleIcon">📂</span>
          Kategóriák
        </h2>
        <button
          onClick={toggleOpen}
          className="categorySectionToggleButton"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Kategóriák bezárása" : "Kategóriák megnyitása"}
        >
          <span className="toggleText">
            {isOpen ? "Összecsukás" : "Kategóriák mutatása"}
          </span>
          <span className={`toggleIcon ${isOpen ? "open" : ""}`}>
            ▼
          </span>
        </button>
      </div>

      {/* Kategória grid */}
      <div 
        className={`categorySectionContent ${isOpen ? "open" : "closed"}`}
        style={{
          maxHeight: isOpen ? `${categories.length * 80}px` : '0',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="categorySectionGrid">
          {categories.map((category) => {
            const style = getCategoryStyle(category.id);
            const isActive = activeCategory === category.id;
            const count = categoryCounts[category.id] || 0;
            
            return (
              <Link
                key={category.id}
                to={`/devices?category=${category.id}`}
                className={`categoryCard ${isActive ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category.id)}
                style={{
                  background: isActive ? style.gradient : style.lightBg,
                  color: isActive ? 'white' : '#333',
                  transform: isActive ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div className="categoryCardContent">
                  <span className="categoryIcon">{category.icon}</span>
                  <div className="categoryInfo">
                    <span className="categoryName">{category.name}</span>
                    {showCount && count > 0 && (
                      <span className="categoryCount">{count} eszköz</span>
                    )}
                  </div>
                </div>
                
                {variant === 'featured' && (
                  <p className="categoryDescription">{category.description}</p>
                )}
                
                <span className="categoryArrow">→</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Gyors navigáció (opcionális) */}
      {isOpen && variant === 'featured' && (
        <div className="categoryQuickNav">
          <span className="quickNavLabel">Ugrás:</span>
          <div className="quickNavLinks">
            {categories.slice(0, 4).map(cat => (
              <Link
                key={cat.id}
                to={`/devices?category=${cat.id}`}
                className="quickNavLink"
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}