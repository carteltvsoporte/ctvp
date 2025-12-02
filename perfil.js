class PerfilManager {
    constructor() {
        this.perfil = this.loadPerfil();
    }

    loadPerfil() {
        try {
            const saved = localStorage.getItem('ctvp_perfil');
            return saved ? JSON.parse(saved) : this.createDefaultPerfil();
        } catch {
            return this.createDefaultPerfil();
        }
    }

    createDefaultPerfil() {
        const userSession = JSON.parse(localStorage.getItem('ctvp_user_session') || '{}');
        return {
            id: Date.now(),
            nombre: userSession.name || 'Usuario',
            avatar: '',
            portada: '',
            bio: '',
            preferencias: {
                generosFavoritos: [],
                tiposContenido: ['movie', 'tv'],
                calidadPreferida: 'hd',
                notificaciones: true,
                privacidad: 'public',
                idioma: 'es'
            },
            actividad: {
                vistasRecientes: [],
                favoritos: [],
                listaVer: [],
                calificaciones: {},
                tiempoVisto: 0
            },
            estadisticas: {
                peliculasVistas: 0,
                seriesCompletadas: 0,
                horasVistas: 0,
                generosMasVistos: [],
                añoMasActivo: new Date().getFullYear()
            },
            configuraciones: {
                tema: 'dark',
                autoPlay: true,
                subtitulos: true,
                calidadAuto: true,
                recomendacionesPersonalizadas: true
            },
            suscripcion: {
                plan: 'premium',
                fechaInicio: new Date().toISOString(),
                fechaRenovacion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                estado: 'activa'
            }
        };
    }

    savePerfil() {
        localStorage.setItem('ctvp_perfil', JSON.stringify(this.perfil));
    }

    actualizarPreferencias(preferencias) {
        this.perfil.preferencias = { ...this.perfil.preferencias, ...preferencias };
        this.savePerfil();
    }

    agregarVisto(contenido) {
        const vista = {
            id: contenido.id || contenido.mal_id,
            tipo: contenido.type || 'movie',
            titulo: contenido.title || contenido.name,
            fecha: new Date().toISOString(),
            progreso: contenido.progreso || 0,
            duracion: contenido.duracion || 0
        };

        this.perfil.actividad.vistasRecientes.unshift(vista);
        
        if (this.perfil.actividad.vistasRecientes.length > 50) {
            this.perfil.actividad.vistasRecientes = this.perfil.actividad.vistasRecientes.slice(0, 50);
        }

        if (contenido.duracion) {
            this.perfil.actividad.tiempoVisto += contenido.duracion;
        }

        this.savePerfil();
    }

    toggleFavorito(contenido) {
        const favoritoId = `${contenido.type || 'movie'}_${contenido.id || contenido.mal_id}`;
        const index = this.perfil.actividad.favoritos.findIndex(f => f.id === favoritoId);

        if (index > -1) {
            this.perfil.actividad.favoritos.splice(index, 1);
            return false;
        } else {
            this.perfil.actividad.favoritos.push({
                id: favoritoId,
                contenidoId: contenido.id || contenido.mal_id,
                tipo: contenido.type || 'movie',
                titulo: contenido.title || contenido.name,
                fecha: new Date().toISOString(),
                poster: contenido.poster_path || contenido.images?.jpg?.image_url
            });
            return true;
        }
    }

    agregarListaVer(contenido) {
        const existe = this.perfil.actividad.listaVer.find(item => 
            item.id === (contenido.id || contenido.mal_id)
        );

        if (!existe) {
            this.perfil.actividad.listaVer.push({
                id: contenido.id || contenido.mal_id,
                tipo: contenido.type || 'movie',
                titulo: contenido.title || contenido.name,
                fechaAgregado: new Date().toISOString(),
                visto: false,
                poster: contenido.poster_path || contenido.images?.jpg?.image_url
            });
            this.savePerfil();
            return true;
        }
        return false;
    }

    calificarContenido(contenidoId, calificacion) {
        this.perfil.actividad.calificaciones[contenidoId] = {
            valor: calificacion,
            fecha: new Date().toISOString()
        };
        this.savePerfil();
    }

    actualizarEstadisticas(contenido) {
        if (contenido.type === 'movie') {
            this.perfil.estadisticas.peliculasVistas++;
        } else if (contenido.type === 'tv') {
            // Lógica para series
        }

        if (contenido.genres) {
            contenido.genres.forEach(genero => {
                const nombreGenero = genero.name || genero;
                const generoExistente = this.perfil.estadisticas.generosMasVistos.find(g => g.nombre === nombreGenero);
                
                if (generoExistente) {
                    generoExistente.veces++;
                } else {
                    this.perfil.estadisticas.generosMasVistos.push({
                        nombre: nombreGenero,
                        veces: 1
                    });
                }
            });

            this.perfil.estadisticas.generosMasVistos.sort((a, b) => b.veces - a.veces);
        }

        this.savePerfil();
    }

    obtenerRecomendaciones() {
        const generosFrecuentes = this.perfil.estadisticas.generosMasVistos.slice(0, 3);
        const tiposPreferidos = this.perfil.preferencias.tiposContenido;
        
        return {
            generos: generosFrecuentes.map(g => g.nombre),
            tipos: tiposPreferidos,
            basadoEn: this.perfil.actividad.vistasRecientes.slice(0, 5)
        };
    }

    exportarDatos() {
        return {
            perfil: this.perfil,
            timestamp: new Date().toISOString()
        };
    }

    eliminarCuenta() {
        localStorage.removeItem('ctvp_perfil');
        localStorage.removeItem('ctvp_user_session');
        localStorage.removeItem('ctvp_favorites');
        this.perfil = this.createDefaultPerfil();
    }
}

const perfilManager = new PerfilManager();