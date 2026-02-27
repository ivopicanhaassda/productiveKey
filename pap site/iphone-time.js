// ================================
// IPHONE TIME - Sistema Profissional
// Atualização suave com animações elegantes
// ================================

class IphoneTimeManager {
    constructor() {
        this.timeElements = {
            time: document.getElementById('time'),
            time2: document.getElementById('time2'),
            time3: document.getElementById('time3')
        };
        
        this.lastTime = null;
        this.init();
    }

    init() {
        // Atualiza imediatamente
        this.updateTimes();
        
        // Atualiza a cada minuto
        setInterval(() => this.updateTimes(), 60000);
        
        // Atualiza a cada segundo para fluidez (opcional)
        setInterval(() => this.updateTimeSmooth(), 1000);
    }

    /**
     * Atualiza o tempo com animação suave
     */
    updateTimes() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const newTime = `${hours}:${minutes}`;

        // Só atualiza se o tempo mudou
        if (this.lastTime !== newTime) {
            Object.values(this.timeElements).forEach(el => {
                if (el) {
                    this.animateTimeChange(el, newTime);
                }
            });
            
            this.lastTime = newTime;
        }
    }

    /**
     * Animação fluida ao mudar o tempo
     * Cria efeito elegante fade in/out com escala
     */
    animateTimeChange(element, newTime) {
        // Fade out
        element.style.opacity = '0';
        element.style.transform = 'scale(0.95) rotateX(-90deg)';
        element.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

        setTimeout(() => {
            element.textContent = newTime;
            
            // Fade in
            element.style.opacity = '1';
            element.style.transform = 'scale(1) rotateX(0deg)';
            
            // Adiciona brilho sutil
            this.addGlowEffect(element);
        }, 150);
    }

    /**
     * Atualização suave de segundos (opcional)
     * Para visualização fluida sem mudar o texto
     */
    updateTimeSmooth() {
        const now = new Date();
        const seconds = now.getSeconds();
        
        Object.values(this.timeElements).forEach(el => {
            if (el) {
                // Pequena animação de "pulse" visual
                if (seconds % 5 === 0) {
                    el.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        el.style.transform = 'scale(1)';
                    }, 100);
                }
            }
        });
    }

    /**
     * Efeito de brilho elegante ao atualizar
     */
    addGlowEffect(element) {
        element.style.boxShadow = '0 0 10px rgba(59, 130, 246, 0.3)';
        
        setTimeout(() => {
            element.style.boxShadow = '0 0 0px rgba(59, 130, 246, 0)';
            element.style.transition = 'box-shadow 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 100);
    }

    /**
     * Método para obter tempo atual formatado
     */
    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new IphoneTimeManager();
    console.log('⏰ Sistema de tempo profissional iniciado');
});
