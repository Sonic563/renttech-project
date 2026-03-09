import { Link } from 'react-router-dom';
import './DeviceCard.css';

export default function DeviceCard({ device }) {
  // Kategória felirat fordítása
  const getCategoryLabel = (category) => {
    switch(category) {
      case 'laptop': return 'Laptop';
      case 'camera': return 'Kamera';
      case 'projector': return 'Projektor';
      case 'vr': return 'VR eszköz';
      case 'audio': return 'Hangtechnika';
      case 'tablet': return 'Tablet';
      default: return 'Eszköz';
    }
  };

  // Kategória ikonok
  const categoryIcons = {
    laptop: '💻',
    camera: '📷',
    projector: '📽️',
    vr: '🕶️',
    audio: '🔊',
    tablet: '📱'
  };

  return (
    <div className="deviceCard">
      <div className="deviceCardImageContainer">
        <img
          src={device.imageUrl}
          alt={device.name}
          className="deviceCardImage"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://via.placeholder.com/400x300?text=${device.category}`;
          }}
        />
        <div className="deviceCardCategory">
          <span>{categoryIcons[device.category] || '📦'}</span>
          <span>{getCategoryLabel(device.category)}</span>
        </div>
      </div>

      <div className="deviceCardContent">
        <h3 className="deviceCardTitle">{device.name}</h3>
        <p className="deviceCardDescription">{device.description}</p>
        
        {device.features && device.features.length > 0 && (
          <div className="deviceFeatures">
            {device.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="featureTag">
                {feature}
              </span>
            ))}
          </div>
        )}
        
        <div className="deviceCardFooter">
          <div className="devicePrice">
            <span className="priceLabel">Bérlési díj</span>
            <span className="priceValue">{device.price} Ft/nap</span>
          </div>
          
          <Link
            to={`/devices/${device.id}`}
            className="deviceCardButton"
          >
            Részletek & Foglalás
          </Link>
        </div>
      </div>
    </div>
  );
}