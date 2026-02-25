// ================================
// SCROLL ANIMATIONS - Profissional
// Sistema avançado com Intersection Observer
// ================================

class ScrollAnimations {
    constructor() {
        this.activePhones = new Set();
        this.init();
    }

    init() {
        this.setupObserver();
        this.setupMouseTracking();
    }

    setupObserver() {
        const options = {
            threshold: [0.05, 0.25, 0.5],
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Adiciona a classe show com delay em cascata
                    setTimeout(() => {
                        entry.target.classList.add('show');
                        this.activePhones.add(entry.target);
                        this.setupPhoneHoverListener(entry.target);
                    }, index * 100);
                    
                    // Desobserva após aparecer para melhor performance
                    observer.unobserve(entry.target);
                } else {
                    // Remove do set quando sai do viewport
                    this.activePhones.delete(entry.target);
                }
            });
        }, options);

        // Observar todos os elementos com scroll-animate
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Setup de listeners para cada iPhone
     * Detecta hover para pausar animação contínua
     */
    setupPhoneHoverListener(phoneContainer) {
        phoneContainer.addEventListener('mouseenter', () => {
            // Pausa a animação contínua ao hover
            phoneContainer.style.animationPlayState = 'paused';
        });

        phoneContainer.addEventListener('mouseleave', () => {
            // Retoma a animação contínua ao sair do hover
            phoneContainer.style.animationPlayState = 'running';
        });
    }

    /**
     * Sistema de parallax suave com movimento do mouse
     * Cria efeito 3D elegante sem comprometer performance
     */
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.activePhones.forEach(phone => {
                // Só aplica parallax se não estiver em hover
                if (phone.matches(':hover')) return;

                // Calcula posição relativa do mouse
                const rect = phone.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                // Ângulo do movimento do mouse
                const angleX = (e.clientY - centerY) * 0.008;
                const angleY = (e.clientX - centerX) * 0.008;
                
                // Aplicação suave com requestAnimationFrame
                requestAnimationFrame(() => {
                    // Blenda a rotação do parallax com a animação contínua
                    phone.style.setProperty('--parallax-x', `${angleX}deg`);
                    phone.style.setProperty('--parallax-y', `${angleY}deg`);
                });
            });
        });

        // Reset ao sair do documento
        document.addEventListener('mouseleave', () => {
            this.activePhones.forEach(phone => {
                phone.style.setProperty('--parallax-x', '0deg');
                phone.style.setProperty('--parallax-y', '0deg');
            });
        });
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    
    // Log para debug
    console.log('✨ Sistema de animações profissional carregado com sucesso');
    console.log('🎬 Animações contínuas ativadas - os iPhones flutuam continuamente!');
});
