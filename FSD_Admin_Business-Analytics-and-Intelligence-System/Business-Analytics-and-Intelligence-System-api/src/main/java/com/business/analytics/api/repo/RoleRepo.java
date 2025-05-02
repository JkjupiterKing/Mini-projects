package com.business.analytics.api.repo;

import com.business.analytics.api.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {
    // You can define custom queries or methods here if needed
}