package com.example.server.model;

import jakarta.persistence.*;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fuelType;
    private int quantity;
    private String slotTime;
    private String paymentStatus;
    private String customerEmail;
    private String location;

    // Required by JPA
    public Booking() {
    }

    // Optional: Constructor with parameters for easier object creation
    public Booking(String fuelType, int quantity, String slotTime, String paymentStatus, String customerEmail, String location) {
        this.fuelType = fuelType;
        this.quantity = quantity;
        this.slotTime = slotTime;
        this.paymentStatus = paymentStatus;
        this.customerEmail = customerEmail;
        this.location = location;
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(String slotTime) {
        this.slotTime = slotTime;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}