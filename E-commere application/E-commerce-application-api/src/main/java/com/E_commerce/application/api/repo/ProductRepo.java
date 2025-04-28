package com.E_commerce.application.api.repo;

import com.E_commerce.application.api.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    // You can define custom query methods here if needed
}