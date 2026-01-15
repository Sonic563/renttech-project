import { Link } from "react-router-dom";

import { useState } from "react";

export default function AppNavbar() {
  const [search, setSearch] = useState("");

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 30px",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 4px 18px rgba(0,0,0,0.45)",
      }}
    >
   
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
         <Link to="/">
        <img
        
          src="/RentTechlogo.png"
        
          alt="RenTech"
          style={{
            width: "42px",
            filter: "drop-shadow(0 0 4px rgba(0, 234, 255, 0.35))",
          }}
      
        />    </Link>
   <Link to="/"
          style={{
            fontSize:"20px",
            ...linkStyle,
            padding: "8px 14px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "6px",
          }}
             >
            RenTech
        </Link>
      </div>

   



      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
      
        <input
          type="text"
          placeholder="Keresés..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.1)",
            color: "white",
            outline: "none",
            width: "180px",
          }}
        />

        {/* BEJELENTKEZÉS */}
        <Link
          to="/login"
          style={{
            ...linkStyle,
            padding: "8px 14px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "6px",
          }}
        >
          Bejelentkezés
        </Link>

        <Link
          to="/register"
          style={{
            ...linkStyle,
            padding: "8px 14px",
            background: "#00bcd4",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          Regisztráció
        </Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  transition: "0.3s",
};
