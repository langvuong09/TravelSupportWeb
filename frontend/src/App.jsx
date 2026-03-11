import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Public pages
import Home           from "./pages/public/Home";
import Locations      from "./pages/public/Locations";
import LocationDetail from "./pages/public/LocationDetail";
import Tours          from "./pages/public/Tours";
import TourDetail     from "./pages/public/TourDetail";
import Login          from "./pages/public/Login";
import Register       from "./pages/public/Register";

// User pages
import BookingForm from "./pages/user/BookingForm";
import MyBookings  from "./pages/user/MyBookings";
import MyReviews   from "./pages/user/MyReviews";
import Profile     from "./pages/user/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AdminUsers, AdminLocations, AdminTours, AdminBookings, AdminReviews } from "./pages/admin/AdminPages";

// ── Guards ──────────────────────────────────────────────────
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

// ── Layout ──────────────────────────────────────────────────
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

// ── App ─────────────────────────────────────────────────────
function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* ── PUBLIC (không cần đăng nhập) ─────────────────── */}
        <Route path="/"                    element={<Home />} />
        <Route path="/locations"           element={<Locations />} />
        <Route path="/locations/:id"       element={<LocationDetail />} />
        <Route path="/tours"               element={<Tours />} />
        <Route path="/tours/:id"           element={<TourDetail />} />
        <Route path="/login"               element={<Login />} />
        <Route path="/register"            element={<Register />} />

        {/* ── USER (cần đăng nhập, không phải admin) ─────── */}
        <Route path="/book/:tourId"  element={<RequireAuth><BookingForm /></RequireAuth>} />
        <Route path="/my-bookings"   element={<RequireUser><MyBookings /></RequireUser>} />
        <Route path="/my-reviews"    element={<RequireUser><MyReviews /></RequireUser>} />
        <Route path="/profile"       element={<RequireAuth><Profile /></RequireAuth>} />

        {/* ── ADMIN (cần đăng nhập + role ADMIN) ─────────── */}
        <Route path="/admin"               element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/users"         element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
        <Route path="/admin/locations"     element={<RequireAdmin><AdminLocations /></RequireAdmin>} />
        <Route path="/admin/tours"         element={<RequireAdmin><AdminTours /></RequireAdmin>} />
        <Route path="/admin/bookings"      element={<RequireAdmin><AdminBookings /></RequireAdmin>} />
        <Route path="/admin/reviews"       element={<RequireAdmin><AdminReviews /></RequireAdmin>} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
