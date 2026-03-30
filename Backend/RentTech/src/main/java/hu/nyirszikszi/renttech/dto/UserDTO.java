package hu.nyirszikszi.renttech.dto;

import hu.nyirszikszi.renttech.model.User;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String email;
    private String fullName;
    private String phone;
    private User.UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public static UserDTO fromEntity(User user) {
        if (user == null) return null;

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}

