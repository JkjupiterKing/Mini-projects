package adaptive_competency_management_system.repo;

import adaptive_competency_management_system.model.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnrollmentRepo extends JpaRepository<Enrollment, Long> {

    @Query("SELECT e FROM Enrollment as e  WHERE e.employee.employeeId = :employeeId")
    List<Enrollment> findByEmployeeId(@Param("employeeId") Long employeeId);

    @Query("SELECT e FROM Enrollment e WHERE e.employee.employeeId = :employeeId AND e.status = :status")
    List<Enrollment> findByEmployeeIdAndStatus(@Param("employeeId") Long employeeId, @Param("status") String status);

}