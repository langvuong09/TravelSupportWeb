import { createContext, useContext, useState } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:8080";

const AuthContext = createContext(null);

// Helper lấy fullName từ user object trả về từ API
function buildFullName(user) {
  const first = user.firstName || "";
  const last  = user.lastName  || "";
  const full  = `${first} ${last}`.trim();
  return full || user.username || "Người dùng";
}

export function AuthProvider({ children }) {
  // Khôi phục session từ localStorage (để refresh trang không bị logout)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ts_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        return { success: false, message: "Lỗi phản hồi từ server" };
      }

      if (!data.success) {
        return { success: false, message: data.message || "Sai tên đăng nhập hoặc mật khẩu!" };
      }

      const apiUser = data.user;
      const enriched = {
        ...apiUser,
        fullName: buildFullName(apiUser),
      };

      setUser(enriched);
      localStorage.setItem("ts_user", JSON.stringify(enriched));
      return { success: true, user: enriched };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Không thể kết nối tới server. Hãy chắc chắn backend đang chạy." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ts_user");
  };

  const updateUser = async (userId, updateData) => {
    try {
      const formData = new FormData();
      formData.append('firstName', updateData.firstName || '');
      formData.append('lastName', updateData.lastName || '');
      formData.append('email', updateData.email || '');
      formData.append('phone', updateData.phone || '');
      formData.append('birthDate', updateData.birthDate || '');
      if (updateData.imageFile) {
        formData.append('image', updateData.imageFile);
      }

      const res = await fetch(`${API}/api/user/${userId}`, {
        method: "PUT",
        body: formData,
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        return { success: false, message: "Lỗi phản hồi từ server" };
      }

      if (!data.success) {
        return { success: false, message: data.message || "Cập nhật thất bại!" };
      }

      const apiUser = data.user;
      const enriched = {
        ...apiUser,
        fullName: buildFullName(apiUser),
      };

      setUser(enriched);
      localStorage.setItem("ts_user", JSON.stringify(enriched));
      return { success: true, user: enriched };
    } catch (err) {
      console.error("Update user error:", err);
      return { success: false, message: "Không thể kết nối tới server." };
    }
  };

  const changePassword = async (userId, oldPassword, newPassword, confirmPassword) => {
    try {
      const res = await fetch(`${API}/api/change-password/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          oldPassword, 
          newPassword, 
          confirmPassword 
        }),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        return { success: false, message: "Lỗi phản hồi từ server" };
      }

      if (!data.success) {
        return { success: false, message: data.message || "Đổi mật khẩu thất bại!" };
      }

      return { success: true, message: data.message || "Đổi mật khẩu thành công!" };
    } catch (err) {
      console.error("Change password error:", err);
      return { success: false, message: "Không thể kết nối tới server." };
    }
  };

  const deleteUserImage = async (userId) => {
    try {
      const res = await fetch(`${API}/api/user/${userId}/image`, {
        method: "DELETE",
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        return { success: false, message: "Lỗi phản hồi từ server" };
      }

      if (!data.success) {
        return { success: false, message: data.message || "Xóa ảnh thất bại!" };
      }

      const apiUser = data.user;
      const enriched = {
        ...apiUser,
        fullName: buildFullName(apiUser),
      };

      setUser(enriched);
      localStorage.setItem("ts_user", JSON.stringify(enriched));
      return { success: true, message: data.message || "Xóa ảnh thành công!" };
    } catch (err) {
      console.error("Delete image error:", err);
      return { success: false, message: "Không thể kết nối tới server." };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, changePassword, deleteUserImage }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);