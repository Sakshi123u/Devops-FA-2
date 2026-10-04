package com.ecocycle.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "waste_reports")
public class WasteReport {

    @Id
    private String id;

    @Column(nullable = false)
    private String user;

    @Column(nullable = false)
    private String wasteType;

    @Column(nullable = false)
    private String location;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false)
    private String date;

    @Column(nullable = false)
    private String priority; // Low, Medium, High

    @Column(nullable = false)
    private String status; // Pending, Assigned, Pickup Scheduled, Collected, Recycled

    private String imageUrl;

    public WasteReport() {}

    public WasteReport(String id, String user, String wasteType, String location, 
                       String description, String date, String priority, String status, String imageUrl) {
        this.id = id;
        this.user = user;
        this.wasteType = wasteType;
        this.location = location;
        this.description = description;
        this.date = date;
        this.priority = priority;
        this.status = status;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUser() { return user; }
    public void setUser(String user) { this.user = user; }

    public String getWasteType() { return wasteType; }
    public void setWasteType(String wasteType) { this.wasteType = wasteType; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
