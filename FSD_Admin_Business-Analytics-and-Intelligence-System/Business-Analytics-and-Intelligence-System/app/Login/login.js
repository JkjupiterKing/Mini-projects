
document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;

        if (email.trim() !== '' && password.trim() !== '') {
            // Fetch all users
            var userFetchUrl = 'http://localhost:8080/users/all';

            fetch(userFetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users.');
                }
                return response.json();
            })
            .then(users => {
                // Find the user based on email and password
                let userFound = users.find(user => user.email === email && user.password === password); // Simple comparison (password should be hashed)
                
                if (userFound) {
                    // Store user information in localStorage with roleId
                    const userToStore = {
                        userId:userFound.userId,
                        email: userFound.email,
                        roleId: userFound.role.roleId,
                        username : userFound.username,
                        salary: userFound.salary, 
                        roleName:userFound.role.roleName
                    };
                    localStorage.setItem('user', JSON.stringify(userToStore));
                    
                    // Log the stored user information
                    console.log('User stored in localStorage:', userToStore);

                    // Redirect based on roleId
                    if (userFound.role.roleId === 5) {
                        window.location.href = '../../app/User-dashboard/UserDashboard.html'; 
                    } else {
                        window.location.href = '../../app/dashboard/dashboard.html';      
                    }

                } else {
                    alert('Invalid email or password. Please check your credentials.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            });
        } else {
            alert('Please enter email and password.');
        }
    });
    const forgotPasswordLink = document.querySelector('.forgot-password-link');
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    forgotPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        modal.show();
    });
});

// JavaScript code to handle forgot password form submission
document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    // Get the email entered by the user
    var email = document.getElementById('forgotEmail').value;
    var newPassword = document.getElementById('newPassword').value;

    // Send a request to your backend API to handle password reset
    var resetPasswordUrl = 'http://localhost:8080/users/reset-password'; // Replace with your actual API endpoint
    console.log("calling API");
    fetch(resetPasswordUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password:newPassword })
    })
    .then(response => {
        console.log('response',response);
        if (response.status==404) {
            alert('Email ID not found in the system, please enter valid email id.');
            // $('#forgotPasswordModal').modal('hide'); // Hide the modal after success
        } else if (response.ok) {
            alert('Password has been reset. Please login using the new password.');
            $('#forgotPasswordModal').modal('hide'); // Hide the modal after success
        } else {
            $('#forgotPasswordModal').modal('hide'); // Hide the modal after success
            throw new Error('Failed to reset password. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to reset password. Please try again.');
    });
});



       
       
  