// Variables Globales
let currentMode = 'movies';
let currentType = 'movie';
let currentCategory = 'popular';
let currentView = 'grid';
let currentPage = 1;
let isLoading = false;

// Referencias DOM actualizadas
const modeSelector = document.querySelector('.mode-selector');
const modeCards = document.querySelectorAll('.mode-card');
const btnModeSelect = document.querySelectorAll('.btn-mode-select');
const navBtns = document.querySelectorAll('.nav-btn');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const userMenuBtn = document.getElementById('userMenuBtn');
const userMenu = document.getElementById('userMenu');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const contentGrid = document.getElementById('contentGrid');
const sectionTitle = document.getElementById('sectionTitle');
const sectionSubtitle = document.getElementById('sectionSubtitle');
const viewBtns = document.querySelectorAll('.view-btn');
const detailModal = document.getElementById('detailModal');
const modalClose = document.getElementById('modalClose');
const profileModal = document.getElementById('profileModal');
const settingsModal = document.getElementById('settingsModal');
const logoutBtn = document.getElementById('logoutBtn');

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    if (!checkAuthentication()) {
        window.location.href = 'auth-modal.html';
        return;
    }
    
    configManager.applyConfig();
    await initializeApp();
    setupEventListeners();
    updateUserInterface();
    setupPeriodicUpdates();
});

async function initializeApp() {
    const savedMode = localStorage.getItem('ctvp_current_mode');
    if (savedMode) {
        currentMode = savedMode;
        modeSelector.style.display = 'none';
        setCurrentMode(savedMode);
    } else {
        modeSelector.style.display = 'flex';
    }
    
    await loadContent();
    await loadRecommendations();
}

