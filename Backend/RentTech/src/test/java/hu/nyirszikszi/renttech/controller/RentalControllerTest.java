package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.dto.CreateBookingRequest;
import hu.nyirszikszi.renttech.dto.RentalDTO;
import hu.nyirszikszi.renttech.service.RentalService;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(
        controllers = RentalController.class,
        excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class}
)
@AutoConfigureMockMvc(addFilters = false)
class RentalControllerTest {

    @Autowired MockMvc mockMvc;

    @MockBean RentalService rentalService;

    @Test
    void createBooking_success_returns200AndMessage() throws Exception {
        doNothing().when(rentalService).createBooking(any(CreateBookingRequest.class));

        String json = "{"
                + "\"userId\":1,"
                + "\"deviceId\":2,"
                + "\"startDate\":\"2026-04-20\","
                + "\"endDate\":\"2026-04-22\","
                + "\"days\":3,"
                + "\"customerName\":\"Teszt Elek\","
                + "\"phone\":\"0630\""
                + "}";

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Booking created"));

        verify(rentalService).createBooking(any(CreateBookingRequest.class));
    }


    @Test
    void getAllBookings_returnsList() throws Exception {
        when(rentalService.getAllBookings()).thenReturn(List.of(new RentalDTO(), new RentalDTO()));

        mockMvc.perform(get("/api/bookings"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(rentalService).getAllBookings();
    }

    @Test
    void getUserBookings_callsService() throws Exception {
        when(rentalService.getBookingsByUser(5L)).thenReturn(List.of());

        mockMvc.perform(get("/api/bookings/user/5"))
                .andExpect(status().isOk());

        verify(rentalService).getBookingsByUser(5L);
    }

    @Test
    void updateStatus_returnsOkAndCallsService() throws Exception {
        doNothing().when(rentalService).updateStatus(eq(7L), eq("elfogadva"));

        String json = "{\"status\":\"elfogadva\"}";

        mockMvc.perform(put("/api/bookings/7/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Status updated"));

        verify(rentalService).updateStatus(7L, "elfogadva");
    }

    @Test
    void checkAvailability_returnsAvailableTrue() throws Exception {
        when(rentalService.isAvailable(3L, "2026-04-20", "2026-04-21")).thenReturn(true);

        mockMvc.perform(get("/api/bookings/availability/3")
                        .param("start", "2026-04-20")
                        .param("end", "2026-04-21"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void cancelBooking_returnsOk() throws Exception {
        doNothing().when(rentalService).cancelBooking(9L);

        mockMvc.perform(put("/api/bookings/cancel/9"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Foglalás lemondva"));

        verify(rentalService).cancelBooking(9L);
    }

    @Test
    void deleteBooking_returnsOk() throws Exception {
        doNothing().when(rentalService).deleteBooking(11L);

        mockMvc.perform(delete("/api/bookings/11"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Booking deleted"));

        verify(rentalService).deleteBooking(11L);
    }

    @Test
    void getDeviceBookings_callsService() throws Exception {
        when(rentalService.getBookingsByDevice(99L)).thenReturn(List.of());

        mockMvc.perform(get("/api/bookings/device/99"))
                .andExpect(status().isOk());

        verify(rentalService).getBookingsByDevice(99L);
    }
}