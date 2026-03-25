package com.example.server.controller;

import org.springframework.web.bind.annotation.*;
import com.example.server.model.User;
import com.example.server.repository.UserRepository;
import com.example.server.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository repo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil){
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user){
        if (repo.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER"); // default role
        }
        
        User savedUser = repo.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user){

        Optional<User> dbUser = repo.findByEmail(user.getEmail());

        if(dbUser.isPresent()){
            User u = dbUser.get();

            // Check if plaintext matches (for legacy) or if bcrypt matches
            boolean isMatch = user.getPassword().equals(u.getPassword()) || passwordEncoder.matches(user.getPassword(), u.getPassword());

            if(isMatch){
                String token = jwtUtil.generateToken(u.getEmail(), u.getRole());
                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("role", u.getRole());
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}