package hu.nyirszikszi.renttech.controller;

import hu.nyirszikszi.renttech.dto.CreateBookingRequest;
import hu.nyirszikszi.renttech.dto.RentalDTO;
import hu.nyirszikszi.renttech.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import hu.nyirszikszi.renttech.exception.BadRequestException;
import hu.nyirszikszi.renttech.exception.ResourceNotFoundException;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class RentalController {

    private final RentalService rentalService;
    

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody CreateBookingRequest request) {


        rentalService.createBooking(request);
        return ResponseEntity.ok(Map.of("message", "Booking created"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<RentalDTO> getAllBookings() {
        return rentalService.getAllBookings();
    }

    @GetMapping("/user/{id}")
    public List<RentalDTO> getUserBookings(@PathVariable Long id) {
        return rentalService.getBookingsByUser(id);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id,
                                          @RequestBody Map<String, String> body) {
        String status = body.get("status");
        rentalService.updateStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Állapot frissítve"));
    }

    @GetMapping("/availability/{deviceId}")
    public Map<String, Boolean> checkAvailability(@PathVariable Long deviceId,
                                                  @RequestParam String start,
                                                  @RequestParam String end) {
        boolean available = rentalService.isAvailable(deviceId, start, end);
        return Map.of("available", available);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        rentalService.cancelBooking(id);
        return ResponseEntity.ok(Map.of("message", "Foglalás lemondva"));
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        rentalService.deleteBooking(id);
        return ResponseEntity.ok(Map.of("message", "Foglalás törölve"));
    }
    @GetMapping("/device/{deviceId}")
    public List<RentalDTO> getDeviceBookings(@PathVariable Long deviceId) {
        return rentalService.getBookingsByDevice(deviceId);
    }
}