function checkAuthentication() {
    try {
        const userSession = localStorage.getItem('ctvp_user_session');
        if (!userSession) return false;
        
        const session = JSON.parse(userSession);
        const loginTime = new Date(session.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        return session && session.name && session.phone && hoursDiff < 24;
    } catch (e) {
        return false;
    }
}

function setupEventListeners() {
    // Selección de modo
    btnModeSelect.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const mode = btn.dataset.mode;
            setCurrentMode(mode);
            localStorage.setItem('ctvp_current_mode', mode);
            modeSelector.style.display = 'none';
        });
    });
    
    // Navegación
    navBtns.forEach(btn => {
        if (btn.dataset.type !== 'dropdown') {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                navigateToSection(section);
            });
        }
    });
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentType = item.dataset.type;
            currentCategory = item.dataset.category;
            currentPage = 1;
            loadContent();
            updateNavigation();
        });
    });
    
    // Búsqueda
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    searchInput.addEventListener('focus', showSearchResults);
    
    // Menú de usuario
    userMenuBtn.addEventListener('click', toggleUserMenu);
    document.addEventListener('click', (e) => {
        if (!userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
            userMenu.style.opacity = '0';
            userMenu.style.visibility = 'hidden';
            userMenu.style.transform = 'translateY(10px)';
        }
    });
    
    // Tema
    themeToggle.addEventListener('click', toggleTheme);
    
    // Menú móvil
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.style.transform = 'translateX(0)';
    });
    
    document.getElementById('mobileMenuClose').addEventListener('click', () => {
        mobileMenu.style.transform = 'translateX(-100%)';
    });
    
    // Vista
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            setCurrentView(view);
        });
    });
    
    // Modal
    modalClose.addEventListener('click', () => {
        detailModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            detailModal.style.display = 'none';
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', logout);
    document.getElementById('mobileLogoutBtn').addEventListener('click', logout);
    
    // Botones de acción
    document.getElementById('exploreBtn').addEventListener('click', () => {
        currentCategory = 'popular';
        loadContent();
    });
    
    document.getElementById('trendingBtn').addEventListener('click', () => {
        currentCategory = 'trending';
        loadContent();
    });
    
    // Load more
    document.getElementById('loadMoreBtn').addEventListener('click', loadMoreContent);
    
    // Perfil y configuración
    document.getElementById('profileLink').addEventListener('click', showProfile);
    document.getElementById('settingsLink').addEventListener('click', showSettings);
}

function setCurrentMode(mode) {
    currentMode = mode;
    
    // Actualizar UI del modo
    modeCards.forEach(card => {
        card.classList.toggle('active', card.dataset.mode === mode);
    });
    
    // Actualizar navegación
    const animeElements = document.querySelectorAll('.anime-only');
    animeElements.forEach(el => {
        el.style.display = mode === 'anime' ? 'block' : 'none';
    });
    
    if (mode === 'movies') {
        currentType = 'movie';
        currentCategory = 'popular';
    } else {
        currentType = 'anime';
        currentCategory = 'airing';
    }
    
    updateNavigation();
    updateHeroSection();
    loadContent();
}

function setCurrentView(view) {
    currentView = view;
    
    viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    applyContentView();
}

function updateNavigation() {
    navBtns.forEach(btn => {
        if (btn.dataset.section === 'home') {
            btn.classList.toggle('active', currentCategory === 'popular');
        }
    });
    
    dropdownItems.forEach(item => {
        const isActive = item.dataset.type === currentType && 
                        item.dataset.category === currentCategory;
        item.classList.toggle('active', isActive);
    });
}

async function loadContent() {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    
    try {
        const cacheKey = `content_${currentMode}_${currentType}_${currentCategory}_${currentPage}`;
        
        if (isCacheValid(cacheKey)) {
            const cachedData = getFromCache(cacheKey);
            if (cachedData) {
                displayContent(cachedData);
                isLoading = false;
                return;
            }
        }
        
        let data;
        if (currentMode === 'movies') {
            const categoryInfo = CONTENIDO_LIBRARY.categorias[currentType]?.[currentCategory];
            const endpoint = categoryInfo?.endpoint || `/${currentType}/${currentCategory}`;
            
            const response = await apiManager.request('tmdb', `${endpoint}?page=${currentPage}`);
            if (response.ok) {
                data = response.data.results || [];
                saveToCache(cacheKey, data);
            }
        } else {
            const categoryInfo = CONTENIDO_LIBRARY.categorias.anime[currentCategory];
            let endpoint = categoryInfo?.endpoint || `/top/anime?filter=${currentCategory}`;
            
            const response = await apiManager.request('jikan', `${endpoint}&page=${currentPage}`);
            if (response.ok) {
                data = response.data.data || [];
                saveToCache(cacheKey, data);
            }
        }
        
        if (data) {
            displayContent(data);
            updateSectionTitle();
        } else {
            showEmptyState('No se pudo cargar el contenido. Intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error loading content:', error);
        showNotification('Error al cargar el contenido', 'error');
        showEmptyState('Error de conexión. Verifica tu internet.');
    } finally {
        isLoading = false;
    }
}

async function loadMoreContent() {
    currentPage++;
    await loadContent();
}

function displayContent(items) {
    if (!contentGrid) return;
    
    // Limpiar solo si es primera página
    if (currentPage === 1) {
        contentGrid.innerHTML = '';
    }
    
    if (!items || items.length === 0) {
        if (currentPage === 1) {
            showEmptyState('No hay contenido disponible en esta categoría.');
        }
        return;
    }
    
    items.forEach(item => {
        const card = createContentCard(item);
        contentGrid.appendChild(card);
    });
    
    applyContentView();
    
    // Mostrar/ocultar botón de cargar más
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = items.length >= 20 ? 'flex' : 'none';
    }
}

function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.tabIndex = 0;
    
    const isAnime = currentMode === 'anime';
    const tipo = isAnime ? 'anime' : (currentType === 'movie' ? 'movie' : 'tv');
    
    // Obtener información específica según el modo
    let imageUrl, title, year, rating, badgeText;
    
    if (isAnime) {
        imageUrl = apiManager.getImageUrl(item.images?.jpg?.large_image_url, 'medium', 'jikan');
        title = item.title || 'Título no disponible';
        year = item.year || item.aired?.prop?.from?.year || 'N/A';
        rating = item.score ? item.score.toFixed(1) : 'N/A';
        badgeText = item.type || 'Anime';
    } else {
        imageUrl = apiManager.getImageUrl(item.poster_path, 'w300');
        title = tipo === 'movie' ? item.title : item.name;
        const date = tipo === 'movie' ? item.release_date : item.first_air_date;
        year = date ? date.substring(0, 4) : 'N/A';
        rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
        badgeText = tipo === 'movie' ? 'Película' : 'Serie';
    }
    
    // Crear HTML de la tarjeta
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${imageUrl}" 
                 alt="${title}" 
                 class="card-image"
                 loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x450/1a1d29/2d3748?text=Imagen+No+Disponible'">
            <div class="card-overlay">
                <button class="card-play-btn">
                    <i class="fas fa-play"></i>
                </button>
                <div class="card-actions">
                    <button class="card-action-btn" data-action="favorite">
                        <i class="far fa-heart"></i>
                    </button>
                    <button class="card-action-btn" data-action="watchlist">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            </div>
            <div class="card-badge">${badgeText}</div>
        </div>
        <div class="card-content">
            <h3 class="card-title text-truncate">${title}</h3>
            <div class="card-meta">
                <span>${year}</span>
                <div class="card-rating">
                    <i class="fas fa-star"></i>
                    <span>${rating}</span>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners
    card.addEventListener('click', () => showDetails(item, tipo));
    
    const favoriteBtn = card.querySelector('[data-action="favorite"]');
    const watchlistBtn = card.querySelector('[data-action="watchlist"]');
    const playBtn = card.querySelector('.card-play-btn');
    
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(item, tipo);
    });
    
    watchlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToWatchlist(item, tipo);
    });
    
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        playContent(item, tipo);
    });
    
    return card;
}

