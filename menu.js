// Get references to the menu button and dropdown menu
const menuBtn = document.getElementById('menu-btn');
const dropdownMenu = document.getElementById('menu-dropdown');

// Toggle the visibility of the dropdown menu when the menu button is clicked
menuBtn.addEventListener('click', function() {
    // Toggle the "hidden" class to show or hide the dropdown menu
    dropdownMenu.classList.toggle('hidden');
});
