package com.Jupiter_Scrum.model;

import jakarta.persistence.*;
import lombok.*;

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

    private String name;
    private String key;
    private String type;
    private String lead;
    private String url;

    @Column(name = "user_id")
    private Long userId;
}

