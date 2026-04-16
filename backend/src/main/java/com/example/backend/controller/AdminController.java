package com.example.backend.controller;

import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.dto.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    /** Lấy danh sách tất cả người dùng */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "users", users.stream().map(user -> Map.of(
                    "user_id", user.getUserId(),
                    "username", user.getUsername(),
                    "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                    "lastName", user.getLastName() != null ? user.getLastName() : "",
                    "email", user.getEmail() != null ? user.getEmail() : "",
                    "phone", user.getPhone() != null ? user.getPhone() : "",
                    "birthDate", user.getBirthDate() != null ? user.getBirthDate() : "",
                    "role", user.getRole() != null ? user.getRole() : "USER",
                    "image", user.getImage() != null ? user.getImage() : ""
                )).toList()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Lỗi khi lấy danh sách người dùng: " + e.getMessage()
            ));
        }
    }

    /** Cập nhật thông tin người dùng */
    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                       @ModelAttribute UpdateUserRequest request,
                                       @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Người dùng không tồn tại!"
                ));
            }

            User user = userOpt.get();

            if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
                user.setFirstName(request.getFirstName().trim());
            }
            if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
                user.setLastName(request.getLastName().trim());
            }
            if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
                user.setEmail(request.getEmail().trim());
            }
            if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
                user.setPhone(request.getPhone().trim());
            }
            if (request.getBirthDate() != null && !request.getBirthDate().trim().isEmpty()) {
                user.setBirthDate(request.getBirthDate().trim());
            }
            if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
                user.setRole(request.getRole().trim());
            }

            // Xử lý upload ảnh nếu có
            if (image != null && !image.isEmpty()) {
                // Xóa ảnh cũ nếu có
                if (user.getImage() != null && !user.getImage().isEmpty()) {
                    try {
                        String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
                        String filename = user.getImage().contains("/") ?
                            user.getImage().substring(user.getImage().lastIndexOf("/") + 1) : user.getImage();
                        java.nio.file.Path oldFilePath = java.nio.file.Paths.get(uploadDir + filename);
                        if (java.nio.file.Files.exists(oldFilePath)) {
                            java.nio.file.Files.delete(oldFilePath);
                        }
                    } catch (Exception e) {
                        System.err.println("Lỗi xóa ảnh cũ: " + e.getMessage());
                    }
                }

                // Upload ảnh mới
                String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                String fileName = java.util.UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
                java.nio.file.Path filePath = uploadPath.resolve(fileName);
                java.nio.file.Files.copy(image.getInputStream(), filePath);
                user.setImage("/uploads/images/" + fileName);
            }

            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Cập nhật người dùng thành công!",
                "user", Map.of(
                    "user_id", savedUser.getUserId(),
                    "username", savedUser.getUsername(),
                    "firstName", savedUser.getFirstName() != null ? savedUser.getFirstName() : "",
                    "lastName", savedUser.getLastName() != null ? savedUser.getLastName() : "",
                    "email", savedUser.getEmail() != null ? savedUser.getEmail() : "",
                    "phone", savedUser.getPhone() != null ? savedUser.getPhone() : "",
                    "birthDate", savedUser.getBirthDate() != null ? savedUser.getBirthDate() : "",
                    "role", savedUser.getRole() != null ? savedUser.getRole() : "USER",
                    "image", savedUser.getImage() != null ? savedUser.getImage() : ""
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Lỗi cập nhật người dùng: " + e.getMessage()
            ));
        }
    }

    /** Xóa người dùng */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Người dùng không tồn tại!"
                ));
            }

            User user = userOpt.get();

            // Không cho phép xóa admin
            if ("ADMIN".equals(user.getRole())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Không thể xóa tài khoản admin!"
                ));
            }

            // Xóa ảnh nếu có
            if (user.getImage() != null && !user.getImage().isEmpty()) {
                try {
                    String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
                    String filename = user.getImage().contains("/") ?
                        user.getImage().substring(user.getImage().lastIndexOf("/") + 1) : user.getImage();
                    java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + filename);
                    if (java.nio.file.Files.exists(filePath)) {
                        java.nio.file.Files.delete(filePath);
                    }
                } catch (Exception e) {
                    System.err.println("Lỗi xóa ảnh: " + e.getMessage());
                }
            }

            userRepository.deleteById(id);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Xóa người dùng thành công!"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Lỗi xóa người dùng: " + e.getMessage()
            ));
        }
    }
}