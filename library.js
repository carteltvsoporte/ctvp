const CONTENIDO_LIBRARY = {
    paises: {
        'US': 'Estados Unidos',
        'GB': 'Reino Unido',
        'ES': 'España',
        'MX': 'México',
        'AR': 'Argentina',
        'CO': 'Colombia',
        'JP': 'Japón',
        'KR': 'Corea del Sur',
        'FR': 'Francia',
        'DE': 'Alemania',
        'IT': 'Italia',
        'BR': 'Brasil',
        'RU': 'Rusia',
        'IN': 'India',
        'AU': 'Australia',
        'CA': 'Canada'
    },

    generos: {
        'movies_tv': {
            'Action': { id: 28, nombre: 'Acción', icon: '⚔️' },
            'Adventure': { id: 12, nombre: 'Aventura', icon: '🧭' },
            'Animation': { id: 16, nombre: 'Animación', icon: '🎬' },
            'Comedy': { id: 35, nombre: 'Comedia', icon: '😂' },
            'Crime': { id: 80, nombre: 'Crimen', icon: '🚓' },
            'Documentary': { id: 99, nombre: 'Documental', icon: '📽️' },
            'Drama': { id: 18, nombre: 'Drama', icon: '🎭' },
            'Family': { id: 10751, nombre: 'Familiar', icon: '👨‍👩‍👧‍👦' },
            'Fantasy': { id: 14, nombre: 'Fantasía', icon: '🐉' },
            'History': { id: 36, nombre: 'Historia', icon: '📜' },
            'Horror': { id: 27, nombre: 'Terror', icon: '👻' },
            'Music': { id: 10402, nombre: 'Música', icon: '🎵' },
            'Mystery': { id: 9648, nombre: 'Misterio', icon: '🔍' },
            'Romance': { id: 10749, nombre: 'Romance', icon: '💖' },
            'Science Fiction': { id: 878, nombre: 'Ciencia Ficción', icon: '🚀' },
            'TV Movie': { id: 10770, nombre: 'Película de TV', icon: '📺' },
            'Thriller': { id: 53, nombre: 'Suspense', icon: '😱' },
            'War': { id: 10752, nombre: 'Bélica', icon: '⚔️' },
            'Western': { id: 37, nombre: 'Western', icon: '🤠' }
        },
        
        'anime': {
            'Action': { id: 1, nombre: 'Acción', icon: '⚔️' },
            'Adventure': { id: 2, nombre: 'Aventura', icon: '🧭' },
            'Comedy': { id: 4, nombre: 'Comedia', icon: '😂' },
            'Drama': { id: 8, nombre: 'Drama', icon: '🎭' },
            'Fantasy': { id: 10, nombre: 'Fantasía', icon: '🐉' },
            'Horror': { id: 14, nombre: 'Terror', icon: '👻' },
            'Mystery': { id: 7, nombre: 'Misterio', icon: '🔍' },
            'Romance': { id: 22, nombre: 'Romance', icon: '💖' },
            'Sci-Fi': { id: 24, nombre: 'Ciencia Ficción', icon: '🚀' },
            'Slice of Life': { id: 36, nombre: 'Vida Cotidiana', icon: '🏠' },
            'Sports': { id: 30, nombre: 'Deportes', icon: '⚽' },
            'Supernatural': { id: 37, nombre: 'Sobrenatural', icon: '👁️' },
            'Psychological': { id: 40, nombre: 'Psicológico', icon: '🧠' },
            'Mecha': { id: 18, nombre: 'Mecha', icon: '🤖' },
            'Isekai': { id: 62, nombre: 'Isekai', icon: '🌌' }
        }
    },

    tipos: {
        'movies_tv': {
            'movie': { nombre: 'Película', icon: '🎬', color: '#e94560' },
            'tv': { nombre: 'Serie TV', icon: '📺', color: '#00adb5' },
            'person': { nombre: 'Persona', icon: '👤', color: '#f9a826' }
        },
        
        'anime': {
            'TV': { nombre: 'Serie TV', icon: '📺', color: '#00adb5' },
            'Movie': { nombre: 'Película', icon: '🎬', color: '#e94560' },
            'OVA': { nombre: 'OVA', icon: '📼', color: '#9c27b0' },
            'ONA': { nombre: 'ONA', icon: '🌐', color: '#4caf50' },
            'Special': { nombre: 'Especial', icon: '⭐', color: '#ff9800' },
            'Music': { nombre: 'Música', icon: '🎵', color: '#2196f3' }
        }
    },

    categorias: {
        'movies': {
            'popular': { nombre: 'Populares', icon: '🔥', endpoint: '/movie/popular' },
            'now_playing': { nombre: 'En Cines', icon: '🎭', endpoint: '/movie/now_playing' },
            'top_rated': { nombre: 'Mejor Valoradas', icon: '⭐', endpoint: '/movie/top_rated' },
            'upcoming': { nombre: 'Próximamente', icon: '📅', endpoint: '/movie/upcoming' },
            'trending': { nombre: 'Tendencias', icon: '📈', endpoint: '/trending/movie/day' }
        },
        
        'tv': {
            'popular': { nombre: 'Populares', icon: '🔥', endpoint: '/tv/popular' },
            'top_rated': { nombre: 'Mejor Valoradas', icon: '⭐', endpoint: '/tv/top_rated' },
            'on_the_air': { nombre: 'En Emisión', icon: '📡', endpoint: '/tv/on_the_air' },
            'airing_today': { nombre: 'Estrenos Hoy', icon: '🎉', endpoint: '/tv/airing_today' },
            'trending': { nombre: 'Tendencias', icon: '📈', endpoint: '/trending/tv/day' }
        },
        
        'anime': {
            'airing': { nombre: 'En Emisión', icon: '📡', endpoint: '/top/anime?filter=airing' },
            'upcoming': { nombre: 'Próximamente', icon: '📅', endpoint: '/top/anime?filter=upcoming' },
            'bypopularity': { nombre: 'Más Populares', icon: '🔥', endpoint: '/top/anime?filter=bypopularity' },
            'favorite': { nombre: 'Favoritos', icon: '❤️', endpoint: '/top/anime?filter=favorite' },
            'movie': { nombre: 'Películas', icon: '🎬', endpoint: '/top/anime?type=movie' },
            'ova': { nombre: 'OVA', icon: '📼', endpoint: '/top/anime?type=ova' },
            'special': { nombre: 'Especiales', icon: '⭐', endpoint: '/top/anime?type=special' },
            'tv': { nombre: 'Series TV', icon: '📺', endpoint: '/top/anime?type=tv' }
        }
    },

    estados: {
        'movies_tv': {
            'Released': 'Estrenada',
            'In Production': 'En Producción',
            'Post Production': 'Postproducción',
            'Returning Series': 'Serie en Curso',
            'Ended': 'Finalizada',
            'Canceled': 'Cancelada',
            'Planned': 'Planificada',
            'Rumored': 'Rumor'
        },
        
        'anime': {
            'Finished Airing': 'Finalizado',
            'Currently Airing': 'En Emisión',
            'Not yet aired': 'No Estrenado',
            'On Hiatus': 'En Pausa'
        }
    },

    clasificaciones: {
        'movies_tv': {
            'G': 'Todo público',
            'PG': 'Guía parental',
            'PG-13': 'Mayores de 13',
            'R': 'Mayores de 17',
            'NC-17': 'Solo adultos',
            'NR': 'Sin calificar'
        },
        
        'anime': {
            'G - All Ages': 'Todo público',
            'PG - Children': 'Niños',
            'PG-13 - Teens 13 or older': 'Adolescentes 13+',
            'R - 17+ (violence & profanity)': 'Mayores 17+',
            'R+ - Mild Nudity': 'Desnudez leve',
            'Rx - Hentai': 'Hentai'
        }
    },

    formatosFecha: {
        corto: { year: 'numeric', month: 'short', day: 'numeric' },
        largo: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
        relativo: { numeric: 'auto' }
    },

    obtenerGeneroPorId(id, modo = 'movies_tv') {
        const generos = CONTENIDO_LIBRARY.generos[modo];
        return Object.values(generos).find(g => g.id === id);
    },

    obtenerGeneroPorNombre(nombre, modo = 'movies_tv') {
        return CONTENIDO_LIBRARY.generos[modo][nombre] || { nombre, icon: '🎬' };
    },

    obtenerTipo(tipo, modo = 'movies_tv') {
        return CONTENIDO_LIBRARY.tipos[modo][tipo] || { nombre: tipo, icon: '🎬', color: '#666' };
    },

    obtenerCategoria(categoria, tipo = 'movies') {
        return CONTENIDO_LIBRARY.categorias[tipo]?.[categoria] || { nombre: categoria, icon: '📁' };
    },

    obtenerPais(codigo) {
        return CONTENIDO_LIBRARY.paises[codigo] || codigo;
    },

    formatearFecha(fecha, formato = 'corto') {
        if (!fecha) return 'N/A';
        const opciones = CONTENIDO_LIBRARY.formatosFecha[formato];
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    },

    formatearDuracion(minutos) {
        if (!minutos) return 'N/A';
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return horas > 0 ? `${horas}h ${mins}m` : `${mins}m`;
    },

    formatearNumero(numero) {
        if (!numero) return '0';
        if (numero >= 1000000) {
            return (numero / 1000000).toFixed(1) + 'M';
        }
        if (numero >= 1000) {
            return (numero / 1000).toFixed(1) + 'K';
        }
        return numero.toString();
    }
};

