// Configurações da API
const API_KEY = "6db79bbc28c06835ffe6a5691e6d68f6";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Cidades para mostrar dados
const cities = [
    { name: "Lisboa", lat: 38.7167, lon: -9.1333 },
    { name: "Porto", lat: 41.1496, lon: -8.611 },
    { name: "Faro", lat: 37.0194, lon: -7.9322 },
    { name: "Coimbra", lat: 40.2111, lon: -8.4291 },
    { name: "Braga", lat: 41.5503, lon: -8.4201 }
];

// Cache para dados meteorológicos
let weatherCache = {
    data: null,
    timestamp: 0,
    ttl: 300000 // 5 minutos
};

// Dark Mode Functionality
function initDarkMode() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Alternar tema escuro/claro');
    document.body.appendChild(themeToggle);

    // Verificar preferência do usuário
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '☀️';
    }

    // Alternar tema
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.innerHTML = '🌙';
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '☀️';
            localStorage.setItem('theme', 'dark');
        }
    });

    // Ouvir mudanças de preferência do sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '☀️';
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeToggle.innerHTML = '🌙';
            }
        }
    });
}

// Statistics removed: loadStatistics and related DB-driven updates were removed

// Função para mostrar notificações melhorada
function showNotification(title, message, duration = 4000) {
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    
    notificationTitle.textContent = title;
    notificationMessage.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// Função para rastrear transferências
function trackDownload() {
    console.log('Transferência iniciada:', new Date().toLocaleString());
    showNotification('Transferência Iniciada', '📱 A transferência começará brevemente! Verifique o seu gestor de transferências.');
    
    // Transfer tracking kept, but removed statistics increment (section removed)
    
    // Pode adicionar Google Analytics aqui
    // gtag('event', 'download', {'event_category': 'app'});
}

// Obter dados meteorológicos da API com cache
async function fetchWeatherData(lat, lon, cityName) {
    // Verificar cache
    const now = Date.now();
    if (weatherCache.data && (now - weatherCache.timestamp) < weatherCache.ttl) {
        return weatherCache.data;
    }

    try {
        const response = await fetch(
            `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt`
        );
        
        if (!response.ok) {
            throw new Error('Erro ao obter dados meteorológicos');
        }
        
        const data = await response.json();
        const processedData = {
            location: cityName,
            temp: `${Math.round(data.main.temp)}°C`,
            condition: getWeatherCondition(data.weather[0].id),
            humidity: `${data.main.humidity}%`,
            wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
            productivity: calculateProductivity(data),
            score: calculateProductivityScore(data)
        };
        
        // Atualizar cache
        weatherCache.data = processedData;
        weatherCache.timestamp = now;
        
        return processedData;
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return null;
    }
}

// Converter código de condição meteorológica em emoji e descrição
function getWeatherCondition(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return '⛈️ Tempestade';
    if (weatherId >= 300 && weatherId < 400) return '🌧️ Chuvisco';
    if (weatherId >= 500 && weatherId < 600) return '🌧️ Chuva';
    if (weatherId >= 600 && weatherId < 700) return '❄️ Neve';
    if (weatherId >= 700 && weatherId < 800) return '🌫️ Neblina';
    if (weatherId === 800) return '☀️ Ensolarado';
    if (weatherId === 801) return '🌤️ Poucas Nuvens';
    if (weatherId === 802) return '⛅ Parcialmente Nublado';
    if (weatherId === 803 || weatherId === 804) return '☁️ Nublado';
    return '🌤️ Condições Variáveis';
}

// Calcular nível de produtividade baseado no tempo
function calculateProductivity(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].id;
    
    let productivity = 0;
    
    if (temp >= 18 && temp <= 24) productivity += 3;
    else if (temp >= 15 && temp <= 27) productivity += 2;
    else if (temp >= 10 && temp <= 30) productivity += 1;
    
    if (humidity >= 40 && humidity <= 60) productivity += 2;
    else if (humidity >= 30 && humidity <= 70) productivity += 1;
    
    if (condition === 800) productivity += 2;
    else if (condition >= 801 && condition <= 802) productivity += 1;
    
    if (productivity >= 5) return "Alta";
    if (productivity >= 3) return "Média-Alta";
    if (productivity >= 2) return "Média";
    return "Média-Baixa";
}

// Calcular percentagem de produtividade
function calculateProductivityScore(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].id;
    
    let score = 70;
    
    score += Math.max(-20, Math.min(20, (21 - Math.abs(21 - temp)) * 2));
    score += Math.max(-10, Math.min(10, (50 - Math.abs(50 - humidity)) / 2));
    
    if (condition === 800) score += 10;
    else if (condition >= 801 && condition <= 802) score += 5;
    else if (condition >= 700 && condition < 800) score -= 5;
    else if (condition >= 600 && condition < 700) score -= 10;
    else if (condition >= 500 && condition < 600) score -= 8;
    else if (condition >= 300 && condition < 400) score -= 5;
    else if (condition >= 200 && condition < 300) score -= 15;
    
    return Math.max(50, Math.min(98, Math.round(score))) + "% Foco";
}

