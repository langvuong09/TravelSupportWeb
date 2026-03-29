package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Arrays;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public boolean login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Với demo: so sánh thẳng password (sau này mã hóa)
            return user.getPassword().equals(request.getPassword());
        }
        return false;
    }

    public boolean existsByUsername(String username) {
        return userRepository.findByUsername(username).isPresent();
    }

    public User register(String username, String password, String fullName, String email, String phone, String birthDate) {
        User u = new User();
        u.setUsername(username);
        u.setPassword(password);
        if (fullName != null) {
            String[] parts = fullName.trim().split(" ");
            if (parts.length > 1) {
                String first = String.join(" ", Arrays.copyOfRange(parts, 0, parts.length - 1));
                String last = parts[parts.length - 1];
                u.setFirstName(first);
                u.setLastName(last);
            } else {
                u.setFirstName(fullName);
                u.setLastName("");
            }
        }
        u.setEmail(email);
        u.setPhone(phone);
        u.setBirthDate(birthDate);
        u.setRole("USER");
        return userRepository.save(u);
    }

    public User authenticate(String username, String password) {
        return userRepository.findByUsername(username)
                .filter(u -> u.getPassword().equals(password))
                .orElse(null);
    }
}