// Funciones de descripción mejoradas
function getDescripcionMejorada(details, tipo, modo = 'movies_tv') {
    if (modo === 'anime') {
        return getDescripcionAnime(details);
    }
    return getDescripcionPeliculaSerie(details, tipo);
}

function getDescripcionPeliculaSerie(details, tipo) {
    let overview = details.overview;
    
    if (!overview || overview.trim() === '') {
        const title = tipo === 'movie' ? details.title : details.name;
        const generos = details.genres?.map(g => 
            CONTENIDO_LIBRARY.generos.movies_tv[g.name]?.nombre || g.name
        ).join(', ') || 'varios géneros';
        
        const tipoNombre = tipo === 'movie' ? 'película' : 'serie';
        const premios = details.vote_average > 7.5 ? 'aclamada por la crítica' : '';
        const año = details.release_date ? new Date(details.release_date).getFullYear() : '';
        
        return `${title}${año ? ` (${año})` : ''} es una ${tipoNombre} ${premios} del género ${generos}. Con una narrativa cautivadora y personajes bien desarrollados, esta producción ofrece una experiencia cinematográfica memorable. La dirección y fotografía crean una atmósfera única que complementa perfectamente la trama. Interpretaciones convincentes y una banda sonora envolvente completan esta obra que seguramente dejará huella.`;
    }
    
    if (overview.length < 200) {
        const enhanced = ` ${overview}. Esta producción se destaca por su excelente dirección, actuaciones memorables y una narrativa que mantiene al espectador completamente inmerso. Cada escena está cuidadosamente elaborada para maximizar el impacto emocional y narrativo.`;
        overview += enhanced;
    }
    
    return overview;
}

