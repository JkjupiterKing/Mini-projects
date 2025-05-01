package com.Jupiter_Scrum.repo;

import com.Jupiter_Scrum.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepo extends JpaRepository<Project, Long> {
    //find projects by user_id
    List<Project> findByUserId(Long userId);
}
