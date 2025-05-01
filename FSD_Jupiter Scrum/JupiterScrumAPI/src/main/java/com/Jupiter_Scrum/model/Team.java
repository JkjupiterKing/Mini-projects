package com.Jupiter_Scrum.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Teams")
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamid;

    @Column(name = "teamname", nullable = false)
    private String teamname;
}
