//scripts for page loader
window.addEventListener('load', function () {
    const loadingOverlay = document.getElementById('loading-overlay');
    const content = document.getElementById('content');
    
    loadingOverlay.style.display = 'none';
    content.style.display = 'block';
  });
  


document.getElementById('button-addon2').addEventListener('click', function() {
    var searchQuery = document.getElementById('searchBar').value.toLowerCase();
    var tutorCards = document.querySelectorAll('.card');

    if (searchQuery.trim() === '') {
        // If search query is empty, reset display of all tutor cards
        tutorCards.forEach(function(card) {
            card.style.display = 'block';
        });
    } else {
        tutorCards.forEach(function(card) {
            var subjectText = card.querySelector('.subject').textContent.toLowerCase();
            var locationText = card.querySelector('.location').textContent.toLowerCase();
            var experienceText = card.querySelector('.experience').textContent.toLowerCase();
            var nameText = card.querySelector('.tutortitle').textContent.toLowerCase();

            if (subjectText.includes(searchQuery) || 
                locationText.includes(searchQuery) || 
                experienceText.includes(searchQuery) || 
                nameText.includes(searchQuery)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
});



    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.display = 'none';
    });

    // Initialize AOS
    AOS.init();




