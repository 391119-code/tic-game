// Wait for the DOM to fully load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {

    // Grab the registration form
    const registerForm = document.getElementById('register-form');

    // Listen for when the user clicks "Sign Up"
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop the browser from refreshing the page

            // Grab the values the user typed in
            const username = document.getElementById('reg-username').value;
            const password = document.getElementById('reg-password').value;

            try {
                // Send a POST request to our server's /register route
                const response = await fetch('/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Send the data as a JSON string
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Success! 
                    alert('Registration successful! Welcome, ' + data.username);
                    // Clear the form
                    registerForm.reset();
                } else {
                    // The server sent back an error (like "Username already taken")
                    alert('Error: ' + data.error);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                alert('Something went wrong talking to the server.');
            }
        });
    }
});