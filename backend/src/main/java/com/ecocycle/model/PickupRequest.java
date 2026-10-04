package com.ecocycle.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "pickup_requests")
public class PickupRequest {

    @Id
    private String id;

    @Column(nullable = false)
    private String wasteType;

    @Column(nullable = false)
    private Double quantityKg;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String timeSlot;

    @Column(nullable = false)
    private String address;

    @Column(length = 500)
    private String notes;

    @Column(nullable = false)
    private String status; // Scheduled, In Progress, Completed

    public PickupRequest() {}

    public PickupRequest(String id, String wasteType, Double quantityKg, String date,
                         String timeSlot, String address, String notes, String status) {
        this.id = id;
        this.wasteType = wasteType;
        this.quantityKg = quantityKg;
        this.date = date;
        this.timeSlot = timeSlot;
        this.address = address;
        this.notes = notes;
        this.status = status;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }

    public Double getQuantityKg() { return quantityKg; }
    public void setQuantityKg(Double quantityKg) { this.quantityKg = quantityKg; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
