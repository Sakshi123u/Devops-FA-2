package com.ecocycle.repository;

import com.ecocycle.model.WasteReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WasteReportRepository extends JpaRepository<WasteReport, String> {
    List<WasteReport> findByUserOrderByIdDesc(String user);
    List<WasteReport> findByStatus(String status);
}
