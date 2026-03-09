import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './BookingCart.css';

export default function BookingCart() {
  const { cart, removeFromCart, clearCart, createBooking, loading } = useBooking();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [bookingStatus, setBookingStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    setIsProcessing(true);
    setBookingStatus('');

    try {
      // Foglalások létrehozása
      for (const item of cart) {
        await createBooking({
          userId: user.id,
          deviceId: item.device.id,
          startDate: item.startDate,
          endDate: item.endDate,
          days: item.days,
          totalPrice: item.totalPrice
        });
      }

      setBookingStatus('Sikeres foglalás!');
      clearCart();
      
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (error) {
      console.error('Hiba a foglalás során:', error);
      setBookingStatus('Hiba történt. Kérlek próbáld újra!');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="emptyCart">
        <p>A kosár üres</p>
        <button onClick={() => navigate('/devices')} className="browseButton">
          Eszközök böngészése
        </button>
      </div>
    );
  }

  return (
    <div className="bookingCart">
      <h2>Foglalási kosár ({cart.length} eszköz)</h2>
      
      {bookingStatus && (
        <div className={`statusMessage ${bookingStatus.includes('Hiba') ? 'error' : 'success'}`}>
          {bookingStatus}
        </div>
      )}
      
      <div className="cartItems">
        {cart.map(item => (
          <div key={item.id} className="cartItem">
            <div className="cartItemInfo">
              <h3>{item.device.name}</h3>
              <p>Időtartam: {item.startDate} - {item.endDate}</p>
              <p>Napok: {item.days}</p>
              <p>Ár/nap: {item.device.price} Ft</p>
            </div>
            <div className="cartItemPrice">
              <strong>{item.totalPrice} Ft</strong>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="removeButton"
                disabled={isProcessing}
              >
                Törlés
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cartSummary">
        <div className="totalRow">
          <span>Összesen:</span>
          <strong>{calculateTotal()} Ft</strong>
        </div>
        
        <div className="cartActions">
          <button 
            onClick={clearCart} 
            className="secondaryButton"
            disabled={isProcessing}
          >
            Kosár ürítése
          </button>
          <button 
            onClick={handleCheckout} 
            className="primaryButton"
            disabled={isProcessing || loading}
          >
            {isProcessing ? 'Feldolgozás...' : 'Foglalás megerősítése'}
          </button>
        </div>
      </div>
    </div>
  );
}