package com.example.server.model;

import jakarta.persistence.*;

@Entity
public class FuelType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name; // e.g. Petrol, Diesel, CNG

    private Double currentPrice;
    
    private Double availableStock;

    public FuelType() {}

    public FuelType(String name, Double currentPrice, Double availableStock) {
        this.name = name;
        this.currentPrice = currentPrice;
        this.availableStock = availableStock;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(Double currentPrice) { this.currentPrice = currentPrice; }

    public Double getAvailableStock() { return availableStock; }
    public void setAvailableStock(Double availableStock) { this.availableStock = availableStock; }
}
