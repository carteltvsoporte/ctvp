// Configuración de APIs
const API_CONFIG = {
    TMDB: {
        API_KEY: 'eef8d6f3eb5b3f98a9c4aa3b9576e4e8',
        BASE_URL: 'https://api.themoviedb.org/3',
        IMAGE_URL: 'https://image.tmdb.org/t/p/w500',
        BACKDROP_URL: 'https://image.tmdb.org/t/p/original'
    },
    JIKAN: {
        BASE_URL: 'https://api.jikan.moe/v4',
        IMAGE_URL: 'https://cdn.myanimelist.net/images/anime'
    },
    OPEN_LIBRARY: {
        BASE_URL: 'https://openlibrary.org'
    },
    OMDB: {
        API_KEY: 'a9c4aa3b',
        BASE_URL: 'http://www.omdbapi.com'
    }
};

// Imágenes de respaldo
const FALLBACK_IMAGES = {
    movie: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
    tv: 'https://images.unsplash.com/photo-1489599809516-9827b6d1cf13?auto=format&fit=crop&w=500&q=80',
    anime: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=500&q=80',
    documentary: 'https://images.unsplash.com/photo-1551029506-0807df4e2038?auto=format&fit=crop&w=500&q=80',
    kids: 'https://images.unsplash.com/photo-1551029506-0807df4e2040?auto=format&fit=crop&w=500&q=80',
    default: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80'
};

// Estado de la aplicación
const appState = {
    currentUser: null,
    currentSection: 'home',
    currentTab: 'trending',
    currentFilters: { 
        genre: 'all', 
        year: 'all', 
        sort: 'popularity.desc' 
    },
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    searchQuery: '',
    watchlist: [],
    genres: {
        movie: [],
        tv: [],
        anime: []
    }
};

// Elementos DOM
const elements = {
    authOverlay: document.getElementById('authOverlay'),
    mainHeader: document.getElementById('mainHeader'),
    mainContent: document.getElementById('mainContent'),
    usernameInput: document.getElementById('usernameInput'),
    ticketInput: document.getElementById('ticketInput'),
    loginBtn: document.getElementById('loginBtn'),
    usernameError: document.getElementById('usernameError'),
    ticketError: document.getElementById('ticketError'),
    welcomeUser: document.getElementById('welcomeUser'),
    userAvatar: document.getElementById('userAvatar'),
    avatarInitials: document.getElementById('avatarInitials'),
    watchlistCounter: document.getElementById('watchlistCounter'),
    toast: document.getElementById('toast'),
    contentGrid: document.getElementById('contentGrid'),
    detailModal: document.getElementById('detailModal'),
    modalBody: document.getElementById('modalBody'),
    closeModal: document.getElementById('closeModal'),
    navLinks: document.querySelectorAll('.nav-link'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    applyFiltersBtn: document.getElementById('applyFilters'),
    resetFiltersBtn: document.getElementById('resetFilters'),
    genreFilter: document.getElementById('genreFilter'),
    yearFilter: document.getElementById('yearFilter'),
    sortFilter: document.getElementById('sortFilter'),
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    exploreBtn: document.getElementById('exploreBtn'),
    randomBtn: document.getElementById('randomBtn'),
    watchlistBtn: document.getElementById('watchlistBtn'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    pagination: document.getElementById('pagination')
};

// Usuarios autorizados
const authorizedUsers = {
    "user000": "ticket000",
    "user001": "ticket001",
    "user002": "ticket002",
    "admin": "admin123"
};

// Géneros predefinidos para anime
const ANIME_GENRES = [
    { id: 1, name: "Acción" },
    { id: 2, name: "Aventura" },
    { id: 4, name: "Comedia" },
    { id: 8, name: "Drama" },
    { id: 10, name: "Fantasia" },
    { id: 14, name: "Horror" },
    { id: 22, name: "Romance" },
    { id: 24, name: "Sci-Fi" },
    { id: 27, name: "Shonen" },
    { id: 28, name: "Seinen" },
    { id: 30, name: "Sports" },
    { id: 31, name: "Super Power" },
    { id: 32, name: "Vampire" },
    { id: 35, name: "Harem" },
    { id: 37, name: "Supernatural" },
    { id: 38, name: "Military" },
    { id: 39, name: "Police" },
    { id: 40, name: "Psychological" },
    { id: 41, name: "Thriller" },
    { id: 43, name: "Mecha" },
    { id: 46, name: "Award Winning" },
    { id: 47, name: "Gourmet" },
    { id: 50, name: "Adult Cast" },
    { id: 51, name: "Anthropomorphic" },
    { id: 52, name: "CGDCT" },
    { id: 53, name: "Childcare" },
    { id: 54, name: "Combat Sports" },
    { id: 56, name: "Delinquents" },
    { id: 57, name: "Detective" },
    { id: 58, name: "Educational" },
    { id: 59, name: "Gag Humor" },
    { id: 60, name: "Gore" },
    { id: 61, name: "High Stakes Game" },
    { id: 62, name: "Historical" },
    { id: 63, name: "Idols (Female)" },
    { id: 64, name: "Idols (Male)" },
    { id: 65, name: "Isekai" },
    { id: 66, name: "Iyashikei" },
    { id: 67, name: "Love Polygon" },
    { id: 68, name: "Magical Sex Shift" },
    { id: 69, name: "Mahou Shoujo" },
    { id: 70, name: "Martial Arts" },
    { id: 71, name: "Medical" },
    { id: 73, name: "Organized Crime" },
    { id: 74, name: "Otaku Culture" },
    { id: 75, name: "Parody" },
    { id: 76, name: "Performing Arts" },
    { id: 77, name: "Pets" },
    { id: 78, name: "Racing" },
    { id: 79, name: "Reincarnation" },
    { id: 80, name: "Reverse Harem" },
    { id: 81, name: "Romantic Subtext" },
    { id: 82, name: "Samurai" },
    { id: 83, name: "School" },
    { id: 84, name: "Showbiz" },
    { id: 85, name: "Space" },
    { id: 86, name: "Strategy Game" },
    { id: 87, name: "Superhero" },
    { id: 88, name: "Survival" },
    { id: 89, name: "Team Sports" },
    { id: 90, name: "Time Travel" },
    { id: 91, name: "Vampire" },
    { id: 92, name: "Video Game" },
    { id: 93, name: "Visual Arts" },
    { id: 94, name: "Workplace" },
    { id: 95, name: "Josei" },
    { id: 96, name: "Kids" },
    { id: 97, name: "Seinen" },
    { id: 98, name: "Shoujo" },
    { id: 99, name: "Shounen" }
];

// Datos de respaldo
const FALLBACK_DATA = {
    movies: [
        {
            id: 1,
            title: "Avengers: Endgame",
            type: 'movie',
            rating: 8.4,
            year: '2019',
            genres: ['Acción', 'Aventura', 'Ciencia Ficción'],
            image: FALLBACK_IMAGES.movie,
            description: 'Los Vengadores restantes deben encontrar una manera de recuperar a sus aliados para un enfrentamiento épico con Thanos.',
            popularity: 100
        },
        {
            id: 2,
            title: "The Dark Knight",
            type: 'movie',
            rating: 9.0,
            year: '2008',
            genres: ['Acción', 'Crimen', 'Drama'],
            image: FALLBACK_IMAGES.movie,
            description: 'Batman se enfrenta al Joker, un criminal que quiere sumir a Gotham City en la anarquía.',
            popularity: 95
        }
    ],
    tv: [
        {
            id: 1,
            title: "Breaking Bad",
            type: 'tv',
            rating: 9.5,
            year: '2008',
            genres: ['Drama', 'Crimen', 'Thriller'],
            image: FALLBACK_IMAGES.tv,
            description: 'Un profesor de química con cáncer terminal se asocia con un exalumno para fabricar y vender metanfetamina.',
            popularity: 98,
            episodes: 62,
            seasons: 5
        }
    ],
    anime: [
        {
            id: 5114,
            title: "Fullmetal Alchemist: Brotherhood",
            type: "anime",
            rating: 9.1,
            year: 2009,
            genres: ["Acción", "Aventura", "Drama", "Fantasía"],
            image: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg",
            description: "Dos hermanos buscan la piedra filosofal para restaurar sus cuerpos después de un fallido intento de resucitar a su madre.",
            popularity: 1,
            episodes: 64,
            status: "Finished Airing",
            source: "Manga"
        }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    loadWatchlist();
    updateWatchlistCounter();
    
    // Detectar conexión
    window.addEventListener('online', () => {
        showToast('Conexión restablecida', 'success');
        if (appState.currentUser) loadContent();
    });
    
    window.addEventListener('offline', () => {
        showToast('Sin conexión. Usando datos en caché.', 'warning');
    });
});

function initApp() {
    setupEventListeners();
    setupKeyboardNavigation();
    populateYearFilter();
    checkInitialAuth();
}

function checkInitialAuth() {
    // Verificar si ya hay un usuario autenticado en localStorage
    const savedUser = localStorage.getItem('cartelTV_currentUser');
    if (savedUser && authorizedUsers[savedUser]) {
        appState.currentUser = savedUser;
        completeLogin(savedUser);
    }
}

function setupEventListeners() {
    // Autenticación
    elements.loginBtn.addEventListener('click', handleLogin);
    elements.ticketInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    elements.usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            elements.ticketInput.focus();
        }
    });

    // Navegación
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveSection(link.dataset.section);
            link.focus();
        });
    });

    // Tabs
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.tabButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
            appState.currentTab = btn.dataset.tab;
            appState.currentPage = 1;
            loadContent();
            btn.focus();
        });
    });

    // Búsqueda
    elements.searchInput.addEventListener('input', debounce(handleSearch, 500));
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Filtros
    elements.applyFiltersBtn.addEventListener('click', applyFilters);
    elements.resetFiltersBtn.addEventListener('click', resetFilters);
    
    elements.genreFilter.addEventListener('change', () => {
        if (appState.currentSection !== 'anime') {
            applyFilters();
        }
    });
    
    elements.sortFilter.addEventListener('change', applyFilters);

    // Botones
    elements.exploreBtn.addEventListener('click', () => {
        setActiveSection('integrated');
        loadContent();
    });

    elements.randomBtn.addEventListener('click', showRandomContent);
    elements.watchlistBtn.addEventListener('click', showWatchlist);

    // Modal
    elements.closeModal.addEventListener('click', () => {
        closeModal();
    });

    elements.detailModal.addEventListener('click', (e) => {
        if (e.target === elements.detailModal) {
            closeModal();
        }
    });

    // Paginación
    elements.prevPage.addEventListener('click', () => {
        if (appState.currentPage > 1) {
            appState.currentPage--;
            loadContent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    elements.nextPage.addEventListener('click', () => {
        if (appState.currentPage < appState.totalPages) {
            appState.currentPage++;
            loadContent();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // Avatar del usuario
    elements.userAvatar.addEventListener('click', showWatchlist);
    elements.userAvatar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            showWatchlist();
        }
    });
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Cerrar modal con Escape
        if (e.key === 'Escape' && elements.detailModal.classList.contains('active')) {
            closeModal();
        }
        
        // Navegación por tabs con flechas
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const activeTab = document.querySelector('.tab-btn.active');
            if (activeTab) {
                const tabs = Array.from(elements.tabButtons);
                const currentIndex = tabs.indexOf(activeTab);
                let nextIndex;
                
                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % tabs.length;
                } else {
                    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                }
                
                tabs[nextIndex].click();
                tabs[nextIndex].focus();
            }
        }
    });
    
    // Mejorar accesibilidad del modal
    elements.detailModal.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusableElements = elements.detailModal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

