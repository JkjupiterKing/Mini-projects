import React, { useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  House,
  FileText,
  Briefcase,
  ExclamationCircle,
  Person,
  BoxArrowRight,
  People,
} from "react-bootstrap-icons";
import "./Sidenav.css";

const Sidenav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromUnifiedDashboard = params.get("fromUnifiedDashboard");

    if (fromUnifiedDashboard) {
      localStorage.setItem("fromUnifiedDashboard", fromUnifiedDashboard);
    }
  }, [location.search]);

  const handleLogout = (event) => {
    event.preventDefault();
    localStorage.removeItem("user_id");

    const storedParam = localStorage.getItem("fromUnifiedDashboard");

    if (storedParam === "yes") {
      window.location.href = "http://localhost:3000/";
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="sidenav">
      <div className="sidenav-header">
        <img
          src="/Images/scrum.png"
          alt="Jupiter Scrum Logo"
          className="sidenav-logo"
        />
        <h1 className="sidenav-title">Jupiter Scrum</h1>
      </div>
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/home" className="nav-link">
          <House size={20} /> Home
        </Nav.Link>
        <Nav.Link as={Link} to="/projects" className="nav-link">
          <Briefcase size={20} /> Projects
        </Nav.Link>
        <Nav.Link as={Link} to="/issues" className="nav-link">
          <ExclamationCircle size={20} /> Issues
        </Nav.Link>
        <Nav.Link as={Link} to="/teams" className="nav-link">
          <People size={20} /> Teams
        </Nav.Link>
        <Nav.Link as={Link} to="/profile" className="nav-link">
          <Person size={20} /> Profile
        </Nav.Link>
        <Nav.Link onClick={handleLogout} className="logout-link">
          <BoxArrowRight size={20} id="logout-icon" /> Logout
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidenav;
