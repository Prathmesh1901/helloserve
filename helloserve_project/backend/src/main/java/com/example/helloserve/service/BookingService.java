package com.example.helloserve.service;

import com.example.helloserve.model.Booking;
import com.example.helloserve.model.ParkingSpace;
import com.example.helloserve.repository.BookingRepository;
import com.example.helloserve.repository.SpaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {
    private final BookingRepository repo;
    private final SpaceRepository spaceRepo;

    public BookingService(BookingRepository repo, SpaceRepository spaceRepo) {
        this.repo = repo;
        this.spaceRepo = spaceRepo;
    }

    public Booking createBooking(Booking booking) {
        if (booking == null) {
            throw new RuntimeException("Booking cannot be null");
        }
        
        ParkingSpace space = booking.getSpace();
        if (space == null) {
            throw new RuntimeException("Space cannot be null");
        }
        
        // Fetch the latest space status from database
        ParkingSpace latestSpace = spaceRepo.findById(space.getId())
            .orElseThrow(() -> new RuntimeException("Space not found"));
            
        if (!"AVAILABLE".equals(latestSpace.getStatus())) {
            throw new RuntimeException("Space not available");
        }
        
        // mark booked
        latestSpace.setStatus("BOOKED");
        spaceRepo.save(latestSpace);
        
        // Update booking with the latest space reference
        booking.setSpace(latestSpace);
        return repo.save(booking);
    }

    public List<Booking> getAllBookings() {
        return repo.findAll();
    }

    public List<Booking> getBookingsByRenter(Long renterId) {
        return repo.findByRenterId(renterId);
    }

    public void cancelBooking(Long id) {
        Booking b = repo.findById(id).orElseThrow(() -> new RuntimeException("Booking not found"));
        ParkingSpace s = b.getSpace();
        s.setStatus("AVAILABLE");
        spaceRepo.save(s);
        repo.delete(b);
    }
}
