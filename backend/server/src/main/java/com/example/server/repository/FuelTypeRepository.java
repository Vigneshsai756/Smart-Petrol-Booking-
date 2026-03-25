package com.example.server.repository;

import com.example.server.model.FuelType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FuelTypeRepository extends JpaRepository<FuelType, Long> {
    Optional<FuelType> findByName(String name);
}
