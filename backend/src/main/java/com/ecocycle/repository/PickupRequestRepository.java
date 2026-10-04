package com.ecocycle.repository;

import com.ecocycle.model.PickupRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickupRequestRepository extends JpaRepository<PickupRequest, String> {
    List<PickupRequest> findByStatus(String status);
}
