package hu.nyirszikszi.renttech.dto;

import hu.nyirszikszi.renttech.model.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserDTOTest {

    @Test
    void fromEntity_null_returnsNull() {
        assertNull(UserDTO.fromEntity(null));
    }

    @Test
    void fromEntity_mapsAllFields() {
        LocalDateTime created = LocalDateTime.of(2026, 4, 20, 10, 0, 0);
        LocalDateTime updated = LocalDateTime.of(2026, 4, 20, 12, 30, 0);

        User user = User.builder()
                .id(1L)
                .email("u@u.com")
                .password("secret")
                .fullName("User Name")
                .phone("061234567")
                .role(User.UserRole.ADMIN)
                .createdAt(created)
                .updatedAt(updated)
                .build();

        UserDTO dto = UserDTO.fromEntity(user);

        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("u@u.com", dto.getEmail());
        assertEquals("User Name", dto.getFullName());
        assertEquals("061234567", dto.getPhone());
        assertEquals(User.UserRole.ADMIN, dto.getRole());
        assertEquals(created, dto.getCreatedAt());
        assertEquals(updated, dto.getUpdatedAt());
    }
}