function applyContentView() {
    const cards = contentGrid.querySelectorAll('.content-card');
    
    cards.forEach(card => {
        card.className = 'content-card';
        card.classList.add(`view-${currentView}`);
        
        switch (currentView) {
            case 'list':
                card.style.display = 'flex';
                card.style.gap = 'var(--spacing-lg)';
                break;
            case 'compact':
                card.querySelector('.card-content').style.display = 'none';
                break;
            default:
                card.style.display = 'block';
                if (card.querySelector('.card-content')) {
                    card.querySelector('.card-content').style.display = 'block';
                }
        }
    });
}

async function showDetails(item, type) {
    try {
        const details = await apiManager.getContentDetails(type, item.id || item.mal_id, currentMode);
        if (!details) {
            showNotification('No se pudieron cargar los detalles', 'error');
            return;
        }
        
        populateModal(details, type);
        detailModal.style.display = 'block';
        
        // Registrar en el perfil
        perfilManager.agregarVisto({
            ...item,
            type,
            duracion: details.runtime || details.duration || 0
        });
        
    } catch (error) {
        console.error('Error showing details:', error);
        showNotification('Error al cargar los detalles', 'error');
    }
}

function populateModal(details, type) {
    // Limpiar contenido anterior
    document.getElementById('modalBackdrop').style.backgroundImage = '';
    document.getElementById('modalPoster').src = '';
    
    // Configurar según el modo
    const isAnime = currentMode === 'anime';
    
    // Imágenes
    if (isAnime) {
        const backdropUrl = details.images?.jpg?.large_image_url || 
                          'https://via.placeholder.com/1400x500/1a1d29/00adb5?text=Anime';
        const posterUrl = apiManager.getImageUrl(details.images?.jpg?.large_image_url, 'medium', 'jikan');
        
        document.getElementById('modalBackdrop').style.backgroundImage = `url(${backdropUrl})`;
        document.getElementById('modalPoster').src = posterUrl;
    } else {
        const backdropUrl = details.backdrop_path 
            ? apiManager.getImageUrl(details.backdrop_path, 'w1280')
            : 'https://via.placeholder.com/1400x500/1a1d29/e94560?text=Imagen+No+Disponible';
        const posterUrl = apiManager.getImageUrl(details.poster_path, 'w500');
        
        document.getElementById('modalBackdrop').style.backgroundImage = `url(${backdropUrl})`;
        document.getElementById('modalPoster').src = posterUrl;
    }
    
    // Información básica
    const title = isAnime ? 
        details.title || details.title_english : 
        type === 'movie' ? details.title : details.name;
    
    document.getElementById('modalTitle').textContent = title;
    
    const badgeText = isAnime ? 
        details.type || 'Anime' : 
        type === 'movie' ? 'Película' : 'Serie';
    document.getElementById('modalBadge').textContent = badgeText;
    
    // Metadatos
    let metaHTML = '';
    if (isAnime) {
        const year = details.year || details.aired?.prop?.from?.year;
        const episodes = details.episodes;
        const duration = details.duration;
        const score = details.score;
        
        if (year) metaHTML += `<span>${year}</span>`;
        if (episodes) metaHTML += `<span>${episodes} episodios</span>`;
        if (duration) metaHTML += `<span>${duration}</span>`;
        if (score) metaHTML += `<span>★ ${score.toFixed(1)}</span>`;
    } else {
        const date = type === 'movie' ? details.release_date : details.first_air_date;
        const year = date ? date.substring(0, 4) : '';
        const runtime = details.runtime;
        const voteAvg = details.vote_average;
        
        if (year) metaHTML += `<span>${year}</span>`;
        if (runtime) metaHTML += `<span>${CONTENIDO_LIBRARY.formatearDuracion(runtime)}</span>`;
        if (voteAvg) metaHTML += `<span>★ ${voteAvg.toFixed(1)}</span>`;
    }
    document.getElementById('modalMeta').innerHTML = metaHTML;
    
    // Géneros
    const genresContainer = document.getElementById('modalGenres');
    genresContainer.innerHTML = '';
    
    const genres = isAnime ? details.genres : details.genres;
    if (genres && genres.length > 0) {
        genres.forEach(genre => {
            const genreName = isAnime ? 
                genre.name : 
                CONTENIDO_LIBRARY.generos.movies_tv[genre.name]?.nombre || genre.name;
            
            const genreTag = document.createElement('span');
            genreTag.className = 'genre-tag';
            genreTag.textContent = genreName;
            genresContainer.appendChild(genreTag);
        });
    }
    
    // Sinopsis
    const overview = isAnime ? 
        getDescripcionAnime(details) : 
        getDescripcionPeliculaSerie(details, type);
    document.getElementById('modalOverview').textContent = overview;
    
    // Detalles adicionales
    const detailsContainer = document.getElementById('modalDetails');
    detailsContainer.innerHTML = '';
    
    if (isAnime) {
        const detailsHTML = `
            <div class="detail-item">
                <div class="detail-label">Estudio</div>
                <div class="detail-value">${details.studios?.[0]?.name || 'No disponible'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Emitido</div>
                <div class="detail-value">${details.aired?.string || 'No disponible'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Puntuación</div>
                <div class="detail-value">${details.scored_by ? `${CONTENIDO_LIBRARY.formatearNumero(details.scored_by)} usuarios` : 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Clasificación</div>
                <div class="detail-value">${details.rating || 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Fuente</div>
                <div class="detail-value">${details.source || 'Original'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Estado</div>
                <div class="detail-value">${CONTENIDO_LIBRARY.estados.anime[details.status] || details.status || 'N/A'}</div>
            </div>
        `;
        detailsContainer.innerHTML = detailsHTML;
    } else {
        const detailsHTML = `
            <div class="detail-item">
                <div class="detail-label">Idioma Original</div>
                <div class="detail-value">${details.original_language ? details.original_language.toUpperCase() : 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Presupuesto</div>
                <div class="detail-value">${details.budget ? `$${details.budget.toLocaleString('es-ES')}` : 'No disponible'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Ingresos</div>
                <div class="detail-value">${details.revenue ? `$${details.revenue.toLocaleString('es-ES')}` : 'No disponible'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Votos</div>
                <div class="detail-value">${details.vote_count ? CONTENIDO_LIBRARY.formatearNumero(details.vote_count) : 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Popularidad</div>
                <div class="detail-value">${details.popularity ? Math.round(details.popularity) : 'N/A'}</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Estado</div>
                <div class="detail-value">${CONTENIDO_LIBRARY.estados.movies_tv[details.status] || details.status || 'N/A'}</div>
            </div>
        `;
        detailsContainer.innerHTML = detailsHTML;
        
        // Mostrar sección de reparto si está disponible
        if (details.credits?.cast) {
            document.getElementById('castSection').style.display = 'block';
            const castGrid = document.getElementById('castGrid');
            castGrid.innerHTML = '';
            
            details.credits.cast.slice(0, 6).forEach(person => {
                const castItem = document.createElement('div');
                castItem.className = 'cast-item';
                castItem.innerHTML = `
                    <img src="${apiManager.getImageUrl(person.profile_path, 'w185')}" 
                         alt="${person.name}"
                         class="cast-image"
                         onerror="this.src='https://via.placeholder.com/185x278/1a1d29/2d3748?text=Actor'">
                    <div class="cast-info">
                        <div class="cast-name">${person.name}</div>
                        <div class="cast-character">${person.character}</div>
                    </div>
                `;
                castGrid.appendChild(castItem);
            });
        } else {
            document.getElementById('castSection').style.display = 'none';
        }
        
        // Mostrar contenido similar
        if (details.similar?.results) {
            document.getElementById('similarSection').style.display = 'block';
            const similarGrid = document.getElementById('similarGrid');
            similarGrid.innerHTML = '';
            
            details.similar.results.slice(0, 4).forEach(item => {
                const similarItem = document.createElement('div');
                similarItem.className = 'similar-item';
                similarItem.innerHTML = `
                    <img src="${apiManager.getImageUrl(item.poster_path, 'w185')}" 
                         alt="${type === 'movie' ? item.title : item.name}"
                         class="similar-image"
                         onerror="this.src='https://via.placeholder.com/185x278/1a1d29/2d3748?text=Imagen'">
                    <div class="similar-title">${type === 'movie' ? item.title : item.name}</div>
                `;
                similarItem.addEventListener('click', () => showDetails(item, type));
                similarGrid.appendChild(similarItem);
            });
        } else {
            document.getElementById('similarSection').style.display = 'none';
        }
    }
    
    // Configurar botones de acción
    const favoriteBtn = document.getElementById('btnFavorite');
    const watchlistBtn = document.getElementById('btnWatchlist');
    const playBtn = document.getElementById('btnPlay');
    
    favoriteBtn.onclick = () => toggleFavorite(details, type);
    watchlistBtn.onclick = () => addToWatchlist(details, type);
    playBtn.onclick = () => playContent(details, type);
}

