import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Ic, Avatar } from "./UI";
import { useState } from "react";
import "./Navbar.css";

const ADMIN_NAV = [
  { path: "/admin",           label: "Dashboard",  icon: <Ic.Dashboard /> },
  { path: "/admin/locations", label: "Địa điểm",   icon: <Ic.Map /> },
  { path: "/admin/foods",     label: "Ẩm thực",    icon: <Ic.Bookmark /> },
  { path: "/admin/provinces", label: "Tỉnh thành", icon: <Ic.Map /> },
  { path: "/admin/users",     label: "Người dùng", icon: <Ic.User /> },
];

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const loc = useLocation();
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">Admin Panel</span>
        </Link>

        <div className="navbar-links">
          {ADMIN_NAV.map((item) => (
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
          {user && (
            <div className="user-menu">
              <button className="user-trigger" onClick={() => setMenuOpen(!menuOpen)}>
                <Avatar name={user.fullName || user.username} size={34} />
                <div className="user-info">
                  <span className="user-name">{user.fullName || user.username}</span>
                  <span className="user-role">Admin</span>
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
                  <button onClick={handleLogout} className="dropdown-item" style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}>
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
