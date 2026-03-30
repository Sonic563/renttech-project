package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.dto.ChangePasswordRequest;
import hu.nyirszikszi.renttech.dto.UpdateProfileRequest;
import hu.nyirszikszi.renttech.dto.UserDTO;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok().body(user))
                .orElse(ResponseEntity.status(404).body("User not found"));
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long id,
            @RequestBody UpdateProfileRequest request
    ) {
        try {
            User updated = userService.updateUserProfile(id, request);
            return ResponseEntity.ok(UserDTO.fromEntity(updated));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping("/password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request
    ) {
        try {
            userService.changePassword(id, request);
            return ResponseEntity.ok("Password updated");
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}
