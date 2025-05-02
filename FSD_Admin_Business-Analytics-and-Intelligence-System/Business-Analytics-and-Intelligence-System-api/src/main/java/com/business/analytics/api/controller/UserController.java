package com.business.analytics.api.controller;

import com.business.analytics.api.model.Role;
import com.business.analytics.api.model.User;
import com.business.analytics.api.repo.RoleRepo;
import com.business.analytics.api.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    private final UserRepo userRepository;
    private final RoleRepo roleRepository;

    @Autowired
    public UserController(UserRepo userRepository, RoleRepo roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // Endpoint to create a new user
    @PostMapping("/adduser")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            User savedUser = userRepository.save(user);
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    // Endpoint to retrieve all users
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        // List<User> users = userRepository.findAll();
        List<User> users = userRepository.findAllByOrderByUserIdDesc();
        return ResponseEntity.ok(users);
    }

    // Endpoint to get a user by userId
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/update/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setPhone(updatedUser.getPhone());
            existingUser.setAddress(updatedUser.getAddress());

            // Update password if provided
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(updatedUser.getPassword());
            }

            User savedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(savedUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to get a user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        List<User> users = userRepository.findByEmail(email);
        return users.isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(users.get(0));
    }

    // Endpoint to delete a user by userId
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            userRepository.deleteById(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build(); // Handle specific exceptions as needed
        }
    }

    // Endpoint to update password
    @PutMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody User updatedUser) {
        List<User> userWithEmail = userRepository.findByEmail(updatedUser.getEmail());
        if (userWithEmail.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            userRepository.resetPassword(updatedUser.getPassword(), updatedUser.getEmail());
            return ResponseEntity.ok().build();
        }
    }

}
