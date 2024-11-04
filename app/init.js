function loadScript(src, callback) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.onload = callback;
    script.src = src;
    document.head.appendChild(script);
}

function getChatbotId() {
    var currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    return currentScript.getAttribute('data-chatbot-id');
}

var chatbotId = getChatbotId();

if (chatbotId) {
    console.log('chatbotId', chatbotId);
    loadScript('https://staging.eca.creai.mx/lib/chatbot.umd.js', function() {
        window.Chatbot.mount({
            chatbotId: chatbotId,
            wsUrl: 'wss://wcm5yje1j4.execute-api.us-east-1.amazonaws.com/staging/'
        });
    });
} else {
    console.error('chatbotId no está definido en los atributos del script.');
}
