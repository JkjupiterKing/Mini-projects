package com.business.analytics.api.controller;

import com.business.analytics.api.model.Project;
import com.business.analytics.api.model.User;
import com.business.analytics.api.repo.ProjectRepo;
import com.business.analytics.api.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/projects")
@CrossOrigin
public class ProjectController {

    private final ProjectRepo projectRepo;
    private final UserRepo userRepo;

    @Autowired
    public ProjectController(ProjectRepo projectRepo, UserRepo userRepo) {
        this.projectRepo = projectRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/all")
    public List<Project> getAllProjects() {
        return projectRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        Optional<Project> optionalProject = projectRepo.findById(id);
        return optionalProject.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/addproject")
    public ResponseEntity<Project> createProject(@RequestBody Project project) {
        // Retrieve the User associated with the project
        User user = userRepo.findByUsername(project.getUser().getUsername());
        if (user == null) {
            // User not found, return a bad request status
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
        // Set the retrieved User to the project
        project.setUser(user);
        // Save the project
        Project savedProject = projectRepo.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProject);
    }

    @PutMapping("/update/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        Project existingProject = projectRepo.findById(id).get();
        User user = userRepo.findByUsername(updatedProject.getUser().getUsername());
        existingProject.setUser(user);
        existingProject.setStatus(updatedProject.getStatus());
        existingProject.setTitle(updatedProject.getTitle());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setProgress(updatedProject.getProgress());
        return projectRepo.save(existingProject);
    }

    @GetMapping("/byusername/{username}")
    public ResponseEntity<List<Project>> getProjectsByUsername(@PathVariable String username) {
        List<Project> projects = projectRepo.findByUserUsername(username);
        if (projects.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(projects);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (!projectRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
