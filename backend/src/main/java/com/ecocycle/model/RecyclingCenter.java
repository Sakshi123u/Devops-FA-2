package com.ecocycle.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "recycling_centers")
public class RecyclingCenter {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    private String distance;

    // Comma-separated materials list, e.g. "Plastic, Paper, Metal, Glass"
    @Column(nullable = false)
    private String materials;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private String status; // Open, Closed, Near Capacity

    private String contact;
    private String timings;

    public RecyclingCenter() {}

    public RecyclingCenter(String id, String name, String location, String distance,
                           String materials, Integer capacity, String status, String contact, String timings) {
        this.id = id;
        this.name = name;
        this.location = location;
        this.distance = distance;
        this.materials = materials;
        this.capacity = capacity;
        this.status = status;
        this.contact = contact;
        this.timings = timings;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDistance() { return distance; }
    public void setDistance(String distance) { this.distance = distance; }

    public String getMaterials() { return materials; }
    public void setMaterials(String materials) { this.materials = materials; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getTimings() { return timings; }
    public void setTimings(String timings) { this.timings = timings; }
}
