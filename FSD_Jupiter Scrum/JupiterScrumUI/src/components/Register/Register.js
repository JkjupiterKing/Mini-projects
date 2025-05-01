import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import './Register.css'; 

const Register = () => {
    // State variables for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [hireDate, setHireDate] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [address, setAddress] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        const userData = {
            firstName,
            lastName,
            email,
            password,
            department,
            position,
            hireDate,
            birthDate,
            address,
        };

        try {
            const response = await fetch('http://localhost:8080/users/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const result = await response.json();
                alert('Registration successful!');
                setIsRegistered(true);
                // Redirect to the login page after successful registration
                navigate('/login');
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <main>
            <Container className="register-container">
                <Row className="w-100 justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="register-card shadow-sm">
                            <Card.Body>
                                <h2 className="text-center mb-4">Register</h2>
                                <Form onSubmit={handleSubmit} className="register-form">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicFirstName">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter first name"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicLastName">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter last name"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Email address</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Enter email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicConfirmPassword">
                                                <Form.Label>Confirm Password</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicDepartment">
                                                <Form.Label>Department</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter department"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicPosition">
                                                <Form.Label>Position</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter position"
                                                    value={position}
                                                    onChange={(e) => setPosition(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicHireDate">
                                                <Form.Label>Hire Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Enter hire date"
                                                    value={hireDate}
                                                    onChange={(e) => setHireDate(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group controlId="formBasicBirthDate">
                                                <Form.Label>Birth Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    placeholder="Enter birth date"
                                                    value={birthDate}
                                                    onChange={(e) => setBirthDate(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col md={12}>
                                            <Form.Group controlId="formBasicAddress">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter address"
                                                    value={address}
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button variant="primary" type="submit" className="mt-3 w-100" id="register-btn">
                                        Register
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <p>Already have an account? <Link to="/login" id='login-link'>Login here</Link></p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </main>
    );
};

export default Register;
