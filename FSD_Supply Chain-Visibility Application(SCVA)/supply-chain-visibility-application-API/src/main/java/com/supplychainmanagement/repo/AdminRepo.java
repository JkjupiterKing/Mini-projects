package com.supplychainmanagement.repo;

import com.supplychainmanagement.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<Admin, Long> {

    // Additional query methods can be defined here
    Admin findByUsername(String username);
    Admin findByEmail(String email);
}
