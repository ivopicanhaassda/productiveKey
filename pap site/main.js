// Modal de vídeo removido

function animateOnScroll() {
    const featureCards = document.querySelectorAll('.feature-card');
    const steps = document.querySelectorAll('.step');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Remove a classe quando sai da viewport para permitir re-animação
                entry.target.classList.remove('visible');
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
    } else {
        header.classList.remove('scrolled');
    }
    
    // Progress bar
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset;
    const scrollPercent = (scrollTop) / (docHeight - winHeight);
    const progressPercent = scrollPercent * 100;
    
    progressBar.style.width = progressPercent + '%';
}

// Mobile menu functionality
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
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    navOverlay.addEventListener('click', closeMenu);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Mobile mode toggle
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

    const navLinks = document.getElementById('navLinks');
    if (navLinks.classList.contains('active')) navLinks.setAttribute('aria-hidden', 'false');
    else navLinks.setAttribute('aria-hidden', 'true');

    const saved = localStorage.getItem('mobileMode');
    if (saved === 'on') enableMobileMode();

    btn.addEventListener('click', () => {
        if (document.documentElement.getAttribute('data-mode') === 'mobile') disableMobileMode();
        else enableMobileMode();
    });

    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
        }
    });
}

// Formulário de avaliação
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm && reviewForm.dataset.emailBound === 'true') return;
    if (reviewForm) {
        reviewForm.addEventListener('submit', async function(e) {
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
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span class="loading"></span> A enviar...';
                submitBtn.disabled = true;
                
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
                const submitBtn = this.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<span>📨 Enviar Avaliação</span>';
                submitBtn.disabled = false;
            }
        });
    }
});

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    animateOnScroll();
    initStarRating();
    updateWeatherData();
    initMobileMenu();
    
    window.addEventListener('scroll', handleHeaderScroll);
    initMobileModeToggle();
    
    // Atualizar dados meteorológicos a cada 30 segundos
    setInterval(updateWeatherData, 30000);
    
    // Eventos do modal removidos
});
// ================================
// SCROLL ANIMATION SYSTEM - scroll-animations.js
// ================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = [];
        this.observer = null;
        this.lastScrollTop = 0;
        this.scrollDirection = 'down';
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollDirection();
        this.setupParallaxElements();
        this.animateOnLoad();
    }

    // Observer para elementos que entram na viewport
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Elemento entra na viewport - adiciona animação
                    entry.target.classList.add('show');
                    this.animateElement(entry.target);
                } else {
                    // Elemento sai da viewport - remove animação para repetir
                    entry.target.classList.remove('show');
                }
            });
        }, options);

        // Observar todos os elementos com classe scroll-animate
        document.querySelectorAll('.scroll-animate').forEach(element => {
            this.observer.observe(element);
        });
    }

    // Detectar direção do scroll
    setupScrollDirection() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.scrollDirection = scrollTop > this.lastScrollTop ? 'down' : 'up';
            this.lastScrollTop = scrollTop;
            
            // Animar elementos baseado na direção do scroll
            this.animateOnScroll();
        });
    }

    // Sistema de parallax
    setupParallaxElements() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.parallax) || 0.5;
                const elementTop = element.getBoundingClientRect().top + scrollTop;
                const elementCenter = elementTop + (element.offsetHeight / 2);
                const distance = (scrollTop + windowHeight / 2) - elementCenter;
                
                element.style.transform = `translateY(${distance * speed * 0.1}px)`;
            });
        });
    }

    // Animar elementos quando entram na viewport
    animateElement(element) {
        const animType = element.dataset.animType || 'up';
        const delay = element.dataset.delay || 0;
        const duration = element.dataset.duration || '0.8s';
        
        // Aplicar delay
        setTimeout(() => {
            element.style.animationDuration = duration;
            
            switch(animType) {
                case 'left':
                    element.classList.add('fade-in');
                    element.style.animation = `slideInLeft3D 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    break;
                case 'right':
                    element.classList.add('fade-in');
                    element.style.animation = `slideInRight3D 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    break;
                case 'up':
                    element.classList.add('fade-in');
                    element.style.animation = `slideInUp3D 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    break;
                case 'scale':
                    element.classList.add('fade-in');
                    element.style.animation = `scaleIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    break;
                case 'rotate':
                    element.classList.add('fade-in');
                    element.style.animation = `rotateInUp3D 0.8s ease-out forwards`;
                    break;
                case 'flip':
                    element.classList.add('fade-in');
                    element.style.animation = `flipInX3D 0.8s ease-out forwards`;
                    break;
                case 'zoom':
                    element.classList.add('fade-in');
                    element.style.animation = `zoomInSpin3D 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
                    break;
                default:
                    element.classList.add('fade-in');
            }
            
            // Marcar como animado
            element.dataset.animated = 'true';
            
        }, delay * 1000);
    }

    // Animações baseadas na posição do scroll
    animateOnScroll() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Progresso do scroll (0 a 1)
        const scrollProgress = scrollTop / (documentHeight - windowHeight);
        
        // Animar elementos com data-scroll-progress
        document.querySelectorAll('[data-scroll-progress]').forEach(element => {
            const start = parseFloat(element.dataset.scrollStart) || 0;
            const end = parseFloat(element.dataset.scrollEnd) || 1;
            
            if (scrollProgress >= start && scrollProgress <= end) {
                const progress = (scrollProgress - start) / (end - start);
                this.applyScrollProgress(element, progress);
            }
        });
        
        // Ativar/desativar classes baseado na direção do scroll
        document.body.classList.toggle('scroll-down', this.scrollDirection === 'down');
        document.body.classList.toggle('scroll-up', this.scrollDirection === 'up');
        
        // Adicionar classe quando scrolado
        if (scrollTop > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    }

    applyScrollProgress(element, progress) {
        const type = element.dataset.scrollProgress;
        
        switch(type) {
            case 'width':
                element.style.width = `${progress * 100}%`;
                break;
            case 'opacity':
                element.style.opacity = progress;
                break;
            case 'scale':
                const minScale = parseFloat(element.dataset.scrollMin) || 0.8;
                const maxScale = parseFloat(element.dataset.scrollMax) || 1;
                element.style.transform = `scale(${minScale + (progress * (maxScale - minScale))})`;
                break;
            case 'rotate':
                const rotate = parseFloat(element.dataset.scrollRotate) || 360;
                element.style.transform = `rotate(${progress * rotate}deg)`;
                break;
            case 'blur':
                const maxBlur = parseFloat(element.dataset.scrollBlur) || 10;
                element.style.filter = `blur(${(1 - progress) * maxBlur}px)`;
                break;
        }
    }

    // Animações na carga inicial
    animateOnLoad() {
        // Animar elementos visíveis na carga
        setTimeout(() => {
            document.querySelectorAll('.scroll-animate').forEach(element => {
                const rect = element.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.8) {
                    this.animateElement(element);
                }
            });
        }, 500);
    }

    // Reiniciar animações de elementos específicos
    resetAnimation(element) {
        element.classList.remove('fade-in');
        element.style.animation = '';
        element.dataset.animated = 'false';
        
        setTimeout(() => {
            this.observer.unobserve(element);
            this.observer.observe(element);
        }, 50);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
});
