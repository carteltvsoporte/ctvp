let currentCategory = 'popular';
let currentType = 'movie';
let currentMode = 'movies';
let currentView = 'grid';

const modeSelector = document.querySelector('.mode-selector-container');
const modeOptions = document.querySelectorAll('.mode-option');
const navCategories = document.querySelectorAll('.nav-category');
const navSubitems = document.querySelectorAll('.nav-subitem');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const contentGrid = document.getElementById('content-grid');
const sectionTitle = document.getElementById('section-title');
const sectionSubtitle = document.getElementById('section-subtitle');
const modal = document.getElementById('detail-modal');
const modalClose = document.getElementById('modal-close');
const userMenuBtn = document.getElementById('user-menu-btn');
const logoutBtn = document.getElementById('logout-btn');
const viewModeButtons = document.querySelectorAll('.btn-view-mode');
const filterBtn = document.getElementById('filter-btn');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalPoster = document.getElementById('modal-poster');
const modalTitle = document.getElementById('modal-title');

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuthentication()) {
        window.location.href = 'auth-modal.html';
        return;
    }
    
    initializeApp();
    setupEventListeners();
    setupPeriodicUpdates();
    updateUserUI();
});

function initializeApp() {
    modeSelector.style.display = 'flex';
    setCurrentMode('movies');
    loadContent();
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
    modeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const mode = option.dataset.mode;
            setCurrentMode(mode);
            modeSelector.style.display = 'none';
        });
    });
    
    navSubitems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            currentType = item.dataset.type;
            currentCategory = item.dataset.category;
            loadContent();
            updateNavigationUI();
        });
    });
    
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    userMenuBtn.addEventListener('click', toggleUserMenu);
    logoutBtn.addEventListener('click', logout);
    
    viewModeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            setCurrentView(view);
        });
    });
    
    filterBtn.addEventListener('click', showFilterOptions);
    
    document.getElementById('favorites-link').addEventListener('click', showFavorites);
    document.getElementById('btn-favorite').addEventListener('click', handleFavorite);
}

function setCurrentMode(mode) {
    currentMode = mode;
    
    modeOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.mode === mode);
    });
    
    updateNavigationForMode(mode);
    loadContent();
}

function setCurrentView(view) {
    currentView = view;
    
    viewModeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });
    
    applyContentView();
}

function updateNavigationForMode(mode) {
    navCategories.forEach(category => {
        const categoryMode = category.dataset.category;
        if (categoryMode === 'movies' || categoryMode === 'tv') {
            category.style.display = mode === 'movies' ? 'block' : 'none';
        } else if (categoryMode === 'anime') {
            category.style.display = mode === 'anime' ? 'block' : 'none';
        }
    });
    
    if (mode === 'movies') {
        currentType = 'movie';
        currentCategory = 'popular';
    } else {
        currentType = 'anime';
        currentCategory = 'airing';
    }
    
    updateNavigationUI();
}

function updateNavigationUI() {
    navSubitems.forEach(item => {
        const isActive = item.dataset.type === currentType && 
                        item.dataset.category === currentCategory;
        item.classList.toggle('active', isActive);
    });
}

async function loadContent() {
    const cacheKey = `ctvp_${currentMode}_${currentType}_${currentCategory}`;
    
    if (isCacheValid(cacheKey)) {
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            displayContent(cachedData);
            return;
        }
    }
    
    try {
        showLoading();
        
        let data;
        if (currentMode === 'movies') {
            const response = await apiManager.request('tmdb', `/${currentType}/${currentCategory}`);
            const result = await response.json();
            data = result.results || [];
        } else {
            let endpoint = '';
            
            if (currentCategory === 'favorite') {
                endpoint = '/top/anime?filter=favorite';
            } else if (['tv', 'movie', 'ova', 'special'].includes(currentCategory)) {
                endpoint = `/top/anime?type=${currentCategory}`;
            } else {
                endpoint = `/top/anime?filter=${currentCategory}`;
            }
            
            const response = await apiManager.request('jikan', `${endpoint}&limit=24`);
            const animeData = await response.json();
            data = animeData.data || [];
        }
        
        saveToCache(cacheKey, data);
        displayContent(data);
    } catch (error) {
        console.error('Error loading content:', error);
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            displayContent(cachedData);
            showNotification('Usando datos en caché', 'warning');
        } else {
            showEmptyState('Error al cargar contenido. Intenta más tarde.');
        }
    }
}

function displayContent(items) {
    if (!contentGrid) return;
    
    contentGrid.innerHTML = '';
    
    if (!items || items.length === 0) {
        showEmptyState('No se encontró contenido en esta categoría.');
        return;
    }
    
    items.forEach(item => {
        const card = createContentCard(item);
        contentGrid.appendChild(card);
    });
    
    applyContentView();
    updateSectionTitle();
}

