package com.business.analytics.api.controller;

import com.business.analytics.api.model.Role;
import com.business.analytics.api.repo.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
@CrossOrigin
public class RoleController {

    private final RoleRepo roleRepository;

    @Autowired
    public RoleController(RoleRepo roleRepository) {
        this.roleRepository = roleRepository;
    }

    // Endpoint to create a new role
    @PostMapping("/create")
    public ResponseEntity<Role> createRole(@RequestBody Role role) {
        Role savedRole = roleRepository.save(role);
        return ResponseEntity.ok(savedRole);
    }

    // Endpoint to retrieve all roles
    @GetMapping("/all")
    public ResponseEntity<List<Role>> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return ResponseEntity.ok(roles);
    }

    // Endpoint to get a role by roleId
    @GetMapping("/{roleId}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long roleId) {
        Optional<Role> roleOptional = roleRepository.findById(roleId);
        return roleOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to update a role by roleId
    @PutMapping("/update/{roleId}")
    public ResponseEntity<Role> updateRole(@PathVariable Long roleId, @RequestBody Role updatedRole) {
        Optional<Role> roleOptional = roleRepository.findById(roleId);
        if (roleOptional.isPresent()) {
            Role existingRole = roleOptional.get();
            existingRole.setRoleName(updatedRole.getRoleName());
            Role savedRole = roleRepository.save(existingRole);
            return ResponseEntity.ok(savedRole);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to delete a role by roleId
    @DeleteMapping("/delete/{roleId}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long roleId) {
        roleRepository.deleteById(roleId);
        return ResponseEntity.noContent().build();
    }
}

