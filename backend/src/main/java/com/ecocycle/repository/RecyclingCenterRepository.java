package com.ecocycle.repository;

import com.ecocycle.model.RecyclingCenter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecyclingCenterRepository extends JpaRepository<RecyclingCenter, String> {
    List<RecyclingCenter> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrMaterialsContainingIgnoreCase(
        String name, String location, String materials
    );
}
