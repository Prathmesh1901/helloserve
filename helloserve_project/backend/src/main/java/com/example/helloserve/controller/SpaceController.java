package com.example.helloserve.controller;

import com.example.helloserve.model.ParkingSpace;
import com.example.helloserve.service.SpaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spaces")
@CrossOrigin(origins = "http://localhost:3000")
public class SpaceController {
    private final SpaceService service;

    public SpaceController(SpaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<ParkingSpace> getAll() {
        return service.getAllSpaces();
    }

    @GetMapping("/available")
    public List<ParkingSpace> getAvailable() {
        return service.getAvailableSpaces();
    }

    @PostMapping
    public ResponseEntity<ParkingSpace> create(@RequestBody ParkingSpace space) {
        return ResponseEntity.ok(service.createSpace(space));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParkingSpace> update(@PathVariable Long id, @RequestBody ParkingSpace details) {
        return ResponseEntity.ok(service.updateSpace(id, details));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        service.deleteSpace(id);
        return ResponseEntity.noContent().build();
    }
}
