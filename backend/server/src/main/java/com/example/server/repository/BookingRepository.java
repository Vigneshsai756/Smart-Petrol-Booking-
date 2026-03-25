package com.example.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.server.model.Booking;

public interface BookingRepository extends JpaRepository<Booking,Long>{

}