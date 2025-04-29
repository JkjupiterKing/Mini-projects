package com.supplychainmanagement.repo;

import com.supplychainmanagement.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    User findByusername(String username);
    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.username = :username")
    void resetPassword(String newPassword, String username);
}
