const API_KEY = 'cdf9b6a0255cebc133ce4d9aaaee8d6d';
const BASE_URL = 'https://api.themoviedb.org/3';
const ANIME_BASE_URL = 'https://api.jikan.moe/v4';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/w780';

class APIManager {
    constructor() {
        this.endpoints = {
            tmdb: {
                base: BASE_URL,
                key: API_KEY,
                priority: 1,
                rateLimit: 1000,
                imageBase: IMAGE_BASE_URL
            },
            jikan: {
                base: ANIME_BASE_URL,
                priority: 2,
                rateLimit: 2000,
                imageBase: 'https://cdn.myanimelist.net/images'
            }
        };
        this.lastRequest = {};
        this.cache = new Map();
        this.requestQueue = [];
        this.processingQueue = false;
    }

    async request(service, endpoint, options = {}) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ service, endpoint, options, resolve, reject });
            if (!this.processingQueue) this.processQueue();
        });
    }

    async processQueue() {
        if (this.requestQueue.length === 0) {
            this.processingQueue = false;
            return;
        }

        this.processingQueue = true;
        const request = this.requestQueue.shift();
        
        try {
            const result = await this.executeRequest(request.service, request.endpoint, request.options);
            request.resolve(result);
        } catch (error) {
            request.reject(error);
        }

        setTimeout(() => this.processQueue(), 100);
    }

    async executeRequest(service, endpoint, options = {}) {
        const config = this.endpoints[service];
        const now = Date.now();
        
        if (this.lastRequest[service] && now - this.lastRequest[service] < config.rateLimit) {
            await new Promise(resolve => 
                setTimeout(resolve, config.rateLimit - (now - this.lastRequest[service]))
            );
        }

        this.lastRequest[service] = Date.now();
        
        const url = service === 'tmdb' 
            ? `${config.base}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${config.key}&language=es-ES&region=ES`
            : `${config.base}${endpoint}`;

        return this.fetchWithRetry(url, options);
    }

    async fetchWithRetry(url, options = {}, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, options);
                
                if (response.ok) {
                    const data = await response.json();
                    return { ok: true, data, status: response.status };
                }
                
                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After') || Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                    continue;
                }
                
                return { ok: false, error: `HTTP ${response.status}`, status: response.status };
                
            } catch (error) {
                if (attempt === maxRetries) {
                    return { ok: false, error: error.message, status: 0 };
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    getImageUrl(path, size = 'w300', service = 'tmdb') {
        if (!path) return 'https://via.placeholder.com/300x450/1a1d29/2d3748?text=Imagen+No+Disponible';
        
        if (service === 'jikan') {
            if (path.includes('cdn.myanimelist.net')) {
                return path.replace('/large/', '/medium/').replace('.jpg', 'l.jpg');
            }
            return path;
        }
        
        return `${this.endpoints.tmdb.imageBase}/${size}${path}`;
    }

    async getContentDetails(type, id, modo = 'movies') {
        const cacheKey = `details_${modo}_${type}_${id}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            let response;
            if (modo === 'movies') {
                response = await this.request('tmdb', `/${type}/${id}?append_to_response=videos,credits,similar`);
            } else {
                response = await this.request('jikan', `/anime/${id}/full`);
            }

            if (response.ok) {
                this.cache.set(cacheKey, response.data);
                return response.data;
            }
            
            throw new Error(response.error);
        } catch (error) {
            console.error('Error obteniendo detalles:', error);
            return null;
        }
    }

    async searchContent(query, filters = {}) {
        const cacheKey = `search_${query}_${JSON.stringify(filters)}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            const promises = [];
            
            if (!filters.type || filters.type === 'movie') {
                promises.push(
                    this.request('tmdb', `/search/movie?query=${encodeURIComponent(query)}&page=1`)
                );
            }
            
            if (!filters.type || filters.type === 'tv') {
                promises.push(
                    this.request('tmdb', `/search/tv?query=${encodeURIComponent(query)}&page=1`)
                );
            }
            
            if (!filters.type || filters.type === 'anime') {
                promises.push(
                    this.request('jikan', `/anime?q=${encodeURIComponent(query)}&limit=12&page=1`)
                );
            }

            const results = await Promise.allSettled(promises);
            const allResults = [];

            results.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value.ok) {
                    const items = result.value.data.results || result.value.data.data || [];
                    const type = index === 0 ? 'movie' : index === 1 ? 'tv' : 'anime';
                    
                    items.forEach(item => {
                        allResults.push({
                            ...item,
                            contentType: type,
                            searchScore: this.calculateSearchScore(item, query)
                        });
                    });
                }
            });

            const sortedResults = allResults.sort((a, b) => b.searchScore - a.searchScore);
            this.cache.set(cacheKey, sortedResults);
            
            return sortedResults;
        } catch (error) {
            console.error('Error en búsqueda:', error);
            return [];
        }
    }

    calculateSearchScore(item, query) {
        const queryLower = query.toLowerCase();
        const title = (item.title || item.name || '').toLowerCase();
        const overview = (item.overview || item.synopsis || '').toLowerCase();
        
        let score = 0;
        
        if (title === queryLower) score += 100;
        if (title.includes(queryLower)) score += 50;
        if (overview.includes(queryLower)) score += 20;
        
        score += (item.popularity || item.score || 0) / 10;
        score += (item.vote_average || item.score || 0) * 2;
        
        return score;
    }

    async getTrendingContent(timeWindow = 'day', type = 'all') {
        const cacheKey = `trending_${type}_${timeWindow}`;
        
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            let response;
            if (type === 'all') {
                response = await this.request('tmdb', `/trending/all/${timeWindow}?language=es-ES`);
            } else {
                response = await this.request('tmdb', `/trending/${type}/${timeWindow}?language=es-ES`);
            }

            if (response.ok) {
                this.cache.set(cacheKey, response.data.results);
                return response.data.results;
            }
            
            return [];
        } catch (error) {
            console.error('Error obteniendo tendencias:', error);
            return [];
        }
    }

    async getDiscoverContent(filters = {}, type = 'movie') {
        const params = new URLSearchParams();
        
        if (filters.genre) params.append('with_genres', filters.genre);
        if (filters.year) params.append('primary_release_year', filters.year);
        if (filters.sortBy) params.append('sort_by', filters.sortBy);
        if (filters.page) params.append('page', filters.page);
        
        params.append('language', 'es-ES');
        params.append('region', 'ES');
        
        const response = await this.request('tmdb', `/discover/${type}?${params.toString()}`);
        
        if (response.ok) {
            return response.data;
        }
        
        return { results: [], total_pages: 0 };
    }

    clearCache() {
        this.cache.clear();
        const keys = Object.keys(localStorage).filter(key => key.startsWith('details_') || key.startsWith('search_') || key.startsWith('trending_'));
        keys.forEach(key => localStorage.removeItem(key));
    }
}

const apiManager = new APIManager();