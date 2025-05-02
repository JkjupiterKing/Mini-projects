package com.business.analytics.api.repo;

import com.business.analytics.api.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepo extends JpaRepository<Project, Long> {
    List<Project> findByUserUsername(String username);
}
