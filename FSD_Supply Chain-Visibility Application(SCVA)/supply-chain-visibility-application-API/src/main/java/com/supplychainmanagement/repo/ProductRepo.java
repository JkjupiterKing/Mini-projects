package com.supplychainmanagement.repo;


import com.supplychainmanagement.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    // You can define custom query methods here if needed
}