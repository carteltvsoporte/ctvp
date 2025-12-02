const SPANISH_DESCRIPTIONS = {
    no_description: "No hay descripción disponible en este momento. Esta película/serie promete ofrecer una experiencia única con su narrativa cautivadora y personajes memorables que te mantendrán enganchado desde el principio hasta el final.",
    no_synopsis: "Sinopsis no disponible. Esta producción destaca por su calidad visual y narrativa, ofreciendo momentos de gran intensidad dramática y escenas que quedarán grabadas en la memoria del espectador.",
    genres: {
        'Action': 'Acción',
        'Adventure': 'Aventura',
        'Animation': 'Animación',
        'Comedy': 'Comedia',
        'Crime': 'Crimen',
        'Documentary': 'Documental',
        'Drama': 'Drama',
        'Family': 'Familiar',
        'Fantasy': 'Fantasía',
        'History': 'Historia',
        'Horror': 'Terror',
        'Music': 'Música',
        'Mystery': 'Misterio',
        'Romance': 'Romance',
        'Science Fiction': 'Ciencia Ficción',
        'TV Movie': 'Película de TV',
        'Thriller': 'Suspense',
        'War': 'Bélica',
        'Western': 'Western'
    },
    status: {
        'Released': 'Estrenada',
        'In Production': 'En Producción',
        'Post Production': 'Postproducción',
        'Returning Series': 'Serie en Curso',
        'Ended': 'Finalizada',
        'Canceled': 'Cancelada'
    }
};

function getDetailedSpanishDescription(details, type) {
    let overview = details.overview;
    
    if (!overview || overview.trim() === '') {
        const title = type === 'movie' ? details.title : details.name;
        const genres = details.genres?.map(g => SPANISH_DESCRIPTIONS.genres[g.name] || g.name).join(', ') || 'varios géneros';
        
        return `${title} es una ${type === 'movie' ? 'película' : 'serie'} de ${genres} que ha capturado la atención del público y la crítica. Con una narrativa cuidadosamente construida y personajes profundamente desarrollados, esta producción ofrece una experiencia cinematográfica memorable. La dirección artística y la fotografía crean una atmósfera única que complementa perfectamente la trama. Los actores principales ofrecen interpretaciones convincentes que dan vida a personajes complejos y fascinantes. La banda sonora y el diseño de sonido contribuyen significativamente a la inmersión del espectador en este universo narrativo. Sin duda, una obra que dejará una huella durarada en quienes tengan la oportunidad de disfrutarla.`;
    }
    
    if (overview.length < 200) {
        const enhancedText = ` ${overview}. Esta producción se destaca por su excelente dirección, actuaciones memorables y una narrativa que mantiene al espectador completamente inmerso desde el inicio hasta el final. Cada escena está cuidadosamente elaborada para maximizar el impacto emocional y narrativo, creando una experiencia cinematográfica verdaderamente envolvente.`;
        overview += enhancedText;
    }
    
    return overview;
}

function getDetailedAnimeDescription(details) {
    let synopsis = details.synopsis;
    
    if (!synopsis || synopsis.trim() === '') {
        const title = details.title || details.title_english || 'esta serie';
        const genres = details.genres?.map(g => g.name).join(', ') || 'animación japonesa';
        
        return `${title} es un anime del género ${genres} que ha conquistado a audiencias worldwide. Con una animación de alta calidad y una dirección artística excepcional, esta serie transporta a los espectadores a un mundo lleno de personajes carismáticos y situaciones emocionantes. La evolución de los personajes a lo largo de la trama es notable, mostrando un desarrollo psicológico profundo y creíble. Las batallas y secuencias de acción están coreografiadas con maestría, mientras que los momentos dramáticos están cargados de emotividad. La banda sonora complementa perfectamente cada escena, intensificando las emociones y la inmersión. Una obra imprescindible para los amantes del anime que buscan historias bien contadas con personajes inolvidables.`;
    }
    
    if (synopsis.length < 250) {
        const enhancedText = ` ${synopsis}. Este anime se caracteriza por su excepcional calidad de animación, dirección artística meticulosa y personajes profundamente desarrollados que evolucionan de manera orgánica a lo largo de la serie. Cada arco argumental está cuidadosamente construido para mantener la tensión narrativa y el interés del espectador, combinando acción trepidante con momentos de gran carga emocional. La banda sonora, compuesta específicamente para la serie, realza cada escena creando una experiencia auditiva memorable. Sin duda, una obra que representa lo mejor de la animación japonesa contemporánea.`;
        synopsis += enhancedText;
    }
    
    return synopsis;
}

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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}