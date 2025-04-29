package com.supplychainmanagement.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.supplychainmanagement.model.CustomerOrders;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerOrdersRepo extends JpaRepository<CustomerOrders, Integer>{

    Optional<CustomerOrders> findById(int orderId);
    List<CustomerOrders> findByCustomerName(String customerName);
    void deleteById(int orderId);
}