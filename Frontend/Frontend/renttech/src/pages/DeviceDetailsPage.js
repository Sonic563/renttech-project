import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";  // <-- useEffect import hozzáadva
import BookingCalendar from "../components/BookingCalendar";
import "./DeviceDetailsPage.css";

export default function DeviceDetailsPage() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Betöltjük az eszközt a backend API-ból
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setLoading(true);
        
        // Próbáljuk meg a backend API-t
        const response = await fetch(`/api/assets/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setDevice(data);
        
      } catch (err) {
        console.error("Error fetching device:", err);
        setError(err.message);
        
        // Fallback: ha nincs backend, próbáljuk a localStorage-t
        const storedDevices = JSON.parse(localStorage.getItem('adminDevices'));
        const defaultDevices = [
          {
            id: 1,
            name: "Dell Latitude 5420",
            description: "Erős üzleti laptop projektmunkákhoz.",
            longDescription: "Ez a laptop ideális választás irodai munkához, programozáshoz, prezentációkhoz és projektmunkákhoz.",
            price: 4500,
            imageUrl: "https://via.placeholder.com/600x400?text=Laptop",
            category: "laptop",
            status: "available"
          },
          // ... többi alapértelmezett eszköz
        ];
        
        const devices = storedDevices && storedDevices.length > 0 ? storedDevices : defaultDevices;
        const foundDevice = devices.find((d) => d.id === Number(id));
        setDevice(foundDevice || null);
      } finally {
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  if (loading) {
    return <div className="loading">Betöltés...</div>;
  }

  if (error) {
    return <div className="error">Hiba: {error}</div>;
  }

  if (!device) {
    return <h2 className="deviceDetailsPageH2">Eszköz nem található.</h2>;
  }

  return (
    <div className="deviceDetailsPageFirstDiv">
      <img src={device.imageUrl} alt={device.name} className="deviceDetailsPageImage"/>
      <h1>{device.name}</h1>
      <p className="deviceDescription">
        {device.longDescription || device.description}
      </p>
      <h3 className="deviceDetailsPageRentalFee">
        Bérlési díj: <span className="deviceDetailsPageFtDay">{device.price || device.dailyPrice} Ft / nap</span>
      </h3>
      <BookingCalendar device={device} />
    </div>
  );
}