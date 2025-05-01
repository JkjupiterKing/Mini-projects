package adaptive_competency_management_system.repo;
import adaptive_competency_management_system.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepo extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
}

