import { useState, useEffect } from "react";
import DeviceCard from "../components/DeviceCard";
import CategorySection from "../components/CategorySection";
import { assetAPI } from "../services/Api";
import "./HomePage.css";

export default function HomePage() {
  const [featuredDevices, setFeaturedDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetAPI.getAll()
      .then(data => {
        setFeaturedDevices(data.slice(0, 3));
        setLoading(false);
      })
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem('adminDevices') || '[]');
        setFeaturedDevices(saved.slice(0, 3));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Betöltés...</div>;

  return (
    <div className="homePageContainer">
      <h1>RenTech – Elektronikai kölcsönzés</h1>
      <p>Laptopok, kamerák, projektorok és további technikai eszközök.</p>
      <CategorySection />
      <h2>Kiemelt eszközök</h2>
      <div className="homePageDevicesGrid">
        {featuredDevices.map(device => <DeviceCard key={device.id} device={device} />)}
      </div>
      <a href="/devices" className="homePageBrowseButton">További eszközök</a>
      <div className="homePageContactSection">
        <h2>Kapcsolat</h2>
        <p>📍 Nyíregyháza</p>
        <p>📞 +36 70 302 8139</p>
        <p>✉ info@rentech.hu</p>
      </div>
    </div>
  );
}