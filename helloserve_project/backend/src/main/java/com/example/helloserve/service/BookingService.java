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
        ParkingSpace space = booking.getSpace();
        if (space == null || !"AVAILABLE".equals(space.getStatus())) {
            throw new RuntimeException("Space not available");
        }
        // mark booked
        space.setStatus("BOOKED");
        spaceRepo.save(space);
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
