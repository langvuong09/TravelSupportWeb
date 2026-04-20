import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ChatboxAI from "./components/ChatboxAI";

import Home from "./pages/home/Home";
import Locations from "./pages/location/Locations";
import LocationDetail from "./pages/location/LocationDetail";
import MyBookings from "./pages/tour/MyBookings";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Profile from "./pages/profile/Profile";
import CreateTour from "./pages/tour/CreateTour";
import TourDetail from "./pages/tour/TourDetail";

import AdminPages from "./pages/admin/AdminPages";

function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user)
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
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
  return children;
}

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ChatboxAI />
      <footer
        style={{
          background: "#0f172a",
          color: "rgba(255,255,255,0.55)",
          padding: "32px 24px",
          textAlign: "center",
          fontSize: 13,
          marginTop: 60,
        }}
      >
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 18,
              marginBottom: 8,
              color: "#fff",
              fontWeight: 800,
            }}
          >
            ✈ TravelSupport
          </div>
          <p style={{ margin: "0 0 8px" }}>
            Website hỗ trợ khám phá địa điểm du lịch thông minh
          </p>
          <p style={{ margin: 0, fontSize: 12 }}>
            © 2026 · Đồ án chuyên ngành · Trường Đại học Sài Gòn
          </p>
        </div>
      </footer>
    </>
  );
}

function AdminLayout({ children }) {
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <Layout>
            <Home />
          </Layout>
        }
        path="/"
      />
      <Route
        element={
          <Layout>
            <Login />
          </Layout>
        }
        path="/login"
      />
      <Route
        element={
          <Layout>
            <Register />
          </Layout>
        }
        path="/register"
      />

      <Route
        path="/locations"
        element={
          <Layout>
            <RequireAuth>
              <Locations />
            </RequireAuth>
          </Layout>
        }
      />
      <Route
        path="/locations/:id"
        element={
          <Layout>
            <RequireAuth>
              <LocationDetail />
            </RequireAuth>
          </Layout>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <Layout>
            <RequireUser>
              <MyBookings />
            </RequireUser>
          </Layout>
        }
      />
      <Route
        path="/tours/:tourId"
        element={
          <Layout>
            <RequireUser>
              <TourDetail />
            </RequireUser>
          </Layout>
        }
      />
      <Route
        path="/create-tour"
        element={
          <Layout>
            <RequireUser>
              <CreateTour />
            </RequireUser>
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <RequireAuth>
              <Profile />
            </RequireAuth>
          </Layout>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AdminLayout>
            <RequireAdmin>
              <AdminPages />
            </RequireAdmin>
          </AdminLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
