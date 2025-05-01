import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Dropdown, Form, Pagination } from 'react-bootstrap';
import Sidenav from '../Sidenav/Sidenav';
import { Search } from 'react-bootstrap-icons'; 
import './Projects.css'; 

const Projects = () => {
    const [showModal, setShowModal] = useState(false);
    const [projects, setProjects] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);
    const [newProject, setNewProject] = useState({
        name: '',
        key: '',
        type: '',
        lead: '',
        url: '',
        userId: '' 
    });
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8080/projects/all');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleShow = () => setShowModal(true);
    
    const handleClose = () => {
        setShowModal(false);
        setNewProject({
            name: '',
            key: '',
            type: '',
            lead: '',
            url: '',
            userId: '' // Reset user_id as well
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProject(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddProject = async () => {
        const userId = localStorage.getItem('user_id'); // Get user_id from local storage

        if (!userId) {
            console.error('User ID not found in local storage');
            return;
        }

        const projectWithUserId = {
            ...newProject,
            userId: userId // Add user_id to the project object
        };

        try {
            const response = await fetch('http://localhost:8080/projects/addProject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectWithUserId)
            });

            if (response.ok) {
                // Clear form and close modal
                handleClose();
                // Refresh the project list
                fetchProjects();
            } else {
                console.error('Failed to add project');
            }
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/projects/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                // Refresh the project list
                fetchProjects();
            } else {
                console.error('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    // Search and filter projects based on the search query
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.lead.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);

    const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="app-container">
            <Sidenav />
            <div className="main-content">
                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1>Projects</h1>
                    </div>
                    <div className="search-create-container d-flex align-items-center mb-3">
                        <div className="search-wrapper">
                            <Form.Control
                                type="text"
                                placeholder="Search projects"
                                className="search-bar"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search
                                size={15}
                                className="search-icon"
                            />
                        </div>
                        <Button variant="primary" onClick={handleShow} id='createproject-btn'>
                            Create Project
                        </Button>
                    </div>

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Key</th>
                                <th>Type</th>
                                <th>Lead</th>
                                <th>Project URL</th>
                                <th>More Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProjects.length > 0 ? (
                                currentProjects.map((project) => (
                                    <tr key={project.id}>
                                        <td>{project.name}</td>
                                        <td>{project.key}</td>
                                        <td>{project.type}</td>
                                        <td>{project.lead}</td>
                                        <td>
                                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                {project.url}
                                            </a>
                                        </td>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                    ...
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleDeleteProject(project.id)} className="text-danger">
                                                        Delete Project
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>No projects available</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {/* Pagination controls */}
                    <div className="pagination-container d-flex justify-content-center">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages).keys()].map(number => (
                                <Pagination.Item
                                    key={number + 1}
                                    active={number + 1 === currentPage}
                                    onClick={() => handlePageChange(number + 1)}
                                >
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>

                    {/* Modal for creating a project */}
                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create New Project</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter project name"
                                        name="name"
                                        value={newProject.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Key</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter project key"
                                        name="key"
                                        value={newProject.key}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter project type"
                                        name="type"
                                        value={newProject.type}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Lead</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter project lead"
                                        name="lead"
                                        value={newProject.lead}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Project URL</Form.Label>
                                    <Form.Control
                                        type="url"
                                        placeholder="Enter project URL"
                                        name="url"
                                        value={newProject.url}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleAddProject}>
                                Add Project
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Projects;
