(function () {
    var CONSENT_KEY = 'pk_cookie_consent_v1';

    function hasConsent() {
        return localStorage.getItem(CONSENT_KEY) === 'accepted';
    }

    function loadScript(src, id, attributes, callback) {
        if (id && document.getElementById(id)) {
            if (callback) callback();
            return;
        }

        var script = document.createElement('script');
        script.src = src;
        if (id) script.id = id;

        if (attributes) {
            Object.keys(attributes).forEach(function (key) {
                script.setAttribute(key, attributes[key]);
            });
        }

        if (callback) {
            script.onload = callback;
        }

        document.body.appendChild(script);
    }

    function initEmailJs(publicKey) {
        if (!publicKey) return;
        if (!window.emailjs || typeof window.emailjs.init !== 'function') return;

        try {
            window.emailjs.init(publicKey);
        } catch (error) {
            console.warn('EmailJS init falhou:', error);
        }
    }

    function loadThirdParties() {
        var body = document.body;

        if (body.dataset.requiresEmailjs === 'true') {
            var emailKey = body.dataset.emailjsKey || '';
            loadScript(
                'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js',
                'pk-emailjs-sdk',
                null,
                function () { initEmailJs(emailKey); }
            );
        }

        if (body.dataset.requiresBotpress === 'true') {
            loadScript('https://cdn.botpress.cloud/webchat/v3.3/inject.js', 'pk-botpress-core');
            loadScript(
                body.dataset.botpressScript || 'https://files.bpcontent.cloud/2025/02/20/16/20250220162029-UIHKCWPQ.js',
                'pk-botpress-bot',
                { defer: 'defer' }
            );
        }

        if (body.dataset.requiresYoutube === 'true') {
            loadScript('https://www.youtube.com/iframe_api', 'pk-youtube-api');
        }
    }

    function handleConsentState() {
        if (hasConsent()) {
            loadThirdParties();
        }
    }

    function init() {
        handleConsentState();
        window.addEventListener('pk:consent-updated', handleConsentState);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
