import { Link } from "react-router-dom";
import "./DeviceCard.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export default function DeviceCard({ device }) {
  if (!device) return null;

  const rawCategory =
    typeof device.category === "string"
      ? device.category
      : device.category?.name || "eszköz";

  const normalizedCategory = rawCategory.toLowerCase();

  const getCategoryLabel = (category) => {
    switch (category) {
      case "laptop":
      case "laptopok":
        return "Laptop";
      case "camera":
      case "kamerák":
        return "Kamera";
      case "projector":
      case "projektorok":
        return "Projektor";
      case "vr":
        return "VR eszköz";
      case "audio":
        return "Hangtechnika";
      case "tablet":
      case "tabletek":
        return "Tablet";
      case "other":
      case "egyeb":
      case "egyéb":
        return "Egyéb eszköz";
      default:
        return "Eszköz";
    }
  };

  const categoryIcons = {
    laptop: "💻",
    laptopok: "💻",
    camera: "📷",
    kamerák: "📷",
    projector: "📽️",
    projektorok: "📽️",
    vr: "🕶️",
    audio: "🔊",
    tablet: "📱",
    tabletek: "📱",
    other: "🧰",
    egyeb: "🧰",
  };

  const getShortDescription = (text, maxLength = 180) => {
    if (!text) return "Nincs leírás.";
    const cleanText = String(text).replace(/\s+/g, " ").trim();
    return cleanText.length > maxLength
      ? cleanText.slice(0, maxLength) + "..."
      : cleanText;
  };

  let imageUrl = null;

if (device.imageUrl && typeof device.imageUrl === "string") {
  imageUrl = device.imageUrl.startsWith("http")
    ? device.imageUrl
    : `http://localhost:8080${device.imageUrl}`;
} else if (device.imageBase64 && typeof device.imageBase64 === "string") {
  imageUrl = device.imageBase64;
}

  const price = Number(
    device.dailyPrice !== undefined ? device.dailyPrice : device.price || 0
  );

  const priceText = new Intl.NumberFormat("hu-HU").format(price);

  return (
    <div className="dc-card">
      <div className="dc-imageContainer">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={device.name}
            className="dc-image"
            onError={(e) => {
              e.target.style.display = "none";
              const fallback = e.target.parentElement.querySelector(".dc-noImage");
              if (fallback) fallback.style.display = "flex";
            }}
          />
        ) : null}

        <div
          className="dc-noImage"
          style={{ display: imageUrl ? "none" : "flex" }}
        >
          Nincs kép
        </div>

        <div className="dc-category">
          <span>{categoryIcons[normalizedCategory] || "📦"}</span>
          <span>{getCategoryLabel(normalizedCategory)}</span>
        </div>
      </div>

      <div className="dc-content">
        <h3 className="dc-title">{device.name}</h3>

   <div className="dc-description">
  <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {getShortDescription(device.description)}
  </ReactMarkdown>
</div>

        <div className="dc-footer">
          <div className="dc-price">
            <span className="dc-priceLabel">Bérlési díj</span>

            <span
              className="dc-pricePill"
              aria-label={`Bérlési díj ${priceText} forint per nap`}
            >
              <span className="dc-priceAmount">{priceText}</span>
              <span className="dc-priceUnit">Ft/nap</span>
            </span>
          </div>

          <Link to={`/devices/${device.id}`} className="dc-button">
            Részletek &amp; Foglalás
          </Link>
        </div>
      </div>
    </div>
  );
}