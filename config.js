/**
 * Configuración global de CARTEL TV
 * @fileoverview Constantes y configuraciones centralizadas
 */

const CONFIG = {
    // Información de la aplicación
    APP: {
        NAME: 'CARTEL TV',
        VERSION: '3.0.0',
        DESCRIPTION: 'Plataforma multimedia con series, anime y noticias',
        AUTHOR: 'Cartel TV Soporte'
    },

    // Configuración de caché
    CACHE: {
        TV_SHOWS_KEY: 'carteltv_tvshows_v3',
        TV_SHOWS_TIME_KEY: 'carteltv_tvshows_time_v3',
        TV_CATEGORIES_KEY: 'carteltv_tv_categories_v3',
        ANIME_KEY: 'carteltv_anime_v3',
        ANIME_TIME_KEY: 'carteltv_anime_time_v3',
        ANIME_CATEGORIES_KEY: 'carteltv_anime_categories_v3',
        UPDATE_INTERVAL: 3600000, // 1 hora en milisegundos
        MAX_AGE: 86400000 // 24 horas en milisegundos
    },

    // Configuración de autenticación
    AUTH: {
        SESSION_KEY: 'carteltv_current_user',
        SESSION_ID_KEY: 'carteltv_session_id',
        LAST_LOGIN_KEY: 'carteltv_last_login',
        LOGIN_ATTEMPTS_KEY: 'carteltv_login_attempts',
        MAX_ATTEMPTS: 5,
        LOCK_TIME: 300000, // 5 minutos
        ATTEMPT_WINDOW: 900000, // 15 minutos
        SESSION_DURATION: 86400000 // 24 horas
    },

    // URLs de APIs
    API: {
        TVMAZE: {
            BASE_URL: 'https://api.tvmaze.com',
            ENDPOINTS: {
                SHOWS_PAGE: (page) => `/shows?page=${page}`,
                SCHEDULE: (country) => `/schedule?country=${country}`,
                SHOW_DETAILS: (id) => `/shows/${id}`,
                SHOW_EPISODES: (id) => `/shows/${id}/episodes`,
                SEARCH: (query) => `/search/shows?q=${encodeURIComponent(query)}`
            },
            TIMEOUT: 10000,
            HEADERS: {
                'Accept': 'application/json',
                'User-Agent': 'CARTEL-TV/3.0'
            }
        },
        JIKAN: {
            BASE_URL: 'https://api.jikan.moe/v4',
            ENDPOINTS: {
                TOP_ANIME: (filter, limit) => `/top/anime?filter=${filter}&limit=${limit}`,
                ANIME_DETAILS: (id) => `/anime/${id}`,
                ANIME_EPISODES: (id) => `/anime/${id}/episodes`,
                SEARCH: (query) => `/anime?q=${encodeURIComponent(query)}&limit=20`
            },
            TIMEOUT: 10000,
            HEADERS: {
                'Accept': 'application/json',
                'User-Agent': 'CARTEL-TV/3.0'
            }
        }
    },

    // Configuración de UI
    UI: {
        DEBOUNCE_SEARCH: 300, // ms
        NOTIFICATION_DURATION: 3000, // ms
        MODAL_ANIMATION_DURATION: 300, // ms
        MAX_RESULTS_PER_SECTION: 5,
        MAX_ITEMS_DISPLAY: 100,
        ITEMS_PER_PAGE: 20,
        IMAGE_LAZY_LOAD_THRESHOLD: 6 // Primeras 6 imágenes sin lazy loading
    },

    // Categorías de contenido
    CATEGORIES: {
        TV: {
            drama: ['drama', 'soap', 'medical', 'legal', 'family'],
            comedy: ['comedy', 'sitcom', 'stand-up', 'parody', 'gag'],
            action: ['action', 'adventure', 'thriller', 'martial', 'war'],
            'sci-fi': ['science-fiction', 'fantasy', 'supernatural', 'horror', 'superhero'],
            crime: ['crime', 'mystery', 'detective', 'police', 'noir'],
            reality: ['reality', 'talk-show', 'game-show', 'competition', 'talent'],
            documentary: ['documentary', 'news', 'biography', 'history', 'educational'],
            kids: ['children', 'animation', 'family', 'educational', 'preschool']
        },
        ANIME: {
            shounen: ['shounen', 'battle', 'martial arts', 'adventure'],
            seinen: ['seinen', 'psychological', 'mature', 'drama'],
            fantasy: ['fantasy', 'supernatural', 'magic', 'mythology'],
            romance: ['romance', 'drama', 'slice of life', 'harem'],
            comedy: ['comedy', 'parody', 'gag humor', 'school'],
            action: ['action', 'adventure', 'military', 'samurai'],
            'sci-fi': ['sci-fi', 'mecha', 'space', 'cyberpunk'],
            mystery: ['mystery', 'horror', 'thriller', 'supernatural'],
            sports: ['sports', 'music', 'racing', 'game']
        }
    },

    // Mensajes de la aplicación
    MESSAGES: {
        ERRORS: {
            LOGIN_EMPTY: 'Por favor, completa todos los campos',
            LOGIN_INVALID: 'Credenciales incorrectas. Intenta de nuevo.',
            LOGIN_BLOCKED: 'Demasiados intentos fallidos. Intenta más tarde.',
            LOGIN_SYSTEM: 'Error en el sistema de login',
            SEARCH_EMPTY: 'Por favor, introduce un término de búsqueda',
            SEARCH_SHORT: 'La búsqueda debe tener al menos 2 caracteres',
            NETWORK: 'Error de conexión. Verifica tu internet.',
            API_UNAVAILABLE: 'Servicio temporalmente no disponible',
            LOAD_FAILED: 'Error al cargar los datos'
        },
        SUCCESS: {
            LOGIN: 'Login exitoso. ¡Bienvenido a CARTEL TV!',
            LOGOUT: 'Sesión cerrada correctamente',
            DATA_UPDATED: 'Datos actualizados correctamente',
            SEARCH_COMPLETE: 'Búsqueda completada'
        },
        INFO: {
            LOADING: 'Cargando datos...',
            UPDATING: 'Actualizando datos...',
            NO_RESULTS: 'No se encontraron resultados',
            WELCOME_BACK: (name) => `¡Bienvenido de nuevo, ${name}!`
        }
    },

    // Configuración de accesibilidad
    ACCESSIBILITY: {
        FOCUS_OUTLINE: '2px solid var(--primary-color)',
        FOCUS_OUTLINE_OFFSET: '2px',
        MIN_CONTRAST_RATIO: 4.5,
        KEYBOARD_NAV_ENABLED: true,
        SCREEN_READER_ENABLED: true
    },

    // Configuración de rendimiento
    PERFORMANCE: {
        ENABLE_CACHE: true,
        ENABLE_LAZY_LOADING: true,
        ENABLE_DEBOUNCE: true,
        ENABLE_THROTTLE: true,
        MAX_CACHE_SIZE: 5242880, // 5MB en bytes
        CLEANUP_INTERVAL: 86400000 // 24 horas
    },

    // Configuración de desarrollo
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
        SHOW_PERFORMANCE: false,
        MOCK_API: false
    }
};

// Congelar configuración para prevenir modificaciones
Object.freeze(CONFIG);

// Exportar configuración
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}

// Función helper para logging con nivel
function log(level, message, ...args) {
    if (!CONFIG.DEBUG.ENABLED) return;
    
    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(CONFIG.DEBUG.LOG_LEVEL);
    const messageLevelIndex = levels.indexOf(level);
    
    if (messageLevelIndex >= currentLevelIndex) {
        console[level](`[CARTEL TV] ${message}`, ...args);
    }
}

// Exportar función de logging
if (typeof window !== 'undefined') {
    window.logDebug = (msg, ...args) => log('debug', msg, ...args);
    window.logInfo = (msg, ...args) => log('info', msg, ...args);
    window.logWarn = (msg, ...args) => log('warn', msg, ...args);
    window.logError = (msg, ...args) => log('error', msg, ...args);
}
