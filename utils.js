/**
 * Utilidades compartidas para CARTEL TV
 * @fileoverview Funciones comunes utilizadas en toda la aplicación
 */

/**
 * Verifica si se debe usar el caché basándose en el tiempo transcurrido
 * @param {string} cacheTimeKey - Clave de localStorage para el timestamp
 * @param {number} maxAge - Edad máxima del caché en milisegundos
 * @returns {Promise<boolean>} True si el caché es válido
 */
async function shouldUseCache(cacheTimeKey, maxAge) {
    try {
        const cacheTime = localStorage.getItem(cacheTimeKey);
        if (!cacheTime) return false;
        
        const elapsed = Date.now() - parseInt(cacheTime);
        return elapsed < maxAge;
    } catch (error) {
        console.error('Error verificando caché:', error);
        return false;
    }
}

/**
 * Capitaliza la primera letra de una cadena
 * @param {string} str - Cadena a capitalizar
 * @returns {string} Cadena con primera letra en mayúscula
 */
function capitalizeFirst(str) {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Limpia HTML de una cadena de texto
 * @param {string} html - Cadena con HTML
 * @returns {string} Texto sin etiquetas HTML
 */
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '');
}

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (por defecto '...')
 * @returns {string} Texto truncado
 */
function truncateText(text, maxLength, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
}

/**
 * Formatea una fecha en formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale para formateo (por defecto 'es-ES')
 * @returns {string} Fecha formateada
 */
function formatDate(date, locale = 'es-ES') {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formateando fecha:', error);
        return 'Fecha no disponible';
    }
}

/**
 * Genera una URL de placeholder para imágenes
 * @param {number} width - Ancho de la imagen
 * @param {number} height - Alto de la imagen
 * @param {string} text - Texto a mostrar
 * @returns {string} URL del placeholder
 */
function getPlaceholderImage(width, height, text) {
    const encodedText = encodeURIComponent(text.substring(0, 15));
    return `https://via.placeholder.com/${width}x${height}/2a2a2a/666?text=${encodedText}`;
}

/**
 * Debounce para funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle para funciones
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función con throttle
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Valida si una URL es válida
 * @param {string} url - URL a validar
 * @returns {boolean} True si la URL es válida
 */
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Obtiene un valor seguro de un objeto anidado
 * @param {Object} obj - Objeto a consultar
 * @param {string} path - Ruta al valor (ej: 'user.profile.name')
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} Valor encontrado o valor por defecto
 */
function getNestedValue(obj, path, defaultValue = null) {
    try {
        return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
function generateUniqueId() {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Manejo de errores de fetch con reintentos
 * @param {string} url - URL a consultar
 * @param {Object} options - Opciones de fetch
 * @param {number} retries - Número de reintentos
 * @returns {Promise<Response>} Respuesta del fetch
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                signal: AbortSignal.timeout(10000)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            
            // Espera exponencial entre reintentos
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

/**
 * Guarda datos en localStorage con manejo de errores
 * @param {string} key - Clave de almacenamiento
 * @param {*} value - Valor a guardar
 * @returns {boolean} True si se guardó exitosamente
 */
function safeLocalStorageSet(key, value) {
    try {
        const serialized = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error guardando en localStorage:', error);
        
        // Si el error es por espacio, limpiar caché antiguo
        if (error.name === 'QuotaExceededError') {
            clearOldCache();
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (retryError) {
                console.error('Error en reintento:', retryError);
                return false;
            }
        }
        return false;
    }
}

/**
 * Obtiene datos de localStorage con manejo de errores
 * @param {string} key - Clave de almacenamiento
 * @param {*} defaultValue - Valor por defecto
 * @returns {*} Valor almacenado o valor por defecto
 */
function safeLocalStorageGet(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (!item) return defaultValue;
        
        try {
            return JSON.parse(item);
        } catch {
            return item;
        }
    } catch (error) {
        console.error('Error leyendo de localStorage:', error);
        return defaultValue;
    }
}

/**
 * Limpia caché antiguo de localStorage
 */
function clearOldCache() {
    const cacheKeys = ['carteltv_tvshows_v3', 'carteltv_anime_v3'];
    cacheKeys.forEach(key => {
        try {
            localStorage.removeItem(key);
            localStorage.removeItem(`${key}_time`);
        } catch (error) {
            console.error('Error limpiando caché:', error);
        }
    });
}

/**
 * Actualiza accesibilidad de una sección
 * @param {string} sectionId - ID de la sección
 * @param {string} filter - Filtro aplicado
 */
function updateSectionAccessibility(sectionId, filter) {
    const section = document.getElementById(`${sectionId}-section`);
    if (!section) return;
    
    const filterName = filter === 'all' ? 'todos' : filter;
    section.setAttribute('aria-label', `Sección de ${sectionId} - Filtro: ${filterName}`);
}

// Exportar funciones para uso global
if (typeof window !== 'undefined') {
    window.shouldUseCache = shouldUseCache;
    window.capitalizeFirst = capitalizeFirst;
    window.stripHtml = stripHtml;
    window.truncateText = truncateText;
    window.formatDate = formatDate;
    window.getPlaceholderImage = getPlaceholderImage;
    window.debounce = debounce;
    window.throttle = throttle;
    window.isValidUrl = isValidUrl;
    window.getNestedValue = getNestedValue;
    window.generateUniqueId = generateUniqueId;
    window.fetchWithRetry = fetchWithRetry;
    window.safeLocalStorageSet = safeLocalStorageSet;
    window.safeLocalStorageGet = safeLocalStorageGet;
    window.clearOldCache = clearOldCache;
    window.updateSectionAccessibility = updateSectionAccessibility;
}
