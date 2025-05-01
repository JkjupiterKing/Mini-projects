import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Form, Pagination, Button } from 'react-bootstrap'; // Import Button here
import Sidenav from '../Sidenav/Sidenav';
import { Search } from 'react-bootstrap-icons';
import CreateIssueButton from '../CreateIssueButton/CreateIssueButton'; // Import the new component
import './Issues.css';

const Issues = () => {
    const [issues, setIssues] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [issuesPerPage] = useState(5);
    const [newIssue, setNewIssue] = useState({
        issueType: '',
        project: '',
        summary: '',
    });
    const [isCreating, setIsCreating] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // State for search query
    const [assigneeName, setAssigneeName] = useState('');

    useEffect(() => {
        const fetchedAssigneeName = localStorage.getItem('first_name');
        console.log(fetchedAssigneeName);
        setAssigneeName(fetchedAssigneeName || '');
        fetchIssues(fetchedAssigneeName);
    }, []);

    const fetchIssues = async (assigneeName) => {
        try {
            if (assigneeName) {
                const response = await fetch(`http://localhost:8080/issues/assignee/${assigneeName}`);
                if (response.ok) {
                    const data = await response.json();
                    setIssues(data);
                } else {
                    console.error('Failed to fetch issues');
                }
            } else {
                console.error('Assignee name not found');
            }
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewIssue(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleDeleteIssue = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/issues/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchIssues(assigneeName); // Fetch issues again after deletion
            } else {
                console.error('Failed to delete issue');
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase()); // Convert to lowercase for case-insensitive search
    };

    // Filter issues based on search query
    const filteredIssues = issues.filter(issue => 
        issue.issueType.toLowerCase().includes(searchQuery) ||
        issue.projectName.toLowerCase().includes(searchQuery) ||
        issue.summary.toLowerCase().includes(searchQuery) ||
        issue.status.toLowerCase().includes(searchQuery)
    );

    // Pagination logic
    const indexOfLastIssue = currentPage * issuesPerPage;
    const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
    const currentIssues = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);

    const totalPages = Math.ceil(filteredIssues.length / issuesPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="app-container">
            <Sidenav />
            <div className="main-content">
                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1>Issues</h1>
                    </div>
                    <div className="search-create-container d-flex align-items-center mb-3">
                        <div className="search-wrapper">
                            <Form.Control
                                type="text"
                                placeholder="Search issues"
                                className="search-bar"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <Search
                                size={15}
                                className="search-icon"
                            />
                        </div>
                        <CreateIssueButton id='createissue-btn' onClick={() => setIsCreating(true)}/>
                    </div>

                    {isCreating && (
                        <Form className="mb-4">
                            <Form.Group className="mb-3">
                                <Form.Label>Issue Type</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter issue type"
                                    name="issueType"
                                    value={newIssue.issueType}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Project</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter project name"
                                    name="project"
                                    value={newIssue.project}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Summary</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter issue summary"
                                    name="summary"
                                    value={newIssue.summary}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Button variant="primary">
                                Add Issue
                            </Button>
                            <Button variant="secondary" onClick={() => setIsCreating(false)} className="ms-2">
                                Cancel
                            </Button>
                        </Form>
                    )}

                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Issue Type</th>
                                <th>Project Name</th>
                                <th>Summary</th>
                                <th>Status</th>
                                <th>More Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentIssues.map((issue) => (
                                <tr key={issue.id}>
                                    <td>{issue.issueType}</td>
                                    <td>{issue.projectName}</td>
                                    <td>{issue.summary}</td>
                                    <td>{issue.status}</td>
                                    <td>
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                ...
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleDeleteIssue(issue.id)} className="text-danger">
                                                    Delete Issue
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            ))}
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
                </div>
            </div>
        </div>
    );
};

export default Issues;