function closeModal() {
    elements.detailModal.classList.remove('active');
    elements.detailModal.setAttribute('aria-hidden', 'true');
    // Restaurar foco al elemento que abrió el modal
    const lastFocused = document.querySelector('.media-card:focus, .action-btn:focus');
    if (lastFocused) lastFocused.focus();
}

// Autenticación
function handleLogin() {
    const username = elements.usernameInput.value.trim().toLowerCase();
    const ticket = elements.ticketInput.value.trim();
    
    elements.usernameError.style.display = 'none';
    elements.ticketError.style.display = 'none';
    
    if (!username || !ticket) {
        if (!username) {
            elements.usernameError.textContent = 'Ingresa usuario';
            elements.usernameError.style.display = 'block';
            elements.usernameInput.focus();
        }
        if (!ticket) {
            elements.ticketError.textContent = 'Ingresa ticket';
            elements.ticketError.style.display = 'block';
            if (username) elements.ticketInput.focus();
        }
        return;
    }
    
    if (!authorizedUsers[username]) {
        elements.usernameError.textContent = 'Usuario no autorizado';
        elements.usernameError.style.display = 'block';
        showToast('Usuario no encontrado', 'error');
        elements.usernameInput.focus();
        return;
    }
    
    if (authorizedUsers[username] !== ticket) {
        elements.ticketError.textContent = 'Ticket incorrecto';
        elements.ticketError.style.display = 'block';
        showToast('Ticket inválido', 'error');
        elements.ticketInput.focus();
        return;
    }
    
    appState.currentUser = username;
    localStorage.setItem('cartelTV_currentUser', username);
    completeLogin(username);
}

function completeLogin(username) {
    const initials = username.split('_').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    elements.avatarInitials.textContent = initials;
    elements.welcomeUser.textContent = username.replace('_', ' ');
    
    // Transición suave
    elements.authOverlay.style.opacity = '0';
    setTimeout(() => {
        elements.authOverlay.style.display = 'none';
        elements.mainHeader.style.display = 'block';
        elements.mainContent.style.display = 'block';
        
        // Cargar géneros y contenido
        loadGenres();
        loadContent();
        
        showToast(`¡Bienvenido ${username}!`, 'success');
        
        // Enfocar búsqueda para accesibilidad
        setTimeout(() => elements.searchInput.focus(), 100);
    }, 400);
}

