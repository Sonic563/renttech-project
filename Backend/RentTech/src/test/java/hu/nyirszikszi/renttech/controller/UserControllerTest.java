package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.security.JwtAuthFilter;
import hu.nyirszikszi.renttech.security.JwtService;
import hu.nyirszikszi.renttech.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = UserController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)

class UserControllerTest {

    @Autowired MockMvc mockMvc;
    @MockBean JwtService jwtService;
    @MockBean JwtAuthFilter jwtAuthFilter;

    @MockBean UserService userService;

    @Test
    void getAllUsers_returnsList() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(
                User.builder().id(1L).email("a@a.com").fullName("A").password("x").build()
        ));

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(userService).getAllUsers();
    }

    @Test
    void getUserById_found_returns200() throws Exception {
        when(userService.getUserById(5L)).thenReturn(Optional.of(
                User.builder().id(5L).email("u@u.com").fullName("U").password("x").build()
        ));

        mockMvc.perform(get("/api/users/5"))
                .andExpect(status().isOk());

        verify(userService).getUserById(5L);
    }

    @Test
    void getUserById_notFound_returns404() throws Exception {
        when(userService.getUserById(5L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/users/5"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("User not found"));
    }

    @Test
    void createUser_callsRegisterUser() throws Exception {
        when(userService.registerUser(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        String json = "{"
                + "\"email\":\"x@y.com\","
                + "\"password\":\"pw\","
                + "\"fullName\":\"X\","
                + "\"phone\":\"1\""
                + "}";

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());

        verify(userService).registerUser(any(User.class));
    }

    @Test
    void updateProfile_success_returns200() throws Exception {
        User updated = User.builder().id(1L).email("u@u.com").fullName("New").password("x").build();
        when(userService.updateUserProfile(eq(1L), any())).thenReturn(updated);

        String json = "{\"fullName\":\"New\"}";

        mockMvc.perform(put("/api/users/profile/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("u@u.com"))
                .andExpect(jsonPath("$.fullName").value("New"));

        verify(userService).updateUserProfile(eq(1L), any());
    }

    @Test
    void updateProfile_error_returns400() throws Exception {
        when(userService.updateUserProfile(eq(1L), any()))
                .thenThrow(new RuntimeException("User not found"));

        String json = "{\"fullName\":\"New\"}";

        mockMvc.perform(put("/api/users/profile/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("User not found"));
    }

    @Test
    void changePassword_success_returns200() throws Exception {
        doNothing().when(userService).changePassword(eq(1L), any());

        String json = "{"
                + "\"currentPassword\":\"old\","
                + "\"newPassword\":\"new\""
                + "}";

        mockMvc.perform(put("/api/users/password/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().string("Password updated"));

        verify(userService).changePassword(eq(1L), any());
    }

    @Test
    void changePassword_error_returns400() throws Exception {
        doThrow(new RuntimeException("Current password is incorrect"))
                .when(userService).changePassword(eq(1L), any());

        String json = "{"
                + "\"currentPassword\":\"old\","
                + "\"newPassword\":\"new\""
                + "}";

        mockMvc.perform(put("/api/users/password/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Current password is incorrect"));
    }
}