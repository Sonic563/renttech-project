package hu.nyirszikszi.renttech.service;

import hu.nyirszikszi.renttech.domain.AvailabilityStatus;
import hu.nyirszikszi.renttech.dto.CreateBookingRequest;
import hu.nyirszikszi.renttech.dto.RentalDTO;
import hu.nyirszikszi.renttech.model.Asset;
import hu.nyirszikszi.renttech.model.Rental;
import hu.nyirszikszi.renttech.model.User;
import hu.nyirszikszi.renttech.repository.AssetRepository;
import hu.nyirszikszi.renttech.repository.RentalRepository;
import hu.nyirszikszi.renttech.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;

    public RentalService(RentalRepository rentalRepository,
                         UserRepository userRepository,
                         AssetRepository assetRepository) {
        this.rentalRepository = rentalRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
    }

    public void createBooking(CreateBookingRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Asset asset = assetRepository.findById(req.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        LocalDate start = LocalDate.parse(req.getStartDate());
        LocalDate end = LocalDate.parse(req.getEndDate());

        if (end.isBefore(start)) {
            throw new RuntimeException("Hibás dátum intervallum");
        }


        if (req.getCustomerName() == null || req.getCustomerName().trim().isEmpty()) {
            throw new RuntimeException("A név megadása kötelező");
        }
        if (req.getPhone() == null || req.getPhone().trim().isEmpty()) {
            throw new RuntimeException("A telefonszám megadása kötelező");
        }

        String deliveryMethod = req.getDeliveryMethod();
        if (deliveryMethod == null || deliveryMethod.trim().isEmpty()) deliveryMethod = "PICKUP";

        if ("COURIER".equalsIgnoreCase(deliveryMethod)) {
            if (req.getShippingZip() == null || req.getShippingZip().trim().isEmpty()) {
                throw new RuntimeException("Irányítószám megadása kötelező (futár)");
            }
            if (req.getShippingCity() == null || req.getShippingCity().trim().isEmpty()) {
                throw new RuntimeException("Város megadása kötelező (futár)");
            }
            if (req.getShippingAddress() == null || req.getShippingAddress().trim().isEmpty()) {
                throw new RuntimeException("Cím megadása kötelező (futár)");
            }
        }


        String paymentMethod = req.getPaymentMethod();
        if (paymentMethod == null || paymentMethod.trim().isEmpty()) paymentMethod = "COD";

        String paymentStatus = req.getPaymentStatus();
        if (paymentStatus == null || paymentStatus.trim().isEmpty()) {
            paymentStatus = "PENDING";
        }

        if ("CARD".equalsIgnoreCase(paymentMethod) && !"PAID".equalsIgnoreCase(paymentStatus)) {
            throw new RuntimeException("Bankkártyás fizetés nem sikerült.");
        }


        int overlap = rentalRepository.countOverlapping(asset.getId(), start, end);
        if (overlap > 0) {
            throw new RuntimeException("A kiválasztott időszak már foglalt!");
        }


        BigDecimal pricePerDay = asset.getDailyPrice();
        BigDecimal days = BigDecimal.valueOf(req.getDays());
        BigDecimal totalPrice = pricePerDay.multiply(days);

        Rental rental = new Rental();
        rental.setUser(user);
        rental.setAsset(asset);
        rental.setStartDate(start);
        rental.setEndDate(end);

        rental.setDays(req.getDays());
        rental.setTotalPrice(totalPrice);

        rental.setCustomerName(req.getCustomerName());
        rental.setPhone(req.getPhone());
        rental.setDeliveryMethod(deliveryMethod.toUpperCase());

        if ("COURIER".equalsIgnoreCase(deliveryMethod)) {
            rental.setShippingZip(req.getShippingZip());
            rental.setShippingCity(req.getShippingCity());
            rental.setShippingAddress(req.getShippingAddress());
        } else {
            rental.setShippingZip("");
            rental.setShippingCity("");
            rental.setShippingAddress("");
        }

        rental.setNote(req.getNote() == null ? "" : req.getNote());

        rental.setPaymentMethod(paymentMethod.toUpperCase());
        rental.setPaymentStatus(paymentStatus.toUpperCase());

        rental.setStatus("függőben");
        rental.setBookingDate(LocalDateTime.now());

        rentalRepository.save(rental);
    }

    public List<RentalDTO> getBookingsByUser(Long userId) {
        return rentalRepository.findByUserId(userId)
                .stream()
                .map(RentalDTO::fromEntity)
                .toList();
    }

    public List<RentalDTO> getAllBookings() {
        return rentalRepository.findAll()
                .stream()
                .map(RentalDTO::fromEntity)
                .toList();
    }



    @Transactional
    public void updateStatus(Long id, String status) {
        Rental rental = rentalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (status == null || status.trim().isEmpty()) {
            throw new RuntimeException("Státusz hiányzik");
        }

        String normalized = status.trim().toLowerCase();

        rental.setStatus(status);

        Asset asset = rental.getAsset();

        if (normalized.equals("elfogadva")
                || normalized.equals("jóváhagyva")
                || normalized.equals("szállítás alatt")) {

            asset.setAvailability(AvailabilityStatus.KÖLCSÖNZÖTT);
            assetRepository.save(asset);
        }

        if (normalized.equals("teljesítve")
                || normalized.equals("lemondva")
                || normalized.equals("elutasítva")) {

            asset.setAvailability(AvailabilityStatus.ELÉRHETŐ);
            assetRepository.save(asset);
        }

        rentalRepository.save(rental);
    }

    public boolean isAvailable(Long deviceId, String start, String end) {
        LocalDate s = LocalDate.parse(start);
        LocalDate e = LocalDate.parse(end);
        int count = rentalRepository.countOverlapping(deviceId, s, e);
        return count == 0;
    }

    public void cancelBooking(Long bookingId) {
        Rental rental = rentalRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        rental.setStatus("lemondva");

        Asset asset = rental.getAsset();
        asset.setAvailability(AvailabilityStatus.ELÉRHETŐ);

        rentalRepository.save(rental);
        assetRepository.save(asset);
    }

    public void deleteBooking(Long bookingId) {
        Rental rental = rentalRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        rentalRepository.delete(rental);
    }

    public List<RentalDTO> getBookingsByDevice(Long deviceId) {
        return rentalRepository.findByAssetId(deviceId)
                .stream()
                .map(RentalDTO::fromEntity)
                .toList();
    }
}