function updateSectionTitle() {
    const titleMap = {
        'movies': {
            'movie_popular': 'Películas Populares',
            'movie_now_playing': 'Películas en Cines',
            'movie_top_rated': 'Películas Mejor Valoradas',
            'movie_upcoming': 'Próximos Estrenos',
            'movie_trending': 'Películas en Tendencia',
            'tv_popular': 'Series Populares',
            'tv_top_rated': 'Series Mejor Valoradas',
            'tv_on_the_air': 'Series en Emisión',
            'tv_airing_today': 'Series que Estrenan Hoy',
            'tv_trending': 'Series en Tendencia'
        },
        'anime': {
            'anime_airing': 'Anime en Emisión',
            'anime_upcoming': 'Anime Próximo',
            'anime_bypopularity': 'Anime Más Popular',
            'anime_favorite': 'Anime Favorito',
            'anime_movie': 'Películas de Anime',
            'anime_ova': 'OVA de Anime',
            'anime_special': 'Especiales de Anime',
            'anime_tv': 'Series de Anime'
        }
    };
    
    const titleKey = `${currentType}_${currentCategory}`;
    const title = titleMap[currentMode]?.[titleKey] || 'Contenido Destacado';
    const subtitle = currentMode === 'movies' ? 
        'Descubre las mejores películas y series' : 
        'Explora el mundo del anime';
    
    if (sectionTitle) sectionTitle.textContent = title;
    if (sectionSubtitle) sectionSubtitle.textContent = subtitle;
}

