package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.service.AuthService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Object login(@RequestBody LoginRequest request) {
        var user = authService.authenticate(request.getUsername(), request.getPassword());
        if (user == null) return Map.of("success", false, "message", "Invalid username or password");
        // return safe user info (omit password)
        return Map.of(
            "success", true,
            "user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "role", user.getRole()
            )
        );
    }

    @PostMapping("/register")
    public Object register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String fullName = body.get("fullName");
        String email = body.get("email");
        String phone = body.get("phone");
        String birthDate = body.get("birthDate");

        if (username == null || password == null) return Map.of("error", "username and password required");

        if (authService.existsByUsername(username)) {
            return Map.of("error", "username_taken");
        }

        var user = authService.register(username, password, fullName, email, phone, birthDate);
        return Map.of("success", true, "user", Map.of("id", user.getId(), "username", user.getUsername(), "role", user.getRole()));
    }
}