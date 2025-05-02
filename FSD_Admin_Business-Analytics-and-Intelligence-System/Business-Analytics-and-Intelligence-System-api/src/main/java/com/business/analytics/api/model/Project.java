package com.business.analytics.api.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "projects")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String status;

    @ManyToOne
    @JoinColumn(name = "username", referencedColumnName = "username")
    private User user;

    private Integer Progress;
}
