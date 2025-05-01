package com.Jupiter_Scrum.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "Users")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    private String firstName;
    private String lastName;
    private String email;
    private String department;
    private String position;
    private LocalDate hireDate;
    private LocalDate birthDate;
    private String address;
    private String password;

    @ManyToOne
    @JoinColumn(name = "teamid")
    private Team team;
}
