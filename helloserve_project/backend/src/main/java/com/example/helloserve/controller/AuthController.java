package com.example.helloserve.controller;

import com.example.helloserve.dto.LoginRequest;
import com.example.helloserve.dto.LoginResponse;
import com.example.helloserve.dto.ErrorResponse;
import com.example.helloserve.model.User;
import com.example.helloserve.service.AuthService;
import com.example.helloserve.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final AuthService authService;
    private final UserService userService;
    
    public AuthController(AuthService authService, UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String token = authService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());
            
            Optional<User> userOpt = userService.getUserByEmail(loginRequest.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return ResponseEntity.ok(new LoginResponse(token, user.getEmail(), user.getName(), user.getRole()));
            }
            
            return ResponseEntity.badRequest().body(new ErrorResponse("User not found"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}