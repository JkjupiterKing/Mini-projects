import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'; 
import './Login.css'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            // Use template literals for URL
            const response = await fetch(`http://localhost:8080/users/login?email=${encodeURIComponent(email)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();

                // Check if response includes user_id and password
                if (result && result.password && result.user_id && result.firstName) {
                    // Decode Base64 encoded password hash
                    const decodedPassword = atob(result.password); // Decode Base64 encoded password 

                    // Compare decoded password hash with the entered password
                    if (password === decodedPassword) {
                        // Store user_id in local storage
                        localStorage.setItem('user_id', result.user_id);
                        localStorage.setItem('first_name', result.firstName)
                        // Navigate to home page
                        navigate('/home'); 
                    } else {
                        alert('Invalid credentials. Please try again.');
                    }
                } else {
                    alert('Invalid credentials. Please try again.');
                }
            } else {
                alert('Invalid credentials. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <main>
            <Container className="login-container">
                <Row className="w-100">
                    <Col md={6} lg={4}>
                        <Card className="login-card">
                            <Card.Body>
                                <h2 className="text-center mb-4">Login</h2>
                                <Form onSubmit={handleLogin} className="login-form">
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
    
                                    <Form.Group controlId="formBasicPassword" className="mt-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
    
                                    <Button variant="primary" type="submit" className="mt-3 w-100" id="login-btn">
                                        Login
                                    </Button>
                                </Form>
                                <div className="text-center mt-3">
                                    <p>Don't have an account? <Link to="/register" id='Register-link'>Register here</Link></p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </main>
    );    
};

export default Login;
