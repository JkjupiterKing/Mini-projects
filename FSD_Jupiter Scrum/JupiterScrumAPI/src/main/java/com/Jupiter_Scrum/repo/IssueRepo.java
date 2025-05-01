package com.Jupiter_Scrum.repo;

import com.Jupiter_Scrum.model.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepo extends JpaRepository<Issue, Long> {
    List<Issue> findByIssueType(String issueType);
    List<Issue> findByUserId(Long userId);

    List<Issue> findByAssignee(String assigneeName);
}