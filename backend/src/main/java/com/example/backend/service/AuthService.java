package com.example.backend.service;

import com.example.backend.dto.request.LoginRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
}