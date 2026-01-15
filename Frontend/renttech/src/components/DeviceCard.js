export default function DeviceCard({ device }) {
  return (
   <div
  style={{
    width: "300px",
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    animation: "fadeInUp 0.8s ease forwards",
    opacity: 0
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.2)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
  }}
>

      <img
        src={device.imageUrl}
        alt={device.name}
        style={{ width: "100%", height: "180px", objectFit: "cover" }}
      />

      <div style={{ padding: "15px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>{device.name}</h3>
        <p style={{ margin: "0 0 15px 0", color: "#555" }}>{device.description}</p>

        <a
          href={`/devices/${device.id}`}
          style={{
            display: "inline-block",
            padding: "10px 16px",
            background: "#1976d2",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "500"
          }}
        >
          Részletek
        </a>
      </div>
    </div>
  );
}
