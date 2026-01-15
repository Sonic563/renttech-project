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

export default function CategoryMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ margin: "40px 0" }}>
      {/* CÍM + LENYITÁS GOMB */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none",
          border: "none",
          color: "#00eaff",
          fontSize: "24px",
          fontWeight: "600",
          cursor: "pointer",
          marginBottom: "20px"
        }}
      >
        {open ? "Kategóriák ▲" : "Kategóriák ▼"}
      </button>

      {/* LENYÍLÓ TARTALOM */}
      <div
        style={{
          maxHeight: open ? "1000px" : "0px",
          overflow: "hidden",
          transition: "max-height 0.5s ease",
        }}
      >
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "20px",
          padding: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
          animation: open ? "fadeIn 1.2s ease forwards" : "none",
          opacity: open ? 1 : 0
        }}>
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={cat.path}
              style={{
                background: "rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                color: "white",
                textDecoration: "none",
                fontSize: "18px",
                backdropFilter: "blur(6px)",
                transition: "0.3s"
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
