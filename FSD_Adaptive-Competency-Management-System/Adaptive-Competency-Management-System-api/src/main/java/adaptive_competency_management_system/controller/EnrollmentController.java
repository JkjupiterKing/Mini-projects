package adaptive_competency_management_system.controller;

import adaptive_competency_management_system.model.Enrollment;
import adaptive_competency_management_system.repo.EnrollmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
@CrossOrigin
public class EnrollmentController {

    private final EnrollmentRepo enrollmentRepository;

    @Autowired
    public EnrollmentController(EnrollmentRepo enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    // Get all enrollments
    @GetMapping("/all")
    public List<Enrollment> getAllEnrollments() {
        System.out.println("here");
        return enrollmentRepository.findAll();
    }

    @GetMapping
    public List<Enrollment> getEnrollmentsByEmployeeId(@RequestParam Long employeeId) {
        System.out.println("employeeId:"+employeeId);
        return enrollmentRepository.findByEmployeeId(employeeId);
    }

    // Get enrollments by employeeId and status
    @GetMapping("/status")
    public List<Enrollment> getEnrollmentsByEmployeeIdAndStatus(
            @RequestParam Long employeeId,
            @RequestParam String status) {
        System.out.println("employeeId:" + employeeId + ", status:" + status);
        return enrollmentRepository.findByEmployeeIdAndStatus(employeeId, status);
    }

    // Get enrollment by ID
    @GetMapping("/{id}")
    public Enrollment getEnrollmentById(@PathVariable("id") Long id) {
        return enrollmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id " + id));
    }

    // Create a new enrollment
    @PostMapping("/addenrollment")
    public Enrollment createEnrollment(@RequestBody Enrollment enrollment) {
        // enrollment.setCompleted(false);
        return enrollmentRepository.save(enrollment);
    }

    // Update enrollment
    @PutMapping("/{id}")
    public Enrollment updateEnrollment(@PathVariable("id") Long id, @RequestBody Enrollment updatedEnrollment) {
        return enrollmentRepository.findById(id)
                .map(Enrollment -> {
                    Enrollment.setEmployee(updatedEnrollment.getEmployee());
                    Enrollment.setCourse(updatedEnrollment.getCourse());
                    Enrollment.setEnrollmentDate(updatedEnrollment.getEnrollmentDate());
                    Enrollment.setStatus(updatedEnrollment.getStatus());
                    return enrollmentRepository.save(Enrollment);
                })
                .orElseThrow(() -> new RuntimeException("Enrollment not found with id " + id));
    }

    // Delete enrollment
    @DeleteMapping("/{id}")
    public void deleteEnrollment(@PathVariable("id") Long id) {
        enrollmentRepository.deleteById(id);
    }
}
