import { createContext, useContext, useState } from 'react';
import { bookingAPI } from '../services/Api';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);

  const getUserBookings = async (userId) => {
    try {
      if (!token) return [];
      const data = await bookingAPI.getUserBookings(userId, token);
      return Array.isArray(data) ? data : data?.content || [];
    } catch (err) {
      console.error('Hiba a foglalások betöltésekor:', err);
      return [];
    }
  };

  const getDeviceBookings = async (deviceId) => {
    try {
   
      const data = await bookingAPI.getDeviceBookings(deviceId, token);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Hiba az eszköz foglalásainak lekérésekor:', err);
      return [];
    }
  };

  const createBooking = async (data) => {
    try {
      const created = await bookingAPI.create(data, token);
      setBookings((prev) => [...prev, created]);
      return { success: true, data: created };
    } catch (err) {
      return { success: false, error: err?.message || 'Foglalás sikertelen' };
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status, token);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
      );
      return { success: true };
    } catch (err) {
      console.error('Hiba a státusz frissítésekor:', err);
      return { success: false, error: err?.message || 'Státusz frissítés hiba' };
    }
  };

  const cancelBooking = async (id) => {
    try {
      await bookingAPI.cancel(id, token);
      return { success: true };
    } catch (err) {
      console.error('Hiba a foglalás lemondásakor:', err);
      return { success: false, error: err?.message || 'Lemondás hiba' };
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        cancelBooking,
        createBooking,
        getUserBookings,
        getDeviceBookings,
        updateBookingStatus,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};