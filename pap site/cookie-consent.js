(function () {
    var CONSENT_KEY = 'pk_cookie_consent_v1';

    function getConsent() {
        return localStorage.getItem(CONSENT_KEY);
    }

    function setConsent(value) {
        localStorage.setItem(CONSENT_KEY, value);
        localStorage.setItem(CONSENT_KEY + '_updated_at', new Date().toISOString());
        window.dispatchEvent(new CustomEvent('pk:consent-updated', { detail: { consent: value } }));
    }

    function injectStyles() {
        if (document.getElementById('cookie-consent-styles')) return;

        var style = document.createElement('style');
        style.id = 'cookie-consent-styles';
        style.textContent = '\n            .cookie-consent-banner {\n                position: fixed;\n                left: 16px;\n                right: 16px;\n                bottom: 16px;\n                z-index: 3000;\n                background: rgba(255, 255, 255, 0.94);\n                border: 1px solid rgba(37, 99, 235, 0.2);\n                border-radius: 18px;\n                box-shadow: 0 14px 40px rgba(0, 0, 0, 0.18);\n                backdrop-filter: blur(8px);\n                padding: 14px 16px;\n                max-width: 900px;\n                margin: 0 auto;\n                font-family: Inter, sans-serif;\n            }\n            .cookie-consent-content {\n                display: flex;\n                gap: 14px;\n                align-items: center;\n                justify-content: space-between;\n                flex-wrap: wrap;\n            }\n            .cookie-consent-text {\n                color: #1e293b;\n                font-size: 0.94rem;\n                line-height: 1.55;\n                flex: 1 1 480px;\n            }\n            .cookie-consent-text a {\n                color: inherit;\n                text-decoration: underline;\n            }\n            .cookie-consent-actions {\n                display: flex;\n                gap: 10px;\n                flex: 0 0 auto;\n            }\n            .cookie-btn {\n                border: 1px solid rgba(37, 99, 235, 0.25);\n                border-radius: 10px;\n                padding: 10px 14px;\n                cursor: pointer;\n                font-weight: 600;\n                font-family: Inter, sans-serif;\n            }\n            .cookie-btn-accept {\n                background: #2563eb;\n                color: white;\n            }\n            .cookie-btn-reject {\n                background: white;\n                color: #1e293b;\n            }\n            @media (max-width: 640px) {\n                .cookie-consent-banner { left: 10px; right: 10px; bottom: 10px; }\n                .cookie-consent-actions { width: 100%; }\n                .cookie-btn { flex: 1; }\n            }\n            [data-theme="dark"] .cookie-consent-banner {\n                background: rgba(30, 41, 59, 0.95);\n                border-color: rgba(148, 163, 184, 0.28);\n            }\n            [data-theme="dark"] .cookie-consent-text {\n                color: #e2e8f0;\n            }\n            [data-theme="dark"] .cookie-btn-reject {\n                background: rgba(51, 65, 85, 0.95);\n                color: #e2e8f0;\n                border-color: rgba(148, 163, 184, 0.28);\n            }\n        ';
        document.head.appendChild(style);
    }

    function createBanner() {
        if (document.getElementById('cookieConsentBanner')) return;

        var banner = document.createElement('div');
        banner.id = 'cookieConsentBanner';
        banner.className = 'cookie-consent-banner';
        banner.innerHTML = '\n            <div class="cookie-consent-content">\n                <div class="cookie-consent-text">\n                    Este site utiliza recursos de terceiros (YouTube, Botpress, EmailJS e OpenWeatherMap) para funcionalidades essenciais.\n                    Pode aceitar ou recusar a ativação destes serviços não essenciais.\n                    Consulte a <a href="politica-privacidade.html">Política de Privacidade</a>.\n                </div>\n                <div class="cookie-consent-actions">\n                    <button type="button" class="cookie-btn cookie-btn-reject" id="cookieRejectBtn">Recusar</button>\n                    <button type="button" class="cookie-btn cookie-btn-accept" id="cookieAcceptBtn">Aceitar</button>\n                </div>\n            </div>\n        ';

        document.body.appendChild(banner);

        document.getElementById('cookieAcceptBtn').addEventListener('click', function () {
            setConsent('accepted');
            banner.remove();
        });

        document.getElementById('cookieRejectBtn').addEventListener('click', function () {
            setConsent('rejected');
            banner.remove();
        });
    }

    function init() {
        injectStyles();

        var consent = getConsent();
        if (!consent) {
            createBanner();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
