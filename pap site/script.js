/**
 * VISUALIZAÇÕES DO IPHONE - FUNCIONALIDADE
 * Scripts para as páginas de visualização do controlador
 */

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    console.log('Página de visualização do iPhone carregada');
    
    // Adicionar animações de scroll se necessário
    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach(el => {
        el.classList.add('show');
    });
});
