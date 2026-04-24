package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.dto.LoginRequest;
import hu.nyirszikszi.renttech.dto.RegisterRequest;
import hu.nyirszikszi.renttech.dto.UserDTO;
import hu.nyirszikszi.renttech.exception.ResourceNotFoundException;
import hu.nyirszikszi.renttech.exception.UnauthorizedException;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.security.JwtService;
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
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található"));

        if (!userService.passwordMatches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("A jelszó nem egyezik");
        }

        String token = jwtService.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", UserDTO.fromEntity(user));
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User savedUser = userService.registerUserFromRequest(request);
        String token = jwtService.generateToken(savedUser);

        Map<String, Object> response = new HashMap<>();
        response.put("user", UserDTO.fromEntity(savedUser));
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException("Missing token");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);

        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!jwtService.isTokenValid(token, user)) {
            throw new UnauthorizedException("Invalid token");
        }

        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }
}
