package hu.nyirszikszi.renttech.service;

import hu.nyirszikszi.renttech.domain.AvailabilityStatus;
import hu.nyirszikszi.renttech.dto.CreateBookingRequest;
import hu.nyirszikszi.renttech.model.Asset;
import hu.nyirszikszi.renttech.model.Rental;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.repository.AssetRepository;
import hu.nyirszikszi.renttech.repository.RentalRepository;
import hu.nyirszikszi.renttech.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalServiceTest {

    @Mock RentalRepository rentalRepository;
    @Mock UserRepository userRepository;
    @Mock AssetRepository assetRepository;

    @InjectMocks RentalService rentalService;

    @Captor ArgumentCaptor<Rental> rentalCaptor;
    @Captor ArgumentCaptor<Asset> assetCaptor;

    private User user;
    private Asset asset;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(10L)
                .email("a@b.com")
                .password("pw")
                .fullName("Test User")
                .build();

        asset = Asset.builder()
                .id(20L)
                .name("Drill")
                .dailyPrice(new BigDecimal("100.00"))
                .availability(AvailabilityStatus.ELÉRHETŐ)
                .build();
    }

    private CreateBookingRequest baseReq() {
        CreateBookingRequest req = new CreateBookingRequest();
        req.setUserId(user.getId());
        req.setDeviceId(asset.getId());
        req.setStartDate("2026-04-20");
        req.setEndDate("2026-04-22");
        req.setDays(3);

        req.setCustomerName("Vevő Béla");
        req.setPhone("06301234567");
        return req;
    }

    @Test
    void createBooking_userNotFound_throws() {
        CreateBookingRequest req = baseReq();
        when(userRepository.findById(req.getUserId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("User not found", ex.getMessage());
        verifyNoInteractions(assetRepository);
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void createBooking_assetNotFound_throws() {
        CreateBookingRequest req = baseReq();
        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("Asset not found", ex.getMessage());
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void createBooking_endBeforeStart_throws() {
        CreateBookingRequest req = baseReq();
        req.setStartDate("2026-04-22");
        req.setEndDate("2026-04-20");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("Hibás dátum intervallum", ex.getMessage());
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void createBooking_missingCustomerName_throws() {
        CreateBookingRequest req = baseReq();
        req.setCustomerName("   ");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("A név megadása kötelező", ex.getMessage());
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void createBooking_missingPhone_throws() {
        CreateBookingRequest req = baseReq();
        req.setPhone("");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("A telefonszám megadása kötelező", ex.getMessage());
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void createBooking_courierMissingZip_throws() {
        CreateBookingRequest req = baseReq();
        req.setDeliveryMethod("COURIER");
        req.setShippingZip("  ");
        req.setShippingCity("Budapest");
        req.setShippingAddress("Fő utca 1.");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("Irányítószám megadása kötelező (futár)", ex.getMessage());
    }

    @Test
    void createBooking_courierMissingCity_throws() {
        CreateBookingRequest req = baseReq();
        req.setDeliveryMethod("COURIER");
        req.setShippingZip("1011");
        req.setShippingCity(null);
        req.setShippingAddress("Fő utca 1.");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("Város megadása kötelező (futár)", ex.getMessage());
    }

    @Test
    void createBooking_courierMissingAddress_throws() {
        CreateBookingRequest req = baseReq();
        req.setDeliveryMethod("COURIER");
        req.setShippingZip("1011");
        req.setShippingCity("Budapest");
        req.setShippingAddress(" ");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("Cím megadása kötelező (futár)", ex.getMessage());
    }

    @Test
    void createBooking_cardButNotPaid_throws() {
        CreateBookingRequest req = baseReq();
        req.setPaymentMethod("CARD");
        req.setPaymentStatus("PENDING");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("Bankkártyás fizetés nem sikerült.", ex.getMessage());
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void createBooking_overlap_throws() {
        CreateBookingRequest req = baseReq();

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));
        when(rentalRepository.countOverlapping(eq(asset.getId()), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(1);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.createBooking(req));
        assertEquals("A kiválasztott időszak már foglalt!", ex.getMessage());
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void createBooking_success_defaultsPickupCodPending_andComputesTotalPrice_andEmptyShipping_andUppercase() {
        CreateBookingRequest req = baseReq();
        req.setDeliveryMethod(null);
        req.setPaymentMethod(null);
        req.setPaymentStatus(null);
        req.setNote(null);

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));
        when(rentalRepository.countOverlapping(eq(asset.getId()), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(0);
        when(rentalRepository.save(any(Rental.class))).thenAnswer(inv -> inv.getArgument(0));

        rentalService.createBooking(req);

        verify(rentalRepository).save(rentalCaptor.capture());
        Rental saved = rentalCaptor.getValue();

        assertSame(user, saved.getUser());
        assertSame(asset, saved.getAsset());

        assertEquals(LocalDate.parse("2026-04-20"), saved.getStartDate());
        assertEquals(LocalDate.parse("2026-04-22"), saved.getEndDate());
        assertEquals(3, saved.getDays());

        assertEquals(new BigDecimal("300.00"), saved.getTotalPrice());

        assertEquals("függőben", saved.getStatus());
        assertNotNull(saved.getBookingDate());

        assertEquals("Vevő Béla", saved.getCustomerName());
        assertEquals("06301234567", saved.getPhone());

        assertEquals("PICKUP", saved.getDeliveryMethod());
        assertEquals("", saved.getShippingZip());
        assertEquals("", saved.getShippingCity());
        assertEquals("", saved.getShippingAddress());

        assertEquals("", saved.getNote());

        assertEquals("COD", saved.getPaymentMethod());
        assertEquals("PENDING", saved.getPaymentStatus());
    }

    @Test
    void createBooking_success_courier_setsShippingFields_andUppercases() {
        CreateBookingRequest req = baseReq();
        req.setDeliveryMethod("courier");
        req.setShippingZip("1011");
        req.setShippingCity("Budapest");
        req.setShippingAddress("Fő utca 1.");
        req.setPaymentMethod("card");
        req.setPaymentStatus("PAID");
        req.setNote("Megjegyzés");

        when(userRepository.findById(req.getUserId())).thenReturn(Optional.of(user));
        when(assetRepository.findById(req.getDeviceId())).thenReturn(Optional.of(asset));
        when(rentalRepository.countOverlapping(eq(asset.getId()), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(0);
        when(rentalRepository.save(any(Rental.class))).thenAnswer(inv -> inv.getArgument(0));

        rentalService.createBooking(req);

        verify(rentalRepository).save(rentalCaptor.capture());
        Rental saved = rentalCaptor.getValue();

        assertEquals("COURIER", saved.getDeliveryMethod());
        assertEquals("1011", saved.getShippingZip());
        assertEquals("Budapest", saved.getShippingCity());
        assertEquals("Fő utca 1.", saved.getShippingAddress());

        assertEquals("CARD", saved.getPaymentMethod());
        assertEquals("PAID", saved.getPaymentStatus());

        assertEquals("Megjegyzés", saved.getNote());
    }

    @Test
    void updateStatus_bookingNotFound_throws() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.updateStatus(1L, "elfogadva"));
        assertEquals("Booking not found", ex.getMessage());
    }

    @Test
    void updateStatus_missingStatus_throws() {
        Rental rental = new Rental();
        rental.setAsset(asset);

        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.updateStatus(1L, " "));
        assertEquals("Státusz hiányzik", ex.getMessage());
        verify(assetRepository, never()).save(any());
        verify(rentalRepository, never()).save(any());
    }

    @Test
    void updateStatus_acceptLike_setsAssetToBorrowed_andSavesBoth() {
        Rental rental = new Rental();
        rental.setAsset(asset);

        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));

        rentalService.updateStatus(1L, "Elfogadva");

        assertEquals("Elfogadva", rental.getStatus());
        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(AvailabilityStatus.KÖLCSÖNZÖTT, assetCaptor.getValue().getAvailability());
        verify(rentalRepository).save(rental);
    }

    @Test
    void updateStatus_doneLike_setsAssetToAvailable_andSavesBoth() {
        asset.setAvailability(AvailabilityStatus.KÖLCSÖNZÖTT);

        Rental rental = new Rental();
        rental.setAsset(asset);

        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));

        rentalService.updateStatus(1L, "teljesítve");

        verify(assetRepository).save(assetCaptor.capture());
        assertEquals(AvailabilityStatus.ELÉRHETŐ, assetCaptor.getValue().getAvailability());
        verify(rentalRepository).save(rental);
    }

    @Test
    void updateStatus_unknownStatus_doesNotTouchAssetStillSavesRental() {
        Rental rental = new Rental();
        rental.setAsset(asset);

        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));

        rentalService.updateStatus(1L, "valami más");

        verify(assetRepository, never()).save(any());
        verify(rentalRepository).save(rental);
    }

    @Test
    void isAvailable_returnsTrueWhenNoOverlap() {
        when(rentalRepository.countOverlapping(eq(99L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(0);

        boolean ok = rentalService.isAvailable(99L, "2026-04-20", "2026-04-21");
        assertTrue(ok);
    }

    @Test
    void isAvailable_returnsFalseWhenOverlap() {
        when(rentalRepository.countOverlapping(eq(99L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(2);

        boolean ok = rentalService.isAvailable(99L, "2026-04-20", "2026-04-21");
        assertFalse(ok);
    }

    @Test
    void cancelBooking_setsStatusCanceled_setsAssetAvailable_savesBoth() {
        Rental rental = new Rental();
        rental.setAsset(asset);
        rental.setStatus("függőben");

        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));

        rentalService.cancelBooking(1L);

        assertEquals("lemondva", rental.getStatus());
        assertEquals(AvailabilityStatus.ELÉRHETŐ, asset.getAvailability());

        verify(rentalRepository).save(rental);
        verify(assetRepository).save(asset);
    }

    @Test
    void deleteBooking_deletesWhenFound() {
        Rental rental = new Rental();
        when(rentalRepository.findById(1L)).thenReturn(Optional.of(rental));

        rentalService.deleteBooking(1L);

        verify(rentalRepository).delete(rental);
    }

    @Test
    void deleteBooking_notFound_throws() {
        when(rentalRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () -> rentalService.deleteBooking(1L));
        assertEquals("Booking not found", ex.getMessage());
        verify(rentalRepository, never()).delete(any());
    }
}