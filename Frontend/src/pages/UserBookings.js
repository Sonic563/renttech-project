import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import './UserBookings.css';

export default function UserBookings() {
  const { user } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const norm = (s) => String(s || '').toLowerCase();

  const ACTIVE_STATUSES = useMemo(
    () =>
      new Set([
        'függőben',
        'megerősített', 
        'jóváhagyva', 
        'elfogadva',
        'szállítás alatt',
      ]),
    [],
  );

  const CLOSED_STATUSES = useMemo(
    () => new Set(['teljesítve', 'lemondva', 'elutasítva']),
    [],
  );

  const loadBookings = useCallback(async () => {
    if (user) {
      const data = await getUserBookings(user.id);
      setBookings(Array.isArray(data) ? data : []);
    } else {
      setBookings([]);
    }
    setLoading(false);
  }, [getUserBookings, user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!user) return;
    if (window.confirm('Biztosan le szeretnéd mondani ezt a foglalást?')) {
      await cancelBooking(bookingId);
      const updated = await getUserBookings(user.id);
      setBookings(Array.isArray(updated) ? updated : []);
    }
  };

  const { activeBookings, pastBookings, completedCount } = useMemo(() => {
    const active = [];
    const past = [];

    for (const b of bookings) {
      const s = norm(b.status);

      if (ACTIVE_STATUSES.has(s)) active.push(b);
      else if (CLOSED_STATUSES.has(s)) past.push(b);
      else active.push(b);
    }

    const byDateDesc = (a, b) =>
      new Date(b.bookingDate || 0).getTime() - new Date(a.bookingDate || 0).getTime();

    active.sort(byDateDesc);
    past.sort(byDateDesc);

    const completed = past.filter((x) => norm(x.status) === 'teljesítve').length;

    return { activeBookings: active, pastBookings: past, completedCount: completed };
  }, [bookings, ACTIVE_STATUSES, CLOSED_STATUSES]);

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
          <p className="count">{completedCount}</p>
        </div>

        <div className="overviewCard">
          <h3>Összes foglalás</h3>
          <p className="count">{bookings.length}</p>
        </div>

        <div className="overviewCard">
          
          <h3>Frissítés</h3>
          <button
            className='refreshOverviewButton'
            style={{ width: '100%' }}
            onClick={loadBookings}
          >
            🔄 Újratöltés
          </button>
        </div>
      </div>

      <div className="bookingsSection">
        <h2>Aktív foglalások</h2>

        {activeBookings.length === 0 ? (
          <p className="noBookings">Nincsenek aktív foglalásaid.</p>
        ) : (
          <div className="bookingsList">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="bookingCard">
                <div className="bookingHeader">
                  <h3>{booking.deviceName}</h3>
                  <span className={`status ${norm(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="bookingDetails">
                  <p>
                    <strong>Foglalás dátuma:</strong>{' '}
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString('hu-HU')
                      : '-'}
                  </p>
                  <p>
                    <strong>Időtartam:</strong> {booking.startDate} – {booking.endDate}
                  </p>
                  <p>
                    <strong>Napok:</strong> {booking.days}
                  </p>
                  <p>
                    <strong>Összeg:</strong> {booking.totalPrice} Ft
                  </p>

                  {booking.paymentMethod && (
                    <p>
                      <strong>Fizetés:</strong>{' '}
                      {String(booking.paymentMethod).toUpperCase() === 'CARD'
                        ? 'Bankkártya'
                        : 'Utánvét'}
                      {booking.paymentStatus
                        ? ` · ${
                            String(booking.paymentStatus).toUpperCase() === 'PAID'
                              ? 'Fizetve'
                              : 'Fizetésre vár'
                          }`
                        : ''}
                    </p>
                  )}
                </div>

                <div className="bookingActions">
                  {norm(booking.status) === 'függőben' && (
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
            {pastBookings.map((booking) => (
              <div key={booking.id} className="bookingCard past">
                <div className="bookingHeader">
                  <h3>{booking.deviceName}</h3>
                  <span className={`status ${norm(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="bookingDetails">
                  <p>
                    <strong>Foglalás dátuma:</strong>{' '}
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleDateString('hu-HU')
                      : '-'}
                  </p>
                  <p>
                    <strong>Időtartam:</strong> {booking.startDate} – {booking.endDate}
                  </p>
                  <p>
                    <strong>Státusz:</strong> {booking.status}
                  </p>
                  <p>
                    <strong>Összeg:</strong> {booking.totalPrice} Ft
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}