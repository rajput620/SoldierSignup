// Get modal elements
const modal = document.getElementById('edit-profile-modal');
const editBtn = document.getElementById('edit-profile-btn');
const closeBtn = document.querySelector('.close-btn');
const form = document.getElementById('edit-profile-form');

// Show modal
editBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal on outside click
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle form submission
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent page reload

    // Get updated values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rank = document.getElementById('rank').value;
    const unit = document.getElementById('unit').value;

    // Update profile section
    document.querySelector('#profile strong').innerText = name;
    const profileDetails = document.querySelectorAll('#profile ul li');
    profileDetails[0].innerHTML = `<strong>Email:</strong> ${email}`;
    profileDetails[1].innerHTML = `<strong>Rank:</strong> ${rank}`;
    profileDetails[2].innerHTML = `<strong>Unit:</strong> ${unit}`;

    // Close the modal
    modal.style.display = 'none';
});
