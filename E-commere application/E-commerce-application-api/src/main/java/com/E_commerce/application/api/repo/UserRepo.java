package com.E_commerce.application.api.repo;

import com.E_commerce.application.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    User findByusername(String username);
}
