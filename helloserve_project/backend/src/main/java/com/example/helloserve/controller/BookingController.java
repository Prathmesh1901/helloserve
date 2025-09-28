package com.example.helloserve.controller;

import com.example.helloserve.model.Booking;
import com.example.helloserve.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @GetMapping
    public List<Booking> getAll() {
        return service.getAllBookings();
    }

    @PostMapping
    public ResponseEntity<Booking> create(@RequestBody Booking booking) {
        return ResponseEntity.ok(service.createBooking(booking));
    }

    @GetMapping("/user/{renterId}")
    public List<Booking> getByRenter(@PathVariable Long renterId) {
        return service.getBookingsByRenter(renterId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        service.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}
