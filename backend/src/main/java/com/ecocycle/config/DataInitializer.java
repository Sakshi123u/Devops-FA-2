package com.ecocycle.config;

import com.ecocycle.model.PickupRequest;
import com.ecocycle.model.RecyclingCenter;
import com.ecocycle.model.User;
import com.ecocycle.model.WasteReport;
import com.ecocycle.repository.PickupRequestRepository;
import com.ecocycle.repository.RecyclingCenterRepository;
import com.ecocycle.repository.UserRepository;
import com.ecocycle.repository.WasteReportRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(
            WasteReportRepository reportRepo,
            PickupRequestRepository pickupRepo,
            RecyclingCenterRepository centerRepo,
            UserRepository userRepo) {
        return args -> {
            // Seed Users
            if (userRepo.count() == 0) {
                userRepo.save(new User("Sakshi", "Sakshi Pandharkar", "sakshi.pandharkar23@pccoepune.org", "user123", "Eco Champion", 840, 68));
                userRepo.save(new User("Admin", "Municipal Administrator", "admin@ecocycle.com", "admin123", "Administrator", 1500, 420));
            }

            // Seed Waste Reports
            if (reportRepo.count() == 0) {
                reportRepo.saveAll(List.of(
                    new WasteReport("RPT-001", "Sakshi", "Plastic", "Shivajinagar, Pune",
                            "Bulk accumulation of plastic bottles and containers near civic garden.", "Oct 04, 2026", "Medium", "Pending", null),
                    new WasteReport("RPT-002", "Rahul", "E-Waste", "Aundh IT Corridor, Pune",
                            "Old computer peripherals and discarded wiring bundles.", "Oct 03, 2026", "High", "Assigned", null),
                    new WasteReport("RPT-003", "Sakshi", "Organic", "Kothrud Market, Pune",
                            "Vegetable market surplus organic matter ready for composting.", "Oct 02, 2026", "Low", "Collected", null),
                    new WasteReport("RPT-004", "Priya", "Metal", "Hadapsar Industrial Zone",
                            "Scrap aluminum siding and metal fittings from renovation.", "Sep 30, 2026", "Medium", "Recycled", null),
                    new WasteReport("RPT-005", "Sakshi", "Paper", "FC Road, Deccan",
                            "Stacked cardboard packaging and discarded paper rolls.", "Sep 28, 2026", "Low", "Recycled", null)
                ));
            }

            // Seed Pickup Requests
            if (pickupRepo.count() == 0) {
                pickupRepo.saveAll(List.of(
                    new PickupRequest("PCK-101", "Paper & Cardboard", 15.0, "Oct 06, 2026", "9 AM – 11 AM", "Flat 402, Green Meadows, Shivajinagar", "Near gate 2", "Scheduled"),
                    new PickupRequest("PCK-102", "Plastic", 10.0, "Sep 29, 2026", "2 PM – 4 PM", "Lane 5, Prabhat Road, Pune", "Packed in bags", "Completed")
                ));
            }

            // Seed Recycling Centers
            if (centerRepo.count() == 0) {
                centerRepo.saveAll(List.of(
                    new RecyclingCenter("RC-1", "Pimpri Recycling Center", "Old Mumbai-Pune Highway, Pimpri", "3.2 km away", "Plastic, Paper, Metal, Glass", 72, "Open", "+91 20 2742 8800", "8:00 AM – 7:00 PM"),
                    new RecyclingCenter("RC-2", "Aundh Green Hub", "Near Parihar Chowk, Aundh, Pune", "1.8 km away", "Plastic, E-Waste, Organic", 48, "Open", "+91 20 2588 1234", "9:00 AM – 6:00 PM"),
                    new RecyclingCenter("RC-3", "Kothrud Eco Center", "Paud Road, Kothrud, Pune", "4.5 km away", "Paper, Glass, Metal, Organic", 88, "Near Capacity", "+91 20 2538 9090", "8:30 AM – 6:30 PM"),
                    new RecyclingCenter("RC-4", "Viman Nagar Recycling Hub", "Symbiosis Road, Viman Nagar, Pune", "6.1 km away", "E-Waste, Plastic, Metal", 35, "Open", "+91 20 2663 4500", "9:00 AM – 8:00 PM")
                ));
            }

            System.out.println("✅ Sample EcoCycle database seeded successfully.");
        };
    }
}