function createContentCard(item) {
    const card = document.createElement('div');
    card.className = 'content-card';
    card.tabIndex = 0;
    
    let imageUrl, title, year, rating, badge, type;
    
    if (currentMode === 'movies') {
        imageUrl = item.poster_path 
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : 'https://via.placeholder.com/300x450/161b22/8b949e?text=Imagen+No+Disponible';
        
        title = currentType === 'movie' ? item.title : item.name;
        const releaseDate = currentType === 'movie' ? item.release_date : item.first_air_date;
        year = releaseDate ? releaseDate.substring(0, 4) : 'N/A';
        rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
        badge = currentType === 'movie' ? 'Película' : 'Serie';
        type = currentType;
    } else {
        imageUrl = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || 
                  'https://via.placeholder.com/300x450/161b22/00adb5?text=Anime';
        
        if (imageUrl.includes('cdn.myanimelist.net')) {
            imageUrl = imageUrl.replace('/large/', '/medium/').replace('.jpg', 'l.jpg');
        }
        
        title = item.title || item.name || 'Título no disponible';
        year = item.year || item.aired?.prop?.from?.year || 'N/A';
        rating = item.score ? item.score.toFixed(1) : 'N/A';
        badge = item.type || 'Anime';
        type = 'anime';
    }
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="card-image" loading="lazy" decoding="async">
        <div class="card-badge">${badge}</div>
        <div class="card-info">
            <h3 class="card-title">${title}</h3>
            <div class="card-meta">
                <span>${year}</span>
                <div class="card-rating">
                    <svg width="12" height="12" viewBox="0 0 24 24">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                    </svg>
                    <span>${rating}</span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => showDetails(item, type));
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') showDetails(item, type);
    });
    
    return card;
}

function applyContentView() {
    const cards = contentGrid.querySelectorAll('.content-card');
    cards.forEach(card => {
        if (currentView === 'list') {
            card.style.display = 'flex';
            card.style.flexDirection = 'row';
            const img = card.querySelector('.card-image');
            const info = card.querySelector('.card-info');
            if (img) {
                img.style.width = '120px';
                img.style.height = '180px';
                img.style.flexShrink = '0';
            }
            if (info) {
                info.style.flex = '1';
                info.style.paddingLeft = '1rem';
            }
        } else {
            card.style.display = 'block';
            const img = card.querySelector('.card-image');
            const info = card.querySelector('.card-info');
            if (img) {
                img.style.width = '100%';
                img.style.height = '270px';
            }
            if (info) {
                info.style.paddingLeft = '';
            }
        }
    });
}

async function showDetails(item, type) {
    const cacheKey = `ctvp_details_${currentMode}_${type}_${item.id || item.mal_id}`;
    
    try {
        let details = getFromCache(cacheKey);
        
        if (!details) {
            if (currentMode === 'movies') {
                const response = await apiManager.request('tmdb', `/${type}/${item.id}`);
                details = await response.json();
            } else {
                const response = await apiManager.request('jikan', `/anime/${item.mal_id}`);
                const animeData = await response.json();
                details = animeData.data;
            }
            saveToCache(cacheKey, details);
        }
        
        populateModal(details, type);
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading details:', error);
        showNotification('Error al cargar los detalles', 'error');
    }
}

