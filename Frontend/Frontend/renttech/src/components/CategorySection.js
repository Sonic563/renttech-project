import { useState } from "react";
import { Link } from "react-router-dom";
import "./CategorySection.css";

const categories = [
  { name: "Laptopok", icon: "💻", path: "/devices?category=laptop" },
  { name: "Kamerák", icon: "📷", path: "/devices?category=kamera" },
  { name: "Projektorok", icon: "📽️", path: "/devices?category=projektor" },
  { name: "VR eszközök", icon: "🕶️", path: "/devices?category=vr" },
  { name: "Hangtechnika", icon: "🔊", path: "/devices?category=hang" },
  { name: "Tabletek", icon: "📱", path: "/devices?category=tablet" },
];

export default function CategorySection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="categorySectionContainer">
      <button
        onClick={() => setOpen(!open)}
        className="categorySectionToggleButton"
      >
        {open ? "Kategóriák ▲" : "Kategóriák ▼"}
      </button>

      <div
        className={`categorySectionContent ${open ? "open" : "closed"}`}
      >
        <div className={`categorySectionGrid ${open ? "visible" : "hidden"}`}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              className="categorySectionCard"
            >
              <div className="categorySectionIcon">{cat.icon}</div>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}