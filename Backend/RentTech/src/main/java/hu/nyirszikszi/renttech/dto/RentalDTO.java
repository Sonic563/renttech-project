package hu.nyirszikszi.renttech.dto;

import hu.nyirszikszi.renttech.model.Rental;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

public class RentalDTO {

    private Long id;
    private String deviceName;
    private String startDate;
    private String endDate;
    private int days;
    private BigDecimal totalPrice;
    private String status;
    private String bookingDate;

    private Long userId;
    private String userName;
    private String userEmail;


    private String customerName;
    private String phone;
    private String deliveryMethod;
    private String shippingZip;
    private String shippingCity;
    private String shippingAddress;
    private String note;


    private String paymentMethod;
    private String paymentStatus;

    public RentalDTO() {}

    public static RentalDTO fromEntity(Rental rental) {
        RentalDTO dto = new RentalDTO();
        dto.setId(rental.getId());
        dto.setDeviceName(rental.getAsset().getName());
        dto.setStartDate(rental.getStartDate().toString());
        dto.setEndDate(rental.getEndDate().toString());
        dto.setDays(rental.getDays());
        dto.setTotalPrice(rental.getTotalPrice());

        dto.setUserId(rental.getUser().getId());
        dto.setUserName(rental.getUser().getFullName());
        dto.setUserEmail(rental.getUser().getEmail());

        dto.setStatus(rental.getStatus());
        if (rental.getBookingDate() != null) {
            dto.setBookingDate(rental.getBookingDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        }

        dto.setCustomerName(rental.getCustomerName());
        dto.setPhone(rental.getPhone());
        dto.setDeliveryMethod(rental.getDeliveryMethod());
        dto.setShippingZip(rental.getShippingZip());
        dto.setShippingCity(rental.getShippingCity());
        dto.setShippingAddress(rental.getShippingAddress());
        dto.setNote(rental.getNote());

        dto.setPaymentMethod(rental.getPaymentMethod());
        dto.setPaymentStatus(rental.getPaymentStatus());

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getDeviceName() { return deviceName; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getBookingDate() { return bookingDate; }
    public void setBookingDate(String bookingDate) { this.bookingDate = bookingDate; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDeliveryMethod() { return deliveryMethod; }
    public void setDeliveryMethod(String deliveryMethod) { this.deliveryMethod = deliveryMethod; }

    public String getShippingZip() { return shippingZip; }
    public void setShippingZip(String shippingZip) { this.shippingZip = shippingZip; }

    public String getShippingCity() { return shippingCity; }
    public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}