// Atualizar dados meteorológicos
async function updateWeatherData() {
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const weatherData = await fetchWeatherData(randomCity.lat, randomCity.lon, randomCity.name);
    
    if (weatherData) {
        document.getElementById('current-location').textContent = `📍 ${weatherData.location}`;
        document.getElementById('current-temp').textContent = weatherData.temp;
        document.getElementById('current-condition').textContent = weatherData.condition;
        document.getElementById('current-humidity').textContent = weatherData.humidity;
        document.getElementById('current-wind').textContent = weatherData.wind;
        document.getElementById('productivity-level').textContent = weatherData.productivity;
        document.getElementById('weather-score').textContent = weatherData.score;
    } else {
        // Fallback para dados simulados
        const fallbackData = [
            { location: "Lisboa", temp: "22°C", condition: "☀️ Ensolarado", humidity: "65%", wind: "15 km/h", productivity: "Alta", score: "92%" },
            { location: "Porto", temp: "18°C", condition: "⛅ Parcialmente Nublado", humidity: "72%", wind: "12 km/h", productivity: "Média-Alta", score: "87%" }
        ];
        
        const randomData = fallbackData[Math.floor(Math.random() * fallbackData.length)];
        
        document.getElementById('current-location').textContent = `📍 ${randomData.location}`;
        document.getElementById('current-temp').textContent = randomData.temp;
        document.getElementById('current-condition').textContent = randomData.condition;
        document.getElementById('current-humidity').textContent = randomData.humidity;
        document.getElementById('current-wind').textContent = randomData.wind;
        document.getElementById('productivity-level').textContent = randomData.productivity;
        document.getElementById('weather-score').textContent = randomData.score;
        
        showNotification('Atenção', '⚠️ A usar dados simulados - API meteorológica temporariamente indisponível');
    }
}

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
                    s.style.transform = 'scale(1.15)';
                    s.style.transition = 'transform 0.2s ease';
                } else {
                    s.style.transform = 'scale(1)';
                    s.style.transition = 'transform 0.2s ease';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            stars.forEach(s => {
                s.style.transform = 'scale(1)';
                s.style.transition = 'transform 0.2s ease';
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

// Função para enviar email usando EmailJS (apenas UM email)
async function sendReviewEmail(reviewData) {
    const templateParams = {
        to_email: 'papproductivekey@gmail.com',
        from_name: reviewData.userName,
        from_email: reviewData.userEmail,
        rating: reviewData.rating + ' estrelas',
        experience: reviewData.userExperience,
        weather_impact: getWeatherImpactText(reviewData.weatherImpact),
        timestamp: reviewData.timestamp,
        subject: `Nova Avaliação - ${reviewData.rating} estrelas - ${reviewData.userName}`
    };

    try {
        const response = await emailjs.send(
            'service_aou9kya',
            'template_jyte39w', // ✅ APENAS ESTE TEMPLATE
            templateParams
        );
        
        console.log('✅ Email enviado com sucesso');
        return response;
    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        throw error;
    }
}

// Formulário de avaliação SIMPLIFICADO
document.getElementById('reviewForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const userEmail = document.getElementById('userEmail').value;
    const rating = document.getElementById('rating').value;
    const userExperience = document.getElementById('userExperience').value;
    const weatherImpact = document.getElementById('weatherImpact').value;
    
    if (!rating) {
        showNotification('Atenção', 'Por favor, selecione uma avaliação com as estrelas.');
        return;
    }
    
    try {
        // Mostrar loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="loading"></span> A enviar...';
        submitBtn.disabled = true;
        
        // Enviar email usando EmailJS
        await sendReviewEmail({
            userName,
            userEmail,
            rating,
            userExperience,
            weatherImpact,
            timestamp: new Date().toLocaleString('pt-PT')
        });
        
        showNotification('Sucesso!', `Obrigado, ${userName}! A sua avaliação de ${rating} estrelas foi enviada com sucesso.`);
        this.reset();
        
        document.querySelectorAll('.star').forEach(star => {
            star.classList.remove('active');
        });
        
    } catch (error) {
        console.error('Erro ao enviar review:', error);
        showNotification('Erro', 'Não foi possível enviar a sua avaliação. Tente novamente.');
    } finally {
        // Restaurar botão
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.innerHTML = '<span>📨 Enviar Avaliação</span>';
        submitBtn.disabled = false;
    }
});

// Animação de scroll para elementos
function animateOnScroll() {
    const featureCards = document.querySelectorAll('.feature-card');
    const steps = document.querySelectorAll('.step');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // (stat-card animations removed with the statistics section)
            }
        });
    }, { threshold: 0.1 });
    
    featureCards.forEach(card => observer.observe(card));
    steps.forEach(step => observer.observe(step));
}

