package hu.nyirszikszi.renttech.model;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class Role {


    public static final String ADMIN = "ADMIN";
    public static final String USER = "USER";


    public static final String ROLE_PREFIX = "ROLE_";


    public static final String ROLE_ADMIN = ROLE_PREFIX + ADMIN;
    public static final String ROLE_USER = ROLE_PREFIX + USER;


    public static boolean isAdmin(User user) {
        return user != null && User.UserRole.ADMIN.equals(user.getRole());
    }

    public static boolean isUser(User user) {
        return user != null && User.UserRole.USER.equals(user.getRole());
    }

    public static boolean hasAdminRole(String role) {
        return ADMIN.equals(role) || ROLE_ADMIN.equals(role);
    }
}