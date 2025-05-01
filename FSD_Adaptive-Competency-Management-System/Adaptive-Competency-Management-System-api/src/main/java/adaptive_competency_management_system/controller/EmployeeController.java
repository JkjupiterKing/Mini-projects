package adaptive_competency_management_system.controller;

import adaptive_competency_management_system.model.Employee;
import adaptive_competency_management_system.repo.EmployeeRepo;
import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import adaptive_competency_management_system.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.mail.MessagingException;

import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/employees")
@CrossOrigin
public class EmployeeController {

    @Autowired
    private EmployeeRepo employeeRepository;

    @Autowired
    private EmailService emailService;

    // GET all employees
    @GetMapping("/all")
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // GET employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        return ResponseEntity.ok(employee);
    }

    // POST create a new employee
    @PostMapping("/addEmployee")
    public ResponseEntity<Employee> createEmployee(@RequestBody Employee emp) {
        try {
            // Save the plain password
            String plainPassword = emp.getPassword();

            // Encode the password before saving it to the database
            String encodedPassword = Base64.getEncoder().encodeToString(plainPassword.getBytes());
            emp.setPassword(encodedPassword);

            // Save the employee with the encoded password
            Employee savedEmployee = employeeRepository.save(emp);

            // Send email with the plain password (don't encode the password in the email)
            String emailBody = "<h1>Welcome to the CodeNova</h1>" +
                    "<p>Dear " + savedEmployee.getFirstName() + ",</p>" +
                    "<p>Your account has been created successfully.</p>" +
                    "<p><strong>Email:</strong> " + savedEmployee.getEmail() + "</p>" +
                    "<p><strong>Password:</strong> " + plainPassword + "</p>" + // Send the plain password
                    "<p>Best regards,</p>" +
                    "<p>CodeNova Team</p>";

            // Send the email with the plain password
            emailService.sendEmail(savedEmployee.getEmail(), "Employee Account Created", emailBody);

            return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT update an existing employee
    @PutMapping("/update/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable Long id, @RequestBody Employee empDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employee.setFirstName(empDetails.getFirstName());
        employee.setLastName(empDetails.getLastName());
        employee.setEmail(empDetails.getEmail());
        employee.setDepartment(empDetails.getDepartment());
        employee.setPosition(empDetails.getPosition());
        employee.setHireDate(empDetails.getHireDate());
        employee.setBirthDate(empDetails.getBirthDate());
        employee.setAddress(empDetails.getAddress());

        // Update password only if provided and different from the existing one
        if (empDetails.getPassword() != null && !empDetails.getPassword().isEmpty()) {
            String plainPassword = empDetails.getPassword();
            String encodedPassword = Base64.getEncoder().encodeToString(plainPassword.getBytes());

            // Compare the new encoded password with the existing encoded password
            if (!encodedPassword.equals(employee.getPassword())) {
                employee.setPassword(encodedPassword);
            }
        }

        Employee updatedEmployee = employeeRepository.save(employee);
        return ResponseEntity.ok(updatedEmployee);
    }


    // DELETE an employee
    @DeleteMapping("/deleteEmployee/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
