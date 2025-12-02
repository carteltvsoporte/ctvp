const API_KEY = 'cdf9b6a0255cebc133ce4d9aaaee8d6d';
const BASE_URL = 'https://api.themoviedb.org/3';
const ANIME_BASE_URL = 'https://api.jikan.moe/v4';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w300';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

class APIManager {
    constructor() {
        this.endpoints = {
            tmdb: {
                base: BASE_URL,
                key: API_KEY,
                priority: 1,
                rateLimit: 1000
            },
            jikan: {
                base: ANIME_BASE_URL,
                priority: 2,
                rateLimit: 2000
            }
        };
        this.lastRequest = {};
        this.cache = new Map();
    }

    async request(service, endpoint, options = {}) {
        const config = this.endpoints[service];
        const now = Date.now();
        
        if (this.lastRequest[service] && 
            now - this.lastRequest[service] < config.rateLimit) {
            await new Promise(resolve => 
                setTimeout(resolve, config.rateLimit - (now - this.lastRequest[service]))
            );
        }

        this.lastRequest[service] = Date.now();
        
        const url = service === 'tmdb' 
            ? `${config.base}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${config.key}&language=es-ES`
            : `${config.base}${endpoint}`;

        return this.fetchWithRetry(url, options);
    }

    async fetchWithRetry(url, options = {}, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) return response;
                
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After') || Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    continue;
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            } catch (error) {
                if (attempt === maxRetries) throw error;
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    async unifiedSearch(query) {
        const cacheKey = `search_${query}`;
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const [movies, tv, anime] = await Promise.allSettled([
                this.request('tmdb', `/search/movie?query=${encodeURIComponent(query)}`).then(r => r.json()),
                this.request('tmdb', `/search/tv?query=${encodeURIComponent(query)}`).then(r => r.json()),
                this.request('jikan', `/anime?q=${encodeURIComponent(query)}&limit=12`).then(r => r.json())
            ]);

            const results = [];
            
            if (movies.status === 'fulfilled') {
                results.push(...(movies.value.results || []).map(item => ({ ...item, type: 'movie' })));
            }
            
            if (tv.status === 'fulfilled') {
                results.push(...(tv.value.results || []).map(item => ({ ...item, type: 'tv' })));
            }
            
            if (anime.status === 'fulfilled') {
                results.push(...(anime.value.data || []).map(item => ({ ...item, type: 'anime' })));
            }

            const sortedResults = results.sort((a, b) => 
                (b.popularity || b.score || 0) - (a.popularity || a.score || 0)
            );

            this.cache.set(cacheKey, sortedResults);
            return sortedResults;
        } catch (error) {
            console.error('Error en búsqueda unificada:', error);
            return [];
        }
    }
}

const apiManager = new APIManager();