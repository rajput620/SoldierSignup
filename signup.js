document.getElementById('signup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    // Check if email is already registered
    if (localStorage.getItem(email)) {
        alert('This email is already registered. Please log in.');
        return;
    }

    // Store user credentials securely in localStorage (not secure for production)
    localStorage.setItem(email, JSON.stringify({ password }));
    alert('Account created successfully! Please log in.');
    window.location.href = 'login.html';
});
