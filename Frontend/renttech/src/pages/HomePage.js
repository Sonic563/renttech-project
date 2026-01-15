import DeviceCard from "../components/DeviceCard";
import CategorySection from "../components/CategorySection";

const fadeIn = {
  animation: "fadeIn 1.2s ease forwards",
  opacity: 0
};

const featuredDevices = [
  {
    id: 1,
    name: "Dell Latitude 5420",
    description: "Erős üzleti laptop projektmunkákhoz.",
    imageUrl: "laptop.jpg"
  },
  {
    id: 2,
    name: "Epson EB-X06 Projektor",
    description: "Prezentációkhoz ideális, nagy fényerejű projektor.",
    imageUrl: "projector.jpg"
  },
  {
    id: 3,
    name: "Canon EOS 250D Kamera",
    description: "Fotózáshoz és videózáshoz, profi minőség.",
    imageUrl: "camera.jpg"
  }
];

export default function HomePage() {
  return (
    <div
      style={{
        ...fadeIn,
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        padding: "60px 20px",
        textAlign: "center"
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
        RenTech – Elektronikai kölcsönzés
      </h1>

      <p style={{ fontSize: "20px", maxWidth: "600px", margin: "0 auto 40px" }}>
        Laptopok, kamerák, projektorok és további technikai eszközök gyorsan,
        egyszerűen, megbízhatóan.
      </p>
<CategorySection />
      <h2>Kiemelt eszközök</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
          marginTop: "20px"
        }}
      >
        {featuredDevices.map((device) => (
          <DeviceCard key={device.id} device={device} />
        ))}
      </div>

      <a
        href="/devices"
        style={{
          display: "inline-block",
          marginTop: "40px",
          padding: "14px 28px",
          background: "#00bcd4",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "20px",
          fontWeight: "600"
        }}
      >
        További eszközök böngészése
      </a>

      <div
        style={{
          marginTop: "80px",
          padding: "40px 20px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "12px",
          backdropFilter: "blur(6px)",
          maxWidth: "600px",
          marginLeft: "auto",
          marginRight: "auto",
          animation: "fadeIn 1.2s ease forwards",
          opacity: 0
        }}
      >
        <h2>Kapcsolat</h2>
        <p style={{ margin: "10px 0" }}>📍 Nyíregyháza</p>
        <p style={{ margin: "10px 0" }}>📞 +36 70 302 8139</p>
        <p style={{ margin: "10px 0" }}>✉ info@rentech.hu</p>
      </div>
    </div>
  );
}
