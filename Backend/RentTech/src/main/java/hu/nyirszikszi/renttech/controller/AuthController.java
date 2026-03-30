package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.dto.LoginRequest;
import hu.nyirszikszi.renttech.dto.RegisterRequest;
import hu.nyirszikszi.renttech.dto.UserDTO;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor

public class AuthController {

    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!userService.passwordMatches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Password mismatch");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("user", UserDTO.fromEntity(user));
            response.put("token", "temp-token-" + System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User newUser = User.builder()
                    .email(request.getEmail())
                    .password(request.getPassword())
                    .fullName(request.getFullName())
                    .phone(request.getPhone())
                    .role(User.UserRole.USER)
                    .build();

            User savedUser = userService.registerUser(newUser);

            Map<String, Object> response = new HashMap<>();
            response.put("user", UserDTO.fromEntity(savedUser));
            response.put("token", "temp-token-" + System.currentTimeMillis());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
