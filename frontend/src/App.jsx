import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookingProvider } from "./context/BookingContext";
import Navbar from "./components/Navbar";

import Home           from "./pages/public/Home";
import Locations      from "./pages/public/Locations";
import LocationDetail from "./pages/public/LocationDetail";
import Login          from "./pages/public/Login";
import Register       from "./pages/public/Register";

import BookingForm from "./pages/user/BookingForm";
import MyBookings  from "./pages/user/MyBookings";
import MyReviews   from "./pages/user/MyReviews";
import Profile     from "./pages/user/Profile";
import CreateTour  from "./pages/user/CreateTour";

import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminUsers, AdminLocations, AdminTours, AdminBookings, AdminReviews } from "./pages/admin/AdminPages";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

function RequireUser({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer style={{
        background: "#0f172a", color: "rgba(255,255,255,0.55)",
        padding: "32px 24px", textAlign: "center", fontSize: 13, marginTop: 60,
      }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div style={{ fontSize: 18, marginBottom: 8, color: "#fff", fontWeight: 800 }}>✈ TravelSupport</div>
          <p style={{ margin: "0 0 8px" }}>Website hỗ trợ khám phá địa điểm du lịch thông minh</p>
          <p style={{ margin: 0, fontSize: 12 }}>© 2026 · Đồ án chuyên ngành · Trường Đại học Sài Gòn</p>
        </div>
      </footer>
    </>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/locations"     element={<RequireAuth><Locations /></RequireAuth>} />
        <Route path="/locations/:id" element={<RequireAuth><LocationDetail /></RequireAuth>} />

        <Route path="/create-tour"  element={<RequireUser><CreateTour /></RequireUser>} />
        <Route path="/book/:tourId" element={<RequireUser><BookingForm /></RequireUser>} />
        <Route path="/my-bookings"  element={<RequireUser><MyBookings /></RequireUser>} />
        <Route path="/my-reviews"   element={<RequireUser><MyReviews /></RequireUser>} />
        <Route path="/profile"      element={<RequireAuth><Profile /></RequireAuth>} />

        <Route path="/admin"           element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/users"     element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
        <Route path="/admin/locations" element={<RequireAdmin><AdminLocations /></RequireAdmin>} />
        <Route path="/admin/tours"     element={<RequireAdmin><AdminTours /></RequireAdmin>} />
        <Route path="/admin/bookings"  element={<RequireAdmin><AdminBookings /></RequireAdmin>} />
        <Route path="/admin/reviews"   element={<RequireAdmin><AdminReviews /></RequireAdmin>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <AppRoutes />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}