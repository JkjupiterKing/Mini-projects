import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Bell } from "react-bootstrap-icons";
import Sidenav from "../Sidenav/Sidenav";
import CreateIssueButton from "../CreateIssueButton/CreateIssueButton";
import "./Home.css";

const Home = () => {
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchedAssigneeName = localStorage.getItem("first_name");
    if (!fetchedAssigneeName) return;

    fetch(`http://localhost:8080/issues/assignee/${fetchedAssigneeName}`)
      .then((res) => res.json())
      .then((data) => {
        setAssignedIssues(data);
        // Extract unique project names from the issues
        const projectNames = [
          ...new Set(data.map((issue) => issue.projectName)),
        ];
        setProjects(projectNames);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching issues:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container id="home-container">
      <Sidenav />
      <div id="icon-container">
        <CreateIssueButton />
        <Button variant="text" id="bell-button">
          <Bell size={24} />
        </Button>
      </div>
      <div id="main-container">
        <Row className="mb-4">
          <Col>
            <h1 className="dashboard-title">Dashboard</h1>
          </Col>
        </Row>

        <Row className="g-4">
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title className="section-title">
                  📘 Introduction
                </Card.Title>
                <Card.Text>
                  Welcome to Jupiter Scrum. Manage your sprints and issues with
                  ease.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title className="section-title">
                  📌 Assigned to Me
                </Card.Title>
                {loading ? (
                  <Spinner animation="border" />
                ) : assignedIssues.length > 0 ? (
                  assignedIssues.map((issue, index) => (
                    <div key={index} className="issue-item">
                      <div className="issue-meta">
                        <span>
                          <strong>Project:</strong> {issue.projectName}
                        </span>
                        <span>
                          <strong>Status:</strong>{" "}
                          <span
                            className={`status-badge ${issue.status.toLowerCase()}`}
                          >
                            {issue.status}
                          </span>
                        </span>
                      </div>
                      <div>
                        <strong>Summary:</strong> {issue.summary}
                      </div>
                      <div>
                        <strong>Type:</strong> {issue.issueType}
                      </div>
                      <div>
                        <strong>Story Points:</strong>{" "}
                        {issue.storyPointEstimate}
                      </div>
                      <div>
                        <strong>Sprint:</strong> {issue.sprint}
                      </div>
                      <div>
                        <strong>Reporter:</strong> {issue.reporter}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No issues assigned.</p>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <Card.Title className="section-title">🗂 Projects</Card.Title>
                {loading ? (
                  <Spinner animation="border" />
                ) : projects.length > 0 ? (
                  <ul className="project-list">
                    {projects.map((project, idx) => (
                      <li key={idx}>{project}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No projects found.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Home;
