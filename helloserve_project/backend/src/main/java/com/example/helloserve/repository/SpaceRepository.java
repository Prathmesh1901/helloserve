package com.example.helloserve.repository;

import com.example.helloserve.model.ParkingSpace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SpaceRepository extends JpaRepository<ParkingSpace, Long> {
    List<ParkingSpace> findByStatus(String status);
    List<ParkingSpace> findByAddressContainingIgnoreCase(String address);
}
