// Sign Up Functionality
document.getElementById('signup-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    // Validate inputs
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Check if email already exists
    const existingUser = localStorage.getItem(email);
    if (existingUser) {
        alert('This email is already registered. Please log in.');
        return;
    }

    // Store user credentials securely in localStorage (not secure for production)
    localStorage.setItem(email, JSON.stringify({ password }));
    alert('Account created successfully! Please log in.');
    window.location.href = 'login.html';
});

// Log In Functionality
document.getElementById('login-form')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    // Validate inputs
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    // Retrieve user data
    const userData = localStorage.getItem(email);
    if (!userData) {
        alert('Invalid email or account does not exist.');
        return;
    }

    const storedData = JSON.parse(userData);

    // Validate credentials
    if (storedData.password === password) {
        alert('Login successful!');
        sessionStorage.setItem('loggedInUser', email); // Track logged-in user
        window.location.href = 'dashboard.html';
    } else {
        alert('Incorrect password. Please try again.');
    }
});

// Check if already logged in
function checkLogin() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    if (loggedInUser) {
        window.location.href = 'dashboard.html';
    }
}

// Call this function on the login page to handle redirection
checkLogin();

// Logout Functionality (Optional for dashboard.js)
function logout() {
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}
