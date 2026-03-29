import { createContext, useContext, useState } from "react";
import { getFullName } from "../data/mockData";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Some server responses may be plain text (legacy). Try JSON first, fallback to text.
      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        // not JSON: accept some plain-text success messages as temporary fallback
        const plain = (text || "").trim();
        if (/success/i.test(plain)) {
          const role = username === "admin" ? "ADMIN" : "USER";
          const fallbackUser = { id: null, username, firstName: "", lastName: "", email: "", role };
          const userWithFullName = { ...fallbackUser, fullName: getFullName({ firstName: "", lastName: "", email: "" }) };
          setUser(userWithFullName);
          return { success: true, user: userWithFullName };
        }
        const msg = text || "Invalid server response";
        return { success: false, message: msg };
      }

      if (!data.success) return { success: false, message: data.message || "Sai tên đăng nhập hoặc mật khẩu!" };
      const user = data.user;
      const userWithFullName = { ...user, fullName: getFullName({ firstName: user.firstName, lastName: user.lastName, email: user.email }) };
      setUser(userWithFullName);
      return { success: true, user: userWithFullName };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Lỗi kết nối tới server" };
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
