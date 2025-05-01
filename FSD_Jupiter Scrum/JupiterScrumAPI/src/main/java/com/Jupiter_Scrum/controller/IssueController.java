package com.Jupiter_Scrum.controller;

import com.Jupiter_Scrum.model.Issue;
import com.Jupiter_Scrum.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/issues")
@CrossOrigin
public class IssueController {

    @Autowired
    private IssueService issueService;

    @GetMapping("/all")
    public ResponseEntity<List<Issue>> getAllIssues() {
        try {
            List<Issue> issues = issueService.getAllIssues();
            return new ResponseEntity<>(issues, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long id) {
        try {
            Optional<Issue> issue = issueService.getIssueById(id);
            return issue.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/addIssue")
    public ResponseEntity<Issue> createIssue(@RequestBody Issue issue) {
        try {
            Issue createdIssue = issueService.createIssue(issue);
            return new ResponseEntity<>(createdIssue, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Issue> updateIssue(@PathVariable Long id, @RequestBody Issue issue) {
        try {
            Optional<Issue> updatedIssue = issueService.updateIssue(id, issue);
            return updatedIssue.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/type/{issueType}")
    public ResponseEntity<List<Issue>> getIssuesByType(@PathVariable String issueType) {
        try {
            List<Issue> issues = issueService.getIssuesByType(issueType);
            return new ResponseEntity<>(issues, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Issue>> getIssuesByUserId(@PathVariable Long userId) {
        try {
            List<Issue> issues = issueService.getIssuesByUserId(userId);
            return new ResponseEntity<>(issues, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/assignee/{assigneeName}")
    public ResponseEntity<List<Issue>> getIssuesByAssigneeName(@PathVariable String assigneeName) {
        try {
            List<Issue> issues = issueService.getIssuesByAssigneeName(assigneeName);
            return new ResponseEntity<>(issues, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(@PathVariable Long id) {
        try {
            boolean isRemoved = issueService.deleteIssue(id);
            return isRemoved ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}