// Cargar géneros desde TMDB
async function loadGenres() {
    try {
        // Géneros para películas
        const movieResponse = await fetchWithTimeout(
            `${API_CONFIG.TMDB.BASE_URL}/genre/movie/list?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES`,
            5000
        );
        
        if (movieResponse.ok) {
            const movieData = await movieResponse.json();
            appState.genres.movie = movieData.genres || [];
        } else {
            throw new Error('Error en respuesta de TMDB');
        }
        
        // Géneros para TV
        const tvResponse = await fetchWithTimeout(
            `${API_CONFIG.TMDB.BASE_URL}/genre/tv/list?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES`,
            5000
        );
        
        if (tvResponse.ok) {
            const tvData = await tvResponse.json();
            appState.genres.tv = tvData.genres || [];
        }
        
        // Actualizar filtro de géneros
        updateGenreFilter();
        
    } catch (error) {
        console.warn('Error cargando géneros, usando datos por defecto:', error);
        // Usar géneros por defecto
        appState.genres.movie = [
            { id: 28, name: "Acción" },
            { id: 12, name: "Aventura" },
            { id: 16, name: "Animación" },
            { id: 35, name: "Comedia" },
            { id: 80, name: "Crimen" },
            { id: 99, name: "Documental" },
            { id: 18, name: "Drama" },
            { id: 10751, name: "Familia" },
            { id: 14, name: "Fantasía" },
            { id: 36, name: "Historia" },
            { id: 27, name: "Terror" },
            { id: 10402, name: "Música" },
            { id: 9648, name: "Misterio" },
            { id: 10749, name: "Romance" },
            { id: 878, name: "Sci-Fi" },
            { id: 10770, name: "TV Movie" },
            { id: 53, name: "Thriller" },
            { id: 10752, name: "Guerra" },
            { id: 37, name: "Western" }
        ];
        appState.genres.tv = [
            { id: 10759, name: "Action & Adventure" },
            { id: 16, name: "Animación" },
            { id: 35, name: "Comedia" },
            { id: 80, name: "Crimen" },
            { id: 99, name: "Documental" },
            { id: 18, name: "Drama" },
            { id: 10751, name: "Familia" },
            { id: 10762, name: "Kids" },
            { id: 9648, name: "Misterio" },
            { id: 10763, name: "News" },
            { id: 10764, name: "Reality" },
            { id: 10765, name: "Sci-Fi & Fantasy" },
            { id: 10766, name: "Soap" },
            { id: 10767, name: "Talk" },
            { id: 10768, name: "War & Politics" },
            { id: 37, name: "Western" }
        ];
        updateGenreFilter();
        showToast('Usando datos locales - conexión limitada', 'warning');
    }
}

async function fetchWithTimeout(url, timeout = 8000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

function updateGenreFilter() {
    const genreFilter = elements.genreFilter;
    genreFilter.innerHTML = '<option value="all">Todos los géneros</option>';
    
    let genres = [];
    
    switch (appState.currentSection) {
        case 'movies':
            genres = appState.genres.movie;
            break;
        case 'tv':
            genres = appState.genres.tv;
            break;
        case 'anime':
            // Usar géneros de anime predefinidos
            ANIME_GENRES.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
            return;
        default:
            // Para secciones mixtas, combinar géneros
            genres = [...appState.genres.movie, ...appState.genres.tv];
            // Eliminar duplicados
            const uniqueGenres = Array.from(new Map(genres.map(g => [g.id, g])).values());
            genres = uniqueGenres;
    }
    
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
    });
}

function populateYearFilter() {
    const yearFilter = elements.yearFilter;
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year >= 1950; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    }
}

// Cargar contenido principal
async function loadContent() {
    showLoading();
    
    try {
        let data = [];
        
        if (appState.searchQuery) {
            // Búsqueda
            data = await searchContent(appState.searchQuery);
            elements.searchResults.style.display = 'block';
            elements.searchResults.innerHTML = `${appState.totalResults} resultados para "${appState.searchQuery}"`;
        } else {
            // Contenido por sección y tab
            switch (appState.currentSection) {
                case 'anime':
                    data = await fetchAnime();
                    break;
                case 'movies':
                    data = await fetchMovies();
                    break;
                case 'tv':
                    data = await fetchTVShows();
                    break;
                case 'documentaries':
                    data = await fetchDocumentaries();
                    break;
                case 'kids':
                    data = await fetchKidsContent();
                    break;
                case 'integrated':
                    data = await fetchIntegratedContent();
                    break;
                default: // home
                    data = await fetchHomeContent();
            }
            
            elements.searchResults.style.display = 'none';
        }
        
        // Aplicar filtros
        data = applyLocalFilters(data);
        
        // Mostrar contenido
        displayContent(data);
        
        // Actualizar paginación
        updatePagination();
        
    } catch (error) {
        console.error('Error cargando contenido:', error);
        showError('Error al cargar el contenido. Intenta nuevamente.');
        // Mostrar datos de respaldo
        displayContent(getFallbackContent());
    }
}

