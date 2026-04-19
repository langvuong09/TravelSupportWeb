import { createContext, useContext, useState, useEffect } from "react";
import { createBooking, getMyBookings, updateBookingStatus } from "../services/api";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async (userId) => {
    if (!userId) return;
    setLoading(true);
    const data = await getMyBookings(userId);
    setBookings(data);
    setLoading(false);
  };

  const addBooking = async (bookingData) => {
    const newBooking = await createBooking(bookingData);
    if (newBooking) {
      setBookings((prev) => [newBooking, ...prev]);
      return newBooking;
    }
    return null;
  };

  const updateStatus = async (bookingId, status) => {
    const updated = await updateBookingStatus(bookingId, status);
    if (updated) {
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? updated : b))
      );
      return updated;
    }
    return null;
  };

  return (
    <BookingContext.Provider value={{ bookings, loading, fetchBookings, addBooking, updateStatus }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return ctx;
}