function populateModal(details, type) {
    if (!modalBackdrop || !modalPoster || !modalTitle) return;
    
    let backdropUrl, posterUrl, title, releaseDate, year, rating, overview, genres, runtime, status;
    
    if (currentMode === 'movies') {
        backdropUrl = details.backdrop_path 
            ? `${BACKDROP_BASE_URL}${details.backdrop_path}`
            : 'https://via.placeholder.com/780x439/161b22/e94560?text=Imagen+No+Disponible';
        
        posterUrl = details.poster_path 
            ? `${IMAGE_BASE_URL}${details.poster_path}`
            : 'https://via.placeholder.com/300x450/161b22/e94560?text=Imagen+No+Disponible';
        
        title = type === 'movie' ? details.title : details.name;
        releaseDate = type === 'movie' ? details.release_date : details.first_air_date;
        year = releaseDate ? releaseDate.substring(0, 4) : 'N/A';
        rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';
        overview = getDetailedSpanishDescription(details, type);
        genres = details.genres || [];
        runtime = type === 'movie' ? details.runtime : null;
        status = SPANISH_DESCRIPTIONS.status[details.status] || details.status || 'N/A';
    } else {
        backdropUrl = details.images?.jpg?.large_image_url || 
                     'https://via.placeholder.com/780x439/161b22/00adb5?text=Anime';
        
        posterUrl = details.images?.jpg?.large_image_url || details.images?.jpg?.image_url || 
                   'https://via.placeholder.com/300x450/161b22/00adb5?text=Anime';
        
        if (backdropUrl.includes('cdn.myanimelist.net')) {
            backdropUrl = backdropUrl.replace('/large/', '/medium/');
        }
        if (posterUrl.includes('cdn.myanimelist.net')) {
            posterUrl = posterUrl.replace('/large/', '/medium/').replace('.jpg', 'l.jpg');
        }
        
        title = details.title || details.title_english || 'Título no disponible';
        year = details.year || details.aired?.prop?.from?.year || 'N/A';
        rating = details.score ? details.score.toFixed(1) : 'N/A';
        overview = getDetailedAnimeDescription(details);
        genres = details.genres || [];
        runtime = details.duration || 'N/A';
        status = details.status || 'N/A';
    }
    
    modalBackdrop.src = backdropUrl;
    modalBackdrop.alt = `Fondo de ${title}`;
    modalPoster.src = posterUrl;
    modalPoster.alt = `Póster de ${title}`;
    modalTitle.textContent = title;
    
    let metaHTML = `<span>${year}</span>`;
    
    if (currentMode === 'movies') {
        if (type === 'movie') {
            metaHTML += `<span>${runtime || 'N/A'} min</span>`;
        } else {
            metaHTML += `<span>${details.number_of_seasons || 'N/A'} temporadas</span>`;
        }
    } else {
        metaHTML += `<span>${runtime}</span>`;
    }
    
    metaHTML += `<span>★ ${rating}</span>`;
    metaHTML += `<span>${status}</span>`;
    
    const modalMeta = document.getElementById('modal-meta');
    if (modalMeta) modalMeta.innerHTML = metaHTML;
    
    const modalOverview = document.getElementById('modal-overview');
    if (modalOverview) modalOverview.textContent = overview;
    
    const modalGenres = document.getElementById('modal-genres');
    if (modalGenres) {
        modalGenres.innerHTML = '';
        if (genres.length > 0) {
            genres.forEach(genre => {
                const genreName = SPANISH_DESCRIPTIONS.genres[genre.name] || genre.name || genre;
                const genreTag = document.createElement('span');
                genreTag.className = 'genre-tag';
                genreTag.textContent = genreName;
                modalGenres.appendChild(genreTag);
            });
        }
    }
    
    populateAdditionalDetails(details, type);
}

