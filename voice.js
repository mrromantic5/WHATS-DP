class ReadGOPlus {
    constructor() {
        this.elements = {
            // TTS Elements
            ttsTextInput: document.getElementById('ttsTextInput'),
            ttsCharCounter: document.getElementById('ttsCharCounter'),
            voiceCategories: document.getElementById('voiceCategories'),
            voicesGrid: document.getElementById('voicesGrid'),
            noVoices: document.getElementById('noVoices'),
            voiceCount: document.getElementById('voiceCount'),
            voiceSearch: document.getElementById('voiceSearch'),
            rateSlider: document.getElementById('rateSlider'),
            pitchSlider: document.getElementById('pitchSlider'),
            volumeSlider: document.getElementById('volumeSlider'),
            rateValue: document.getElementById('rateValue'),
            pitchValue: document.getElementById('pitchValue'),
            volumeValue: document.getElementById('volumeValue'),
            generateVoiceBtn: document.getElementById('generateVoiceBtn'),
            playPauseBtn: document.getElementById('playPauseBtn'),
            stopBtn: document.getElementById('stopBtn'),
            recordBtn: document.getElementById('recordBtn'),
            recordBtnText: document.getElementById('recordBtnText'),
            voiceProgressBar: document.getElementById('voiceProgressBar'),
            voiceProgressFill: document.getElementById('voiceProgressFill'),
            currentTime: document.getElementById('currentTime'),
            totalTime: document.getElementById('totalTime'),
            playbackControls: document.getElementById('playbackControls'),
            
            // Audio Visualizer
            audioVisualizer: document.getElementById('audioVisualizer'),
            visualizerPlaceholder: document.getElementById('visualizerPlaceholder'),
            visualizerStatus: document.getElementById('visualizerStatus'),
            visualizerWrapper: document.querySelector('.visualizer-wrapper'),
            
            // STT Elements
            startListeningBtn: document.getElementById('startListeningBtn'),
            stopListeningBtn: document.getElementById('stopListeningBtn'),
            clearSttBtn: document.getElementById('clearSttBtn'),
            sttLanguage: document.getElementById('sttLanguage'),
            sttVisualizer: document.getElementById('sttVisualizer'),
            sttPlaceholder: document.getElementById('sttPlaceholder'),
            sttListening: document.getElementById('sttListening'),
            sttVisualizerStatus: document.getElementById('sttVisualizerStatus'),
            sttTextOutput: document.getElementById('sttTextOutput'),
            sttOutputPlaceholder: document.getElementById('sttOutputPlaceholder'),
            interimResult: document.getElementById('interimResult'),
            interimText: document.getElementById('interimText'),
            sttWordCount: document.getElementById('sttWordCount'),
            sttActions: document.getElementById('sttActions'),
            copySttBtn: document.getElementById('copySttBtn'),
            downloadSttBtn: document.getElementById('downloadSttBtn'),
            saveSttHistoryBtn: document.getElementById('saveSttHistoryBtn'),
            listeningTime: document.getElementById('listeningTime'),
            
            // Tab Elements
            voiceTabs: document.getElementById('voiceTabs'),
            ttsPanel: document.getElementById('ttsPanel'),
            sttPanel: document.getElementById('sttPanel'),
            
            // History Elements
            voiceHistoryList: document.getElementById('voiceHistoryList'),
            voiceHistoryEmpty: document.getElementById('voiceHistoryEmpty'),
            toggleVoiceHistoryView: document.getElementById('toggleVoiceHistoryView'),
            clearVoiceHistoryBtn: document.getElementById('clearVoiceHistoryBtn'),
            
            // Statistics Elements
            totalVoices: document.getElementById('totalVoices'),
            totalTranscriptions: document.getElementById('totalTranscriptions'),
            totalCopies: document.getElementById('totalCopies'),
            successRateReadGo: document.getElementById('successRateReadGo')
        };
        
        this.state = {
            // TTS State
            voices: [],
            selectedVoice: null,
            selectedCategory: 'all',
            isSpeaking: false,
            isPaused: false,
            isRecording: false,
            speechSynthesis: window.speechSynthesis,
            audioContext: null,
            analyser: null,
            source: null,
            dataArray: null,
            bufferLength: null,
            animationFrameId: null,
            visualizerCtx: null,
            sttVisualizerCtx: null,
            
            // Recording State
            mediaRecorder: null,
            recordedChunks: [],
            audioStream: null,
            isRecordingAudio: false,
            
            // STT State
            speechRecognition: null,
            isListening: false,
            listeningStartTime: null,
            listeningInterval: null,
            transcriptionHistory: [],
            finalTranscript: '',
            interimTranscript: '',
            
            // History & Stats
            history: JSON.parse(localStorage.getItem('readgo_history')) || [],
            stats: JSON.parse(localStorage.getItem('readgo_stats')) || {
                totalVoices: 0,
                totalTranscriptions: 0,
                totalCopies: 0,
                successfulVoices: 0,
                successfulTranscriptions: 0
            },
            
            // Current playback
            currentUtterance: null,
            playbackStartTime: null,
            playbackTimer: null,
            
            // Browser support flags
            isSpeechSynthesisSupported: false,
            isSpeechRecognitionSupported: false,
            isAudioContextSupported: false
        };
        
        // Pre-defined voices that work in ALL browsers
        this.predefinedVoices = [
            {
                name: 'English (US) - Female',
                lang: 'en-US',
                category: 'female',
                gender: 'female',
                default: true,
                localService: true
            },
            {
                name: 'English (US) - Male',
                lang: 'en-US',
                category: 'male',
                gender: 'male',
                default: false,
                localService: true
            },
            {
                name: 'English (UK) - Female',
                lang: 'en-GB',
                category: 'female',
                gender: 'female',
                default: false,
                localService: true
            },
            {
                name: 'English (UK) - Male',
                lang: 'en-GB',
                category: 'male',
                gender: 'male',
                default: false,
                localService: true
            },
            {
                name: 'Friendly Assistant',
                lang: 'en-US',
                category: 'friendly',
                gender: 'female',
                default: false,
                localService: true
            },
            {
                name: 'Deep Voice',
                lang: 'en-US',
                category: 'deep',
                gender: 'male',
                default: false,
                localService: true
            },
            {
                name: 'AI Assistant',
                lang: 'en-US',
                category: 'ai',
                gender: 'neutral',
                default: false,
                localService: true
            }
        ];
        
        this.voiceCategories = [
            { id: 'all', name: 'All Voices', icon: 'fas fa-globe' },
            { id: 'male', name: 'Male', icon: 'fas fa-male' },
            { id: 'female', name: 'Female', icon: 'fas fa-female' },
            { id: 'friendly', name: 'Friendly', icon: 'fas fa-smile' },
            { id: 'deep', name: 'Deep', icon: 'fas fa-volume-up' },
            { id: 'ai', name: 'AI', icon: 'fas fa-robot' }
        ];
        
        this.init();
    }
    
    init() {
        this.checkBrowserSupport();
        this.setupEventListeners();
        this.loadVoicesImmediately();
        this.setupAudioContext();
        this.setupSpeechRecognition();
        this.renderHistory();
        this.updateStatsDisplay();
        this.setupVisualizers();
        this.updateTTSCharCounter();
        this.updateTabIndicator();
    }
    
    checkBrowserSupport() {
        // Check Speech Synthesis support
        this.state.isSpeechSynthesisSupported = !!(window.speechSynthesis);
        
        // Check Speech Recognition support
        this.state.isSpeechRecognitionSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        
        // Check Audio Context support
        this.state.isAudioContextSupported = !!(window.AudioContext || window.webkitAudioContext);
        
        console.log('Browser Support:', {
            speechSynthesis: this.state.isSpeechSynthesisSupported,
            speechRecognition: this.state.isSpeechRecognitionSupported,
            audioContext: this.state.isAudioContextSupported
        });
    }
    
    loadVoicesImmediately() {
        if (!this.state.isSpeechSynthesisSupported) {
            console.warn('Speech Synthesis not supported, using predefined voices');
            this.usePredefinedVoices();
            return;
        }
        
        // Try to get voices immediately
        const voices = speechSynthesis.getVoices();
        
        if (voices && voices.length > 0) {
            console.log('Voices loaded immediately:', voices.length);
            this.processBrowserVoices(voices);
        } else {
            console.log('No voices available immediately, using predefined voices');
            this.usePredefinedVoices();
            
            // Try again after a delay
            setTimeout(() => {
                const delayedVoices = speechSynthesis.getVoices();
                if (delayedVoices && delayedVoices.length > 0) {
                    console.log('Voices loaded after delay:', delayedVoices.length);
                    this.processBrowserVoices(delayedVoices);
                }
            }, 1000);
            
            // Setup voices changed listener
            speechSynthesis.onvoiceschanged = () => {
                const changedVoices = speechSynthesis.getVoices();
                if (changedVoices && changedVoices.length > 0) {
                    console.log('Voices changed:', changedVoices.length);
                    this.processBrowserVoices(changedVoices);
                }
            };
        }
    }
    
    processBrowserVoices(browserVoices) {
        if (!browserVoices || browserVoices.length === 0) return;
        
        // Map browser voices to our format
        const mappedVoices = browserVoices.map(voice => ({
            name: voice.name,
            lang: voice.lang,
            category: this.categorizeVoice(voice),
            gender: this.detectGender(voice),
            default: voice.default || false,
            localService: voice.localService || false,
            voiceObject: voice,
            isBrowserVoice: true
        }));
        
        // Filter for English voices first, then add others
        const englishVoices = mappedVoices.filter(v => 
            v.lang.startsWith('en-') || v.lang === 'en'
        );
        
        const otherVoices = mappedVoices.filter(v => 
            !v.lang.startsWith('en-') && v.lang !== 'en'
        );
        
        this.state.voices = [...englishVoices, ...otherVoices];
        
        // Auto-select first voice
        if (this.state.voices.length > 0 && !this.state.selectedVoice) {
            this.selectVoice(this.state.voices[0]);
        }
        
        this.populateVoices();
    }
    
    usePredefinedVoices() {
        console.log('Using predefined voices');
        this.state.voices = this.predefinedVoices.map(voice => ({
            ...voice,
            isBrowserVoice: false,
            voiceObject: null
        }));
        
        // Auto-select first voice
        if (this.state.voices.length > 0 && !this.state.selectedVoice) {
            this.selectVoice(this.state.voices[0]);
        }
        
        this.populateVoices();
    }
    
    categorizeVoice(voice) {
        if (!voice || !voice.name) return 'other';
        
        const name = voice.name.toLowerCase();
        
        if (name.includes('male') || name.includes('man') || name.includes('mike') || name.includes('david') || name.includes('john')) {
            return 'male';
        } else if (name.includes('female') || name.includes('woman') || name.includes('susan') || name.includes('kate') || name.includes('mary')) {
            return 'female';
        } else if (name.includes('friendly') || name.includes('casual') || name.includes('happy') || name.includes('smile')) {
            return 'friendly';
        } else if (name.includes('deep') || name.includes('authority') || name.includes('strong') || name.includes('power')) {
            return 'deep';
        } else if (name.includes('ai') || name.includes('neutral') || name.includes('robot') || name.includes('assistant')) {
            return 'ai';
        }
        
        return 'other';
    }
    
    detectGender(voice) {
        const name = voice.name.toLowerCase();
        if (name.includes('female') || name.includes('woman') || name.includes('susan') || name.includes('kate') || name.includes('mary')) {
            return 'female';
        } else if (name.includes('male') || name.includes('man') || name.includes('mike') || name.includes('david') || name.includes('john')) {
            return 'male';
        }
        return 'neutral';
    }
    
    setupEventListeners() {
        // TTS Text Input
        if (this.elements.ttsTextInput) {
            this.elements.ttsTextInput.addEventListener('input', () => {
                this.updateTTSCharCounter();
                this.validateTTSInput();
            });
            
            // Pre-fill with sample text
            if (!this.elements.ttsTextInput.value.trim()) {
                this.elements.ttsTextInput.value = "Welcome to ReadGO+! This is a demonstration of the Text-to-Speech feature. You can type anything here and it will be converted to speech. Try changing the voice and settings to hear different styles.";
            }
        }
        
        // Voice Search
        if (this.elements.voiceSearch) {
            this.elements.voiceSearch.addEventListener('input', (e) => {
                this.filterVoices(e.target.value);
            });
        }
        
        // Settings Sliders
        if (this.elements.rateSlider && this.elements.rateValue) {
            this.elements.rateSlider.addEventListener('input', (e) => {
                this.elements.rateValue.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
            });
        }
        
        if (this.elements.pitchSlider && this.elements.pitchValue) {
            this.elements.pitchSlider.addEventListener('input', (e) => {
                this.elements.pitchValue.textContent = parseFloat(e.target.value).toFixed(1);
            });
        }
        
        if (this.elements.volumeSlider && this.elements.volumeValue) {
            this.elements.volumeSlider.addEventListener('input', (e) => {
                this.elements.volumeValue.textContent = `${Math.round(e.target.value * 100)}%`;
            });
        }
        
        // TTS Controls
        if (this.elements.generateVoiceBtn) {
            this.elements.generateVoiceBtn.addEventListener('click', () => this.generateVoice());
        }
        
        if (this.elements.playPauseBtn) {
            this.elements.playPauseBtn.addEventListener('click', () => this.togglePlayback());
        }
        
        if (this.elements.stopBtn) {
            this.elements.stopBtn.addEventListener('click', () => this.stopPlayback());
        }
        
        if (this.elements.recordBtn) {
            this.elements.recordBtn.addEventListener('click', () => this.toggleRecording());
        }
        
        // STT Controls
        if (this.elements.startListeningBtn) {
            this.elements.startListeningBtn.addEventListener('click', () => this.startListening());
        }
        
        if (this.elements.stopListeningBtn) {
            this.elements.stopListeningBtn.addEventListener('click', () => this.stopListening());
        }
        
        if (this.elements.clearSttBtn) {
            this.elements.clearSttBtn.addEventListener('click', () => this.clearSTT());
        }
        
        if (this.elements.sttLanguage) {
            this.elements.sttLanguage.addEventListener('change', () => this.updateRecognitionLanguage());
        }
        
        if (this.elements.copySttBtn) {
            this.elements.copySttBtn.addEventListener('click', () => this.copySTT());
        }
        
        if (this.elements.downloadSttBtn) {
            this.elements.downloadSttBtn.addEventListener('click', () => this.downloadSTT());
        }
        
        if (this.elements.saveSttHistoryBtn) {
            this.elements.saveSttHistoryBtn.addEventListener('click', () => this.saveSTTHistory());
        }
        
        // Tab Switching
        document.querySelectorAll('.voice-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.currentTarget.dataset.tab;
                this.switchTab(tabId);
            });
        });
        
        // History Controls
        if (this.elements.clearVoiceHistoryBtn) {
            this.elements.clearVoiceHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
        
        if (this.elements.toggleVoiceHistoryView) {
            this.elements.toggleVoiceHistoryView.addEventListener('click', () => this.toggleHistoryView());
        }
        
        // Window events
        window.addEventListener('resize', () => {
            this.updateTabIndicator();
        });
        
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }
    
    setupAudioContext() {
        if (this.state.isAudioContextSupported) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = 256;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
            } catch (error) {
                console.warn('Audio Context setup failed:', error);
            }
        }
    }
    
    setupVisualizers() {
        // TTS Visualizer
        if (this.elements.audioVisualizer) {
            this.visualizerCtx = this.elements.audioVisualizer.getContext('2d');
            this.resizeCanvas(this.elements.audioVisualizer);
        }
        
        // STT Visualizer
        if (this.elements.sttVisualizer) {
            this.sttVisualizerCtx = this.elements.sttVisualizer.getContext('2d');
            this.resizeCanvas(this.elements.sttVisualizer);
        }
        
        window.addEventListener('resize', () => {
            if (this.elements.audioVisualizer) this.resizeCanvas(this.elements.audioVisualizer);
            if (this.elements.sttVisualizer) this.resizeCanvas(this.elements.sttVisualizer);
        });
    }
    
    resizeCanvas(canvas) {
        if (!canvas || !canvas.parentElement) return;
        
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
    }
    
    setupSpeechRecognition() {
        if (!this.state.isSpeechRecognitionSupported) {
            if (this.elements.startListeningBtn) {
                this.elements.startListeningBtn.disabled = true;
                this.elements.startListeningBtn.innerHTML = '<i class="fas fa-microphone-slash"></i><span>Not Supported</span>';
            }
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = true;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = this.elements.sttLanguage ? this.elements.sttLanguage.value : 'en-US';
        
        this.speechRecognition.onstart = () => {
            this.state.isListening = true;
            this.updateListeningUI(true);
            this.startListeningTimer();
            this.startSTTVisualizer();
        };
        
        this.speechRecognition.onresult = (event) => {
            this.interimTranscript = '';
            this.finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript + ' ';
                } else {
                    this.interimTranscript += transcript;
                }
            }
            
            this.updateSTTOutput();
        };
        
        this.speechRecognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopListening();
            this.showToast('Speech Recognition Error', 'Please try again', 'error');
        };
        
        this.speechRecognition.onend = () => {
            this.stopListening();
        };
    }
    
    populateVoices() {
        if (!this.elements.voicesGrid || !this.elements.noVoices || !this.elements.voiceCount) return;
        
        if (this.state.voices.length === 0) {
            this.elements.noVoices.style.display = 'block';
            this.elements.voicesGrid.style.display = 'none';
            this.elements.voiceCount.textContent = 'No voices available';
            return;
        }
        
        this.elements.noVoices.style.display = 'none';
        this.elements.voicesGrid.style.display = 'grid';
        this.elements.voiceCount.textContent = `${this.state.voices.length} voices available`;
        
        this.renderVoiceCategories();
        this.filterVoices();
        
        // Update button state
        this.validateTTSInput();
    }
    
    renderVoiceCategories() {
        if (!this.elements.voiceCategories) return;
        
        this.elements.voiceCategories.innerHTML = this.voiceCategories.map(category => `
            <button class="category-pill ${this.state.selectedCategory === category.id ? 'active' : ''}" 
                    data-category="${category.id}">
                <i class="${category.icon}"></i>
                <span>${category.name}</span>
            </button>
        `).join('');
        
        // Add event listeners to category pills
        this.elements.voiceCategories.querySelectorAll('.category-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.state.selectedCategory = category;
                this.renderVoiceCategories();
                this.filterVoices(this.elements.voiceSearch ? this.elements.voiceSearch.value : '');
            });
        });
    }
    
    filterVoices(searchTerm = '') {
        const searchLower = (searchTerm || '').toLowerCase();
        let filteredVoices = this.state.voices;
        
        // Filter by category
        if (this.state.selectedCategory !== 'all') {
            filteredVoices = filteredVoices.filter(voice => 
                voice.category === this.state.selectedCategory
            );
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredVoices = filteredVoices.filter(voice => 
                voice.name.toLowerCase().includes(searchLower) ||
                (voice.lang && voice.lang.toLowerCase().includes(searchLower))
            );
        }
        
        this.renderVoices(filteredVoices);
    }
    
    renderVoices(voices) {
        if (!this.elements.voicesGrid) return;
        
        if (voices.length === 0) {
            this.elements.voicesGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <i class="fas fa-search"></i>
                    <p>No voices found</p>
                    <p class="small-text">Try a different search or category</p>
                </div>
            `;
            return;
        }
        
        this.elements.voicesGrid.innerHTML = voices.map(voice => `
            <div class="voice-item ${this.state.selectedVoice === voice ? 'selected' : ''}" 
                 data-voice="${voice.name}">
                <div class="voice-header">
                    <div class="voice-icon">
                        <i class="fas fa-user${voice.gender === 'female' ? '-female' : voice.gender === 'male' ? '-male' : ''}"></i>
                    </div>
                    <div class="voice-name">${voice.name}</div>
                </div>
                <div class="voice-meta">
                    <span class="voice-category">${voice.category || 'other'}</span>
                    <span class="voice-lang">${voice.lang || 'en-US'}</span>
                </div>
                <div class="voice-details">
                    ${voice.isBrowserVoice ? 'Browser voice' : 'Predefined voice'} • ${voice.default ? 'Default' : 'Available'}
                </div>
                <button class="voice-preview-btn" data-action="preview">
                    <i class="fas fa-play-circle"></i>
                    Preview
                </button>
            </div>
        `).join('');
        
        // Add event listeners
        this.elements.voicesGrid.querySelectorAll('.voice-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('[data-action="preview"]')) {
                    const voiceName = item.dataset.voice;
                    const voice = voices.find(v => v.name === voiceName);
                    if (voice) this.selectVoice(voice);
                }
            });
        });
        
        this.elements.voicesGrid.querySelectorAll('[data-action="preview"]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const voiceName = e.target.closest('.voice-item').dataset.voice;
                const voice = voices.find(v => v.name === voiceName);
                if (voice) this.previewVoice(voice);
            });
        });
    }
    
    selectVoice(voice) {
        this.state.selectedVoice = voice;
        
        // Update UI
        if (this.elements.voicesGrid) {
            this.elements.voicesGrid.querySelectorAll('.voice-item').forEach(item => {
                item.classList.remove('selected');
                if (item.dataset.voice === voice.name) {
                    item.classList.add('selected');
                }
            });
        }
        
        this.validateTTSInput();
        this.showToast('Voice Selected', `${voice.name}`, 'success');
    }
    
    previewVoice(voice) {
        if (!this.state.isSpeechSynthesisSupported) {
            this.showToast('Preview Not Available', 'Speech synthesis not supported', 'error');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance("Hello, this is a voice preview.");
        
        if (voice.isBrowserVoice && voice.voiceObject) {
            utterance.voice = voice.voiceObject;
        }
        
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.5;
        
        // Stop any current speech
        speechSynthesis.cancel();
        
        // Speak
        speechSynthesis.speak(utterance);
        this.showToast('Playing Preview', 'Listen to the voice sample', 'info');
    }
    
    updateTTSCharCounter() {
        if (!this.elements.ttsTextInput || !this.elements.ttsCharCounter) return;
        
        const length = this.elements.ttsTextInput.value.length;
        this.elements.ttsCharCounter.textContent = `${length}/5000`;
        
        // Update color based on length
        if (length > 4500) {
            this.elements.ttsCharCounter.style.color = '#ff4757';
        } else if (length > 4000) {
            this.elements.ttsCharCounter.style.color = '#ffa502';
        } else {
            this.elements.ttsCharCounter.style.color = '';
        }
        
        this.validateTTSInput();
    }
    
    validateTTSInput() {
        if (!this.elements.ttsTextInput || !this.elements.generateVoiceBtn) return false;
        
        const text = this.elements.ttsTextInput.value.trim();
        const hasText = text.length > 0 && text.length <= 5000;
        const hasVoice = this.state.selectedVoice !== null;
        const isSupported = this.state.isSpeechSynthesisSupported;
        
        const isValid = hasText && hasVoice && isSupported;
        
        this.elements.generateVoiceBtn.disabled = !isValid;
        
        if (!isValid) {
            if (!hasText) {
                this.elements.generateVoiceBtn.title = 'Please enter text';
            } else if (!hasVoice) {
                this.elements.generateVoiceBtn.title = 'Please select a voice';
            } else if (!isSupported) {
                this.elements.generateVoiceBtn.title = 'Speech synthesis not supported';
            }
        } else {
            this.elements.generateVoiceBtn.title = 'Generate voice from text';
        }
        
        return isValid;
    }
    
    generateVoice() {
        const text = this.elements.ttsTextInput.value.trim();
        
        if (!this.validateTTSInput()) {
            if (!text) {
                this.showToast('No Text', 'Please enter text to convert to speech', 'error');
            } else if (!this.state.selectedVoice) {
                this.showToast('No Voice Selected', 'Please select a voice first', 'error');
            } else if (!this.state.isSpeechSynthesisSupported) {
                this.showToast('Not Supported', 'Text-to-speech not supported in this browser', 'error');
            }
            return;
        }
        
        // Show loading state
        if (this.elements.generateVoiceBtn) {
            this.elements.generateVoiceBtn.classList.add('loading');
        }
        
        // Stop any current speech
        speechSynthesis.cancel();
        
        try {
            // Create utterance
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Set voice if available
            if (this.state.selectedVoice.isBrowserVoice && this.state.selectedVoice.voiceObject) {
                utterance.voice = this.state.selectedVoice.voiceObject;
            }
            
            // Apply settings
            utterance.rate = this.elements.rateSlider ? parseFloat(this.elements.rateSlider.value) : 1.0;
            utterance.pitch = this.elements.pitchSlider ? parseFloat(this.elements.pitchSlider.value) : 1.0;
            utterance.volume = this.elements.volumeSlider ? parseFloat(this.elements.volumeSlider.value) : 1.0;
            
            this.state.currentUtterance = utterance;
            
            // Set up event handlers
            utterance.onstart = () => {
                console.log('Speech started');
                this.state.isSpeaking = true;
                this.state.isPaused = false;
                this.updatePlaybackUI(true);
                this.startPlaybackTimer();
                this.startAudioVisualizer();
                
                if (this.elements.visualizerWrapper) {
                    this.elements.visualizerWrapper.classList.add('playing');
                }
                if (this.elements.visualizerStatus) {
                    this.elements.visualizerStatus.textContent = 'Playing';
                    this.elements.visualizerStatus.classList.add('active');
                }
                
                this.showToast('Voice Playing', 'Text is being spoken', 'success');
            };
            
            utterance.onend = () => {
                console.log('Speech ended');
                this.stopPlayback();
                
                if (this.elements.visualizerWrapper) {
                    this.elements.visualizerWrapper.classList.remove('playing');
                }
                if (this.elements.visualizerStatus) {
                    this.elements.visualizerStatus.textContent = 'Idle';
                    this.elements.visualizerStatus.classList.remove('active');
                }
                
                this.stopAudioVisualizer();
                
                // Update statistics
                this.state.stats.totalVoices++;
                this.state.stats.successfulVoices++;
                this.saveStats();
                this.updateStatsDisplay();
                
                // Save to history
                this.saveTTSHistory(text);
                
                // Trigger WhatsApp popup
                setTimeout(() => {
                    if (window.whatsDPApp && typeof window.whatsDPApp.openFollowPopup === 'function') {
                        window.whatsDPApp.openFollowPopup();
                    }
                }, 1500);
            };
            
            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                this.stopPlayback();
                this.showToast('Voice Generation Failed', 'Please try again', 'error');
            };
            
            // Start speaking
            speechSynthesis.speak(utterance);
            
            // Show playback controls
            if (this.elements.playbackControls) {
                this.elements.playbackControls.style.display = 'flex';
            }
            
        } catch (error) {
            console.error('Error generating voice:', error);
            this.showToast('Generation Failed', 'Please try again', 'error');
        } finally {
            // Remove loading state
            if (this.elements.generateVoiceBtn) {
                this.elements.generateVoiceBtn.classList.remove('loading');
            }
        }
    }
    
    saveTTSHistory(text) {
        const historyItem = {
            id: Date.now(),
            type: 'voice',
            title: `Voice ${this.state.history.filter(h => h.type === 'voice').length + 1}`,
            content: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
            fullText: text,
            timestamp: new Date().toISOString(),
            voice: this.state.selectedVoice?.name || 'Default',
            settings: {
                rate: this.elements.rateSlider ? parseFloat(this.elements.rateSlider.value) : 1.0,
                pitch: this.elements.pitchSlider ? parseFloat(this.elements.pitchSlider.value) : 1.0,
                volume: this.elements.volumeSlider ? parseFloat(this.elements.volumeSlider.value) : 1.0
            }
        };
        
        this.state.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }
    
    togglePlayback() {
        if (!this.state.isSpeechSynthesisSupported) return;
        
        if (this.state.isSpeaking) {
            if (this.state.isPaused) {
                speechSynthesis.resume();
                this.state.isPaused = false;
                if (this.elements.playPauseBtn) {
                    this.elements.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                }
                this.startPlaybackTimer();
                this.startAudioVisualizer();
            } else {
                speechSynthesis.pause();
                this.state.isPaused = true;
                if (this.elements.playPauseBtn) {
                    this.elements.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
                this.stopPlaybackTimer();
                this.stopAudioVisualizer();
            }
        }
    }
    
    stopPlayback() {
        if (this.state.isSpeechSynthesisSupported && this.state.isSpeaking) {
            speechSynthesis.cancel();
            this.state.isSpeaking = false;
            this.state.isPaused = false;
            this.updatePlaybackUI(false);
            this.stopPlaybackTimer();
            this.stopAudioVisualizer();
        }
    }
    
    updatePlaybackUI(isPlaying) {
        if (!this.elements.playPauseBtn || !this.elements.stopBtn) return;
        
        this.elements.playPauseBtn.disabled = !isPlaying;
        this.elements.stopBtn.disabled = !isPlaying;
        this.elements.playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        
        if (!isPlaying && this.elements.playbackControls) {
            this.elements.playbackControls.style.display = 'none';
        }
        
        if (this.elements.currentTime && this.elements.totalTime && this.elements.voiceProgressFill) {
            this.elements.currentTime.textContent = '0:00';
            this.elements.totalTime.textContent = '0:00';
            this.elements.voiceProgressFill.style.width = '0%';
        }
    }
    
    startPlaybackTimer() {
        this.stopPlaybackTimer();
        this.state.playbackStartTime = Date.now();
        
        this.state.playbackTimer = setInterval(() => {
            if (!this.state.currentUtterance) return;
            
            const elapsed = Date.now() - this.state.playbackStartTime;
            const total = this.state.currentUtterance.text.length * 50; // Estimate
            
            const progress = Math.min((elapsed / total) * 100, 100);
            
            if (this.elements.voiceProgressFill) {
                this.elements.voiceProgressFill.style.width = `${progress}%`;
            }
            
            // Update time display
            const elapsedSeconds = Math.floor(elapsed / 1000);
            const totalSeconds = Math.floor(total / 1000);
            
            if (this.elements.currentTime && this.elements.totalTime) {
                this.elements.currentTime.textContent = this.formatTime(elapsedSeconds);
                this.elements.totalTime.textContent = this.formatTime(totalSeconds);
            }
        }, 100);
    }
    
    stopPlaybackTimer() {
        if (this.state.playbackTimer) {
            clearInterval(this.state.playbackTimer);
            this.state.playbackTimer = null;
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    startAudioVisualizer() {
        if (!this.audioContext || !this.analyser || !this.visualizerCtx) return;
        
        try {
            // Create oscillator for visualization
            this.source = this.audioContext.createOscillator();
            this.source.type = 'sine';
            this.source.frequency.value = 200;
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            this.source.start();
            
            this.animationFrameId = requestAnimationFrame(() => this.drawAudioVisualizer());
        } catch (error) {
            console.warn('Audio visualizer error:', error);
        }
    }
    
    stopAudioVisualizer() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        if (this.source) {
            try {
                this.source.stop();
                this.source.disconnect();
            } catch (e) {
                // Ignore errors
            }
            this.source = null;
        }
        
        // Clear canvas
        if (this.visualizerCtx && this.elements.audioVisualizer) {
            const canvas = this.elements.audioVisualizer;
            this.visualizerCtx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    drawAudioVisualizer() {
        if (!this.visualizerCtx || !this.analyser || !this.elements.audioVisualizer) return;
        
        const canvas = this.elements.audioVisualizer;
        const width = canvas.width;
        const height = canvas.height;
        const ctx = this.visualizerCtx;
        
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Get frequency data
        if (this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray);
        }
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#25D366');
        gradient.addColorStop(0.5, '#34B7F1');
        gradient.addColorStop(1, '#9B59B6');
        
        // Draw wave
        ctx.beginPath();
        
        const sliceWidth = width / (this.bufferLength || 128);
        let x = 0;
        
        for (let i = 0; i < (this.bufferLength || 128); i++) {
            const v = this.dataArray ? (this.dataArray[i] / 255.0) : (Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5);
            const y = height - (v * height * 0.7);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        // Add bottom line for fill
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Fill with gradient
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        
        // Draw outline
        ctx.beginPath();
        x = 0;
        for (let i = 0; i < (this.bufferLength || 128); i++) {
            const v = this.dataArray ? (this.dataArray[i] / 255.0) : (Math.sin(Date.now() / 1000 + i) * 0.5 + 0.5);
            const y = height - (v * height * 0.7);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
        }
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.8;
        ctx.stroke();
        
        this.animationFrameId = requestAnimationFrame(() => this.drawAudioVisualizer());
    }
    
    startSTTVisualizer() {
        if (!this.sttVisualizerCtx) return;
        this.animationFrameId = requestAnimationFrame(() => this.drawSTTVisualizer());
    }
    
    stopSTTVisualizer() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
        
        // Clear canvas
        if (this.sttVisualizerCtx && this.elements.sttVisualizer) {
            const canvas = this.elements.sttVisualizer;
            this.sttVisualizerCtx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    drawSTTVisualizer() {
        if (!this.sttVisualizerCtx || !this.elements.sttVisualizer) return;
        
        const canvas = this.elements.sttVisualizer;
        const width = canvas.width;
        const height = canvas.height;
        const ctx = this.sttVisualizerCtx;
        const time = Date.now() / 1000;
        
        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Create pulsing circles
        const pulseCount = 3;
        for (let i = 0; i < pulseCount; i++) {
            const progress = (time * 0.5 + i / pulseCount) % 1;
            const radius = progress * Math.min(width, height) * 0.3;
            const alpha = 1 - progress;
            
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(52, 183, 241, ${alpha * 0.3})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw central listening indicator
        const pulseSize = Math.sin(time * 3) * 10 + 25;
        
        // Outer glow
        const gradient = ctx.createRadialGradient(
            width / 2, height / 2, pulseSize,
            width / 2, height / 2, pulseSize + 20
        );
        gradient.addColorStop(0, 'rgba(52, 183, 241, 0.8)');
        gradient.addColorStop(1, 'rgba(52, 183, 241, 0)');
        
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, pulseSize + 20, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = '#34B7F1';
        ctx.fill();
        
        // Mic icon
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎤', width / 2, height / 2);
        
        this.animationFrameId = requestAnimationFrame(() => this.drawSTTVisualizer());
    }
    
    startListening() {
        if (!this.speechRecognition) {
            this.showToast('Speech Recognition Not Supported', 'Please use Chrome or Edge', 'error');
            return;
        }
        
        try {
            this.speechRecognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showToast('Error', 'Cannot start speech recognition', 'error');
        }
    }
    
    stopListening() {
        if (this.speechRecognition && this.state.isListening) {
            this.speechRecognition.stop();
        }
        
        this.state.isListening = false;
        this.updateListeningUI(false);
        this.stopListeningTimer();
        this.stopSTTVisualizer();
    }
    
    updateListeningUI(isListening) {
        if (!this.elements.startListeningBtn || !this.elements.stopListeningBtn) return;
        
        this.elements.startListeningBtn.disabled = isListening;
        this.elements.stopListeningBtn.disabled = !isListening;
        
        if (this.elements.sttPlaceholder) {
            this.elements.sttPlaceholder.style.display = isListening ? 'none' : 'flex';
        }
        if (this.elements.sttListening) {
            this.elements.sttListening.style.display = isListening ? 'flex' : 'none';
        }
        if (this.elements.sttVisualizerStatus) {
            this.elements.sttVisualizerStatus.textContent = isListening ? 'Listening' : 'Ready';
            this.elements.sttVisualizerStatus.classList.toggle('active', isListening);
        }
    }
    
    startListeningTimer() {
        this.stopListeningTimer();
        this.state.listeningStartTime = Date.now();
        
        this.state.listeningInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.state.listeningStartTime) / 1000);
            if (this.elements.listeningTime) {
                this.elements.listeningTime.textContent = `${elapsed}s`;
            }
        }, 1000);
    }
    
    stopListeningTimer() {
        if (this.state.listeningInterval) {
            clearInterval(this.state.listeningInterval);
            this.state.listeningInterval = null;
        }
    }
    
    updateSTTOutput() {
        const text = this.finalTranscript || this.interimTranscript;
        
        if (text.trim()) {
            if (this.elements.sttOutputPlaceholder) {
                this.elements.sttOutputPlaceholder.style.display = 'none';
            }
            if (this.elements.sttTextOutput) {
                this.elements.sttTextOutput.style.display = 'block';
                this.elements.sttTextOutput.value = this.finalTranscript;
            }
            if (this.elements.interimResult) {
                this.elements.interimResult.style.display = this.interimTranscript ? 'block' : 'none';
            }
            if (this.elements.interimText) {
                this.elements.interimText.textContent = this.interimTranscript;
            }
            if (this.elements.sttActions) {
                this.elements.sttActions.style.display = 'flex';
            }
            
            // Update word count
            const wordCount = this.finalTranscript.trim().split(/\s+/).filter(w => w.length > 0).length;
            if (this.elements.sttWordCount) {
                this.elements.sttWordCount.textContent = `${wordCount} words`;
            }
        }
    }
    
    clearSTT() {
        this.finalTranscript = '';
        this.interimTranscript = '';
        this.state.transcriptionHistory = [];
        
        if (this.elements.sttTextOutput) {
            this.elements.sttTextOutput.value = '';
        }
        if (this.elements.interimText) {
            this.elements.interimText.textContent = '';
        }
        if (this.elements.sttOutputPlaceholder) {
            this.elements.sttOutputPlaceholder.style.display = 'flex';
        }
        if (this.elements.sttTextOutput) {
            this.elements.sttTextOutput.style.display = 'none';
        }
        if (this.elements.interimResult) {
            this.elements.interimResult.style.display = 'none';
        }
        if (this.elements.sttActions) {
            this.elements.sttActions.style.display = 'none';
        }
        if (this.elements.sttWordCount) {
            this.elements.sttWordCount.textContent = '0 words';
        }
        
        this.showToast('Cleared', 'Transcription cleared', 'info');
    }
    
    updateRecognitionLanguage() {
        if (this.speechRecognition && this.elements.sttLanguage) {
            this.speechRecognition.lang = this.elements.sttLanguage.value;
        }
    }
    
    copySTT() {
        const text = this.elements.sttTextOutput?.value || '';
        if (!text.trim()) {
            this.showToast('No Text', 'Nothing to copy', 'error');
            return;
        }
        
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied!', 'Text copied to clipboard', 'success');
            this.state.stats.totalCopies++;
            this.saveStats();
            this.updateStatsDisplay();
        }).catch(() => {
            // Fallback method
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('Copied!', 'Text copied to clipboard', 'success');
            this.state.stats.totalCopies++;
            this.saveStats();
            this.updateStatsDisplay();
        });
    }
    
    downloadSTT() {
        const text = this.elements.sttTextOutput?.value || '';
        if (!text.trim()) {
            this.showToast('No Text', 'Nothing to download', 'error');
            return;
        }
        
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `readgo-transcription-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        this.showToast('Downloaded', 'Transcription saved as TXT', 'success');
    }
    
    saveSTTHistory() {
        const text = this.elements.sttTextOutput?.value || '';
        if (!text.trim()) {
            this.showToast('No Text', 'Please transcribe some text first', 'error');
            return;
        }
        
        const historyItem = {
            id: Date.now(),
            type: 'text',
            title: `Transcription ${this.state.history.filter(h => h.type === 'text').length + 1}`,
            content: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
            fullText: text,
            timestamp: new Date().toISOString(),
            language: this.elements.sttLanguage?.value || 'en-US'
        };
        
        this.state.history.unshift(historyItem);
        
        // Keep only last 50 items
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
        
        // Update statistics
        this.state.stats.totalTranscriptions++;
        this.state.stats.successfulTranscriptions++;
        this.saveStats();
        this.updateStatsDisplay();
        
        this.showToast('Saved', 'Added to history', 'success');
    }
    
    switchTab(tabId) {
        // Update tabs
        document.querySelectorAll('.voice-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            }
        });
        
        // Update panels
        document.querySelectorAll('.voice-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        if (tabId === 'tts') {
            if (this.elements.ttsPanel) {
                this.elements.ttsPanel.classList.add('active');
            }
        } else {
            if (this.elements.sttPanel) {
                this.elements.sttPanel.classList.add('active');
            }
        }
        
        this.updateTabIndicator();
    }
    
    updateTabIndicator() {
        const activeTab = document.querySelector('.voice-tab.active');
        const indicator = document.querySelector('.tab-indicator');
        
        if (activeTab && indicator && this.elements.voiceTabs) {
            const tabRect = activeTab.getBoundingClientRect();
            const tabsRect = this.elements.voiceTabs.getBoundingClientRect();
            indicator.style.transform = `translateX(${tabRect.left - tabsRect.left}px)`;
            indicator.style.width = `${tabRect.width}px`;
        }
    }
    
    renderHistory() {
        if (!this.elements.voiceHistoryList || !this.elements.voiceHistoryEmpty) return;
        
        if (this.state.history.length === 0) {
            this.elements.voiceHistoryEmpty.style.display = 'flex';
            this.elements.voiceHistoryList.style.display = 'none';
            return;
        }
        
        this.elements.voiceHistoryEmpty.style.display = 'none';
        this.elements.voiceHistoryList.style.display = 'block';
        
        this.elements.voiceHistoryList.innerHTML = this.state.history.map(item => `
            <div class="voice-history-item" data-id="${item.id}">
                <div class="history-item-header">
                    <div class="history-title">
                        <div class="history-title-text">${item.title}</div>
                        <span class="history-type ${item.type}">${item.type === 'voice' ? 'VOICE' : 'TEXT'}</span>
                    </div>
                    <div class="history-time">${this.formatHistoryTime(item.timestamp)}</div>
                </div>
                <div class="history-content">
                    ${item.content}
                </div>
                <div class="history-actions">
                    ${item.type === 'voice' ? `
                        <button class="btn-icon-sm" onclick="window.readGOApp.playHistoryItem(${item.id})" aria-label="Play">
                            <i class="fas fa-play"></i>
                        </button>
                    ` : `
                        <button class="btn-icon-sm" onclick="window.readGOApp.copyHistoryItem(${item.id})" aria-label="Copy">
                            <i class="fas fa-copy"></i>
                        </button>
                    `}
                    <button class="btn-icon-sm" onclick="window.readGOApp.deleteHistoryItem(${item.id})" aria-label="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    formatHistoryTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }
    
    playHistoryItem(id) {
        const item = this.state.history.find(h => h.id === id && h.type === 'voice');
        if (item && item.fullText) {
            this.elements.ttsTextInput.value = item.fullText;
            this.updateTTSCharCounter();
            this.validateTTSInput();
            this.showToast('Text Loaded', 'Ready to generate voice', 'info');
        }
    }
    
    copyHistoryItem(id) {
        const item = this.state.history.find(h => h.id === id);
        if (item && item.fullText) {
            navigator.clipboard.writeText(item.fullText).then(() => {
                this.showToast('Copied!', 'Text copied from history', 'success');
                this.state.stats.totalCopies++;
                this.saveStats();
                this.updateStatsDisplay();
            });
        }
    }
    
    deleteHistoryItem(id) {
        if (confirm('Delete this item from history?')) {
            this.state.history = this.state.history.filter(h => h.id !== id);
            this.saveHistory();
            this.renderHistory();
            this.showToast('Deleted', 'Item removed from history', 'success');
        }
    }
    
    clearHistory() {
        if (this.state.history.length === 0) return;
        
        if (confirm('Clear all voice studio history?')) {
            this.state.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showToast('History Cleared', 'All history removed', 'success');
        }
    }
    
    toggleHistoryView() {
        if (!this.elements.voiceHistoryList) return;
        
        const isGrid = this.elements.voiceHistoryList.classList.contains('grid-view');
        this.elements.voiceHistoryList.classList.toggle('grid-view', !isGrid);
        
        if (this.elements.toggleVoiceHistoryView) {
            this.elements.toggleVoiceHistoryView.innerHTML = isGrid ? 
                '<i class="fas fa-th"></i>' : '<i class="fas fa-list"></i>';
        }
    }
    
    saveHistory() {
        try {
            localStorage.setItem('readgo_history', JSON.stringify(this.state.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
    
    saveStats() {
        try {
            localStorage.setItem('readgo_stats', JSON.stringify(this.state.stats));
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }
    
    updateStatsDisplay() {
        // Animate counters
        this.animateCounter(this.elements.totalVoices, this.state.stats.totalVoices);
        this.animateCounter(this.elements.totalTranscriptions, this.state.stats.totalTranscriptions);
        this.animateCounter(this.elements.totalCopies, this.state.stats.totalCopies);
        
        // Calculate success rate
        const totalAttempts = this.state.stats.totalVoices + this.state.stats.totalTranscriptions;
        const successfulAttempts = this.state.stats.successfulVoices + this.state.stats.successfulTranscriptions;
        const successRate = totalAttempts > 0 ? 
            Math.round((successfulAttempts / totalAttempts) * 100) : 100;
        
        if (this.elements.successRateReadGo) {
            this.elements.successRateReadGo.textContent = `${successRate}%`;
        }
    }
    
    animateCounter(element, targetValue) {
        if (!element) return;
        
        const current = parseInt(element.textContent) || 0;
        if (current === targetValue) return;
        
        const increment = targetValue > current ? 1 : -1;
        let currentValue = current;
        
        const animate = () => {
            currentValue += increment;
            element.textContent = currentValue;
            
            if (currentValue !== targetValue) {
                setTimeout(animate, 50);
            }
        };
        
        animate();
    }
    
    showToast(title, message, type = 'info') {
        // Use existing toast system if available
        if (window.whatsDPApp && typeof window.whatsDPApp.showToast === 'function') {
            window.whatsDPApp.showToast(title, message, type);
            return;
        }
        
        // Fallback toast implementation
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const container = document.getElementById('toastContainer') || document.body;
        container.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        });
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('fade-out');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    cleanup() {
        this.stopPlayback();
        this.stopListening();
        this.stopAudioVisualizer();
        this.stopSTTVisualizer();
        
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
        }
    }
}

// Initialize immediately when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.readGOApp = new ReadGOPlus();
});
