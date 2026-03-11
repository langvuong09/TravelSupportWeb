import { createContext, useContext, useState } from "react";
import { mockUsers } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null = chưa đăng nhập

  const login = (username, password) => {
    const found = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      const { password: _, ...safe } = found;
      setUser(safe);
      return { success: true, user: safe };
    }
    return { success: false, message: "Sai tên đăng nhập hoặc mật khẩu!" };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
