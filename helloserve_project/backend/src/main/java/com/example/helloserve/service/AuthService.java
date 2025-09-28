package com.example.helloserve.service;

import com.example.helloserve.model.User;
import com.example.helloserve.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthService(UserService userService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    public String authenticate(String email, String password) {
        Optional<User> userOpt = userService.getUserByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return jwtUtil.generateToken(email);
            }
        }
        
        throw new RuntimeException("Invalid email or password");
    }
    
    public User registerUser(String name, String email, String password, String role) {
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(name, email, encodedPassword, role);
        return userService.createUser(user);
    }
}