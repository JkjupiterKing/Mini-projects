package com.Jupiter_Scrum.service;

import com.Jupiter_Scrum.model.Issue;
import com.Jupiter_Scrum.repo.IssueRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IssueService {

    @Autowired
    private IssueRepo issueRepository;

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }

    public Issue createIssue(Issue issue) {
        return issueRepository.save(issue);
    }

    public List<Issue> getIssuesByType(String issueType) {
        return issueRepository.findByIssueType(issueType);
    }

    public Optional<Issue> updateIssue(Long id, Issue issue) {
        if (issueRepository.existsById(id)) {
            issue.setId(id);
            return Optional.of(issueRepository.save(issue));
        }
        return Optional.empty();
    }

    public boolean deleteIssue(Long id) {
        if (issueRepository.existsById(id)) {
            issueRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<Issue> getIssuesByUserId(Long userId) {
        return issueRepository.findByUserId(userId);
    }

    public List<Issue> getIssuesByAssigneeName(String assigneeName) {
        return issueRepository.findByAssignee(assigneeName);
    }
}
