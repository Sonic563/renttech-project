package hu.nyirszikszi.renttech.dto;

import hu.nyirszikszi.renttech.model.Asset;
import hu.nyirszikszi.renttech.model.Rental;
import hu.nyirszikszi.renttech.model.User;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class RentalDTOTest {

    private Rental baseRental() {
        User user = User.builder()
                .id(10L)
                .email("a@b.com")
                .fullName("Test User")
                .password("pw")
                .role(User.UserRole.USER)
                .build();

        Asset asset = Asset.builder()
                .id(20L)
                .name("Drill")
                .dailyPrice(new BigDecimal("100.00"))
                .build();

        Rental rental = new Rental();
        rental.setId(99L);
        rental.setUser(user);
        rental.setAsset(asset);
        rental.setStartDate(LocalDate.of(2026, 4, 20));
        rental.setEndDate(LocalDate.of(2026, 4, 22));
        rental.setDays(3);
        rental.setTotalPrice(new BigDecimal("300.00"));
        rental.setStatus("függőben");

        rental.setCustomerName("Vevő Béla");
        rental.setPhone("0630");
        rental.setDeliveryMethod("PICKUP");
        rental.setShippingZip("");
        rental.setShippingCity("");
        rental.setShippingAddress("");
        rental.setNote("");

        rental.setPaymentMethod("COD");
        rental.setPaymentStatus("PENDING");

        return rental;
    }

    @Test
    void fromEntity_whenBookingDateNull_doesNotSetBookingDate() {
        Rental rental = baseRental();
        rental.setBookingDate(null);

        RentalDTO dto = RentalDTO.fromEntity(rental);

        assertEquals(99L, dto.getId());
        assertEquals("Drill", dto.getDeviceName());
        assertEquals("2026-04-20", dto.getStartDate());
        assertEquals("2026-04-22", dto.getEndDate());
        assertEquals(3, dto.getDays());
        assertEquals(new BigDecimal("300.00"), dto.getTotalPrice());

        assertEquals(10L, dto.getUserId());
        assertEquals("Test User", dto.getUserName());
        assertEquals("a@b.com", dto.getUserEmail());

        assertEquals("függőben", dto.getStatus());
        assertNull(dto.getBookingDate(), "bookingDate should remain null if entity bookingDate is null");

        assertEquals("Vevő Béla", dto.getCustomerName());
        assertEquals("0630", dto.getPhone());
        assertEquals("PICKUP", dto.getDeliveryMethod());
        assertEquals("", dto.getShippingZip());
        assertEquals("", dto.getShippingCity());
        assertEquals("", dto.getShippingAddress());
        assertEquals("", dto.getNote());

        assertEquals("COD", dto.getPaymentMethod());
        assertEquals("PENDING", dto.getPaymentStatus());
    }

    @Test
    void fromEntity_whenBookingDatePresent_formatsIsoLocalDateTime() {
        Rental rental = baseRental();
        rental.setBookingDate(LocalDateTime.of(2026, 4, 20, 10, 11, 12));

        RentalDTO dto = RentalDTO.fromEntity(rental);

        assertEquals("2026-04-20T10:11:12", dto.getBookingDate());
    }
}