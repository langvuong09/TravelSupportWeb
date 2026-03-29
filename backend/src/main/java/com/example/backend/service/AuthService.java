package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    /** Xác thực đăng nhập – so sánh plain text (demo, chưa hash). */
    public User authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
    }

    /** Kiểm tra username đã tồn tại chưa. */
    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    /**
     * Đăng ký tài khoản mới.
     * Role luôn là USER – không cho phép client tự set ADMIN.
     */
    public User register(String username, String password,
                         String fullName, String email,
                         String phone, String birthDate) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password);

        // Tách họ tên: phần cuối là tên, phần trước là họ
        if (fullName != null && !fullName.isBlank()) {
            String[] parts = fullName.trim().split("\\s+");
            if (parts.length > 1) {
                u.setLastName(parts[parts.length - 1]);
                u.setFirstName(String.join(" ", Arrays.copyOfRange(parts, 0, parts.length - 1)));
            } else {
                u.setFirstName(fullName.trim());
                u.setLastName("");
            }
        }

        u.setEmail(email);
        u.setPhone(phone);
        u.setBirthDate(birthDate);
        u.setRole("USER"); // Luôn USER, không nhận từ client

        return userRepository.save(u);
    }

    /** Legacy – dùng bởi login form cũ nếu còn. */
    public boolean login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        return userOpt.map(u -> u.getPassword().equals(request.getPassword())).orElse(false);
    }
}