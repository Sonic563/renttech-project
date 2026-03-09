import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';
import './BookingCalendar.css';

export default function BookingCalendar({ device }) {
  const { user } = useAuth();
  const { createBooking, getDeviceBookings, isDateAvailable } = useBooking();
  const navigate = useNavigate();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBooking = async () => {
    setError('');
    setSuccess('');
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!startDate || !endDate) {
      setError('Kérjük, válassz dátumot!');
      return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setError('A kezdődátum nem lehet későbbi, mint a végdátum!');
      return;
    }
    
    if (start < new Date().setHours(0,0,0,0)) {
      setError('A foglalás nem kezdődhet múltbeli dátummal!');
      return;
    }
    
    // Dátum elérhetőség ellenőrzése
    const available = await isDateAvailable(device.id, startDate, endDate);
    if (!available) {
      setError('A kiválasztott időszak már foglalt!');
      return;
    }
    
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = device.price * days;
    
    const bookingData = {
      userId: user.id,
      deviceId: device.id,
      startDate,
      endDate,
      days,
      totalPrice
    };
    
    try {
      await createBooking(bookingData);
      setSuccess(`Sikeres foglalás! ${totalPrice} Ft`);
      
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err) {
      setError('Hiba történt a foglalás során!');
    }
  };

  return (
    <div className="bookingCalendar">
      <h3>Foglalás: {device.name}</h3>
      <p className="devicePrice">{device.price} Ft / nap</p>
      
      {error && <div className="errorMessage">{error}</div>}
      {success && <div className="successMessage">{success}</div>}
      
      <div className="dateSelection">
        <div className="dateInputGroup">
          <label>Kezdő dátum:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="dateInputGroup">
          <label>Végső dátum:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      {startDate && endDate && (
        <div className="bookingSummary">
          <p>Napok: {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} nap</p>
          <p className="totalPrice">
            Összesen: {device.price * (Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1)} Ft
          </p>
        </div>
      )}
      
      <button 
        onClick={handleBooking}
        disabled={!startDate || !endDate || !user}
        className="bookButton"
      >
        {user ? 'Foglalás' : 'Bejelentkezés a foglaláshoz'}
      </button>
    </div>
  );
}