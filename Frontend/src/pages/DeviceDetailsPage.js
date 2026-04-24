import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { assetAPI } from "../services/Api";
import "./DeviceDetailsPage.css";
import ReactMarkdown from "react-markdown";
import BookingCalendar from "../components/BookingCalendar";

function getCategoryLabel(category) {
  const raw =
    typeof category === "string"
      ? category.toLowerCase()
      : category?.name?.toLowerCase() || "";

  switch (raw) {
    case "laptop":
    case "laptopok":
      return "Laptopok";
    case "camera":
    case "kamera":
    case "kamerák":
      return "Kamerák";
    case "projector":
    case "projektor":
    case "projektorok":
      return "Projektorok";
    case "vr":
      return "VR eszközök";
    case "audio":
    case "hang":
    case "hangtechnika":
      return "Hangtechnika";
    case "tablet":
    case "tabletek":
      return "Tabletek";
    case "other":
    case "egyeb":
    case "egyéb":
    case "egyéb eszközök":
      return "Egyéb eszközök";
    default:
      return typeof category === "string"
        ? category
        : category?.name || "Eszköz";
  }
}

export default function DeviceDetailsPage() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    assetAPI
      .getById(id)
      .then((data) => {
        setDevice(data);
        setLoading(false);
      })
      .catch(() => {
        const saved = JSON.parse(localStorage.getItem("adminDevices") || "[]");
        const found = Array.isArray(saved)
          ? saved.find((item) => String(item.id) === String(id))
          : null;

        setDevice(found || null);
        setLoading(false);
      });
  }, [id]);

  const imageUrl = useMemo(() => {
    if (!device) return null;
    if (device.imageUrl && typeof device.imageUrl === "string") return device.imageUrl;
    if (device.imageBase64 && typeof device.imageBase64 === "string") return device.imageBase64;
    return null;
  }, [device]);

  const price = Number(
    device?.dailyPrice !== undefined ? device.dailyPrice : device?.price || 0
  );

  const priceText = new Intl.NumberFormat("hu-HU").format(price);

  const shortDescription = device?.description || "";
  const detailedDescription = device?.extraDescription || "";

  if (loading) {
    return <div className="deviceDetailsPageLoading">Betöltés...</div>;
  }

  if (!device) {
    return (
      <div className="deviceDetailsPageStateWrap">
        <div className="deviceDetailsPageStateCard">
          <h2>Az eszköz nem található</h2>
          <Link to="/devices" className="deviceDetailsPageBackButton">
            Vissza az eszközökhöz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="deviceDetailsPage">
      <div className="deviceDetailsPageContainer">
        <div className="deviceDetailsPageHero">
          <div className="deviceDetailsPageImageCard">
            <div className="deviceDetailsPageImageWrap">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={device.name}
                  className="deviceDetailsPageImage"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.parentElement.querySelector(
                      ".deviceDetailsNoImage"
                    );
                    if (fallback) fallback.style.display = "flex";
                  }}
                />
              ) : null}

              <div
                className="deviceDetailsNoImage"
                style={{ display: imageUrl ? "none" : "flex" }}
              >
                Nincs kép feltöltve
              </div>
            </div>
          </div>

          <div className="deviceDetailsPageSummaryCard">
            <p className="deviceDetailsPageEyebrow">Eszköz részletei</p>

            <div className="deviceDetailsPageHeroTop">
              <div className="deviceDetailsPageHeroMain">
                <h1 className="deviceDetailsPageTitle">{device.name}</h1>
              </div>

             
            </div>
          
           <div className="deviceDetailsPagePriceBox">
                <span className="deviceDetailsPagePriceLabel">Bérlési díj</span>
                <span className="deviceDetailsPagePrice">{priceText} Ft / nap</span>
              </div>
            <div className="deviceDetailsPageMetaGrid">
              
              <div className="deviceDetailsMetaCard">
                
                <span className="deviceDetailsMetaLabel">Kategória</span>
                <span className="deviceDetailsMetaValue">
                  {getCategoryLabel(device.category)}
                </span>
              </div>

              <div className="deviceDetailsMetaCard">
                <span className="deviceDetailsMetaLabel">Állapot</span>
                <span className="deviceDetailsMetaValue">
                  {device.availability || "Ismeretlen"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="deviceDetailsPageDescriptionCard">
          <div className="deviceDetailsPageSectionHeader">
            <h2>Leírás</h2>
          </div>

          {shortDescription ? (
            <div className="deviceDetailsShortDescription">
            <ReactMarkdown>{shortDescription}</ReactMarkdown>
          </div>
          ) : null}

              <div className="deviceDetailsLongDescription">
        <ReactMarkdown>
          {detailedDescription || "Nincs részletes leírás ehhez az eszközhöz."}
        </ReactMarkdown>
      </div>
        </div>

<BookingCalendar device={device} />

        <div className="deviceDetailsPageActions">
  <Link to="/devices" className="deviceDetailsPageBackButton">
    Vissza az eszközökhöz
  </Link>
</div>


  
      </div>
    </div>
  );
}