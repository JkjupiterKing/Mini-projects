package com.supplychainmanagement.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.supplychainmanagement.model.PurchaseOrders;

import java.util.List;

@Repository
public interface PurchaseOrdersRepo extends JpaRepository<PurchaseOrders, Long>{
    List<PurchaseOrders> findBySupplier(String supplier);
}