// Funciones para fetch de diferentes APIs
async function fetchMovies() {
    try {
        let endpoint = '';
        
        switch (appState.currentTab) {
            case 'trending':
                endpoint = `/trending/movie/week?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            case 'top-rated':
                endpoint = `/movie/top_rated?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            case 'upcoming':
                endpoint = `/movie/upcoming?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            case 'now-playing':
                endpoint = `/movie/now_playing?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            default:
                endpoint = `/discover/movie?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&sort_by=${appState.currentFilters.sort}&page=${appState.currentPage}`;
        }
        
        // Añadir filtros a discover
        if (appState.currentTab === 'discover') {
            if (appState.currentFilters.genre !== 'all') {
                endpoint += `&with_genres=${appState.currentFilters.genre}`;
            }
            if (appState.currentFilters.year !== 'all') {
                endpoint += `&primary_release_year=${appState.currentFilters.year}`;
            }
        }
        
        const response = await fetchWithTimeout(`${API_CONFIG.TMDB.BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        appState.totalPages = data.total_pages || 1;
        appState.totalResults = data.total_results || 0;
        
        return (data.results || []).map(item => ({
            id: item.id,
            title: item.title || 'Sin título',
            type: 'movie',
            rating: item.vote_average || 0,
            year: item.release_date ? item.release_date.substring(0, 4) : 'N/A',
            genres: item.genre_ids ? getGenreNames(item.genre_ids, 'movie') : [],
            image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.movie,
            backdrop: item.backdrop_path ? `${API_CONFIG.TMDB.BACKDROP_URL}${item.backdrop_path}` : null,
            description: item.overview || 'Sin descripción disponible.',
            popularity: item.popularity || 0,
            vote_count: item.vote_count || 0
        }));
        
    } catch (error) {
        console.error('Error fetching movies:', error);
        return FALLBACK_DATA.movies;
    }
}

async function fetchTVShows() {
    try {
        let endpoint = '';
        
        switch (appState.currentTab) {
            case 'trending':
                endpoint = `/trending/tv/week?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            case 'top-rated':
                endpoint = `/tv/top_rated?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            case 'upcoming':
                endpoint = `/tv/on_the_air?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            case 'now-playing':
                endpoint = `/tv/airing_today?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${appState.currentPage}`;
                break;
            default:
                endpoint = `/discover/tv?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&sort_by=${appState.currentFilters.sort}&page=${appState.currentPage}`;
        }
        
        // Añadir filtros a discover
        if (appState.currentTab === 'discover') {
            if (appState.currentFilters.genre !== 'all') {
                endpoint += `&with_genres=${appState.currentFilters.genre}`;
            }
            if (appState.currentFilters.year !== 'all') {
                endpoint += `&first_air_date_year=${appState.currentFilters.year}`;
            }
        }
        
        const response = await fetchWithTimeout(`${API_CONFIG.TMDB.BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        appState.totalPages = data.total_pages || 1;
        appState.totalResults = data.total_results || 0;
        
        return (data.results || []).map(item => ({
            id: item.id,
            title: item.name || 'Sin título',
            type: 'tv',
            rating: item.vote_average || 0,
            year: item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A',
            genres: item.genre_ids ? getGenreNames(item.genre_ids, 'tv') : [],
            image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.tv,
            backdrop: item.backdrop_path ? `${API_CONFIG.TMDB.BACKDROP_URL}${item.backdrop_path}` : null,
            description: item.overview || 'Sin descripción disponible.',
            popularity: item.popularity || 0,
            vote_count: item.vote_count || 0,
            episodes: item.number_of_episodes || 0,
            seasons: item.number_of_seasons || 0
        }));
        
    } catch (error) {
        console.error('Error fetching TV shows:', error);
        return FALLBACK_DATA.tv;
    }
}

async function fetchAnime() {
    try {
        let endpoint = '';
        
        switch (appState.currentTab) {
            case 'trending':
                endpoint = `/top/anime?filter=airing&page=${appState.currentPage}&limit=20`;
                break;
            case 'top-rated':
                endpoint = `/top/anime?filter=bypopularity&page=${appState.currentPage}&limit=20`;
                break;
            case 'upcoming':
                endpoint = `/top/anime?filter=upcoming&page=${appState.currentPage}&limit=20`;
                break;
            default:
                endpoint = `/top/anime?page=${appState.currentPage}&limit=20`;
        }
        
        const response = await fetchWithTimeout(`${API_CONFIG.JIKAN.BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        appState.totalPages = data.pagination?.last_visible_page || 1;
        appState.totalResults = data.pagination?.items?.total || 0;
        
        return (data.data || []).map(item => ({
            id: item.mal_id,
            title: item.title || 'Sin título',
            type: 'anime',
            rating: item.score || 0,
            year: item.year || item.aired?.prop?.from?.year || 'N/A',
            genres: item.genres ? item.genres.map(g => g.name) : [],
            image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || FALLBACK_IMAGES.anime,
            description: item.synopsis || 'Sin descripción disponible.',
            popularity: item.popularity || 0,
            episodes: item.episodes || 0,
            status: item.status || 'Desconocido',
            source: item.source || 'Desconocido'
        }));
        
    } catch (error) {
        console.error('Error fetching anime:', error);
        return FALLBACK_DATA.anime;
    }
}

async function fetchDocumentaries() {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.TMDB.BASE_URL}/discover/movie?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&with_genres=99&sort_by=${appState.currentFilters.sort}&page=${appState.currentPage}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        appState.totalPages = data.total_pages || 1;
        appState.totalResults = data.total_results || 0;
        
        return (data.results || []).map(item => ({
            id: item.id,
            title: item.title || 'Sin título',
            type: 'documentary',
            rating: item.vote_average || 0,
            year: item.release_date ? item.release_date.substring(0, 4) : 'N/A',
            genres: ['Documental', ...getGenreNames(item.genre_ids || [], 'movie')],
            image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.documentary,
            description: item.overview || 'Sin descripción disponible.',
            popularity: item.popularity || 0
        }));
        
    } catch (error) {
        console.error('Error fetching documentaries:', error);
        return [];
    }
}

