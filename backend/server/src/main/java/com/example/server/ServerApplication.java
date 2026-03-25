package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.server.repository.FuelTypeRepository;
import com.example.server.model.FuelType;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedDatabase(FuelTypeRepository repo) {
		return args -> {
			if (repo.count() == 0) {
				repo.save(new FuelType("Petrol", 1.05, 5000.0));
				repo.save(new FuelType("Diesel", 0.95, 3000.0));
				repo.save(new FuelType("CNG", 0.70, 1000.0));
				System.out.println("🚀 Seeded database with initial Fuel Types!");
			}
		};
	}
}
