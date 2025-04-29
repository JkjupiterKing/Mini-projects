package com.supplychainmanagement.repo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.supplychainmanagement.model.StockKeepingUnit;
@Repository
public interface StockKeepingUnitRepo extends JpaRepository<StockKeepingUnit, Long> {

}