async function fetchKidsContent() {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.TMDB.BASE_URL}/discover/movie?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&with_genres=10751,16&sort_by=${appState.currentFilters.sort}&page=${appState.currentPage}`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        appState.totalPages = data.total_pages || 1;
        appState.totalResults = data.total_results || 0;
        
        return (data.results || []).map(item => ({
            id: item.id,
            title: item.title || 'Sin título',
            type: 'kids',
            rating: item.vote_average || 0,
            year: item.release_date ? item.release_date.substring(0, 4) : 'N/A',
            genres: ['Infantil', 'Familia', ...getGenreNames(item.genre_ids || [], 'movie')],
            image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.kids,
            description: item.overview || 'Sin descripción disponible.',
            popularity: item.popularity || 0
        }));
        
    } catch (error) {
        console.error('Error fetching kids content:', error);
        return [];
    }
}

async function fetchIntegratedContent() {
    try {
        // Combinar contenido de diferentes APIs con timeout individual
        const [movies, tvShows, anime] = await Promise.allSettled([
            fetchMovies().catch(() => []),
            fetchTVShows().catch(() => []),
            fetchAnime().catch(() => [])
        ]);
        
        const allContent = [
            ...(movies.status === 'fulfilled' ? movies.value : []),
            ...(tvShows.status === 'fulfilled' ? tvShows.value : []),
            ...(anime.status === 'fulfilled' ? anime.value : [])
        ];
        
        appState.totalResults = allContent.length;
        appState.totalPages = 1;
        
        return allContent;
        
    } catch (error) {
        console.error('Error fetching integrated content:', error);
        return [...FALLBACK_DATA.movies, ...FALLBACK_DATA.tv, ...FALLBACK_DATA.anime];
    }
}

async function fetchHomeContent() {
    try {
        // Contenido destacado para la página de inicio con timeout
        const [trendingMovies, trendingTV, topAnime] = await Promise.allSettled([
            fetchWithTimeout(`${API_CONFIG.TMDB.BASE_URL}/trending/movie/week?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=1`).then(r => r.ok ? r.json() : { results: [] }),
            fetchWithTimeout(`${API_CONFIG.TMDB.BASE_URL}/trending/tv/week?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=1`).then(r => r.ok ? r.json() : { results: [] }),
            fetchWithTimeout(`${API_CONFIG.JIKAN.BASE_URL}/top/anime?page=1`).then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] }))
        ]);
        
        const movies = (trendingMovies.status === 'fulfilled' ? trendingMovies.value.results || [] : []).slice(0, 6).map(item => ({
            id: item.id,
            title: item.title || 'Sin título',
            type: 'movie',
            rating: item.vote_average || 0,
            year: item.release_date ? item.release_date.substring(0, 4) : 'N/A',
            genres: getGenreNames(item.genre_ids || [], 'movie'),
            image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.movie,
            description: item.overview || 'Sin descripción disponible.'
        }));
        
        const tv = (trendingTV.status === 'fulfilled' ? trendingTV.value.results || [] : []).slice(0, 6).map(item => ({
            id: item.id,
            title: item.name || 'Sin título',
            type: 'tv',
            rating: item.vote_average || 0,
            year: item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A',
            genres: getGenreNames(item.genre_ids || [], 'tv'),
            image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.tv,
            description: item.overview || 'Sin descripción disponible.'
        }));
        
        const animeData = topAnime.status === 'fulfilled' ? topAnime.value.data || [] : [];
        const anime = animeData.slice(0, 6).map(item => ({
            id: item.mal_id,
            title: item.title || 'Sin título',
            type: 'anime',
            rating: item.score || 0,
            year: item.year || 'N/A',
            genres: item.genres ? item.genres.map(g => g.name) : [],
            image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || FALLBACK_IMAGES.anime,
            description: item.synopsis || 'Sin descripción disponible.'
        }));
        
        appState.totalResults = movies.length + tv.length + anime.length;
        appState.totalPages = 1;
        
        return [...movies, ...tv, ...anime];
        
    } catch (error) {
        console.error('Error fetching home content:', error);
        return [...FALLBACK_DATA.movies.slice(0, 2), ...FALLBACK_DATA.tv.slice(0, 2), ...FALLBACK_DATA.anime.slice(0, 2)];
    }
}

async function searchContent(query) {
    appState.searchQuery = query;
    
    if (!query.trim()) {
        appState.searchQuery = '';
        loadContent();
        return [];
    }
    
    // Limitar longitud de query
    if (query.length > 100) {
        query = query.substring(0, 100);
        showToast('Búsqueda truncada a 100 caracteres', 'warning');
    }
    
    try {
        // Búsqueda multi-API con timeout
        const [tmdbResponse, jikanResponse] = await Promise.allSettled([
            fetchWithTimeout(`${API_CONFIG.TMDB.BASE_URL}/search/multi?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=${appState.currentPage}`),
            fetchWithTimeout(`${API_CONFIG.JIKAN.BASE_URL}/anime?q=${encodeURIComponent(query)}&page=${appState.currentPage}&limit=10`)
        ]);
        
        let results = [];
        
        // Procesar resultados de TMDB
        if (tmdbResponse.status === 'fulfilled' && tmdbResponse.value.ok) {
            const tmdbData = await tmdbResponse.value.json();
            const tmdbResults = tmdbData.results || [];
            
            results = tmdbResults.map(item => {
                const type = item.media_type === 'movie' ? 'movie' : 
                            item.media_type === 'tv' ? 'tv' : 
                            'other';
                
                return {
                    id: item.id,
                    title: item.title || item.name || 'Sin título',
                    type: type,
                    rating: item.vote_average || 0,
                    year: (item.release_date || item.first_air_date) ? 
                          (item.release_date || item.first_air_date).substring(0, 4) : 'N/A',
                    genres: getGenreNames(item.genre_ids || [], type === 'movie' ? 'movie' : 'tv'),
                    image: item.poster_path ? 
                          `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : 
                          FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default,
                    description: item.overview || 'Sin descripción disponible.'
                };
            });
        }
        
        // Procesar resultados de Jikan (anime)
        if (jikanResponse.status === 'fulfilled' && jikanResponse.value.ok) {
            const jikanData = await jikanResponse.value.json();
            const jikanResults = jikanData.data || [];
            
            const animeResults = jikanResults.map(item => ({
                id: item.mal_id,
                title: item.title || 'Sin título',
                type: 'anime',
                rating: item.score || 0,
                year: item.year || item.aired?.prop?.from?.year || 'N/A',
                genres: item.genres ? item.genres.map(g => g.name) : [],
                image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || FALLBACK_IMAGES.anime,
                description: item.synopsis || 'Sin descripción disponible.'
            }));
            
            results = [...results, ...animeResults];
        }
        
        // Si no hay resultados
        if (results.length === 0) {
            showToast('No se encontraron resultados', 'info');
        }
        
        appState.totalResults = results.length;
        appState.totalPages = Math.max(1, Math.ceil(results.length / 20));
        
        // Paginar resultados
        const startIndex = (appState.currentPage - 1) * 20;
        const endIndex = startIndex + 20;
        return results.slice(startIndex, endIndex);
        
    } catch (error) {
        console.error('Error en búsqueda:', error);
        showToast('Error en la búsqueda. Intenta nuevamente.', 'error');
        return [];
    }
}

// Funciones auxiliares
function getGenreNames(genreIds, type) {
    if (!genreIds || !Array.isArray(genreIds)) return [];
    
    const genreMap = type === 'movie' ? appState.genres.movie : 
                    type === 'tv' ? appState.genres.tv : [];
    
    return genreIds
        .map(id => {
            const genre = genreMap.find(g => g.id === id);
            return genre ? genre.name : null;
        })
        .filter(name => name !== null);
}

function applyLocalFilters(items) {
    if (!Array.isArray(items)) return [];
    
    return items.filter(item => {
        // Filtro por género
        if (appState.currentFilters.genre !== 'all') {
            const genreId = parseInt(appState.currentFilters.genre);
            if (!item.genres || !Array.isArray(item.genres)) return false;
            
            if (item.type === 'anime') {
                const animeGenre = ANIME_GENRES.find(ag => ag.id === genreId);
                return animeGenre && item.genres.includes(animeGenre.name);
            } else {
                const genreMap = item.type === 'movie' ? appState.genres.movie : appState.genres.tv;
                const genre = genreMap.find(g => g.id === genreId);
                return genre && item.genres.includes(genre.name);
            }
        }
        
        // Filtro por año
        if (appState.currentFilters.year !== 'all') {
            if (item.year !== appState.currentFilters.year.toString()) {
                return false;
            }
        }
        
        return true;
    });
}

