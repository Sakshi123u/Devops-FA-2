package com.ecocycle.controller;

import com.ecocycle.model.RecyclingCenter;
import com.ecocycle.repository.RecyclingCenterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/centers")
@CrossOrigin(origins = "*")
public class RecyclingCenterController {

    @Autowired
    private RecyclingCenterRepository centerRepository;

    // GET /api/centers - Fetch all or search recycling centers
    @GetMapping
    public List<RecyclingCenter> getCenters(@RequestParam(required = false) String query) {
        if (query != null && !query.trim().isEmpty()) {
            return centerRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrMaterialsContainingIgnoreCase(
                    query, query, query
            );
        }
        return centerRepository.findAll();
    }
}
