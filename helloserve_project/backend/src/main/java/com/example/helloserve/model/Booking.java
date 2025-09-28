package com.example.helloserve.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "renter_id")
    private User renter;

    @ManyToOne
    @JoinColumn(name = "space_id")
    private ParkingSpace space;

    @Column(nullable = false)
    private String startTime;

    @Column(nullable = false)
    private String endTime;

    public Booking() {}

    public Booking(User renter, ParkingSpace space, String startTime, String endTime) {
        this.renter = renter;
        this.space = space;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRenter() { return renter; }
    public void setRenter(User renter) { this.renter = renter; }

    public ParkingSpace getSpace() { return space; }
    public void setSpace(ParkingSpace space) { this.space = space; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
}