function displayContent(items) {
    if (!items || items.length === 0) {
        elements.contentGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:50px;" role="alert">
                <i class="fas fa-search" style="font-size:3rem;color:var(--accent);" aria-hidden="true"></i>
                <h3 style="margin-top:15px;">Sin resultados</h3>
                <p style="color:var(--light-gray);margin-top:10px;">Intenta con otros filtros o términos de búsqueda.</p>
                <button class="btn btn-primary" onclick="resetFilters(); loadContent()" style="margin-top:20px;">
                    <i class="fas fa-redo"></i> Restablecer búsqueda
                </button>
            </div>
        `;
        return;
    }
    
    elements.contentGrid.innerHTML = items.map((item, index) => `
        <div class="media-card" data-id="${item.id}" data-type="${item.type}" 
             role="article" aria-label="${item.title}" tabindex="0"
             onclick="showDetails(${item.id}, '${item.type}')"
             onkeypress="if(event.key === 'Enter') showDetails(${item.id}, '${item.type}')">
            
            ${item.type === 'anime' ? '<div class="card-badge">ANIME</div>' : 
              item.type === 'movie' ? '<div class="card-badge">PELÍCULA</div>' : 
              item.type === 'tv' ? '<div class="card-badge">SERIE</div>' : 
              item.type === 'documentary' ? '<div class="card-badge">DOCUMENTAL</div>' : 
              '<div class="card-badge">INFANTIL</div>'}
            
            <img src="${item.image}" alt="${item.title}" class="card-image" loading="lazy" 
                 onerror="this.src='${FALLBACK_IMAGES[item.type] || FALLBACK_IMAGES.default}'">
            
            <div class="card-content">
                <h3 class="card-title">${item.title}</h3>
                
                <div class="card-meta">
                    <span>Año: ${item.year}</span>
                    <div class="card-rating">
                        <i class="fas fa-star" aria-hidden="true"></i>
                        <span>${item.rating.toFixed(1)}</span>
                    </div>
                </div>
                
                <div class="card-genres">
                    ${item.genres && item.genres.length > 0 ? 
                      item.genres.slice(0, 3).map(genre => `<span class="genre-tag">${genre}</span>`).join('') : 
                      '<span class="genre-tag">Sin géneros</span>'}
                    ${item.genres && item.genres.length > 3 ? '<span class="genre-tag">+</span>' : ''}
                </div>
                
                <div class="card-actions">
                    <button class="action-btn" onclick="event.stopPropagation(); showDetails(${item.id}, '${item.type}')"
                            aria-label="Ver detalles de ${item.title}">
                        <i class="fas fa-info-circle" aria-hidden="true"></i> Detalles
                    </button>
                    <button class="action-btn" 
                            onclick="event.stopPropagation(); toggleWatchlist(${item.id}, '${item.type}', '${item.title.replace(/'/g, "\\'")}', '${item.image}')"
                            aria-label="Añadir ${item.title} a mi lista">
                        <i class="fas fa-plus" aria-hidden="true"></i> Lista
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Enfocar el primer elemento para navegación por teclado
    if (items.length > 0) {
        setTimeout(() => {
            const firstCard = elements.contentGrid.querySelector('.media-card');
            if (firstCard) firstCard.setAttribute('tabindex', '0');
        }, 100);
    }
}

async function showDetails(id, type) {
    showLoading();
    elements.detailModal.setAttribute('aria-hidden', 'false');
    
    try {
        let item;
        
        switch (type) {
            case 'movie':
                item = await fetchMovieDetails(id);
                break;
            case 'tv':
                item = await fetchTVDetails(id);
                break;
            case 'anime':
                item = await fetchAnimeDetails(id);
                break;
            default:
                item = await fetchGenericDetails(id, type);
        }
        
        const isInWatchlist = appState.watchlist.some(w => w.id == id && w.type === type);
        
        elements.modalBody.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:25px;">
                <div style="display:grid;grid-template-columns:1fr 2fr;gap:25px;">
                    <div>
                        <img src="${item.image}" alt="${item.title}" 
                             style="width:100%;border-radius:15px;box-shadow:var(--shadow);"
                             onerror="this.src='${FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default}'">
                    </div>
                    
                    <div>
                        <h2 id="modalTitle" style="font-size:2rem;margin-bottom:10px;color:white;">${item.title}</h2>
                        
                        <div style="display:flex;align-items:center;gap:15px;margin-bottom:20px;">
                            <div style="display:flex;align-items:center;gap:5px;color:#ffc107;">
                                <i class="fas fa-star" aria-hidden="true"></i>
                                <span style="font-size:1.5rem;font-weight:bold;">${item.rating.toFixed(1)}</span>
                            </div>
                            <span style="background:var(--gray);padding:5px 10px;border-radius:5px;">${item.year}</span>
                            <span style="background:var(--primary);color:white;padding:5px 10px;border-radius:5px;text-transform:uppercase;">
                                ${type === 'movie' ? 'Película' : 
                                  type === 'tv' ? 'Serie TV' : 
                                  type === 'anime' ? 'Anime' : 
                                  type === 'documentary' ? 'Documental' : 'Infantil'}
                            </span>
                        </div>
                        
                        <div style="margin-bottom:20px;">
                            <div style="color:var(--accent);font-weight:600;margin-bottom:10px;">Géneros</div>
                            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                                ${item.genres.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                            </div>
                        </div>
                        
                        ${item.duration ? `
                        <div style="margin-bottom:20px;">
                            <div style="color:var(--accent);font-weight:600;">Duración</div>
                            <div>${item.duration}</div>
                        </div>` : ''}
                        
                        ${item.episodes ? `
                        <div style="margin-bottom:20px;">
                            <div style="color:var(--accent);font-weight:600;">Episodios</div>
                            <div>${item.episodes}</div>
                        </div>` : ''}
                        
                        ${item.status ? `
                        <div style="margin-bottom:20px;">
                            <div style="color:var(--accent);font-weight:600;">Estado</div>
                            <div>${item.status}</div>
                        </div>` : ''}
                    </div>
                </div>
                
                <div>
                    <div style="color:var(--accent);font-weight:600;margin-bottom:10px;">Descripción</div>
                    <p style="line-height:1.7;font-size:1.1rem;">${item.description || 'Sin descripción disponible.'}</p>
                </div>
                
                ${item.cast && item.cast.length > 0 ? `
                <div>
                    <div style="color:var(--accent);font-weight:600;margin-bottom:10px;">Reparto Principal</div>
                    <div style="display:flex;gap:15px;overflow-x:auto;padding-bottom:10px;">
                        ${item.cast.slice(0, 5).map(actor => `
                            <div style="text-align:center;min-width:80px;">
                                <div style="width:60px;height:60px;border-radius:50%;background:var(--gray);margin:0 auto 5px;display:flex;align-items:center;justify-content:center;">
                                    <i class="fas fa-user" aria-hidden="true" style="color:var(--light-gray);"></i>
                                </div>
                                <div style="font-size:0.85rem;font-weight:500;">${actor.name}</div>
                                <div style="font-size:0.75rem;color:var(--light-gray);">${actor.character}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}
                
                <div style="display:flex;gap:15px;justify-content:center;">
                    <button class="btn btn-primary" 
                            onclick="toggleWatchlist(${item.id}, '${type}', '${item.title.replace(/'/g, "\\'")}', '${item.image}')"
                            aria-label="${isInWatchlist ? 'Remover de mi lista' : 'Añadir a mi lista'}">
                        <i class="fas ${isInWatchlist ? 'fa-check' : 'fa-plus'}" aria-hidden="true"></i> 
                        ${isInWatchlist ? 'En Mi Lista' : 'Añadir a Mi Lista'}
                    </button>
                    ${item.trailer ? `
                    <button class="btn btn-secondary" 
                            onclick="window.open('${item.trailer}', '_blank')"
                            aria-label="Ver tráiler de ${item.title}">
                        <i class="fas fa-play" aria-hidden="true"></i> Ver Tráiler
                    </button>` : ''}
                </div>
            </div>
        `;
        
        elements.detailModal.classList.add('active');
        // Enfocar el botón de cerrar para accesibilidad
        setTimeout(() => elements.closeModal.focus(), 100);
        
    } catch (error) {
        console.error('Error cargando detalles:', error);
        showToast('Error al cargar los detalles', 'error');
        elements.detailModal.classList.remove('active');
    }
}

async function fetchMovieDetails(id) {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.TMDB.BASE_URL}/movie/${id}?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&append_to_response=credits,videos`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        
        return {
            id: data.id,
            title: data.title || 'Sin título',
            type: 'movie',
            rating: data.vote_average || 0,
            year: data.release_date ? data.release_date.substring(0, 4) : 'N/A',
            genres: data.genres ? data.genres.map(g => g.name) : [],
            image: data.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${data.poster_path}` : FALLBACK_IMAGES.movie,
            backdrop: data.backdrop_path ? `${API_CONFIG.TMDB.BACKDROP_URL}${data.backdrop_path}` : null,
            description: data.overview || 'Sin descripción disponible.',
            duration: data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : 'Desconocido',
            cast: data.credits?.cast?.slice(0, 10).map(actor => ({
                name: actor.name || 'Desconocido',
                character: actor.character || 'Desconocido'
            })) || [],
            trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
            budget: data.budget,
            revenue: data.revenue
        };
        
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return getFallbackDetails(id, 'movie');
    }
}

async function fetchTVDetails(id) {
    try {
        const response = await fetchWithTimeout(
            `${API_CONFIG.TMDB.BASE_URL}/tv/${id}?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&append_to_response=credits,videos`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        const trailer = data.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
        
        return {
            id: data.id,
            title: data.name || 'Sin título',
            type: 'tv',
            rating: data.vote_average || 0,
            year: data.first_air_date ? data.first_air_date.substring(0, 4) : 'N/A',
            genres: data.genres ? data.genres.map(g => g.name) : [],
            image: data.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${data.poster_path}` : FALLBACK_IMAGES.tv,
            backdrop: data.backdrop_path ? `${API_CONFIG.TMDB.BACKDROP_URL}${data.backdrop_path}` : null,
            description: data.overview || 'Sin descripción disponible.',
            episodes: data.number_of_episodes || 0,
            seasons: data.number_of_seasons || 0,
            status: data.status || 'Desconocido',
            cast: data.credits?.cast?.slice(0, 10).map(actor => ({
                name: actor.name || 'Desconocido',
                character: actor.character || 'Desconocido'
            })) || [],
            trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
            networks: data.networks?.map(n => n.name) || []
        };
        
    } catch (error) {
        console.error('Error fetching TV details:', error);
        return getFallbackDetails(id, 'tv');
    }
}