function getDescripcionAnime(details) {
    let synopsis = details.synopsis;
    
    if (!synopsis || synopsis.trim() === '') {
        const title = details.title || details.title_english;
        const generos = details.genres?.map(g => g.name).join(', ') || 'animación japonesa';
        const estudio = details.studios?.[0]?.name ? `producido por ${details.studios[0].name}` : '';
        const año = details.year || details.aired?.prop?.from?.year;
        
        return `${title}${año ? ` (${año})` : ''} es un anime del género ${generos} ${estudio}. Con animación de alta calidad y dirección artística excepcional, esta serie transporta a un mundo lleno de personajes carismáticos. La evolución de los personajes es notable, mostrando desarrollo psicológico profundo. Secuencias de acción coreografiadas con maestría y momentos dramáticos cargados de emotividad. Banda sonora que complementa perfectamente cada escena. Una obra imprescindible para los amantes del anime.`;
    }
    
    if (synopsis.length < 250) {
        const enhanced = ` ${synopsis}. Este anime se caracteriza por su excepcional calidad de animación, dirección meticulosa y personajes profundamente desarrollados. Cada arco argumental mantiene la tensión narrativa, combinando acción trepidante con momentos de gran carga emocional.`;
        synopsis += enhanced;
    }
    
    return synopsis;
}

// Cache management
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function isCacheValid(cacheKey) {
    const cacheData = localStorage.getItem(cacheKey);
    if (!cacheData) return false;
    
    try {
        const { timestamp } = JSON.parse(cacheData);
        return (Date.now() - timestamp) < CACHE_DURATION;
    } catch (e) {
        return false;
    }
}

function saveToCache(cacheKey, data) {
    const cacheData = { data, timestamp: Date.now() };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
}

function getFromCache(cacheKey) {
    try {
        const cacheData = JSON.parse(localStorage.getItem(cacheKey));
        return cacheData ? cacheData.data : null;
    } catch (e) {
        return null;
    }
}

// Notificaciones
function showNotification(mensaje, tipo = 'info', duracion = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${tipo}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${mensaje}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => hideNotification(notification));
    
    setTimeout(() => hideNotification(notification), duracion);
    
    function hideNotification(notif) {
        notif.classList.remove('show');
        setTimeout(() => {
            if (notif.parentNode) notif.parentNode.removeChild(notif);
        }, 300);
    }
}