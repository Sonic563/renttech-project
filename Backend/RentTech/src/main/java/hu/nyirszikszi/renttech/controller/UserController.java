package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.dto.ChangePasswordRequest;
import hu.nyirszikszi.renttech.dto.UpdateProfileRequest;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("A felhasználó nem található."));
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        userService.registerUser(user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ) {
        User updated = userService.updateUserProfile(id, request);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(id, request);
        return ResponseEntity.ok("Jelszó frissítve");
    }
}