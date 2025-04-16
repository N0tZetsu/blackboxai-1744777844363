class LoadingScreen {
    constructor() {
        // Elementos DOM
        this.loadingBar = document.getElementById('loadingBar');
        this.video = document.getElementById('bgVideo');
        this.audio = document.getElementById('bgMusic');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.playIcon = this.playPauseBtn.querySelector('.play-icon');
        this.pauseIcon = this.playPauseBtn.querySelector('.pause-icon');

        // Estado
        this.progress = 0;
        this.isPlaying = false;

        // Inicialización
        this.init();
    }

    init() {
        // Inicializar eventos
        this.initializeEventListeners();
        
        // Iniciar simulación de carga
        this.startLoadingSimulation();

        // Configurar volumen inicial
        this.audio.volume = this.volumeSlider.value / 100;
    }

    initializeEventListeners() {
        // Control de reproducción
        this.playPauseBtn.addEventListener('click', () => this.togglePlay());

        // Control de volumen
        this.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });

        // Manejo de errores de medios
        this.handleMediaErrors();

        // Eventos de carga de FiveM
        window.addEventListener('message', (event) => {
            if (event.data.eventName === 'loadProgress') {
                this.updateLoadingProgress(event.data.progress);
            }
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playIcon.classList.remove('hidden');
            this.pauseIcon.classList.add('hidden');
        } else {
            this.audio.play();
            this.playIcon.classList.add('hidden');
            this.pauseIcon.classList.remove('hidden');
        }
        this.isPlaying = !this.isPlaying;
    }

    updateLoadingProgress(progress) {
        this.progress = Math.min(progress, 100);
        this.loadingBar.style.width = `${this.progress}%`;
    }

    startLoadingSimulation() {
        let progress = 0;
        const interval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(interval);
                return;
            }
            
            // Simular progreso más realista
            const increment = Math.random() * 3;
            progress = Math.min(progress + increment, 100);
            this.updateLoadingProgress(progress);
        }, 100);
    }

    handleMediaErrors() {
        // Manejar errores de video
        this.video.addEventListener('error', (e) => {
            console.error('Error en la carga del video:', e);
            // Fallback a color de fondo negro (ya establecido en CSS)
        });

        // Manejar errores de audio
        this.audio.addEventListener('error', (e) => {
            console.error('Error en la carga del audio:', e);
            this.playPauseBtn.disabled = true;
            this.playPauseBtn.style.opacity = '0.5';
        });
    }
}

// Crear carpetas necesarias para los assets
const createAssetFolders = () => {
    const folders = [
        'assets/logo',
        'assets/media/music',
        'assets/media/video'
    ];

    folders.forEach(folder => {
        const path = folder.split('/');
        let currentPath = '';
        path.forEach(dir => {
            currentPath += (currentPath ? '/' : '') + dir;
            try {
                if (!window.fs.existsSync(currentPath)) {
                    window.fs.mkdirSync(currentPath);
                }
            } catch (error) {
                console.warn(`No se pudo crear la carpeta ${currentPath}:`, error);
            }
        });
    });
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    createAssetFolders();
    new LoadingScreen();
});
