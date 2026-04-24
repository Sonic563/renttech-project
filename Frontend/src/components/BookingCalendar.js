import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import './BookingCalendar.css';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import CheckoutModal from '../components/CheckoutModal';

function toYmd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(date, n) {
  const x = new Date(date);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
}

export default function BookingCalendar({ device }) {
  const { user } = useAuth();
  const { createBooking, getDeviceBookings } = useBooking();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [deviceBookings, setDeviceBookings] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!device?.id) return;
      const data = await getDeviceBookings(device.id);
      if (!cancelled) {
        setDeviceBookings(Array.isArray(data) ? data : []);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [device?.id, getDeviceBookings]);

  const disabledDates = useMemo(() => {
    const out = [];

    for (const booking of deviceBookings) {
      if (!booking?.startDate || !booking?.endDate) continue;
      if (String(booking.status || '').toLowerCase() === 'lemondva') continue;

      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      for (let date = new Date(startDate); date <= endDate; date = addDays(date, 1)) {
        out.push(new Date(date));
      }
    }

    return out;
  }, [deviceBookings]);

  const { days: totalDays, price: totalPrice } = useMemo(() => {
    if (!start || !end) return { days: 0, price: 0 };

    const ms = end.getTime() - start.getTime();
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1;
    const dailyPrice = Number(device?.dailyPrice ?? device?.price ?? 0);

    return {
      days,
      price: days * dailyPrice,
    };
  }, [device?.dailyPrice, device?.price, end, start]);

  const handleOpenCheckout = () => {
    setError('');
    setSuccess('');

    if (!start || !end) {
      setError('Kérjük, válassz dátumot!');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    setShowCheckout(true);
  };

  const handleSubmitOrder = async (checkoutData) => {
    setError('');
    setSuccess('');

    const bookingData = {
      userId: user.id,
      deviceId: device.id,
      startDate: toYmd(start),
      endDate: toYmd(end),
      days: totalDays,
      totalPrice,
      customerName: checkoutData.customerName,
      phone: checkoutData.phone,
      deliveryMethod: checkoutData.deliveryMethod,
      shippingZip: checkoutData.shippingZip,
      shippingCity: checkoutData.shippingCity,
      shippingAddress: checkoutData.shippingAddress,
      note: checkoutData.note,
      paymentMethod: checkoutData.paymentMethod,
      paymentStatus: checkoutData.paymentStatus,
    };

    const result = await createBooking(bookingData);

    if (!result?.success) {
      setError(result?.error || 'Hiba történt a rendelés leadása során!');
      setShowCheckout(false);
      return;
    }

    setShowCheckout(false);
    setSuccess('Megrendelés leadva! Admin visszaigazolásra vár.');
    setTimeout(() => navigate('/bookings'), 1500);
  };

  return (
    <div className="bookingCalendar">
      <h3>Foglalás: {device?.name}</h3>
      <p className="devicePrice">{Number(device?.dailyPrice ?? device?.price ?? 0)} Ft / nap</p>

      {error && <div className="errorMessage">{error}</div>}
      {success && <div className="successMessage">{success}</div>}

      <div className="dateSelection">
        <div className="dateInputGroup">
          <label>Kezdő dátum:</label>
          <DatePicker
            selected={start}
            onChange={(date) => {
              setStart(date);
              if (end && date && end < date) {
                setEnd(null);
              }
            }}
            selectsStart
            startDate={start}
            endDate={end}
            minDate={new Date()}
            excludeDates={disabledDates}
            dateFormat="yyyy-MM-dd"
            placeholderText="Válassz"
          />
        </div>

        <div className="dateInputGroup">
          <label>Végső dátum:</label>
          <DatePicker
            selected={end}
            onChange={(date) => setEnd(date)}
            selectsEnd
            startDate={start}
            endDate={end}
            minDate={start || new Date()}
            excludeDates={disabledDates}
            dateFormat="yyyy-MM-dd"
            placeholderText="Válassz"
            disabled={!start}
          />
        </div>
      </div>

      {start && end && (
        <div className="bookingSummary">
          <p>Napok: {totalDays} nap</p>
          <p className="totalPrice">Összesen: {totalPrice} Ft</p>
        </div>
      )}

      <button onClick={handleOpenCheckout} disabled={!start || !end} className="bookButton">
        {user ? 'Megrendelés leadása' : 'Bejelentkezés a rendeléshez'}
      </button>

      {showCheckout && (
        <CheckoutModal
          price={totalPrice}
          userEmail={user?.email}
          onClose={() => setShowCheckout(false)}
          onSubmit={handleSubmitOrder}
        />
      )}
    </div>
  );
}
