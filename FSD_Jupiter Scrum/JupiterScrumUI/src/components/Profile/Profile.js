import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import Sidenav from '../Sidenav/Sidenav'; 
import './Profile.css';
import { FaUserCircle } from 'react-icons/fa'; 

const Profile = () => {
    const [userData, setUserData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userId = localStorage.getItem('user_id'); // Fetch user_id from local storage
                if (!userId) {
                    throw new Error('User ID not found in local storage');
                }
                const response = await fetch(`http://localhost:8080/users/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserData(data);
                setFormData(data);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                setErrorMessage('Failed to load user data.');
            }
        };
        loadUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                throw new Error('User ID not found in local storage');
            }
            const response = await fetch(`http://localhost:8080/users/update/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setUserData(formData);
                setSuccessMessage('Profile updated successfully!');
                setEditMode(false);
            } else {
                setErrorMessage('Failed to update profile.');
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
            setErrorMessage('Failed to update profile.');
        }
    };

    return (
        <div id="profile-page">
            <Sidenav /> 

            <div id="profile-content">
                <Container>
                    <Row className="mb-4">
                        <Col md={12}>
                            <div className="profile-header">
                                <FaUserCircle size={100} className="profile-icon" />
                                <h2 className="profile-title">Profile</h2>
                            </div>

                            {successMessage && (
                                <Alert 
                                    variant="success" 
                                    onClose={() => setSuccessMessage('')} 
                                    dismissible
                                    className="custom-alert-success"
                                >
                                    {successMessage}
                                </Alert>
                            )}
                            {errorMessage && (
                                <Alert 
                                    variant="danger" 
                                    onClose={() => setErrorMessage('')} 
                                    dismissible
                                >
                                    {errorMessage}
                                </Alert>
                            )}

                            <Card id='card'>
                                <Card.Body>
                                    <Form>
                                        <Row className="mb-4">
                                            <Col md={4}>
                                                <Form.Group controlId="formFirstName">
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="firstName"
                                                        value={formData.firstName || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="formLastName">
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="lastName"
                                                        value={formData.lastName || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="formEmail">
                                                    <Form.Label>Email</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        value={formData.email || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col md={4}>
                                                <Form.Group controlId="formDepartment">
                                                    <Form.Label>Department</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="department"
                                                        value={formData.department || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="formPosition">
                                                    <Form.Label>Position</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="position"
                                                        value={formData.position || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="formHireDate">
                                                    <Form.Label>Hire Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="hireDate"
                                                        value={formData.hireDate || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row className="mb-4">
                                            <Col md={4}>
                                                <Form.Group controlId="formBirthDate">
                                                    <Form.Label>Birth Date</Form.Label>
                                                    <Form.Control
                                                        type="date"
                                                        name="birthDate"
                                                        value={formData.birthDate || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group controlId="formAddress">
                                                    <Form.Label>Address</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="address"
                                                        value={formData.address || ''}
                                                        onChange={handleChange}
                                                        readOnly={!editMode}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            {editMode && (
                                                <Col md={4}>
                                                    <Form.Group controlId="formPassword">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            name="password"
                                                            value={formData.password || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            )}
                                        </Row>

                                        <div className="d-flex justify-content-between">
                                            {!editMode ? (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => setEditMode(true)}
                                                >
                                                    Edit
                                                </Button>
                                            ) : (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        onClick={handleSave}
                                                        className="me-2"
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => setEditMode(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default Profile;
