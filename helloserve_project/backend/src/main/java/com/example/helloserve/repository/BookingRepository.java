package com.example.helloserve.repository;

import com.example.helloserve.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // findByRenterId provided by Spring Data via property navigation
    List<Booking> findByRenterId(Long renterId);
}
