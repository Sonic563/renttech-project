import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import './UserBookings.css';

export default function UserBookings() {
  const { user } = useAuth();
  const { getUserBookings, updateBookingStatus } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadBookings = async () => {
    if (user) {
      const data = await getUserBookings(user.id);
      setBookings(data);
    }
    setLoading(false);
  };
  loadBookings();
}, [user, getUserBookings]);

const handleCancelBooking = async (bookingId) => {
  if (window.confirm('Biztosan le szeretnéd mondani ezt a foglalást?')) {
    await updateBookingStatus(bookingId, 'lemondva');
    const updated = await getUserBookings(user.id);
    setBookings(updated);
  }
};

  if (loading) {
    return <div className="loading">Betöltés...</div>;
  }

  if (!user) {
    return (
      <div className="notLoggedIn">
        <h2>Kérjük, jelentkezz be a foglalások megtekintéséhez!</h2>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.status === 'függőben' || b.status === 'megerősített');
  const pastBookings = bookings.filter(b => b.status === 'teljesítve' || b.status === 'lemondva');

  return (
    <div className="userBookings">
      <h1>Foglalásaim</h1>
      
      <div className="bookingsOverview">
        <div className="overviewCard">
          <h3>Aktív foglalások</h3>
          <p className="count">{activeBookings.length}</p>
        </div>
        <div className="overviewCard">
          <h3>Teljesített</h3>
          <p className="count">{pastBookings.filter(b => b.status === 'teljesítve').length}</p>
        </div>
        <div className="overviewCard">
          <h3>Összes foglalás</h3>
          <p className="count">{bookings.length}</p>
        </div>
      </div>

      <div className="bookingsSection">
        <h2>Aktív foglalások</h2>
        {activeBookings.length === 0 ? (
          <p className="noBookings">Nincsenek aktív foglalásaid.</p>
        ) : (
          <div className="bookingsList">
            {activeBookings.map(booking => (
              <div key={booking.id} className="bookingCard">
                <div className="bookingHeader">
                  <h3>{booking.deviceName}</h3>
                  <span className={`status ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="bookingDetails">
                  <p><strong>Foglalás dátuma:</strong> {new Date(booking.bookingDate).toLocaleDateString('hu-HU')}</p>
                  <p><strong>Időtartam:</strong> {booking.startDate} - {booking.endDate}</p>
                  <p><strong>Napok:</strong> {booking.days}</p>
                  <p><strong>Összeg:</strong> {booking.totalPrice} Ft</p>
                </div>
                <div className="bookingActions">
                  {booking.status === 'függőben' && (
                    <button 
                      onClick={() => handleCancelBooking(booking.id)}
                      className="cancelButton"
                    >
                      Foglalás lemondása
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bookingsSection">
        <h2>Korábbi foglalások</h2>
        {pastBookings.length === 0 ? (
          <p className="noBookings">Nincsenek korábbi foglalásaid.</p>
        ) : (
          <div className="bookingsList">
            {pastBookings.map(booking => (
              <div key={booking.id} className="bookingCard past">
                <div className="bookingHeader">
                  <h3>{booking.deviceName}</h3>
                  <span className={`status ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="bookingDetails">
                  <p><strong>Foglalás dátuma:</strong> {new Date(booking.bookingDate).toLocaleDateString('hu-HU')}</p>
                  <p><strong>Időtartam:</strong> {booking.startDate} - {booking.endDate}</p>
                  <p><strong>Státusz:</strong> {booking.status}</p>
                  <p><strong>Összeg:</strong> {booking.totalPrice} Ft</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}