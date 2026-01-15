import { useState } from "react";
import { Link } from "react-router-dom";

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
    <div style={{ margin: "60px auto", maxWidth: "1000px", textAlign: "center" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          fontSize: "24px",
          fontWeight: "600",
          background: "none",
          border: "none",
          color: "#00eaff",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {open ? "Kategóriák ▲" : "Kategóriák ▼"}
      </button>

      <div
        style={{
          maxHeight: open ? "1000px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.6s ease",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "20px",
            padding: "20px",
            opacity: open ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "20px",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
                backdropFilter: "blur(6px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
            >
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>{cat.icon}</div>
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
