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

// Ligar envio de avaliação via EmailJS
document.addEventListener('DOMContentLoaded', function() {
    const reviewForm = document.getElementById('reviewForm');
    if (!reviewForm || reviewForm.dataset.emailBound === 'true') return;

    reviewForm.dataset.emailBound = 'true';

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
});

// Função para enviar feedback beta usando EmailJS
async function sendBetaFeedbackEmail(feedbackData) {
    const templateParams = {
        to_email: 'papproductivekey@gmail.com',
        from_name: feedbackData.userName,
        from_email: feedbackData.userEmail,
        rating: 'Feedback Beta',
        experience: feedbackData.message,
        weather_impact: 'N/A',
        timestamp: feedbackData.timestamp,
        subject: `Novo Feedback Beta - ${feedbackData.userName}`
    };

    try {
        const response = await emailjs.send(
            'service_aou9kya',
            'template_jyte39w',
            templateParams
        );
        console.log('✅ Feedback enviado com sucesso');
        return response;
    } catch (error) {
        console.error('❌ Erro ao enviar feedback:', error);
        throw error;
    }
}
