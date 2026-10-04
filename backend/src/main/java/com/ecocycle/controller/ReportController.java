package com.ecocycle.controller;

import com.ecocycle.model.WasteReport;
import com.ecocycle.repository.WasteReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private WasteReportRepository reportRepository;

    // GET /api/reports - Fetch all reports
    @GetMapping
    public List<WasteReport> getAllReports(@RequestParam(required = false) String user) {
        if (user != null && !user.isEmpty()) {
            return reportRepository.findByUserOrderByIdDesc(user);
        }
        return reportRepository.findAll();
    }

    // GET /api/reports/{id} - Fetch single report
    @GetMapping("/{id}")
    public ResponseEntity<WasteReport> getReportById(@PathVariable String id) {
        return reportRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/reports - Submit a new waste report
    @PostMapping
    public ResponseEntity<WasteReport> createReport(@RequestBody WasteReport report) {
        if (report.getId() == null || report.getId().isEmpty()) {
            int randomNum = 100 + new Random().nextInt(900);
            report.setId("RPT-" + randomNum);
        }
        if (report.getDate() == null || report.getDate().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy");
            report.setDate(LocalDate.now().format(formatter));
        }
        if (report.getStatus() == null || report.getStatus().isEmpty()) {
            report.setStatus("Pending");
        }
        WasteReport saved = reportRepository.save(report);
        return ResponseEntity.ok(saved);
    }

    // PATCH /api/reports/{id}/status - Update ticket status (Admin)
    @PatchMapping("/{id}/status")
    public ResponseEntity<WasteReport> updateStatus(@PathVariable String id, @RequestBody Map<String, String> statusUpdate) {
        return reportRepository.findById(id)
                .map(report -> {
                    String newStatus = statusUpdate.get("status");
                    if (newStatus != null) {
                        report.setStatus(newStatus);
                    }
                    WasteReport updated = reportRepository.save(report);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
