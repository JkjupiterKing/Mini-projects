package com.Jupiter_Scrum.controller;

import com.Jupiter_Scrum.model.User;
import com.Jupiter_Scrum.repo.userRepo;
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
    private userRepo userRepository;

    // GET all users
    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // POST create a new user
    @PostMapping("/addUser")
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
             String encodedPassword = Base64.getEncoder().encodeToString(user.getPassword().getBytes());
             user.setPassword(encodedPassword);
            User savedUser = userRepository.save(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // PUT update an existing user
    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        System.out.println("id = " + id);
        System.out.println(userDetails);

        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            // Update fields that are provided in userDetails
            if (userDetails.getFirstName() != null) {
                existingUser.setFirstName(userDetails.getFirstName());
            }
            if (userDetails.getLastName() != null) {
                existingUser.setLastName(userDetails.getLastName());
            }
            if (userDetails.getEmail() != null) {
                existingUser.setEmail(userDetails.getEmail());
            }
            if (userDetails.getDepartment() != null) {
                existingUser.setDepartment(userDetails.getDepartment());
            }
            if (userDetails.getPosition() != null) {
                existingUser.setPosition(userDetails.getPosition());
            }
            if (userDetails.getHireDate() != null) {
                existingUser.setHireDate(userDetails.getHireDate());
            }
            if (userDetails.getBirthDate() != null) {
                existingUser.setBirthDate(userDetails.getBirthDate());
            }
            if (userDetails.getAddress() != null) {
                existingUser.setAddress(userDetails.getAddress());
            }
            if (userDetails.getPassword() != null) {
                // Optionally encode the password if provided
                String encodedPassword = Base64.getEncoder().encodeToString(userDetails.getPassword().getBytes());
                existingUser.setPassword(encodedPassword);
            }
            if (userDetails.getTeam() != null) {
                existingUser.setTeam(userDetails.getTeam());
            } else {
                // Set the team to null if it is explicitly set to null
                existingUser.setTeam(null);
            }

            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // GET user by email
    @GetMapping("/login")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        // Find the user by email
        User user = userRepository.findByEmail(email);
        if (user != null) {
            // User exists, return the user object
            return ResponseEntity.ok(user);
        }
        // User does not exist, return not found status
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    }

    // GET users by team ID
    @GetMapping("/team/{teamid}")
    public ResponseEntity<List<User>> getUsersByTeam(@PathVariable Long teamid) {
        List<User> users = userRepository.findByTeam_Teamid(teamid);
        if (users.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(users);
    }

    // DELETE a user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
