package com.example.server.controller;

import org.springframework.web.bind.annotation.*;
import com.example.server.model.FuelType;
import com.example.server.repository.FuelTypeRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/fuel")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class FuelController {

    private final FuelTypeRepository repo;

    public FuelController(FuelTypeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<FuelType> getAllFuelTypes() {
        return repo.findAll().stream()
                .filter(f -> f.getName() != null && !f.getName().trim().isEmpty() 
                          && f.getCurrentPrice() != null 
                          && f.getAvailableStock() != null)
                .toList();
    }

    @PostMapping
    public FuelType updateFuelType(@RequestBody FuelType fuelType) {
        if (fuelType.getName() == null || fuelType.getName().trim().isEmpty()) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, "Fuel name cannot be empty"
            );
        }
        if (fuelType.getCurrentPrice() == null || fuelType.getAvailableStock() == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.BAD_REQUEST, "Price and Stock must not be null"
            );
        }
        Optional<FuelType> existing = repo.findByName(fuelType.getName());
        if (existing.isPresent()) {
            FuelType f = existing.get();
            f.setCurrentPrice(fuelType.getCurrentPrice());
            if(fuelType.getAvailableStock() != null) {
                f.setAvailableStock(fuelType.getAvailableStock());
            }
            return repo.save(f);
        } else {
            return repo.save(fuelType);
        }
    }
}
