package hu.nyirszikszi.renttech.service;

import hu.nyirszikszi.renttech.dto.ChangePasswordRequest;
import hu.nyirszikszi.renttech.dto.RegisterRequest;
import hu.nyirszikszi.renttech.dto.UpdateProfileRequest;
import hu.nyirszikszi.renttech.exception.BadRequestException;
import hu.nyirszikszi.renttech.exception.ConflictException;
import hu.nyirszikszi.renttech.exception.ResourceNotFoundException;
import hu.nyirszikszi.renttech.exception.UnauthorizedException;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUserFromRequest(RegisterRequest request) {
        if (request == null) {
            throw new BadRequestException("Hiányzik a kérés törzse (request body).");
        }

        String emailRaw = request.getEmail();
        validateEmailStrictLowercase(emailRaw);
        String email = emailRaw.trim().toLowerCase();

        String pw = request.getPassword() == null ? null : request.getPassword().trim();
        String cpw = request.getConfirmPassword() == null ? null : request.getConfirmPassword().trim();

        if (pw == null || pw.isBlank()) {
            throw new BadRequestException("A jelszó megadása kötelező.");
        }
        if (cpw == null || cpw.isBlank()) {
            throw new BadRequestException("A jelszó megerősítése kötelező.");
        }
        if (!pw.equals(cpw)) {
            throw new BadRequestException("A két jelszó nem egyezik.");
        }

        validatePasswordPolicy(pw);

        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new BadRequestException("A teljes név (fullName) megadása kötelező.");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Ezzel az email címmel már létezik felhasználó.");
        }

        User newUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(pw))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(User.UserRole.USER)
                .build();

        return userRepository.save(newUser);
    }

    public User registerUser(User user) {
        if (user == null) {
            throw new BadRequestException("Hiányzik a felhasználó adata (request body).");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new BadRequestException("Az email megadása kötelező.");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new BadRequestException("A jelszó megadása kötelező.");
        }

        String email = user.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Ezzel az email címmel már létezik felhasználó.");
        }

        validatePasswordPolicy(user.getPassword());

        User newUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(user.getPassword()))
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(User.UserRole.USER)
                .build();

        return userRepository.save(newUser);
    }

    public User registerAdmin(User user) {
        if (user == null) {
            throw new BadRequestException("Hiányzik a felhasználó adata (request body).");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new BadRequestException("Az email megadása kötelező.");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new BadRequestException("A jelszó megadása kötelező.");
        }

        String email = user.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Ezzel az email címmel már létezik felhasználó.");
        }

        validatePasswordPolicy(user.getPassword());

        User newUser = User.builder()
                .email(email)
                .password(passwordEncoder.encode(user.getPassword()))
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(User.UserRole.ADMIN)
                .build();

        return userRepository.save(newUser);
    }

    public User updateUser(Long id, User userDetails) {
        if (id == null) {
            throw new BadRequestException("A felhasználó azonosító (id) kötelező.");
        }
        if (userDetails == null) {
            throw new BadRequestException("Hiányzik a felhasználó adata (request body).");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + id));

        if (userDetails.getFullName() != null) {
            user.setFullName(userDetails.getFullName());
        }
        if (userDetails.getPhone() != null) {
            user.setPhone(userDetails.getPhone());
        }

        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            validatePasswordPolicy(userDetails.getPassword());
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        return userRepository.save(user);
    }

    public User updateUserProfile(Long id, UpdateProfileRequest request) {
        if (id == null) {
            throw new BadRequestException("A felhasználó azonosító (id) kötelező.");
        }
        if (request == null) {
            throw new BadRequestException("Hiányzik a kérés törzse (request body).");
        }
        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new BadRequestException("A teljes név (fullName) megadása kötelező.");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + id));

        user.setFullName(request.getFullName());
        return userRepository.save(user);
    }

    public void changePassword(Long id, ChangePasswordRequest request) {
        if (id == null) {
            throw new BadRequestException("A felhasználó azonosító (id) kötelező.");
        }
        if (request == null) {
            throw new BadRequestException("Hiányzik a kérés törzse (request body).");
        }
        if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
            throw new BadRequestException("A jelenlegi jelszó (currentPassword) megadása kötelező.");
        }
        if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
            throw new BadRequestException("Az új jelszó (newPassword) megadása kötelező.");
        }

        validatePasswordPolicy(request.getNewPassword());

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + id));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new UnauthorizedException("A jelenlegi jelszó hibás.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        if (email == null || email.isBlank()) {
            return Optional.empty();
        }
        return userRepository.findByEmail(email.trim().toLowerCase());
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(User.UserRole role) {
        if (role == null) {
            throw new BadRequestException("A szerepkör (role) megadása kötelező.");
        }
        return userRepository.findByRole(role);
    }

    public Optional<User> getUserById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return userRepository.findById(id);
    }

    public void deleteUser(Long id) {
        if (id == null) {
            throw new BadRequestException("A felhasználó azonosító (id) kötelező.");
        }
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Felhasználó nem található: " + id);
        }
        userRepository.deleteById(id);
    }

    public boolean passwordMatches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public boolean isAdmin(User user) {
        return user != null && User.UserRole.ADMIN.equals(user.getRole());
    }

    private void validateEmailStrictLowercase(String emailRaw) {
        if (emailRaw == null || emailRaw.isBlank()) {
            throw new BadRequestException("Az email megadása kötelező.");
        }

        String email = emailRaw.trim();

        if (!email.equals(email.toLowerCase())) {
            throw new BadRequestException("Az email cím csak kisbetűket tartalmazhat.");
        }

        long atCount = email.chars().filter(c -> c == '@').count();
        if (atCount != 1) {
            throw new BadRequestException("Az email címnek pontosan 1 darab @ jelet kell tartalmaznia.");
        }

        int at = email.indexOf('@');
        if (at <= 0 || at >= email.length() - 1) {
            throw new BadRequestException("Hibás email formátum.");
        }

        String domain = email.substring(at + 1);
        if (!domain.contains(".")) {
            throw new BadRequestException("Hibás email formátum (hiányzik a pont a domain részből).");
        }
        if (domain.startsWith(".") || domain.endsWith(".")) {
            throw new BadRequestException("Hibás email formátum.");
        }
    }

    private void validatePasswordPolicy(String pw) {
        if (pw == null || pw.isBlank()) {
            throw new BadRequestException("A jelszó megadása kötelező.");
        }
        if (pw.length() < 6) {
            throw new BadRequestException("A jelszónak legalább 6 karakter hosszúnak kell lennie.");
        }
        if (!pw.chars().anyMatch(Character::isUpperCase)) {
            throw new BadRequestException("A jelszónak tartalmaznia kell legalább 1 nagybetűt.");
        }
        if (!pw.chars().anyMatch(Character::isDigit)) {
            throw new BadRequestException("A jelszónak tartalmaznia kell legalább 1 számot.");
        }
    }
}