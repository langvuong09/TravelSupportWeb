package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.service.AuthService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
// Cho phép cả localhost:3000 (dev) và bất kỳ origin nào (production)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest request) {
        var user = authService.authenticate(request.getUsername(), request.getPassword());
        if (user == null) {
            return Map.of("success", false, "message", "Sai tên đăng nhập hoặc mật khẩu!");
        }
        return Map.of(
            "success", true,
            "user", Map.of(
                "id",        user.getId(),
                "username",  user.getUsername(),
                "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                "lastName",  user.getLastName()  != null ? user.getLastName()  : "",
                "email",     user.getEmail()     != null ? user.getEmail()     : "",
                "image",     user.getImage()     != null ? user.getImage()     : "",
                "role",      user.getRole()      != null ? user.getRole()      : "USER"
            )
        );
    }

    @PostMapping("/register")
    public Object register(@RequestBody Map<String, String> body) {
        String username  = body.get("username");
        String password  = body.get("password");
        String fullName  = body.get("fullName");
        String email     = body.get("email");
        String phone     = body.get("phone");
        String birthDate = body.get("birthDate");
        String image     = body.get("image");

        if (username == null || username.isBlank()) {
            return Map.of("error", "username_required");
        }
        if (password == null || password.isBlank()) {
            return Map.of("error", "password_required");
        }

        if (authService.existsByUsername(username.trim())) {
            return Map.of("error", "username_taken");
        }

        // Luôn tạo với role USER (không nhận role từ client)
        var user = authService.register(
            username.trim(), password,
            fullName, email, phone, birthDate,
            image
        );

        return Map.of(
            "success", true,
            "user", Map.of(
                "id",       user.getId(),
                "username", user.getUsername(),
                "image",    user.getImage() != null ? user.getImage() : "",
                "role",     user.getRole()
            )
        );
    }
}