// Beta Feedback Handler - Scroll to Review Section
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('betaFeedbackForm');
    const nameInput = document.getElementById('betaName');
    const emailInput = document.getElementById('betaEmail');
    const messageInput = document.getElementById('betaMessage');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const userName = nameInput ? nameInput.value.trim() : '';
            const userEmail = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!userName || !userEmail || !message) {
                showNotification('Atenção', 'Por favor, preencha todos os campos do feedback.');
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'A enviar...';
            }

            try {
                await sendBetaFeedbackEmail({
                    userName,
                    userEmail,
                    message,
                    timestamp: new Date().toLocaleString('pt-PT')
                });
                showNotification('Sucesso!', 'Obrigado pelo feedback!');
                form.reset();
            } catch (error) {
                showNotification('Erro', 'Não foi possível enviar o feedback. Tente novamente.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enviar Feedback';
                }
            }
        });
    }
});
