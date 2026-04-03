package com.example.backend.controller;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.dto.ChangePasswordRequest;
import com.example.backend.service.AuthService;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


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

    @PutMapping(value = "/user/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Object updateUser(@PathVariable Long id,
                             @RequestParam(value = "firstName", required = false) String firstName,
                             @RequestParam(value = "lastName", required = false) String lastName,
                             @RequestParam(value = "email", required = false) String email,
                             @RequestParam(value = "phone", required = false) String phone,
                             @RequestParam(value = "birthDate", required = false) String birthDate,
                             @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            var updatedUser = authService.updateUser(id, firstName, lastName, email, phone, birthDate, image);
            if (updatedUser == null) {
                return Map.of("success", false, "message", "Người dùng không tồn tại!");
            }
            return Map.of(
                "success", true,
                "user", Map.of(
                    "id",        updatedUser.getId(),
                    "username",  updatedUser.getUsername(),
                    "firstName", updatedUser.getFirstName() != null ? updatedUser.getFirstName() : "",
                    "lastName",  updatedUser.getLastName()  != null ? updatedUser.getLastName()  : "",
                    "email",     updatedUser.getEmail()     != null ? updatedUser.getEmail()     : "",
                    "phone",     updatedUser.getPhone()     != null ? updatedUser.getPhone()     : "",
                    "birthDate", updatedUser.getBirthDate() != null ? updatedUser.getBirthDate() : "",
                    "image",     updatedUser.getImage()     != null ? updatedUser.getImage()     : "",
                    "role",      updatedUser.getRole()      != null ? updatedUser.getRole()      : "USER"
                )
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", "Lỗi cập nhật: " + e.getMessage());
        }
    }

    @PostMapping("/change-password/{id}")
    public Object changePassword(@PathVariable Long id,
                                 @RequestBody ChangePasswordRequest request) {
        // Kiểm tra validation
        if (request.getOldPassword() == null || request.getOldPassword().isBlank()) {
            return Map.of("success", false, "message", "Mật khẩu cũ không được để trống!");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            return Map.of("success", false, "message", "Mật khẩu mới không được để trống!");
        }
        if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
            return Map.of("success", false, "message", "Xác nhận mật khẩu không được để trống!");
        }

        // Kiểm tra mật khẩu mới và xác nhận có trùng nhau không
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return Map.of("success", false, "message", "Mật khẩu mới và xác nhận không trùng khớp!");
        }

        // Kiểm tra mật khẩu mới không được giống mật khẩu cũ
        if (request.getOldPassword().equals(request.getNewPassword())) {
            return Map.of("success", false, "message", "Mật khẩu mới không được trùng với mật khẩu cũ!");
        }

        // Gọi service để đổi mật khẩu
        var updatedUser = authService.changePassword(id, request.getOldPassword(), request.getNewPassword());
        
        if (updatedUser == null) {
            return Map.of("success", false, "message", "Mật khẩu cũ không chính xác hoặc người dùng không tồn tại!");
        }

        return Map.of(
            "success", true,
            "message", "Đổi mật khẩu thành công!",
            "user", Map.of(
                "id", updatedUser.getId(),
                "username", updatedUser.getUsername()
            )
        );
    }

    @DeleteMapping("/user/{id}/image")
    public Object deleteUserImage(@PathVariable Long id) {
        try {
            var updatedUser = authService.deleteUserImage(id);
            if (updatedUser == null) {
                return Map.of("success", false, "message", "Người dùng không tồn tại!");
            }
            return Map.of(
                "success", true,
                "message", "Xóa ảnh thành công!",
                "user", Map.of(
                    "id", updatedUser.getId(),
                    "username", updatedUser.getUsername(),
                    "firstName", updatedUser.getFirstName() != null ? updatedUser.getFirstName() : "",
                    "lastName", updatedUser.getLastName() != null ? updatedUser.getLastName() : "",
                    "email", updatedUser.getEmail() != null ? updatedUser.getEmail() : "",
                    "phone", updatedUser.getPhone() != null ? updatedUser.getPhone() : "",
                    "birthDate", updatedUser.getBirthDate() != null ? updatedUser.getBirthDate() : "",
                    "image", updatedUser.getImage() != null ? updatedUser.getImage() : "",
                    "role", updatedUser.getRole() != null ? updatedUser.getRole() : "USER"
                )
            );
        } catch (Exception e) {
            return Map.of("success", false, "message", "Lỗi xóa ảnh: " + e.getMessage());
        }
    }
}