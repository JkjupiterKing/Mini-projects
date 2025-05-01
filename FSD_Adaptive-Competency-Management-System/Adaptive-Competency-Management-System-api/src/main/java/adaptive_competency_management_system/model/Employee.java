package adaptive_competency_management_system.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import java.util.Date;

@Entity
@Table(name = "employees")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long employeeId;

    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private String position;
    private Date hireDate;
    private Date birthDate;
    private String address;
    private String password;
}
