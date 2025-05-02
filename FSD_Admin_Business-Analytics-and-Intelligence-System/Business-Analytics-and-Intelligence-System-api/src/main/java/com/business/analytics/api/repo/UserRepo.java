package com.business.analytics.api.repo;

import com.business.analytics.api.model.User;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    List<User> findAllByOrderByUserIdDesc();
    List<User> findByEmail(String email);
    User findByUsername(String username);
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.email = :emailId")
    void resetPassword(String newPassword, String emailId);
}
