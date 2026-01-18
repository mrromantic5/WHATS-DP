class PremiumVideoPlayer {
    constructor() {
        this.elements = {
            videoContainer: document.getElementById('videoContainer'),
            nativeVideo: document.getElementById('nativeVideo'),
            youtubeContainer: document.getElementById('youtubeContainer'),
            videoSkeleton: document.getElementById('videoSkeleton'),
            videoOverlay: document.getElementById('videoOverlay'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            muteBtn: document.getElementById('muteBtn'),
            videoProgress: document.getElementById('videoProgress'),
            progressBar: document.getElementById('progressBar'),
            videoTime: document.getElementById('videoTime'),
            prevVideoBtn: document.getElementById('prevVideo'),
            nextVideoBtn: document.getElementById('nextVideo'),
            shuffleBtn: document.getElementById('shuffleVideos'),
            sourceButtons: document.querySelectorAll('.source-btn'),
            currentVideoInfo: document.getElementById('currentVideoInfo')
        };

        this.state = {
            currentSourceType: 'mixed',
            currentVideoIndex: 0,
            isPlaying: false,
            isMuted: false,
            isShuffled: false,
            isYoutubePlayerReady: false,
            youtubePlayer: null,
            playlist: this.getPlaylist(),
            originalPlaylist: this.getPlaylist(),
            isLoading: false
        };

        this.youtubeAPIReady = false;
        this.init();
    }

    getPlaylist() {
        return {
            direct: [
                {
                    url: 'https://files.catbox.moe/s8s294.mp4',
                    title: 'WhatsDP Tutorial',
                    type: 'direct'
                },
                {
                    url: 'https://files.catbox.moe/jfoaw0.mp4',
                    title: 'WalinkGO Tutorial',
                    type: 'direct'
                },
                {
                    url: 'https://files.catbox.moe/f9yh53.mp4',
                    title: 'WhatsPOST Tutorial',
                    type: 'direct'
                },
                {
                    url: 'https://files.catbox.moe/lvjju9.mp4',
                    title: 'WhatsS.I.M Tutorial',
                    type: 'direct'
                }
            ],
            youtube: [
                {
                    url: 'https://youtu.be/SLahFiAo6bY?si=xOm1raGzW1ZdN10I',
                    title: 'Kena',
                    type: 'youtube'
                },
                {
                    url: 'https://youtu.be/o1eRwPYi51U?si=NCOO4ROYJUppL4s0',
                    title: 'The Enchanted Well of Silverbrook',
                    type: 'youtube'
                },
                {
                    url: 'https://youtu.be/9kWL4d-iqYE?si=OFDmaRcaar_4uDVQ',
                    title: 'Hobble – The Boggart That Was Born From Greed',
                    type: 'youtube'
                }
            ],
            mixed: []
        };
    }

    extractYouTubeVideoId(url) {
        if (!url) return '';
        
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/v\/([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];
        
        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        const lastSegment = url.split('/').pop();
        const cleanSegment = lastSegment.split('?')[0].split('&')[0];
        if (cleanSegment && cleanSegment.length === 11) {
            return cleanSegment;
        }
        
        return '';
    }

    init() {
        this.createMixedPlaylist();
        this.setupEventListeners();
        this.loadYouTubeAPI();
        this.loadRandomVideo();
    }

    createMixedPlaylist() {
        const allVideos = [...this.state.playlist.direct, ...this.state.playlist.youtube];
        const shuffled = [...allVideos].sort(() => Math.random() - 0.5);
        this.state.playlist.mixed = shuffled;
        this.state.originalPlaylist.mixed = [...shuffled];
    }

    setupEventListeners() {
        this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.elements.nativeVideo.addEventListener('click', () => this.togglePlayPause());
        this.elements.muteBtn.addEventListener('click', () => this.toggleMute());
        this.elements.videoProgress.addEventListener('click', (e) => this.seekVideo(e));
        this.elements.nativeVideo.addEventListener('timeupdate', () => this.updateProgress());
        this.elements.nativeVideo.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.elements.prevVideoBtn.addEventListener('click', () => this.previousVideo());
        this.elements.nextVideoBtn.addEventListener('click', () => this.nextVideo());
        this.elements.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.elements.sourceButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchSource(btn.dataset.source));
        });
        this.elements.nativeVideo.addEventListener('ended', () => this.nextVideo());
        this.elements.nativeVideo.addEventListener('waiting', () => this.showLoading());
        this.elements.nativeVideo.addEventListener('playing', () => this.hideLoading());
        this.elements.nativeVideo.addEventListener('canplay', () => this.hideLoading());
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    loadYouTubeAPI() {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            tag.async = true;
            tag.defer = true;
            const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
            if (existingScript) {
                existingScript.remove();
            }
            
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            
            window.onYouTubeIframeAPIReady = () => {
                this.youtubeAPIReady = true;
                this.initYouTubePlayer();
            };
        } else {
            this.youtubeAPIReady = true;
            this.initYouTubePlayer();
        }
    }

    initYouTubePlayer() {
        if (!this.youtubeAPIReady) return;
        
        try {
            if (this.state.youtubePlayer) {
                try {
                    this.state.youtubePlayer.destroy();
                } catch (e) {
                }
            }
            this.elements.youtubeContainer.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: #000;';
            this.state.youtubePlayer = new YT.Player('youtubeContainer', {
                height: '100%',
                width: '100%',
                videoId: '',
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                    'disablekb': 1,
                    'enablejsapi': 1,
                    'fs': 0,
                    'modestbranding': 1,
                    'playsinline': 1,
                    'rel': 0,
                    'showinfo': 0,
                    'iv_load_policy': 3,
                    'origin': window.location.origin,
                    'widget_referrer': window.location.origin
                },
                events: {
                    'onReady': (event) => this.onYouTubePlayerReady(event),
                    'onStateChange': (event) => this.onYouTubeStateChange(event),
                    'onError': (event) => this.onYouTubeError(event)
                }
            });
        } catch (error) {
            console.error('Error initializing YouTube player:', error);
            this.loadYouTubeEmbed();
        }
    }

    onYouTubePlayerReady(event) {
        this.state.isYoutubePlayerReady = true;
        const currentPlaylist = this.state.playlist[this.state.currentSourceType];
        if (currentPlaylist && currentPlaylist[this.state.currentVideoIndex]?.type === 'youtube') {
            this.loadYouTubeVideo(currentPlaylist[this.state.currentVideoIndex].url);
        }
    }

    onYouTubeStateChange(event) {
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                this.state.isPlaying = true;
                this.updatePlayPauseButton();
                this.hideLoading();
                break;
            case YT.PlayerState.PAUSED:
                this.state.isPlaying = false;
                this.updatePlayPauseButton();
                break;
            case YT.PlayerState.ENDED:
                this.nextVideo();
                break;
            case YT.PlayerState.BUFFERING:
                this.showLoading();
                break;
            case YT.PlayerState.CUED:
                this.hideLoading();
                break;
        }
    }

    onYouTubeError(event) {
        console.error('YouTube Player Error:', event.data);
        this.hideLoading();
        this.loadYouTubeEmbed();
    }

    loadYouTubeEmbed() {
        const playlist = this.state.playlist[this.state.currentSourceType];
        if (!playlist || !playlist[this.state.currentVideoIndex]) return;
        
        const video = playlist[this.state.currentVideoIndex];
        const videoId = this.extractYouTubeVideoId(video.url);
        
        if (!videoId) return;
        this.elements.youtubeContainer.innerHTML = '';
        
        const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=0&modestbranding=1&playsinline=1&rel=0&showinfo=0&origin=${encodeURIComponent(window.location.origin)}`;
        
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
        
        this.elements.youtubeContainer.appendChild(iframe);
        
        iframe.onload = () => {
            this.hideLoading();
        };
        
        this.hideLoading();
    }

    loadRandomVideo() {
        const playlist = this.state.playlist[this.state.currentSourceType];
        if (playlist.length === 0) return;
        
        if (this.state.isShuffled && this.state.currentSourceType === 'mixed') {
            this.state.currentVideoIndex = Math.floor(Math.random() * playlist.length);
        }
        
        this.loadVideo(this.state.currentVideoIndex);
    }

    loadVideo(index) {
        const playlist = this.state.playlist[this.state.currentSourceType];
        if (index < 0 || index >= playlist.length) return;
        
        this.state.currentVideoIndex = index;
        const video = playlist[index];
        
        this.showLoading();
        this.elements.currentVideoInfo.textContent = video.title;
        
        if (video.type === 'direct') {
            this.loadNativeVideo(video.url);
        } else if (video.type === 'youtube') {
            this.loadYouTubeVideo(video.url);
        }
    }

    loadNativeVideo(url) {
        this.hideYouTubePlayer();
        this.elements.nativeVideo.style.display = 'block';
        this.elements.youtubeContainer.style.display = 'none';
        
        this.elements.nativeVideo.src = url;
        this.elements.nativeVideo.load();
        this.elements.nativeVideo.onerror = () => {
            console.error('Error loading native video:', url);
            this.hideLoading();
        };
        this.elements.nativeVideo.addEventListener('canplaythrough', () => {
            this.hideLoading();
            if (this.shouldAutoPlay()) {
                this.playVideo();
            }
        }, { once: true });
    }

    loadYouTubeVideo(url) {
        const videoId = this.extractYouTubeVideoId(url);
        
        if (!videoId) {
            console.error('Could not extract video ID from URL:', url);
            this.showError('Invalid YouTube URL');
            return;
        }
        this.elements.youtubeContainer.style.display = 'block';
        this.elements.nativeVideo.style.display = 'none';
        
        if (!this.state.isYoutubePlayerReady) {
            this.loadYouTubeAPI();
            setTimeout(() => {
                if (this.state.isYoutubePlayerReady && this.state.youtubePlayer) {
                    this.state.youtubePlayer.loadVideoById(videoId);
                    this.hideLoading();
                } else {
                    this.loadYouTubeEmbed();
                }
            }, 1000);
            return;
        }
        
        try {
            if (this.state.youtubePlayer && typeof this.state.youtubePlayer.loadVideoById === 'function') {
                this.state.youtubePlayer.loadVideoById(videoId);
                this.hideLoading();
                
                if (this.shouldAutoPlay()) {
                    setTimeout(() => {
                        if (this.state.youtubePlayer && typeof this.state.youtubePlayer.playVideo === 'function') {
                            this.state.youtubePlayer.playVideo();
                        }
                    }, 500);
                }
            } else {
                console.error('YouTube player not properly initialized');
                this.loadYouTubeEmbed();
            }
        } catch (error) {
            console.error('Error loading YouTube video:', error);
            this.loadYouTubeEmbed();
        }
    }

    hideYouTubePlayer() {
        if (this.state.youtubePlayer) {
            try {
                this.state.youtubePlayer.stopVideo();
            } catch (e) {
            }
        }
        this.elements.youtubeContainer.style.display = 'none';
    }

    togglePlayPause() {
        if (this.isYouTubeVideoActive()) {
            if (this.state.isPlaying) {
                this.pauseVideo();
            } else {
                this.playVideo();
            }
        } else {
            if (this.elements.nativeVideo.paused) {
                this.playVideo();
            } else {
                this.pauseVideo();
            }
        }
        
        this.state.isPlaying = !this.state.isPlaying;
        this.updatePlayPauseButton();
    }

    playVideo() {
        if (this.isYouTubeVideoActive()) {
            if (this.state.youtubePlayer && typeof this.state.youtubePlayer.playVideo === 'function') {
                this.state.youtubePlayer.playVideo();
            }
        } else {
            this.elements.nativeVideo.play().catch(e => {
                console.log('Autoplay prevented:', e);
                this.elements.playPauseBtn.style.display = 'flex';
            });
        }
        this.state.isPlaying = true;
        this.updatePlayPauseButton();
    }

    pauseVideo() {
        if (this.isYouTubeVideoActive()) {
            if (this.state.youtubePlayer && typeof this.state.youtubePlayer.pauseVideo === 'function') {
                this.state.youtubePlayer.pauseVideo();
            }
        } else {
            this.elements.nativeVideo.pause();
        }
        this.state.isPlaying = false;
        this.updatePlayPauseButton();
    }

    toggleMute() {
        if (this.isYouTubeVideoActive()) {
            if (this.state.isMuted) {
                if (this.state.youtubePlayer && typeof this.state.youtubePlayer.unMute === 'function') {
                    this.state.youtubePlayer.unMute();
                }
            } else {
                if (this.state.youtubePlayer && typeof this.state.youtubePlayer.mute === 'function') {
                    this.state.youtubePlayer.mute();
                }
            }
        } else {
            this.elements.nativeVideo.muted = !this.elements.nativeVideo.muted;
        }
        
        this.state.isMuted = !this.state.isMuted;
        this.updateMuteButton();
    }

    updatePlayPauseButton() {
        const icon = this.elements.playPauseBtn.querySelector('i');
        if (this.state.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }

    updateMuteButton() {
        const icon = this.elements.muteBtn.querySelector('i');
        if (this.state.isMuted) {
            icon.className = 'fas fa-volume-mute';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    updateProgress() {
        if (this.isYouTubeVideoActive() || !this.elements.nativeVideo.duration) return;
        
        const currentTime = this.elements.nativeVideo.currentTime;
        const duration = this.elements.nativeVideo.duration;
        const percent = (currentTime / duration) * 100;
        
        this.elements.progressBar.style.width = `${percent}%`;
        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        if (this.isYouTubeVideoActive()) {
            return;
        }
        
        const currentTime = this.elements.nativeVideo.currentTime || 0;
        const duration = this.elements.nativeVideo.duration || 0;
        
        if (duration > 0) {
            const currentFormatted = this.formatTime(currentTime);
            const durationFormatted = this.formatTime(duration);
            
            this.elements.videoTime.textContent = `${currentFormatted} / ${durationFormatted}`;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    seekVideo(e) {
        if (this.isYouTubeVideoActive() || !this.elements.nativeVideo.duration) return;
        
        const rect = this.elements.videoProgress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const time = percent * this.elements.nativeVideo.duration;
        
        this.elements.nativeVideo.currentTime = time;
    }

    previousVideo() {
        const playlist = this.state.playlist[this.state.currentSourceType];
        let newIndex = this.state.currentVideoIndex - 1;
        
        if (newIndex < 0) {
            newIndex = playlist.length - 1;
        }
        
        this.loadVideo(newIndex);
    }

    nextVideo() {
        const playlist = this.state.playlist[this.state.currentSourceType];
        let newIndex = this.state.currentVideoIndex + 1;
        
        if (newIndex >= playlist.length) {
            newIndex = 0;
        }
        
        this.loadVideo(newIndex);
    }

    switchSource(sourceType) {
        if (this.state.currentSourceType === sourceType) return;
        this.elements.sourceButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.source === sourceType);
        });
        this.state.currentSourceType = sourceType;
        this.state.currentVideoIndex = 0;
        this.loadRandomVideo();
    }

    toggleShuffle() {
        this.state.isShuffled = !this.state.isShuffled;
        
        if (this.state.isShuffled && this.state.currentSourceType === 'mixed') {
            const shuffled = [...this.state.originalPlaylist.mixed]
                .sort(() => Math.random() - 0.5);
            this.state.playlist.mixed = shuffled;
            
            this.elements.shuffleBtn.innerHTML = '<i class="fas fa-random"></i>';
            this.elements.shuffleBtn.style.background = 'var(--primary-color)';
            this.elements.shuffleBtn.style.color = 'white';
        } else {
            this.state.playlist.mixed = [...this.state.originalPlaylist.mixed];
            
            this.elements.shuffleBtn.innerHTML = '<i class="fas fa-random"></i>';
            this.elements.shuffleBtn.style.background = '';
            this.elements.shuffleBtn.style.color = '';
        }
    }

    showLoading() {
        this.state.isLoading = true;
        this.elements.videoContainer.classList.add('loading');
        this.elements.videoSkeleton.style.display = 'flex';
    }

    hideLoading() {
        this.state.isLoading = false;
        this.elements.videoContainer.classList.remove('loading');
        this.elements.videoSkeleton.style.display = 'none';
    }

    showError(message) {
        this.elements.currentVideoInfo.textContent = `Error: ${message}`;
        this.hideLoading();
    }

    isYouTubeVideoActive() {
        const playlist = this.state.playlist[this.state.currentSourceType];
        const currentVideo = playlist[this.state.currentVideoIndex];
        return currentVideo && currentVideo.type === 'youtube';
    }

    shouldAutoPlay() {
        return document.visibilityState === 'visible' && 
               this.elements.nativeVideo.readyState >= 3;
    }

    handleKeyboardShortcuts(e) {
        const rect = this.elements.videoContainer.getBoundingClientRect();
        if (rect.top > window.innerHeight || rect.bottom < 0) return;
        
        switch (e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'm':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'arrowleft':
            case 'j':
                e.preventDefault();
                this.previousVideo();
                break;
            case 'arrowright':
            case 'l':
                e.preventDefault();
                this.nextVideo();
                break;
            case 'f':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.elements.videoContainer.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    destroy() {
        if (this.state.youtubePlayer) {
            try {
                this.state.youtubePlayer.destroy();
            } catch (e) {
                console.log('Error destroying YouTube player:', e);
            }
        }
        
        this.elements.nativeVideo.pause();
        this.elements.nativeVideo.src = '';
        this.elements.nativeVideo.load();
        
        this.elements.youtubeContainer.innerHTML = '';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (document.getElementById('videoContainer')) {
            window.videoPlayer = new PremiumVideoPlayer();
        }
    }, 500);
});