import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Ic, Avatar } from "./UI";
import { useState } from "react";
import "./Navbar.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

const PUBLIC_NAV = [
  { path: "/",          label: "Trang chủ", icon: <Ic.Home /> },
  { path: "/locations", label: "Địa điểm",  icon: <Ic.Map /> },
];

const USER_NAV = [
  { path: "/",             label: "Trang chủ",  icon: <Ic.Home /> },
  { path: "/locations",    label: "Địa điểm",   icon: <Ic.Map /> },
  { path: "/create-tour",  label: "Tạo tour",   icon: <Ic.Plus /> },
  { path: "/my-bookings",  label: "Tours list",   icon: <Ic.Bookmark /> },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = !user
    ? PUBLIC_NAV
    : USER_NAV;

  const handleLogout = () => {
    logout();
    nav("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✈</span>
          <span className="logo-text">TravelSupport</span>
        </Link>

        <div className="navbar-links">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${loc.pathname === item.path ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>

        <div className="navbar-auth">
          {!user ? (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Đăng nhập</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Đăng ký</Link>
            </>
          ) : (
            <div className="user-menu">
              <button className="user-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                <Avatar name={user.fullName || user.username} size={34} avatarUrl={user.image ? `${API}${user.image}` : null} />
                <div className="user-info">
                  <span className="user-name">{user.fullName || user.username}</span>
                  <span className="user-role">{user.role}</span>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"
                  style={{ transform: menuOpen ? "rotate(180deg)" : "", transition: "0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {menuOpen && (
                <div className="user-dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                    <Ic.User /> Hồ sơ cá nhân
                  </Link>
                  {user.role === "ADMIN" && (
                    <>
                      <div className="dropdown-divider" />
                      <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <Ic.Dashboard /> Quản lý Admin
                      </Link>
                    </>
                  )}
                  {user.role === "USER" && (
                    <>
                      <Link to="/create-tour" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <Ic.Plus /> Tạo tour tùy chỉnh
                      </Link>
                      <Link to="/my-bookings" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <Ic.Bookmark /> Đặt tour của tôi
                      </Link>
                    </>
                  )}
                  <div className="dropdown-divider" />
                  <button className="dropdown-item danger" onClick={handleLogout}>
                    <Ic.Logout /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}