// Animação de contagem para números
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        // Simple numeric animation; keep existing suffixes if present in the original text
        const suffix = element.textContent.includes('K') ? 'K+' : (element.textContent.includes('%') ? '%' : '');
        element.textContent = value + suffix;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function scrollToFeatures() {
    document.getElementById('features').scrollIntoView({
        behavior: 'smooth'
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.getElementById('header');
    const progressBar = document.getElementById('progressBar');
    
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
        // backToTop removed
    } else {
        header.classList.remove('scrolled');
        // backToTop removed
    }
    
    // Progress bar
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const scrollPercent = (scrollTop) / (docHeight - winHeight);
    const progressPercent = scrollPercent * 100;
    
    progressBar.style.width = progressPercent + '%';
}

// Back to top functionality
// initBackToTop removed along with the Back-to-Top button

// Mobile menu functionality - CORRIGIDA
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    // Create overlay for mobile nav
    let navOverlay = document.querySelector('.nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'nav-overlay';
        document.body.appendChild(navOverlay);
    }

    function openMenu() {
        navLinks.classList.add('active');
        navOverlay.classList.add('show');
        mobileMenuBtn.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        navLinks.setAttribute('aria-hidden', 'false');
        // move focus to first link for accessibility
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinks.classList.remove('active');
        navOverlay.classList.remove('show');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        mobileMenuBtn.focus();
    }

    mobileMenuBtn.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) closeMenu();
        else openMenu();
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close when clicking on overlay
    navOverlay.addEventListener('click', closeMenu);

    // Close with Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Mobile mode (simulated phone layout) toggle
function initMobileModeToggle() {
    const btn = document.getElementById('mobileToggle');
    if (!btn) return;

    function enableMobileMode() {
        document.documentElement.setAttribute('data-mode', 'mobile');
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('active');
        btn.title = 'Desativar modo telemóvel';
        localStorage.setItem('mobileMode', 'on');
    }

    function disableMobileMode() {
        document.documentElement.removeAttribute('data-mode');
        btn.setAttribute('aria-pressed', 'false');
        btn.classList.remove('active');
        btn.title = 'Ativar modo telemóvel';
        localStorage.setItem('mobileMode', 'off');
    }

    // Ensure navLinks has aria-hidden in sync with state
    if (navLinks.classList.contains('active')) navLinks.setAttribute('aria-hidden', 'false');
    else navLinks.setAttribute('aria-hidden', 'true');

    // Restore saved preference
    const saved = localStorage.getItem('mobileMode');
    if (saved === 'on') enableMobileMode();

    // Toggle on click
    btn.addEventListener('click', () => {
        if (document.documentElement.getAttribute('data-mode') === 'mobile') disableMobileMode();
        else enableMobileMode();
    });

    // Keyboard accessibility
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
}

// App Modal Functions
function openAppModal() {
    const modal = document.getElementById('appModal');
    const videoPlayer = document.getElementById('appVideoPlayer');
    
    modal.classList.add('active');
    videoPlayer.play();
    document.body.style.overflow = 'hidden';
}

function closeAppModal() {
    const modal = document.getElementById('appModal');
    const videoPlayer = document.getElementById('appVideoPlayer');
    
    modal.classList.remove('active');
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
    document.body.style.overflow = 'auto';
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode(); // Inicializar tema escuro/claro
    animateOnScroll();
    initStarRating();
    updateWeatherData();
    initMobileMenu();
    
    window.addEventListener('scroll', handleHeaderScroll);
    initMobileModeToggle(); // initialize mobile-mode toggle
    
    // Atualizar dados meteorológicos a cada 30 segundos
    setInterval(updateWeatherData, 30000);
    
    // App Modal event listeners
    const modal = document.getElementById('appModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const downloadBtn = document.querySelector('.btn-download');
    const appButton = document.querySelector('.app-button');
    const previewClickable = document.getElementById('previewClickable');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeAppModal);
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', closeAppModal);
    }
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openAppModal();
        });
    }
    
    if (appButton) {
        appButton.addEventListener('click', openAppModal);
    }
    
    if (previewClickable) {
        previewClickable.addEventListener('click', openAppModal);
    }
    
    // Fechar modal com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('appModal');
            if (modal.classList.contains('active')) {
                closeAppModal();
            }
        }
    });
});