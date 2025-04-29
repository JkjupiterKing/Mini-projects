document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('submit');

    submitButton.addEventListener('click', function (event) {
        event.preventDefault(); 

        // Retrieve input field data
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const address = document.getElementById('address').value;
        const password = document.getElementById('password').value;

        // Prepare the data to be sent in the POST request
        const userData = {
            username: username, 
            email: email,
            password: password,
            address: address,
            phoneNumber: mobile 
        };

        // Make the POST request to the API endpoint
        fetch('http://localhost:8080/users/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle the response from the server
            alert('User registered successfully!');
            window.location.href = '../login/login.html'; // Redirect to login page
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch operation
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        });
    });
});
