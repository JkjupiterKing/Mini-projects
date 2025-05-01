import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Dropdown, Form, Pagination, Badge } from 'react-bootstrap';
import Sidenav from '../Sidenav/Sidenav';
import { Search } from 'react-bootstrap-icons';
import './Teams.css';

const Teams = () => {
    const [showModal, setShowModal] = useState(false);
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [teamsPerPage] = useState(5);
    const [newTeam, setNewTeam] = useState({
        name: '',
        members: []
    });
    const [selectedUser, setSelectedUser] = useState('');
    const [searchQuery, setSearchQuery] = useState(''); // State for search query

    useEffect(() => {
        fetchTeams();
        fetchUsers();
    }, []);

    const fetchTeams = async () => {
        try {
            // Step 1: Fetch teams data
            const teamsResponse = await fetch('http://localhost:8080/teams/all');
            if (!teamsResponse.ok) {
                throw new Error('Failed to fetch teams');
            }
            const teamsData = await teamsResponse.json();
            
            // Step 2: Fetch users data
            const usersResponse = await fetch('http://localhost:8080/users/all');
            if (!usersResponse.ok) {
                throw new Error('Failed to fetch users');
            }
            const usersData = await usersResponse.json();
            
            // Step 3: Map users to teams
            const teamsWithMembers = teamsData.map(team => {
                // Find members of the current team
                const teamMembers = usersData.filter(user => user.team?.teamid === team.teamid);
                return {
                    ...team,
                    members: teamMembers
                };
            });
            
            // Update state with the teams including members
            setTeams(teamsWithMembers);
        } catch (error) {
            console.error('Error fetching teams and users:', error);
        }
    };
    
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8080/users/all');
            if (response.ok) {
                const data = await response.json();
                setUsers(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleShow = () => setShowModal(true);

    const handleClose = () => {
        setShowModal(false);
        setNewTeam({
            name: '',
            members: []
        });
        setSelectedUser('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTeam(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddMember = () => {
        if (selectedUser) {
            const user = users.find(u => u.firstName === selectedUser);
            if (user && !newTeam.members.some(m => m.user_id === user.user_id)) {
                setNewTeam(prevState => ({
                    ...prevState,
                    members: [...prevState.members, user]
                }));
                setSelectedUser('');
            }
        }
    };

    const handleRemoveMember = (userId) => {
        setNewTeam(prevState => ({
            ...prevState,
            members: prevState.members.filter(member => member.user_id !== userId)
        }));
    };

    const handleAddTeam = async () => {
        try {
            const response = await fetch('http://localhost:8080/teams/addTeam', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTeam)
            });

            if (response.ok) {
                const data1 = await response.json();
                console.log(data1);
                await Promise.all(newTeam.members.map(async (member) => {
                    const updateResponse = await fetch(`http://localhost:8080/users/update/${member.user_id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ team: { teamid: data1.teamid } })
                    });
                    if (!updateResponse.ok) {
                        console.error('Failed to update user team ID');
                    }
                }));
                handleClose();
                fetchTeams();
            } else {
                console.error('Failed to add team');
            }
        } catch (error) {
            console.error('Error adding team:', error);
        }
    };

    const handleDeleteTeam = async (teamid) => {
        try {
            // Step 1: Fetch users associated with the team
            const usersResponse = await fetch(`http://localhost:8080/users/team/${teamid}`);
            if (!usersResponse.ok) {
                throw new Error('Failed to fetch team users');
            }
            const teamUsers = await usersResponse.json();
    
            // Step 2: Update each user's record to remove team association
            await Promise.all(teamUsers.map(async (user) => {
                const updateResponse = await fetch(`http://localhost:8080/users/update/${user.user_id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ team: null })  // Set the team field to null
                });
                if (!updateResponse.ok) {
                    console.error(`Failed to update user ${user.user_id}`);
                }
            }));
    
            // Step 3: Delete the team
            const deleteResponse = await fetch(`http://localhost:8080/teams/${teamid}`, {
                method: 'DELETE',
            });
    
            if (deleteResponse.ok) {
                fetchTeams();
            } else {
                console.error('Failed to delete team:', deleteResponse.statusText);
            }
        } catch (error) {
            console.error('Error handling team deletion:', error);
        }
    };
    
    // Search and filter teams based on the search query
    const filteredTeams = teams.filter(team =>
        team.teamname.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const currentTeams = filteredTeams.slice(indexOfFirstTeam, indexOfLastTeam);

    const totalPages = Math.ceil(filteredTeams.length / teamsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="app-container">
            <Sidenav />
            <div className="main-content">
                <div className="container mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h1>Teams</h1>
                    </div>
                    <div className="search-create-container d-flex align-items-center mb-3">
                        <div className="search-wrapper">
                            <Form.Control
                                type="text"
                                placeholder="Search teams"
                                className="search-bar"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Search
                                size={15}
                                className="search-icon"
                            />
                        </div>
                        <Button variant="primary" onClick={handleShow} id='createteam-btn'>
                            Create Team
                        </Button>
                    </div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Team Name</th>
                                <th>Team Members</th>
                                <th>More Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTeams && currentTeams.length > 0 ? (
                                currentTeams.map((team) => (
                                    <tr key={team.teamid}>
                                        <td>{team.teamname}</td>
                                        <td>{team.members.map(m => m.firstName).join(', ')}</td>
                                        <td>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                                    ...
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu>
                                                    <Dropdown.Item onClick={() => handleDeleteTeam(team.teamid)} className="text-danger">
                                                        Delete Team
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center' }}>No teams available</td>
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
                    
                    {/* Modal for creating a team */}
                    <Modal show={showModal} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Team</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Team Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter team name"
                                        name="teamname"
                                        value={newTeam.teamname}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Who Should be in this team?</Form.Label>
                                    <div className="member-input">
                                        <Form.Control
                                            as="select"
                                            value={selectedUser}
                                            onChange={(e) => setSelectedUser(e.target.value)}
                                        >
                                            <option value="">Choose people</option>
                                            {users && users.length > 0 ? (
                                                users.map(user => (
                                                    <option key={user.user_id} value={user.firstName}>
                                                        {user.firstName}
                                                    </option>
                                                ))
                                            ) : (
                                                <option>No users available</option>
                                            )}
                                        </Form.Control>
                                        <Button className="btn-add-member" variant="secondary" onClick={handleAddMember}>
                                            Add People
                                        </Button>
                                    </div>
                                    <div className="members-list mt-2">
                                        {newTeam.members.map((member) => (
                                            <Badge
                                                key={member.user_id}
                                                pill
                                                bg="secondary"
                                                className="me-2 custom-badge"
                                                onClick={() => handleRemoveMember(member.user_id)}
                                                style={{ cursor: 'pointer'}}
                                            >
                                                {member.firstName} <span className="ms-2">x</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleAddTeam}>
                                Add Team
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default Teams;
