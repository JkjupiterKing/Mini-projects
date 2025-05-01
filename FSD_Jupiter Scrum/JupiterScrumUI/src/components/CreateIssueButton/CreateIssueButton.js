import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import './CreateIssueButton.css';

// Function to fetch project names from an API
const fetchProjectNamesFromAPI = async () => {
    try {
        const response = await fetch('http://localhost:8080/projects/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map(project => project.name);
    } catch (error) {
        console.error('Failed to fetch projects:', error);
        return [];
    }
};

// Function to fetch assignees from an API
const fetchAssigneesFromAPI = async () => {
    try {
        const response = await fetch('http://localhost:8080/users/all');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data.map(assignee => assignee.firstName);
    } catch (error) {
        console.error('Failed to fetch assignees:', error);
        return [];
    }
};

// Function to post new issue data to the API
const postIssueToAPI = async (issueData) => {
    try {
        const formData = new FormData();
        
        // Append only fields that have values
        for (const key in issueData) {
            if (issueData[key] !== '' && issueData[key] !== undefined) {
                if (key === 'attachment' && issueData[key]) {
                    // Handle file attachment
                    formData.append(key, issueData[key]);
                } else {
                    // Handle regular fields
                    formData.append(key, issueData[key] || null); // Append null if value is empty
                }
            } else {
                formData.append(key, null); // Append null if value is empty or undefined
            }
        }

        const requestBody = {};
        formData.forEach((value, key) => {
            requestBody[key] = value;
        });

        const response = await fetch('http://localhost:8080/issues/addIssue', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody) // Send as JSON
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to post issue:', error);
        throw error;
    }
};

const CreateIssueButton = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        projectName: '',
        issueType: '',
        status: '',
        summary: '',
        description: '',
        assignee: '',
        labels: '',
        parent: '',
        sprint: '',
        storyPointEstimate: '',
        reporter: '',
        attachment: '',
        linkedIssues: '',
        userId: localStorage.getItem('user_id')
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [projectNames, setProjectNames] = useState([]);
    const [assignees, setAssignees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const projects = await fetchProjectNamesFromAPI();
            setProjectNames(projects);
            const assigneesList = await fetchAssigneesFromAPI();
            setAssignees(assigneesList);
            setLoading(false);
        };
        loadData();
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        if (userId) {
            setFormData(prevData => ({
                ...prevData,
                user_id: userId
            }));
        }
    }, []);

    const handleShow = () => setShowModal(true);

    const handleClose = () => {
        setShowModal(false);
        setSuccessMessage('');
        // Reset form data
        setFormData({
            projectName: '',
            issueType: '',
            status: '',
            summary: '',
            description: '',
            assignee: '',
            labels: '',
            parent: '',
            sprint: '',
            storyPointEstimate: '',
            reporter: '',
            attachment: '',
            linkedIssues: '',
            user_id: ''
        });
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prevData => ({
                ...prevData,
                [name]: files[0] // Handle file input
            }));
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value || null // Set to null if value is empty
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.projectName) newErrors.projectName = 'Project Name is required.';
        if (!formData.issueType) newErrors.issueType = 'Issue Type is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await postIssueToAPI(formData);
                setSuccessMessage('Issue created successfully!');
                handleClose();
            } catch (error) {
                setSuccessMessage('Failed to create issue.');
            }
        }
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Create
            </Button>

            {/* Create Issue Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Issue</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {loading ? (
                        <Alert variant="info">Loading data...</Alert>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="formProjectName" className="mb-4">
                                <Form.Label>Project Name</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="projectName"
                                    value={formData.projectName || ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.projectName}
                                >
                                    <option value="">Select Project</option>
                                    {projectNames.map((projectName, index) => (
                                        <option key={index} value={projectName}>{projectName}</option>
                                    ))}
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.projectName}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formIssueType" className="mb-4">
                                <Form.Label>Issue Type</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="issueType"
                                    value={formData.issueType || ''}
                                    onChange={handleChange}
                                    isInvalid={!!errors.issueType}
                                >
                                    <option value="">Select Issue Type</option>
                                    <option value="Epic">Epic</option>
                                    <option value="Story">Story</option>
                                    <option value="Task">Task</option>
                                    <option value="Bug">Bug</option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">{errors.issueType}</Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formStatus" className="mb-4">
                                <Form.Label>Status</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="status"
                                    value={formData.status || ''}
                                    onChange={handleChange}
                                >
                                    <option value="To do">To do</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Done">Done</option>
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formSummary" className="mb-4">
                                <Form.Label>Summary</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="summary"
                                    value={formData.summary || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formDescription" className="mb-4">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={formData.description || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formAssignee" className="mb-4">
                                <Form.Label>Assignee</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="assignee"
                                    value={formData.assignee || ''}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Assignee</option>
                                    {assignees.map((assignee, index) => (
                                        <option key={index} value={assignee}>{assignee}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formLabels" className="mb-4">
                                <Form.Label>Labels</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="labels"
                                    value={formData.labels || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formParent" className="mb-4">
                                <Form.Label>Parent</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="parent"
                                    value={formData.parent || ''}
                                    onChange={handleChange}
                                    disabled={formData.issueType === 'Epic'} // Disable if issueType is 'Epic'
                                />
                            </Form.Group>

                            <Form.Group controlId="formSprint" className="mb-4">
                                <Form.Label>Sprint</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="sprint"
                                    value={formData.sprint || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formStoryPointEstimate" className="mb-4">
                                <Form.Label>Story Point Estimate</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="storyPointEstimate"
                                    value={formData.storyPointEstimate || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formReporter" className="mb-4">
                                <Form.Label>Reporter</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="reporter"
                                    value={formData.reporter || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formAttachment" className="mb-4">
                                <Form.Label>Attachment</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="attachment"
                                    onChange={handleChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLinkedIssues" className="mb-4">
                                <Form.Label>Linked Issues</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="linkedIssues"
                                    value={formData.linkedIssues || ''}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <br />
                            <Button variant="primary" type="submit">Create</Button>
                            <Button variant="secondary" onClick={handleClose} className="ms-2">Cancel</Button>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreateIssueButton;
