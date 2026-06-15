package com.jobportal.backend.controller;

import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.backend.dto.LoginRequest;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (isBlank(user.getName()) || isBlank(user.getEmail()) || isBlank(user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email and password are required"));
        }

        String email = user.getEmail().trim().toLowerCase();

        if (!email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Enter a valid email address"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already registered"));
        }

        user.setName(user.getName().trim());
        user.setEmail(email);
        user.setPassword(user.getPassword().trim());

        if (isBlank(user.getRole())) {
            user.setRole("USER");
        }

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        if (request == null || isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        Optional<User> optionalUser =
                userRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if(optionalUser.isPresent()) {

            User user = optionalUser.get();

            if(user.getPassword()
                    .equals(request.getPassword().trim())) {

                return ResponseEntity.ok(Map.of("token", JwtUtil.generateToken(user.getEmail())));
            }
        }

        return ResponseEntity.status(401).body(Map.of("message", "Invalid credentials"));
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