function updateHeroSection() {
    const heroTitle = document.getElementById('heroTitle');
    const heroSubtitle = document.getElementById('heroSubtitle');
    
    if (currentMode === 'movies') {
        heroTitle.textContent = 'Películas y Series Ilimitadas';
        heroSubtitle.textContent = 'Disfruta del mejor cine y televisión en un solo lugar';
    } else {
        heroTitle.textContent = 'Anime Sin Límites';
        heroSubtitle.textContent = 'Las mejores series y películas de animación japonesa';
    }
}

async function handleSearch() {
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
        searchResults.innerHTML = '';
        searchResults.style.display = 'none';
        return;
    }
    
    try {
        const results = await apiManager.searchContent(query, { type: currentMode === 'anime' ? 'anime' : undefined });
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    if (!results || results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results">No se encontraron resultados</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    let html = '';
    results.slice(0, 8).forEach(item => {
        const imageUrl = item.contentType === 'anime' ?
            apiManager.getImageUrl(item.images?.jpg?.image_url, 'small', 'jikan') :
            apiManager.getImageUrl(item.poster_path, 'w92');
        
        const title = item.contentType === 'movie' ? item.title : 
                     item.contentType === 'tv' ? item.name : 
                     item.title || item.name;
        
        const type = item.contentType === 'movie' ? 'Película' :
                    item.contentType === 'tv' ? 'Serie' : 'Anime';
        
        const year = item.release_date ? item.release_date.substring(0, 4) :
                    item.first_air_date ? item.first_air_date.substring(0, 4) :
                    item.year || '';
        
        html += `
            <a href="#" class="search-result-item" data-id="${item.id || item.mal_id}" data-type="${item.contentType}">
                <img src="${imageUrl}" alt="${title}" class="search-result-image"
                     onerror="this.src='https://via.placeholder.com/92x138/1a1d29/2d3748?text=Imagen'">
                <div class="search-result-info">
                    <div class="search-result-title">${title}</div>
                    <div class="search-result-meta">
                        <span class="search-result-type">${type}</span>
                        ${year ? `<span class="search-result-year">${year}</span>` : ''}
                    </div>
                </div>
            </a>
        `;
    });
    
    searchResults.innerHTML = html;
    searchResults.style.display = 'block';
    
    // Event listeners para resultados
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const id = item.dataset.id;
            const type = item.dataset.type;
            
            // Encontrar el elemento en los resultados
            const result = results.find(r => (r.id || r.mal_id) == id);
            if (result) {
                showDetails(result, type);
                searchResults.style.display = 'none';
                searchInput.value = '';
            }
        });
    });
}

