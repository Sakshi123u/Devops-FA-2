package com.ecocycle.controller;

import com.ecocycle.model.PickupRequest;
import com.ecocycle.repository.PickupRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/pickups")
@CrossOrigin(origins = "*")
public class PickupController {

    @Autowired
    private PickupRequestRepository pickupRepository;

    // GET /api/pickups - Fetch all pickups
    @GetMapping
    public List<PickupRequest> getAllPickups() {
        return pickupRepository.findAll();
    }

    // POST /api/pickups - Schedule a new waste pickup
    @PostMapping
    public ResponseEntity<PickupRequest> createPickup(@RequestBody PickupRequest pickup) {
        if (pickup.getId() == null || pickup.getId().isEmpty()) {
            int randomNum = 100 + new Random().nextInt(900);
            pickup.setId("PCK-" + randomNum);
        }
        if (pickup.getStatus() == null || pickup.getStatus().isEmpty()) {
            pickup.setStatus("Scheduled");
        }
        PickupRequest saved = pickupRepository.save(pickup);
        return ResponseEntity.ok(saved);
    }
}
