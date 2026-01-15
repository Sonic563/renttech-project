import { useParams } from "react-router-dom";

const dummyDevices = [
  {
    id: 1,
    name: "Dell Latitude 5420",
    description: "Erős üzleti laptop projektmunkákhoz.",
    longDescription:
      "Ez a laptop ideális választás irodai munkához, programozáshoz, prezentációkhoz és projektmunkákhoz. Gyors SSD, erős processzor és hosszú akkumulátoridő.",
    price: 4500,
    imageUrl: "https://via.placeholder.com/600x400?text=Laptop"
  },
  {
    id: 2,
    name: "Epson EB-X06 Projektor",
    description: "Prezentációkhoz ideális, nagy fényerejű projektor.",
    longDescription:
      "Tökéletes választás oktatáshoz, prezentációkhoz és kisebb rendezvényekhez. Nagy fényerő, éles kép, könnyű kezelhetőség.",
    price: 6000,
    imageUrl: "https://via.placeholder.com/600x400?text=Projektor"
  },
  {
    id: 3,
    name: "Canon EOS 250D Kamera",
    description: "Fotózáshoz és videózáshoz, profi minőség.",
    longDescription:
      "Kiváló minőségű DSLR kamera, kezdőknek és haladóknak egyaránt. Tiszta kép, jó fókusz, könnyű kezelhetőség.",
    price: 7000,
    imageUrl: "https://via.placeholder.com/600x400?text=Kamera"
  }
];

export default function DeviceDetailsPage() {
  const { id } = useParams();
  const device = dummyDevices.find((d) => d.id === Number(id));

  if (!device) {
    return <h2 style={{ padding: "40px" }}>Eszköz nem található.</h2>;
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        color: "white"
      }}
    >
      <img
        src={device.imageUrl}
        alt={device.name}
        style={{
          width: "100%",
          borderRadius: "12px",
          marginBottom: "20px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
        }}
      />

      <h1>{device.name}</h1>
      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        {device.longDescription}
      </p>

      <h3 style={{ marginBottom: "20px" }}>
        Bérlési díj: <span style={{ color: "#00eaff" }}>{device.price} Ft / nap</span>
      </h3>

      <button
        style={{
          padding: "14px 28px",
          background: "#00bcd4",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          cursor: "pointer",
          transition: "0.3s"
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#00d4f0")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#00bcd4")}
      >
        Foglalás indítása
      </button>
    </div>
  );
}
