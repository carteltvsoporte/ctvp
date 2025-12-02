const APP_CONFIG = {
    theme: 'dark',
    language: 'es',
    autoplayTrailers: false,
    adultContent: false,
    notifications: true,
    quality: 'hd',
    autoNextEpisode: true,
    dataSaving: false,
    subtitleLanguage: 'es',
    audioLanguage: 'es',
    videoPlayer: 'html5',
    cacheDuration: 24,
    defaultView: 'grid',
    animationEffects: true
};

class ConfigManager {
    constructor() {
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            const saved = localStorage.getItem('ctvp_config');
            return saved ? { ...APP_CONFIG, ...JSON.parse(saved) } : APP_CONFIG;
        } catch {
            return APP_CONFIG;
        }
    }

    saveConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        localStorage.setItem('ctvp_config', JSON.stringify(this.config));
        this.applyConfig();
    }

    applyConfig() {
        document.documentElement.setAttribute('data-theme', this.config.theme);
        document.documentElement.setAttribute('lang', this.config.language);
        
        if (this.config.animationEffects) {
            document.body.classList.add('animations-enabled');
        } else {
            document.body.classList.remove('animations-enabled');
        }
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        this.saveConfig({ [key]: value });
    }

    reset() {
        localStorage.removeItem('ctvp_config');
        this.config = APP_CONFIG;
        this.applyConfig();
    }
}

const configManager = new ConfigManager();