async function fetchAnimeDetails(id) {
    try {
        const response = await fetchWithTimeout(`${API_CONFIG.JIKAN.BASE_URL}/anime/${id}/full`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const anime = data.data;
        
        return {
            id: anime.mal_id,
            title: anime.title || 'Sin título',
            type: 'anime',
            rating: anime.score || 0,
            year: anime.year || anime.aired?.prop?.from?.year || 'N/A',
            genres: anime.genres ? anime.genres.map(g => g.name) : [],
            image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || FALLBACK_IMAGES.anime,
            description: anime.synopsis || 'Sin descripción disponible.',
            episodes: anime.episodes || 0,
            status: anime.status || 'Desconocido',
            duration: anime.duration || 'Desconocido',
            source: anime.source || 'Desconocido',
            trailer: anime.trailer?.url || null,
            studios: anime.studios?.map(s => s.name) || [],
            popularity: anime.popularity || 0,
            rank: anime.rank || 'N/A'
        };
    } catch (error) {
        console.error('Error fetching anime details:', error);
        return getFallbackDetails(id, 'anime');
    }
}

async function fetchGenericDetails(id, type) {
    return getFallbackDetails(id, type);
}

function getFallbackDetails(id, type) {
    const fallback = FALLBACK_DATA[type === 'movie' ? 'movies' : type === 'tv' ? 'tv' : 'anime'][0] || {
        id: id,
        title: "Contenido",
        type: type,
        rating: 7.5,
        year: '2023',
        genres: ["General"],
        image: FALLBACK_IMAGES.default,
        description: "Información detallada no disponible en este momento."
    };
    
    return {
        ...fallback,
        id: id,
        type: type
    };
}

function getFallbackContent() {
    return [...FALLBACK_DATA.movies, ...FALLBACK_DATA.tv, ...FALLBACK_DATA.anime];
}

// Watchlist Management
function loadWatchlist() {
    try {
        const saved = localStorage.getItem('cartelTV_watchlist');
        if (saved) {
            appState.watchlist = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading watchlist:', error);
        appState.watchlist = [];
    }
}

function saveWatchlist() {
    try {
        localStorage.setItem('cartelTV_watchlist', JSON.stringify(appState.watchlist));
    } catch (error) {
        console.error('Error saving watchlist:', error);
    }
}

function toggleWatchlist(id, type, title, image) {
    const existingIndex = appState.watchlist.findIndex(item => item.id == id && item.type === type);
    
    if (existingIndex > -1) {
        // Remover de la lista
        appState.watchlist.splice(existingIndex, 1);
        showToast(`"${title}" removido de Mi Lista`, 'success');
    } else {
        // Agregar a la lista
        appState.watchlist.push({
            id: id,
            type: type,
            title: title,
            image: image,
            addedAt: new Date().toISOString()
        });
        showToast(`"${title}" añadido a Mi Lista`, 'success');
    }
    
    saveWatchlist();
    updateWatchlistCounter();
    
    // Actualizar botón en modal si está abierto
    const modal = elements.detailModal;
    if (modal.classList.contains('active')) {
        const btn = modal.querySelector('.btn-primary');
        if (btn) {
            const isInWatchlist = existingIndex === -1;
            btn.innerHTML = `<i class="fas ${isInWatchlist ? 'fa-check' : 'fa-plus'}" aria-hidden="true"></i> ${isInWatchlist ? 'En Mi Lista' : 'Añadir a Mi Lista'}`;
            btn.setAttribute('aria-label', `${isInWatchlist ? 'Remover de mi lista' : 'Añadir a mi lista'}`);
        }
    }
}

function updateWatchlistCounter() {
    const count = appState.watchlist.length;
    if (count > 0) {
        elements.watchlistCounter.textContent = count > 99 ? '99+' : count;
        elements.watchlistCounter.style.display = 'flex';
    } else {
        elements.watchlistCounter.style.display = 'none';
    }
}

function showWatchlist() {
    if (appState.watchlist.length === 0) {
        showToast('Tu lista está vacía', 'info');
        return;
    }
    
    // Convertir watchlist a formato displayable
    const watchlistItems = appState.watchlist.map(item => ({
        ...item,
        rating: 0,
        year: 'N/A',
        genres: []
    }));
    
    // Mostrar como contenido especial
    appState.currentSection = 'watchlist';
    elements.searchResults.style.display = 'block';
    elements.searchResults.innerHTML = `Mi Lista (${appState.watchlist.length} items)`;
    elements.searchResults.setAttribute('aria-live', 'polite');
    
    // Ocultar filtros y tabs
    document.querySelector('.content-tabs').style.display = 'none';
    document.querySelector('.filter-section').style.display = 'none';
    
    displayContent(watchlistItems);
    
    // Mostrar botón para volver
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.innerHTML = '<i class="fas fa-arrow-left" aria-hidden="true"></i> Volver';
    backBtn.style.margin = '20px auto';
    backBtn.style.display = 'block';
    backBtn.onclick = () => {
        document.querySelector('.content-tabs').style.display = '';
        document.querySelector('.filter-section').style.display = '';
        elements.searchResults.style.display = 'none';
        loadContent();
    };
    
    const existingBackBtn = elements.contentGrid.parentNode.querySelector('.back-btn');
    if (existingBackBtn) existingBackBtn.remove();
    
    backBtn.classList.add('back-btn');
    elements.contentGrid.parentNode.appendChild(backBtn);
}

// Búsqueda
function handleSearch() {
    const query = elements.searchInput.value.trim();
    if (query === appState.searchQuery) return;
    
    appState.searchQuery = query;
    appState.currentPage = 1;
    
    if (query) {
        loadContent();
    } else {
        appState.searchQuery = '';
        loadContent();
    }
}

// Filtros
function applyFilters() {
    appState.currentFilters = {
        genre: elements.genreFilter.value,
        year: elements.yearFilter.value,
        sort: elements.sortFilter.value
    };
    
    appState.currentPage = 1;
    loadContent();
    showToast('Filtros aplicados', 'success');
}

function resetFilters() {
    elements.genreFilter.value = 'all';
    elements.yearFilter.value = 'all';
    elements.sortFilter.value = 'popularity.desc';
    
    appState.currentFilters = {
        genre: 'all',
        year: 'all',
        sort: 'popularity.desc'
    };
    
    appState.currentPage = 1;
    loadContent();
    showToast('Filtros restablecidos', 'success');
}

// Navegación
function setActiveSection(section) {
    elements.navLinks.forEach(l => {
        l.classList.remove('active');
        l.setAttribute('aria-selected', 'false');
    });
    
    const activeLink = document.querySelector(`[data-section="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-selected', 'true');
    }
    
    appState.currentSection = section;
    appState.currentPage = 1;
    appState.searchQuery = '';
    elements.searchInput.value = '';
    
    // Restaurar vista normal
    document.querySelector('.content-tabs').style.display = '';
    document.querySelector('.filter-section').style.display = '';
    elements.searchResults.style.display = 'none';
    
    // Actualizar filtros de género según sección
    updateGenreFilter();
    
    loadContent();
}

// Contenido aleatorio
async function showRandomContent() {
    showLoading();
    
    try {
        const [movies, tvShows, anime] = await Promise.allSettled([
            fetchWithTimeout(`${API_CONFIG.TMDB.BASE_URL}/movie/popular?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${Math.floor(Math.random() * 5) + 1}`),
            fetchWithTimeout(`${API_CONFIG.TMDB.BASE_URL}/tv/popular?api_key=${API_CONFIG.TMDB.API_KEY}&language=es-ES&page=${Math.floor(Math.random() * 5) + 1}`),
            fetchWithTimeout(`${API_CONFIG.JIKAN.BASE_URL}/top/anime?page=${Math.floor(Math.random() * 5) + 1}`)
        ]);
        
        let allItems = [];
        
        // Procesar películas
        if (movies.status === 'fulfilled' && movies.value.ok) {
            const moviesData = await movies.value.json();
            const movieItems = (moviesData.results || []).map(item => ({
                id: item.id,
                title: item.title,
                type: 'movie',
                rating: item.vote_average,
                year: item.release_date ? item.release_date.substring(0, 4) : 'N/A',
                image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.movie
            }));
            allItems = [...allItems, ...movieItems];
        }
        
        // Procesar series
        if (tvShows.status === 'fulfilled' && tvShows.value.ok) {
            const tvData = await tvShows.value.json();
            const tvItems = (tvData.results || []).map(item => ({
                id: item.id,
                title: item.name,
                type: 'tv',
                rating: item.vote_average,
                year: item.first_air_date ? item.first_air_date.substring(0, 4) : 'N/A',
                image: item.poster_path ? `${API_CONFIG.TMDB.IMAGE_URL}${item.poster_path}` : FALLBACK_IMAGES.tv
            }));
            allItems = [...allItems, ...tvItems];
        }
        
        // Procesar anime
        if (anime.status === 'fulfilled' && anime.value.ok) {
            const animeData = await anime.value.json();
            const animeItems = (animeData.data || []).map(item => ({
                id: item.mal_id,
                title: item.title,
                type: 'anime',
                rating: item.score || 0,
                year: item.year || 'N/A',
                image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || FALLBACK_IMAGES.anime
            }));
            allItems = [...allItems, ...animeItems];
        }
        
        if (allItems.length > 0) {
            const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
            showToast(`Recomendado: ${randomItem.title}`, 'info');
            showDetails(randomItem.id, randomItem.type);
        } else {
            showToast('No se pudo obtener recomendación', 'error');
        }
        
    } catch (error) {
        console.error('Error obteniendo contenido aleatorio:', error);
        showToast('Error al obtener recomendación', 'error');
    }
}

// Paginación
function updatePagination() {
    if (appState.totalPages > 1) {
        elements.pagination.style.display = 'flex';
        elements.prevPage.disabled = appState.currentPage === 1;
        elements.nextPage.disabled = appState.currentPage === appState.totalPages;
        elements.pageInfo.textContent = `Página ${appState.currentPage} de ${appState.totalPages}`;
    } else {
        elements.pagination.style.display = 'none';
    }
}

// UI Helpers
function showLoading() {
    elements.contentGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:50px;" role="status" aria-live="polite">
            <div class="loading-spinner" aria-hidden="true"></div>
            <p style="margin-top:15px;color:var(--accent);">Cargando contenido...</p>
        </div>
    `;
}

function showError(message) {
    elements.contentGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:50px;" role="alert">
            <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:var(--danger);" aria-hidden="true"></i>
            <h3 style="margin-top:15px;">Error</h3>
            <p style="color:var(--light-gray);margin-top:10px;">${message}</p>
            <button class="btn btn-primary" onclick="loadContent()" style="margin-top:20px;">
                <i class="fas fa-redo" aria-hidden="true"></i> Reintentar
            </button>
        </div>
    `;
}

function showToast(message, type = 'info') {
    elements.toast.textContent = message;
    elements.toast.style.background = type === 'error' ? 'linear-gradient(135deg, #ff4757, #ff3838)' : 
                            type === 'success' ? 'linear-gradient(135deg, #2ed573, #1dd1a1)' : 
                            type === 'warning' ? 'linear-gradient(135deg, #ffc107, #ff9f43)' : 
                            'var(--gradient)';
    elements.toast.classList.add('show');
    
    // Para lectores de pantalla
    const ariaLive = type === 'error' ? 'assertive' : 'polite';
    elements.toast.setAttribute('aria-live', ariaLive);
    
    setTimeout(() => { 
        elements.toast.classList.remove('show');
        elements.toast.removeAttribute('aria-live');
    }, 3000);
}

// Debounce para búsqueda
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

// Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered:', registration);
        }).catch(error => {
            console.log('SW registration failed:', error);
        });
    });
}

// Exportar funciones para uso global
window.showDetails = showDetails;
window.toggleWatchlist = toggleWatchlist;
window.loadContent = loadContent;
window.resetFilters = resetFilters;