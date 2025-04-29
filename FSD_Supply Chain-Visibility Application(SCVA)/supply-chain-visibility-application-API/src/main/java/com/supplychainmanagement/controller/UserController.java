package com.supplychainmanagement.controller;

import com.supplychainmanagement.model.User;
import com.supplychainmanagement.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepo userRepository;

    // Get all users
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    // Get a single user by id
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return new ResponseEntity<>(user.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Create a new user
    @PostMapping("/addUser")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // Print user object to console for debugging
        System.out.println("Received user data: " + user);
        // Encode the password (base64 encoding example, you might want to use a more secure hashing algorithm)
        String encodedPassword = Base64.getEncoder().encodeToString(user.getPassword().getBytes());
        user.setPassword(encodedPassword);
        User createdUser = userRepository.save(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        if (!userRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        user.setId(id);
        // Optionally, encode the password if it's being updated
        if (user.getPassword() != null) {
            user.setPassword(encodePassword(user.getPassword()));
        }
        User updatedUser = userRepository.save(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    // Delete a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        userRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get a user by username
    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userRepository.findByusername(username);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Method to encode password using Base64
    private String encodePassword(String password) {
        return Base64.getEncoder().encodeToString(password.getBytes());
    }
    // Endpoint to update password
    @PutMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestBody User updatedUser) {
        // Check if user exists with the provided username
        User user = userRepository.findByusername(updatedUser.getUsername());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // Encode the new password and update the user
        String encodedPassword = encodePassword(updatedUser.getPassword());
        userRepository.resetPassword(encodedPassword, user.getUsername());
        return ResponseEntity.ok().build();
    }
}
