package hu.nyirszikszi.renttech.service;

import hu.nyirszikszi.renttech.dto.ChangePasswordRequest;
import hu.nyirszikszi.renttech.dto.UpdateProfileRequest;
import hu.nyirszikszi.renttech.exception.ConflictException;
import hu.nyirszikszi.renttech.exception.ResourceNotFoundException;
import hu.nyirszikszi.renttech.exception.UnauthorizedException;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    UserRepository userRepository;

    @Mock
    PasswordEncoder passwordEncoder;

    @InjectMocks
    UserService userService;

    @Captor
    ArgumentCaptor<User> userCaptor;

    @Test
    void registerUser_emailExists_throwsConflict() {
        User input = User.builder()
                .email("x@y.com")
                .password("Password1")
                .fullName("X")
                .phone("1")
                .build();

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> userService.registerUser(input));
        assertEquals("Ezzel az email címmel már létezik felhasználó.", ex.getMessage());

        verify(userRepository, never()).save(any());
        verifyNoInteractions(passwordEncoder);
    }

    @Test
    void registerUser_success_encodesPassword_setsUserRoleUser_andSaves() {
        User input = User.builder()
                .email("x@y.com")
                .password("Password1")
                .fullName("X")
                .phone("1")
                .build();

        when(userRepository.existsByEmail("x@y.com")).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("ENC(Password1)");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.registerUser(input);

        verify(userRepository).save(userCaptor.capture());
        User toSave = userCaptor.getValue();

        assertEquals("x@y.com", toSave.getEmail());
        assertEquals("ENC(Password1)", toSave.getPassword());
        assertEquals("X", toSave.getFullName());
        assertEquals("1", toSave.getPhone());
        assertEquals(User.UserRole.USER, toSave.getRole());

        assertEquals("x@y.com", saved.getEmail());
    }

    @Test
    void registerAdmin_success_setsRoleAdmin() {
        User input = User.builder()
                .email("admin@y.com")
                .password("Password1")
                .fullName("Admin")
                .phone("2")
                .build();

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("Password1")).thenReturn("ENC(Password1)");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.registerAdmin(input);

        verify(userRepository).save(userCaptor.capture());
        assertEquals(User.UserRole.ADMIN, userCaptor.getValue().getRole());
        assertEquals("ENC(Password1)", saved.getPassword());
        assertEquals("admin@y.com", saved.getEmail());
    }

    @Test
    void updateUser_notFound_throwsResourceNotFound() {
        when(userRepository.findById(123L)).thenReturn(Optional.empty());

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> userService.updateUser(123L, User.builder().fullName("N").build())
        );

        assertEquals("Felhasználó nem található: 123", ex.getMessage());
    }

    @Test
    void updateUser_passwordNullOrBlank_doesNotEncodePassword() {
        User existing = User.builder()
                .id(1L)
                .email("u@u.com")
                .password("OLD")
                .fullName("Old")
                .phone("0")
                .role(User.UserRole.USER)
                .build();

        User details = User.builder()
                .fullName("New Name")
                .phone("9")
                .password("   ")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.updateUser(1L, details);

        assertEquals("New Name", saved.getFullName());
        assertEquals("9", saved.getPhone());
        assertEquals("OLD", saved.getPassword());

        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository).save(existing);
    }

    @Test
    void updateUser_passwordProvided_encodesAndUpdatesPassword() {
        User existing = User.builder()
                .id(1L)
                .email("u@u.com")
                .password("OLD")
                .fullName("Old")
                .phone("0")
                .role(User.UserRole.USER)
                .build();

        User details = User.builder()
                .fullName("New Name")
                .phone("9")
                .password("NewPassword1")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(passwordEncoder.encode("NewPassword1")).thenReturn("ENC(NewPassword1)");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.updateUser(1L, details);

        assertEquals("ENC(NewPassword1)", saved.getPassword());
        verify(passwordEncoder).encode("NewPassword1");
        verify(userRepository).save(existing);
    }

    @Test
    void updateUserProfile_notFound_throwsResourceNotFound() {
        when(userRepository.findById(5L)).thenReturn(Optional.empty());

        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("X");

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> userService.updateUserProfile(5L, req)
        );

        assertEquals("Felhasználó nem található: 5", ex.getMessage());
    }

    @Test
    void updateUserProfile_success_updatesFullName() {
        User existing = User.builder()
                .id(5L)
                .email("u@u.com")
                .password("Password1")
                .fullName("Old")
                .build();

        when(userRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        UpdateProfileRequest req = new UpdateProfileRequest();
        req.setFullName("New");

        User saved = userService.updateUserProfile(5L, req);

        assertEquals("New", saved.getFullName());
        verify(userRepository).save(existing);
    }

    @Test
    void changePassword_notFound_throwsResourceNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("OldPassword1");
        req.setNewPassword("NewPassword1");

        ResourceNotFoundException ex = assertThrows(
                ResourceNotFoundException.class,
                () -> userService.changePassword(1L, req)
        );

        assertEquals("Felhasználó nem található: 1", ex.getMessage());
    }

    @Test
    void changePassword_currentPasswordIncorrect_throwsUnauthorized() {
        User existing = User.builder()
                .id(1L)
                .email("u@u.com")
                .password("ENC(OldPassword1)")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("OldPassword1", "ENC(OldPassword1)")).thenReturn(false);

        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("OldPassword1");
        req.setNewPassword("NewPassword1");

        UnauthorizedException ex = assertThrows(
                UnauthorizedException.class,
                () -> userService.changePassword(1L, req)
        );

        assertEquals("A jelenlegi jelszó hibás.", ex.getMessage());

        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any());
    }

    @Test
    void changePassword_success_encodesAndSaves() {
        User existing = User.builder()
                .id(1L)
                .email("u@u.com")
                .password("ENC(OldPassword1)")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("OldPassword1", "ENC(OldPassword1)")).thenReturn(true);
        when(passwordEncoder.encode("NewPassword1")).thenReturn("ENC(NewPassword1)");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        ChangePasswordRequest req = new ChangePasswordRequest();
        req.setCurrentPassword("OldPassword1");
        req.setNewPassword("NewPassword1");

        userService.changePassword(1L, req);

        assertEquals("ENC(NewPassword1)", existing.getPassword());
        verify(passwordEncoder).encode("NewPassword1");
        verify(userRepository).save(existing);
    }

    @Test
    void passwordMatches_delegatesToEncoder() {
        when(passwordEncoder.matches("raw", "enc")).thenReturn(true);

        assertTrue(userService.passwordMatches("raw", "enc"));

        verify(passwordEncoder).matches("raw", "enc");
    }

    @Test
    void isAdmin_nullUser_false() {
        assertFalse(userService.isAdmin(null));
    }

    @Test
    void isAdmin_userRoleUser_false() {
        User u = User.builder().role(User.UserRole.USER).build();
        assertFalse(userService.isAdmin(u));
    }

    @Test
    void isAdmin_userRoleAdmin_true() {
        User u = User.builder().role(User.UserRole.ADMIN).build();
        assertTrue(userService.isAdmin(u));
    }
}