import { createContext, useContext, useState } from "react";
import { mockUsers, getFullName } from "../data/mockData";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = mockUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      const { password: _, ...safe } = found;
      // Thêm fullName tiện dùng trong UI
      const userWithFullName = { ...safe, fullName: getFullName(safe) };
      setUser(userWithFullName);
      return { success: true, user: userWithFullName };
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
