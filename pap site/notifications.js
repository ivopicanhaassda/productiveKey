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
    
    // Pode adicionar Google Analytics aqui
    // gtag('event', 'download', {'event_category': 'app'});
}