function showSearchResults() {
    if (searchInput.value.trim().length >= 2) {
        searchResults.style.display = 'block';
    }
}

function toggleUserMenu() {
    const isVisible = userMenu.style.opacity === '1';
    
    if (isVisible) {
        userMenu.style.opacity = '0';
        userMenu.style.visibility = 'hidden';
        userMenu.style.transform = 'translateY(10px)';
    } else {
        userMenu.style.opacity = '1';
        userMenu.style.visibility = 'visible';
        userMenu.style.transform = 'translateY(0)';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    configManager.set('theme', newTheme);
    
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    
    showNotification(`Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`, 'info');
}

function toggleFavorite(item, type) {
    const added = perfilManager.toggleFavorito({
        ...item,
        type: type === 'anime' ? 'anime' : type
    });
    
    showNotification(
        added ? 'Añadido a favoritos' : 'Eliminado de favoritos',
        added ? 'success' : 'info'
    );
    
    // Actualizar icono si está en el modal
    const favoriteBtn = document.getElementById('btnFavorite');
    if (favoriteBtn) {
        favoriteBtn.querySelector('i').className = added ? 'fas fa-heart' : 'far fa-heart';
        favoriteBtn.innerHTML = added ? 
            '<i class="fas fa-heart"></i> Quitar de Favoritos' :
            '<i class="far fa-heart"></i> Añadir a Favoritos';
    }
}

function addToWatchlist(item, type) {
    const added = perfilManager.agregarListaVer({
        ...item,
        type: type === 'anime' ? 'anime' : type
    });
    
    showNotification(
        added ? 'Añadido a Ver Más Tarde' : 'Ya está en la lista',
        added ? 'success' : 'info'
    );
}

function playContent(item, type) {
    showNotification('Función de reproducción en desarrollo', 'info');
    
    // Para demostración, abrir trailer si existe
    if (item.videos?.results?.[0]?.key) {
        window.open(`https://www.youtube.com/watch?v=${item.videos.results[0].key}`, '_blank');
    }
}

async function showProfile() {
    const profileHTML = `
        <div class="profile-header">
            <button class="modal-close" onclick="document.getElementById('profileModal').style.display='none'">
                <i class="fas fa-times"></i>
            </button>
            <h2>Mi Perfil</h2>
        </div>
        <div class="profile-content">
            <div class="profile-section">
                <h3>Información Personal</h3>
                <div class="profile-info">
                    <div class="profile-avatar-large">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="profile-details">
                        <h4>${perfilManager.perfil.nombre}</h4>
                        <p class="profile-plan">
                            <i class="fas fa-crown"></i> Plan ${perfilManager.perfil.suscripcion.plan}
                        </p>
                        <p class="profile-stats">
                            <span>${perfilManager.perfil.estadisticas.peliculasVistas} películas vistas</span>
                            •
                            <span>${perfilManager.perfil.estadisticas.horasVistas} horas vistas</span>
                        </p>
                    </div>
                </div>
            </div>
            
            <div class="profile-section">
                <h3>Mis Listas</h3>
                <div class="profile-lists">
                    <div class="profile-list-item">
                        <i class="fas fa-heart"></i>
                        <div>
                            <h5>Favoritos</h5>
                            <p>${perfilManager.perfil.actividad.favoritos.length} elementos</p>
                        </div>
                    </div>
                    <div class="profile-list-item">
                        <i class="fas fa-bookmark"></i>
                        <div>
                            <h5>Ver Más Tarde</h5>
                            <p>${perfilManager.perfil.actividad.listaVer.length} elementos</p>
                        </div>
                    </div>
                    <div class="profile-list-item">
                        <i class="fas fa-history"></i>
                        <div>
                            <h5>Historial</h5>
                            <p>${perfilManager.perfil.actividad.vistasRecientes.length} elementos</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="profile-section">
                <h3>Preferencias</h3>
                <div class="profile-preferences">
                    <div class="preference-tags">
                        ${perfilManager.perfil.estadisticas.generosMasVistos.slice(0, 5).map(genre => 
                            `<span class="preference-tag">${genre.nombre}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.querySelector('.profile-container').innerHTML = profileHTML;
    profileModal.style.display = 'block';
}

function showSettings() {
    const settingsHTML = `
        <div class="settings-header">
            <button class="modal-close" onclick="document.getElementById('settingsModal').style.display='none'">
                <i class="fas fa-times"></i>
            </button>
            <h2>Configuración</h2>
        </div>
        <div class="settings-content">
            <div class="settings-section">
                <h3>Apariencia</h3>
                <div class="settings-option">
                    <label>Tema</label>
                    <select id="themeSelect" class="settings-select">
                        <option value="dark" ${configManager.get('theme') === 'dark' ? 'selected' : ''}>Oscuro</option>
                        <option value="light" ${configManager.get('theme') === 'light' ? 'selected' : ''}>Claro</option>
                    </select>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="animationsToggle" ${configManager.get('animationEffects') ? 'checked' : ''}>
                        Animaciones
                    </label>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Reproducción</h3>
                <div class="settings-option">
                    <label>Calidad de vídeo</label>
                    <select id="qualitySelect" class="settings-select">
                        <option value="auto" ${configManager.get('quality') === 'auto' ? 'selected' : ''}>Auto</option>
                        <option value="hd" ${configManager.get('quality') === 'hd' ? 'selected' : ''}>HD</option>
                        <option value="fullhd" ${configManager.get('quality') === 'fullhd' ? 'selected' : ''}>Full HD</option>
                    </select>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="autoplayToggle" ${configManager.get('autoplayTrailers') ? 'checked' : ''}>
                        Reproducción automática de tráilers
                    </label>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="autoNextToggle" ${configManager.get('autoNextEpisode') ? 'checked' : ''}>
                        Siguiente episodio automático
                    </label>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Privacidad</h3>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="historyToggle" checked>
                        Guardar historial de visualización
                    </label>
                </div>
                <div class="settings-option">
                    <label>
                        <input type="checkbox" id="recommendationsToggle" ${configManager.get('recommendationsPersonalizadas') ? 'checked' : ''}>
                        Recomendaciones personalizadas
                    </label>
                </div>
            </div>
            
            <div class="settings-actions">
                <button class="btn-settings-save" onclick="saveSettings()">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
                <button class="btn-settings-reset" onclick="resetSettings()">
                    <i class="fas fa-undo"></i> Restablecer
                </button>
            </div>
        </div>
    `;
    
    document.querySelector('.settings-container').innerHTML = settingsHTML;
    settingsModal.style.display = 'block';
}

function saveSettings() {
    const theme = document.getElementById('themeSelect').value;
    const animations = document.getElementById('animationsToggle').checked;
    const quality = document.getElementById('qualitySelect').value;
    const autoplay = document.getElementById('autoplayToggle').checked;
    const autoNext = document.getElementById('autoNextToggle').checked;
    const recommendations = document.getElementById('recommendationsToggle').checked;
    
    configManager.saveConfig({
        theme,
        animationEffects: animations,
        quality,
        autoplayTrailers: autoplay,
        autoNextEpisode: autoNext,
        recommendationsPersonalizadas: recommendations
    });
    
    showNotification('Configuración guardada', 'success');
    settingsModal.style.display = 'none';
}

function resetSettings() {
    configManager.reset();
    showNotification('Configuración restablecida', 'info');
    settingsModal.style.display = 'none';
}

function logout() {
    localStorage.removeItem('ctvp_user_session');
    window.location.href = 'auth-modal.html';
}

function updateUserInterface() {
    const userSession = JSON.parse(localStorage.getItem('ctvp_user_session') || '{}');
    
    // Actualizar nombre de usuario en varios lugares
    const userNameElements = document.querySelectorAll('#userName, #userDisplayName, #mobileUserName');
    userNameElements.forEach(el => {
        if (el && userSession.name) {
            el.textContent = userSession.name;
        }
    });
    
    // Actualizar estadísticas del héroe (simulado)
    if (currentMode === 'movies') {
        document.getElementById('movieCount').textContent = '10,000+';
        document.getElementById('seriesCount').textContent = '5,000+';
    } else {
        document.getElementById('animeCount').textContent = '2,000+';
    }
}

async function loadRecommendations() {
    try {
        const recommendations = perfilManager.obtenerRecomendaciones();
        const recommendationsGrid = document.getElementById('recommendationsGrid');
        
        if (!recommendationsGrid || recommendations.generos.length === 0) return;
        
        // Cargar contenido basado en géneros favoritos
        const genreId = CONTENIDO_LIBRARY.generos.movies_tv[recommendations.generos[0]]?.id;
        if (genreId) {
            const response = await apiManager.request('tmdb', 
                `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`);
            
            if (response.ok) {
                const items = response.data.results.slice(0, 6);
                recommendationsGrid.innerHTML = '';
                
                items.forEach(item => {
                    const card = createContentCard({...item, type: 'movie'});
                    card.classList.add('recommendation-card');
                    recommendationsGrid.appendChild(card);
                });
            }
        }
    } catch (error) {
        console.error('Error loading recommendations:', error);
    }
}

function showLoading() {
    if (!contentGrid) return;
    
    if (currentPage === 1) {
        contentGrid.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Cargando contenido...</p>
            </div>
        `;
    }
}

function showEmptyState(message) {
    if (!contentGrid) return;
    
    contentGrid.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-film" style="font-size: 4rem; color: var(--text-tertiary); margin-bottom: 1rem;"></i>
            <h3>No hay contenido disponible</h3>
            <p>${message}</p>
        </div>
    `;
}

function setupPeriodicUpdates() {
    // Actualizar caché cada hora
    setInterval(() => {
        const cacheKeys = Object.keys(localStorage).filter(key => 
            key.startsWith('content_') || key.startsWith('details_') || key.startsWith('search_')
        );
        
        let needsUpdate = false;
        for (const key of cacheKeys) {
            if (!isCacheValid(key)) {
                needsUpdate = true;
                break;
            }
        }
        
        if (needsUpdate) {
            showNotification('Actualizando contenido...', 'info', 2000);
            setTimeout(() => {
                currentPage = 1;
                loadContent();
            }, 1000);
        }
    }, 60 * 60 * 1000);
    
    // Actualizar recomendaciones cada 30 minutos
    setInterval(loadRecommendations, 30 * 60 * 1000);
}

// Funciones de utilidad
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

function navigateToSection(section) {
    if (section === 'home') {
        currentCategory = 'popular';
        currentType = 'movie';
        loadContent();
    }
    // Otras secciones...
}

// Exportar funciones globales necesarias
window.toggleFavorite = toggleFavorite;
window.addToWatchlist = addToWatchlist;
window.playContent = playContent;
window.saveSettings = saveSettings;
window.resetSettings = resetSettings;