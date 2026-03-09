import { createContext, useContext, useState } from 'react';
import { bookingAPI } from '../services/Api';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Felhasználó foglalásainak lekérése
  const getUserBookings = async (userId) => {
    try {
      if (!token) return [];
      const data = await bookingAPI.getUserBookings(userId, token);
      const bookingsData = Array.isArray(data) ? data : data?.content || [];
      setBookings(bookingsData);
      return bookingsData;
    } catch (err) {
      console.error('Hiba a foglalások betöltésekor:', err);
      return [];
    }
  };

  // Foglalás státusz frissítése
  const updateBookingStatus = async (bookingId, status) => {
    try {
      await bookingAPI.updateStatus(bookingId, status, token);
      // Ha sikerült, frissítsük a helyi listát is
      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status } : b)
      );
      return { success: true };
    } catch (err) {
      console.error('Hiba a státusz frissítésekor:', err);
      return { success: false, error: err.message };
    }
  };

  const createBooking = async (data) => {
    try {
      await bookingAPI.create(data, token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addToCart = (item) => {
    setCart([...cart, { ...item, id: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <BookingContext.Provider value={{
      cart,
      bookings,
      addToCart,
      removeFromCart,
      clearCart,
      createBooking,
      getUserBookings,        // <- HIÁNYZOTT
      updateBookingStatus     // <- HIÁNYZOTT
    }}>
      {children}
    </BookingContext.Provider>
  );
};