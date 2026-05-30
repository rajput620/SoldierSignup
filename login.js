document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    // Retrieve stored user data
    const userData = localStorage.getItem(email);

    if (!userData) {
        alert('Invalid email or account does not exist.');
        return;
    }

    const storedData = JSON.parse(userData);

    // Check if password matches
    if (storedData.password === password) {
        alert('Login successful!');
        localStorage.setItem('loggedInUser', email); // Store logged-in user session

        // Redirect to Soldier Security Page before Dashboard
        window.location.href = 'soldier-security.html';
    } else {
        alert('Incorrect password. Please try again.');
    }
});
