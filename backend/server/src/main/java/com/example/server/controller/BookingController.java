package com.example.server.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import com.example.server.model.Booking;
import com.example.server.model.FuelType;
import com.example.server.service.QrService;
import com.example.server.repository.BookingRepository;
import com.example.server.repository.FuelTypeRepository;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingRepository repo;
    private final FuelTypeRepository fuelRepo;
    private final QrService qrService;

    public BookingController(BookingRepository repo, FuelTypeRepository fuelRepo, QrService qrService){
        this.repo = repo;
        this.fuelRepo = fuelRepo;
        this.qrService = qrService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Booking booking){

        // Find fuel type to deduct stock
        Optional<FuelType> fuelOpt = fuelRepo.findByName(booking.getFuelType());
        if(fuelOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Fuel Type");
        }
        
        FuelType fuel = fuelOpt.get();
        if(fuel.getAvailableStock() != null && fuel.getAvailableStock() < booking.getQuantity()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Insufficient Fuel Stock");
        }
        
        // Deduct stock
        if (fuel.getAvailableStock() != null) {
            fuel.setAvailableStock(fuel.getAvailableStock() - booking.getQuantity());
            fuelRepo.save(fuel);
        }

        // Add Customer email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (email != null && !email.equals("anonymousUser")) {
            booking.setCustomerEmail(email);
        }

        Booking saved = repo.save(booking);

        String qrText = "Booking ID: " + saved.getId() +
                        "\nUser: " + booking.getCustomerEmail() +
                        "\nLoc: " + saved.getLocation() +
                        "\nFuel: " + saved.getFuelType() +
                        "\nQty: " + saved.getQuantity() + "L";

        String qrBase64 = qrService.generateQR(qrText);
        return ResponseEntity.ok(qrBase64);
    }

    @GetMapping
    public List<Booking> getBookings(){
        return repo.findAll();
    }
}