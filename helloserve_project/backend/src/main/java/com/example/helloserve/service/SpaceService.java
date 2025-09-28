package com.example.helloserve.service;

import com.example.helloserve.model.ParkingSpace;
import com.example.helloserve.repository.SpaceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SpaceService {
    private final SpaceRepository repo;

    public SpaceService(SpaceRepository repo) {
        this.repo = repo;
    }

    public ParkingSpace createSpace(ParkingSpace space) {
        return repo.save(space);
    }

    public List<ParkingSpace> getAllSpaces() {
        return repo.findAll();
    }

    public Optional<ParkingSpace> getSpaceById(Long id) {
        return repo.findById(id);
    }

    public List<ParkingSpace> getAvailableSpaces() {
        return repo.findByStatus("AVAILABLE");
    }

    public List<ParkingSpace> searchByAddress(String address) {
        return repo.findByAddressContainingIgnoreCase(address);
    }

    public ParkingSpace updateSpace(Long id, ParkingSpace details) {
        return repo.findById(id).map(s -> {
            s.setAddress(details.getAddress());
            s.setStatus(details.getStatus());
            return repo.save(s);
        }).orElseThrow(() -> new RuntimeException("Space not found"));
    }

    public void deleteSpace(Long id) {
        repo.deleteById(id);
    }
}