function populateAdditionalDetails(details, type) {
    const modalDetails = document.getElementById('modal-details');
    if (!modalDetails) return;
    
    modalDetails.innerHTML = '';
    
    if (currentMode === 'movies') {
        if (type === 'movie') {
            modalDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Presupuesto</span>
                    <span class="detail-value">${details.budget ? `$${details.budget.toLocaleString('es-ES')}` : 'No disponible'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Ingresos</span>
                    <span class="detail-value">${details.revenue ? `$${details.revenue.toLocaleString('es-ES')}` : 'No disponible'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Idioma Original</span>
                    <span class="detail-value">${details.original_language ? details.original_language.toUpperCase() : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Votos</span>
                    <span class="detail-value">${details.vote_count ? details.vote_count.toLocaleString('es-ES') : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Popularidad</span>
                    <span class="detail-value">${details.popularity ? Math.round(details.popularity) : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Estado</span>
                    <span class="detail-value">${SPANISH_DESCRIPTIONS.status[details.status] || details.status || 'N/A'}</span>
                </div>
            `;
        } else {
            modalDetails.innerHTML = `
                <div class="detail-item">
                    <span class="detail-label">Episodios</span>
                    <span class="detail-value">${details.number_of_episodes || 'En emisión'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Temporadas</span>
                    <span class="detail-value">${details.number_of_seasons || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Idioma Original</span>
                    <span class="detail-value">${details.original_language ? details.original_language.toUpperCase() : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Votos</span>
                    <span class="detail-value">${details.vote_count ? details.vote_count.toLocaleString('es-ES') : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Popularidad</span>
                    <span class="detail-value">${details.popularity ? Math.round(details.popularity) : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Estado</span>
                    <span class="detail-value">${SPANISH_DESCRIPTIONS.status[details.status] || details.status || 'N/A'}</span>
                </div>
            `;
        }
    } else {
        modalDetails.innerHTML = `
            <div class="detail-item">
                <span class="detail-label">Episodios</span>
                <span class="detail-value">${details.episodes || 'En emisión'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Estudio</span>
                <span class="detail-value">${details.studios && details.studios.length > 0 ? details.studios[0].name : 'No disponible'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Emitido</span>
                <span class="detail-value">${details.aired?.string || 'No disponible'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Puntuación</span>
                <span class="detail-value">${details.scored_by ? details.scored_by.toLocaleString('es-ES') + ' usuarios' : 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Clasificación</span>
                <span class="detail-value">${details.rating || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Fuente</span>
                <span class="detail-value">${details.source || 'Original'}</span>
            </div>
        `;
    }
}

async function performSearch() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    try {
        showLoading();
        const allResults = await apiManager.unifiedSearch(query);
        displaySearchResults(allResults, query);
    } catch (error) {
        console.error('Error performing search:', error);
        showEmptyState('Error en la búsqueda. Intenta más tarde.');
    }
}

function displaySearchResults(results, query) {
    if (!contentGrid || !sectionTitle || !sectionSubtitle) return;
    
    contentGrid.innerHTML = '';
    sectionTitle.textContent = `Resultados para: "${query}"`;
    sectionSubtitle.textContent = `${results.length} resultados encontrados`;
    
    if (results.length === 0) {
        showEmptyState('No se encontraron resultados para tu búsqueda.');
    } else {
        results.forEach(item => {
            const card = createContentCard(item);
            contentGrid.appendChild(card);
        });
    }
    applyContentView();
}

function updateSectionTitle() {
    if (!sectionTitle || !sectionSubtitle) return;
    
    const titles = {
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
    sectionTitle.textContent = titles[currentMode]?.[titleKey] || 'Contenido Destacado';
    sectionSubtitle.textContent = currentMode === 'movies' ? 'Descubre las mejores películas y series' : 'Explora el mundo del anime';
}

function updateUserUI() {
    const userSession = localStorage.getItem('ctvp_user_session');
    if (userSession) {
        try {
            const user = JSON.parse(userSession);
            const userName = document.getElementById('user-name');
            const userDisplayName = document.getElementById('user-display-name');
            
            if (userName) userName.textContent = user.name;
            if (userDisplayName) userDisplayName.textContent = user.name;
        } catch (e) {
            console.error('Error mostrando información de usuario:', e);
        }
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.classList.toggle('active');
}

function logout() {
    localStorage.removeItem('ctvp_user_session');
    window.location.href = 'auth-modal.html';
}

function showFilterOptions() {
    showNotification('Funcionalidad de filtros en desarrollo', 'info');
}

function showFavorites() {
    const favorites = JSON.parse(localStorage.getItem('ctvp_favorites') || '{}');
    const favoriteItems = Object.values(favorites);
    
    if (favoriteItems.length === 0) {
        showEmptyState('No tienes favoritos guardados.');
    } else {
        displayContent(favoriteItems);
        if (sectionTitle) sectionTitle.textContent = 'Tus Favoritos';
        if (sectionSubtitle) sectionSubtitle.textContent = `${favoriteItems.length} elementos guardados`;
    }
}

function handleFavorite() {
    const title = document.getElementById('modal-title')?.textContent;
    if (!title) return;
    
    const currentItem = {
        id: Date.now(),
        title: title,
        type: currentType,
        addedAt: new Date().toISOString()
    };
    
    toggleFavorite(currentItem, currentType);
}

function toggleFavorite(item, type) {
    const favorites = JSON.parse(localStorage.getItem('ctvp_favorites') || '{}');
    const key = `${type}_${item.id || item.mal_id}`;
    const btnFavorite = document.getElementById('btn-favorite');
    
    if (!btnFavorite) return;
    
    if (favorites[key]) {
        delete favorites[key];
        showNotification('Eliminado de favoritos', 'info');
        btnFavorite.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39465C21.7563 5.72719 21.351 5.12076 20.84 4.61Z" fill="currentColor"/>
            </svg>
            Añadir a Favoritos
        `;
    } else {
        favorites[key] = {
            ...item,
            type,
            addedAt: new Date().toISOString()
        };
        showNotification('Añadido a favoritos', 'success');
        btnFavorite.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39465C21.7563 5.72719 21.351 5.12076 20.84 4.61Z" fill="currentColor"/>
            </svg>
            Quitar de Favoritos
        `;
    }
    
    localStorage.setItem('ctvp_favorites', JSON.stringify(favorites));
}

function showLoading() {
    if (!contentGrid) return;
    
    contentGrid.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
        </div>
    `;
}

function showEmptyState(message) {
    if (!contentGrid) return;
    
    contentGrid.innerHTML = `
        <div class="empty-state">
            <svg width="100" height="100" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
            </svg>
            <h3>No hay contenido disponible</h3>
            <p>${message}</p>
        </div>
    `;
}

function setupPeriodicUpdates() {
    setInterval(() => {
        const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('ctvp_'));
        let needsUpdate = false;
        
        for (const key of cacheKeys) {
            if (!isCacheValid(key)) {
                needsUpdate = true;
                break;
            }
        }
        
        if (needsUpdate) {
            loadContent();
            showNotification('Contenido actualizado', 'info');
        }
    }, 60 * 60 * 1000);
}