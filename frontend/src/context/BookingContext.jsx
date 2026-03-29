import { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem("ts_bookings");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Lưu vào localStorage mỗi khi bookings thay đổi
  useEffect(() => {
    localStorage.setItem("ts_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const addBooking = (booking) => {
    const newBooking = {
      id: `b-${Date.now()}`,
      bookingDate: new Date().toISOString().split("T")[0],
      status: "confirmed", // ← Trực tiếp confirmed, không cần duyệt
      ...booking,
    };
    setBookings((prev) => [...prev, newBooking]);
    return newBooking;
  };

  const getBookingsByUser = (userId) => {
    return bookings.filter((b) => b.userId === userId);
  };

  const updateBooking = (bookingId, updates) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b))
    );
  };

  const deleteBooking = (bookingId) => {
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, getBookingsByUser, updateBooking, deleteBooking }}>
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
