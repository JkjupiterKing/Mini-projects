package com.Jupiter_Scrum.repo;

import com.Jupiter_Scrum.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface userRepo extends JpaRepository<User, Long> {
    // You can define custom query methods here if needed
    User findByEmail(String email);
    List<User> findByTeam_Teamid(Long teamid);
}