package com.example.backend.service;

import com.example.backend.dto.LoginRequest;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Optional;
import java.util.UUID;

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
                         String phone, String birthDate,
                         String image) {
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
        u.setImage(image);

        return userRepository.save(u);
    }

    /** Legacy – dùng bởi login form cũ nếu còn. */
    public boolean login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        return userOpt.map(u -> u.getPassword().equals(request.getPassword())).orElse(false);
    }

    /** Cập nhật thông tin người dùng. */
    public User updateUser(Long userId, String firstName, String lastName, String email, String phone, String birthDate, MultipartFile image) throws IOException {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return null;
        }
        User user = userOpt.get();

        if (firstName != null && !firstName.trim().isEmpty()) {
            user.setFirstName(firstName.trim());
        }
        if (lastName != null && !lastName.trim().isEmpty()) {
            user.setLastName(lastName.trim());
        }
        if (email != null && !email.trim().isEmpty()) {
            user.setEmail(email.trim());
        }
        if (phone != null && !phone.trim().isEmpty()) {
            user.setPhone(phone.trim());
        }
        if (birthDate != null && !birthDate.trim().isEmpty()) {
            user.setBirthDate(birthDate.trim());
        }
        if (image != null && !image.isEmpty()) {
            // Lưu file ảnh
            String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(image.getInputStream(), filePath);
            user.setImage("/uploads/images/" + fileName);
        }

        return userRepository.save(user);
    }

    /** Đổi mật khẩu người dùng. */
    public User changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return null; // Người dùng không tồn tại
        }

        User user = userOpt.get();

        // Kiểm tra mật khẩu cũ có đúng không
        if (!user.getPassword().equals(oldPassword)) {
            return null; // Mật khẩu cũ không chính xác
        }

        // Cập nhật mật khẩu mới
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

    /** Xóa ảnh đại diện của người dùng. */
    public User deleteUserImage(Long userId) throws IOException {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();

        // Xóa file ảnh nếu tồn tại
        if (user.getImage() != null && !user.getImage().isEmpty()) {
            try {
                // Xây dựng path chính xác: thêm "uploads/images/" nếu user.getImage() chỉ trả về filename
                String imagePath = user.getImage();
                String uploadDir = System.getProperty("user.dir") + File.separator + "uploads" + File.separator + "images" + File.separator;
                
                // Nếu imagePath chứa full path thì extract filename
                String filename;
                if (imagePath.contains("/")) {
                    filename = imagePath.substring(imagePath.lastIndexOf("/") + 1);
                } else {
                    filename = imagePath;
                }
                
                Path filePath = Paths.get(uploadDir + filename);
                System.out.println("Cố gắng xóa file: " + filePath.toString());
                
                if (Files.exists(filePath)) {
                    Files.delete(filePath);
                    System.out.println("Đã xóa file thành công: " + filePath.toString());
                } else {
                    System.out.println("File không tồn tại: " + filePath.toString());
                }
            } catch (Exception e) {
                System.err.println("Lỗi xóa file: " + e.getMessage());
                e.printStackTrace();
            }
        }

        // Cập nhật image thành null
        user.setImage(null);
        return userRepository.save(user);
    }
}