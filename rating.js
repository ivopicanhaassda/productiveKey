// Sistema de avaliação com estrelas
function initStarRating() {
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-rating');
            ratingInput.value = rating;
            
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
        
        // Efeito hover
        star.addEventListener('mouseenter', function() {
            const rating = this.getAttribute('data-rating');
            stars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.style.transform = 'scale(1.1)';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.style.transform = '';
            });
        });
    });
}

// Função para obter texto do impacto meteorológico
function getWeatherImpactText(impact) {
    const impacts = {
        'very': 'Muito - o tempo influencia bastante o meu trabalho',
        'moderate': 'Moderadamente - afeta em algumas situações', 
        'little': 'Pouco - quase não noto diferença',
        'none': 'Nada - não afeta o meu trabalho'
    };
    return impacts[impact] || impact;
}

// Inicializar estrelas mesmo que o main.js falhe
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.star')) {
        initStarRating();
    }
});
