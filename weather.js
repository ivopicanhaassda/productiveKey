// Configurações da API
const API_KEY = "6db79bbc28c06835ffe6a5691e6d68f6";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

// Cidades para mostrar dados
const cities = [
    { name: "Lisboa", lat: 38.7167, lon: -9.1333 },
    { name: "Porto", lat: 41.1496, lon: -8.611 },
    { name: "Faro", lat: 37.0194, lon: -7.9322 },
    { name: "Coimbra", lat: 40.2111, lon: -8.4291 },
    { name: "Braga", lat: 41.5503, lon: -8.4201 }
];

// Cache para dados meteorológicos
let weatherCache = {
    data: null,
    timestamp: 0,
    ttl: 300000 // 5 minutos
};

// Obter dados meteorológicos da API com cache
async function fetchWeatherData(lat, lon, cityName) {
    // Verificar cache
    const now = Date.now();
    if (weatherCache.data && (now - weatherCache.timestamp) < weatherCache.ttl) {
        console.log('Usando dados em cache para', cityName);
        return weatherCache.data;
    }

    try {
        const url = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt`;
        console.log('Fetching weather data from:', url.replace(API_KEY, '***'));
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.error('API Error:', response.status, response.statusText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Weather data received:', data);
        
        const processedData = {
            location: cityName,
            temp: `${Math.round(data.main.temp)}°C`,
            condition: getWeatherCondition(data.weather[0].id),
            humidity: `${data.main.humidity}%`,
            wind: `${Math.round(data.wind.speed * 3.6)} km/h`,
            productivity: calculateProductivity(data),
            score: calculateProductivityScore(data)
        };
        
        // Atualizar cache
        weatherCache.data = processedData;
        weatherCache.timestamp = now;
        
        console.log('Weather data processed successfully:', processedData);
        return processedData;
    } catch (error) {
        console.error('Erro ao buscar dados meteorológicos:', error);
        return null;
    }
}

// Converter código de condição meteorológica em emoji e descrição
function getWeatherCondition(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return '⛈️ Tempestade';
    if (weatherId >= 300 && weatherId < 400) return '🌧️ Chuvisco';
    if (weatherId >= 500 && weatherId < 600) return '🌧️ Chuva';
    if (weatherId >= 600 && weatherId < 700) return '❄️ Neve';
    if (weatherId >= 700 && weatherId < 800) return '🌫️ Neblina';
    if (weatherId === 800) return '☀️ Ensolarado';
    if (weatherId === 801) return '🌤️ Poucas Nuvens';
    if (weatherId === 802) return '⛅ Parcialmente Nublado';
    if (weatherId === 803 || weatherId === 804) return '☁️ Nublado';
    return '🌤️ Condições Variáveis';
}

// Calcular nível de produtividade baseado no tempo
function calculateProductivity(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].id;
    
    let productivity = 0;
    
    if (temp >= 18 && temp <= 24) productivity += 3;
    else if (temp >= 15 && temp <= 27) productivity += 2;
    else if (temp >= 10 && temp <= 30) productivity += 1;
    
    if (humidity >= 40 && humidity <= 60) productivity += 2;
    else if (humidity >= 30 && humidity <= 70) productivity += 1;
    
    if (condition === 800) productivity += 2;
    else if (condition >= 801 && condition <= 802) productivity += 1;
    
    if (productivity >= 5) return "Alta";
    if (productivity >= 3) return "Média-Alta";
    if (productivity >= 2) return "Média";
    return "Média-Baixa";
}

// Calcular percentagem de produtividade
function calculateProductivityScore(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const condition = data.weather[0].id;
    
    let score = 70;
    
    score += Math.max(-20, Math.min(20, (21 - Math.abs(21 - temp)) * 2));
    score += Math.max(-10, Math.min(10, (50 - Math.abs(50 - humidity)) / 2));
    
    if (condition === 800) score += 10;
    else if (condition >= 801 && condition <= 802) score += 5;
    else if (condition >= 700 && condition < 800) score -= 5;
    else if (condition >= 600 && condition < 700) score -= 10;
    else if (condition >= 500 && condition < 600) score -= 8;
    else if (condition >= 300 && condition < 400) score -= 5;
    else if (condition >= 200 && condition < 300) score -= 15;
    
    return Math.max(50, Math.min(98, Math.round(score))) + "% Foco";
}

// Atualizar dados meteorológicos
async function updateWeatherData() {
    console.log('===== INICIANDO updateWeatherData =====');
    try {
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        console.log('Atualizando dados meteorológicos para:', randomCity.name);
        
        const weatherData = await fetchWeatherData(randomCity.lat, randomCity.lon, randomCity.name);
        
        if (weatherData) {
            console.log('Atualizando elementos do DOM com dados:', weatherData);
            
            const elements = {
                'current-location': `📍 ${weatherData.location}`,
                'current-temp': weatherData.temp,
                'current-condition': weatherData.condition,
                'current-humidity': weatherData.humidity,
                'current-wind': weatherData.wind,
                'productivity-level': weatherData.productivity,
                'weather-score': weatherData.score
            };
            
            for (const [id, content] of Object.entries(elements)) {
                const element = document.getElementById(id);
                if (element) {
                    // Limpar elementos loading
                    const loadingSpan = element.querySelector('.loading');
                    if (loadingSpan) {
                        loadingSpan.remove();
                    }
                    
                    element.textContent = content;
                    console.log(`Atualizado ${id}: ${content}`);
                } else {
                    console.warn(`Elemento com ID "${id}" não encontrado no DOM`);
                }
            }
        } else {
            console.log('Dados da API não disponíveis, usando fallback');
            // Fallback para dados simulados
            const fallbackData = [
                { location: "Lisboa", temp: "22°C", condition: "☀️ Ensolarado", humidity: "65%", wind: "15 km/h", productivity: "Alta", score: "92% Foco" },
                { location: "Porto", temp: "18°C", condition: "⛅ Parcialmente Nublado", humidity: "72%", wind: "12 km/h", productivity: "Média-Alta", score: "87% Foco" }
            ];
            
            const randomData = fallbackData[Math.floor(Math.random() * fallbackData.length)];
            
            const elements = {
                'current-location': `📍 ${randomData.location}`,
                'current-temp': randomData.temp,
                'current-condition': randomData.condition,
                'current-humidity': randomData.humidity,
                'current-wind': randomData.wind,
                'productivity-level': randomData.productivity,
                'weather-score': randomData.score
            };
            
            for (const [id, content] of Object.entries(elements)) {
                const element = document.getElementById(id);
                if (element) {
                    // Limpar elementos loading
                    const loadingSpan = element.querySelector('.loading');
                    if (loadingSpan) {
                        loadingSpan.remove();
                    }
                    
                    element.textContent = content;
                }
            }
            
            if (typeof showNotification === 'function') {
                showNotification('Atenção', '⚠️ A usar dados simulados - API meteorológica temporariamente indisponível');
            }
        }
    } catch (error) {
        console.error('Erro geral ao atualizar dados meteorológicos:', error);
    }
}

// Garantir que a função é chamada quando a página carrega
console.log('Weather.js carregado com sucesso');

// Inicialização automática se DOMContentLoaded já foi acionado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateWeatherData);
    console.log('DOMContentLoaded listener adicionado ao weather.js');
} else {
    // Página já carregou
    console.log('Página já está carregada, chamando updateWeatherData imediatamente');
    updateWeatherData();
}

// Também chamar a cada 30 segundos como fallback
setInterval(updateWeatherData, 30000);
