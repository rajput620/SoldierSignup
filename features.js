document.getElementById('more-features-btn').addEventListener('click', function() {
    const extraFeatures = document.getElementById('extra-features');
    const button = this;

    if (extraFeatures.style.display === 'none' || extraFeatures.style.display === '') {
        extraFeatures.style.display = 'block';
        button.textContent = 'See Less';
    } else {
        extraFeatures.style.display = 'none';
        button.textContent = 'See More';
    }
});
