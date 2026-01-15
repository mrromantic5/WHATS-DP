class WhatsSIMPlus {
    constructor() {
        this.elements = {
            canvas: document.getElementById('simCanvas'),
            textInput: document.getElementById('simTextInput'),
            charCounter: document.getElementById('simCharCounter'),
            sizePresets: document.getElementById('sizePresets'),
            fontPresets: document.getElementById('fontPresets'),
            colorPresets: document.getElementById('colorPresets'),
            customColorPicker: document.getElementById('customColorPicker'),
            applyCustomColor: document.getElementById('applyCustomColor'),
            emojiContainer: document.getElementById('emojiContainer'),
            textShadowToggle: document.getElementById('textShadowToggle'),
            watermarkToggle: document.getElementById('watermarkToggle'),
            safeAreaToggle: document.getElementById('safeAreaToggle'),
            autoResizeToggle: document.getElementById('autoResizeToggle'),
            opacitySlider: document.getElementById('opacitySlider'),
            opacityValue: document.getElementById('opacityValue'),
            generateImageBtn: document.getElementById('generateImageBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            shareBtn: document.getElementById('shareBtn'),
            saveTemplateBtn: document.getElementById('saveTemplateBtn'),
            zoomPreviewBtn: document.getElementById('zoomPreviewBtn'),
            resetPreviewBtn: document.getElementById('resetPreviewBtn'),
            sizeDisplay: document.getElementById('sizeDisplay'),
            canvasDimensions: document.getElementById('canvasDimensions'),
            platformName: document.getElementById('platformName'),
            totalImagesGenerated: document.getElementById('totalImagesGenerated'),
            totalDownloads: document.getElementById('totalDownloads'),
            successRateSim: document.getElementById('successRateSim'),
            simHistoryEmpty: document.getElementById('simHistoryEmpty'),
            simHistoryGrid: document.getElementById('simHistoryGrid'),
            clearSimHistoryBtn: document.getElementById('clearSimHistoryBtn'),
            toggleSimHistoryView: document.getElementById('toggleSimHistoryView'),
            canvasPlaceholder: document.getElementById('canvasPlaceholder')
        };
        
        this.ctx = this.elements.canvas.getContext('2d');
        this.state = {
            currentText: '',
            currentFont: 'bold',
            currentColor: '#25D366',
            currentOpacity: 1,
            currentSize: 'whatsapp',
            elements: [],
            isGenerating: false,
            isZoomed: false,
            stats: {
                imagesGenerated: 0,
                downloads: 0,
                failures: 0
            },
            history: [],
            fonts: {
                bold: { family: 'Arial Black, sans-serif', weight: '900' },
                clean: { family: 'Inter, sans-serif', weight: '500' },
                script: { family: 'Brush Script MT, cursive', weight: 'normal' },
                modern: { family: 'Segoe UI, sans-serif', weight: '600' },
                handwritten: { family: 'Comic Sans MS, cursive', weight: 'normal' }
            },
            sizes: {
                whatsapp: { width: 1080, height: 1920, name: 'WhatsApp Status', ratio: '9:16', platform: 'WhatsApp', icon: 'fab fa-whatsapp' },
                instagram: { width: 1080, height: 1080, name: 'Instagram Square', ratio: '1:1', platform: 'Instagram', icon: 'fab fa-instagram' },
                instagramStory: { width: 1080, height: 1920, name: 'Instagram Story', ratio: '9:16', platform: 'Instagram', icon: 'fas fa-mobile-alt' },
                youtubeThumb: { width: 1280, height: 720, name: 'YouTube Thumbnail', ratio: '16:9', platform: 'YouTube', icon: 'fab fa-youtube' },
                tiktok: { width: 1080, height: 1920, name: 'TikTok Video', ratio: '9:16', platform: 'TikTok', icon: 'fab fa-tiktok' },
                twitter: { width: 1200, height: 675, name: 'Twitter Post', ratio: '16:9', platform: 'Twitter', icon: 'fab fa-twitter' },
                facebook: { width: 1200, height: 630, name: 'Facebook Post', ratio: '1.91:1', platform: 'Facebook', icon: 'fab fa-facebook' },
                pinterest: { width: 1000, height: 1500, name: 'Pinterest Pin', ratio: '2:3', platform: 'Pinterest', icon: 'fab fa-pinterest' },
                linkedin: { width: 1200, height: 627, name: 'LinkedIn Post', ratio: '1.91:1', platform: 'LinkedIn', icon: 'fab fa-linkedin' },
                square: { width: 1080, height: 1080, name: 'Square', ratio: '1:1', platform: 'Square', icon: 'fas fa-square' },
                portrait: { width: 1080, height: 1350, name: 'Portrait', ratio: '4:5', platform: 'Portrait', icon: 'fas fa-portrait' },
                landscape: { width: 1920, height: 1080, name: 'Landscape', ratio: '16:9', platform: 'Landscape', icon: 'fas fa-desktop' }
            },
            colors: [
                { name: 'WhatsApp Green', value: '#25D366' },
                { name: 'Dark Mode', value: '#111B21' },
                { name: 'Premium Blue', value: '#0066CC' },
                { name: 'Vibrant Red', value: '#FF3B30' },
                { name: 'Sunset Orange', value: '#FF9500' },
                { name: 'Royal Purple', value: '#5856D6' },
                { name: 'Neon Pink', value: '#FF2D55' },
                { name: 'Minimal White', value: '#FFFFFF' },
                { name: 'Elegant Black', value: '#000000' },
                { name: 'Ocean Teal', value: '#5AC8FA' },
                { name: 'Lavender', value: '#AF52DE' },
                { name: 'Gold', value: '#FFCC00' }
            ],
            emojis: ['😊', '😂', '🥰', '😎', '🤩', '😍', '🙌', '🔥', '💯', '✨', '🌟', '🎉', '💪', '❤️', '👍', '👏'],
            stickers: []
        };
        
        this.canvasWidth = 1080;
        this.canvasHeight = 1920;
        this.currentImageData = null;
        this.imageGenerated = false;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initializing WhatsSIMPlus...');
        this.setupCanvas();
        this.loadFonts();
        this.loadStats();
        this.loadHistory();
        this.renderSizePresets();
        this.renderFontPresets();
        this.renderColorPresets();
        this.loadStickers();
        this.setupEventListeners();
        this.updateUI();
        
        // Initial placeholder state - make sure canvas is visible
        this.showCanvasPlaceholder(true);
        this.ensureCanvasVisible();
        
        console.log('✅ WhatsSIMPlus initialized successfully');
    }
    
    setupCanvas() {
        console.log('🎨 Setting up canvas...');
        // Set initial canvas dimensions
        this.updateCanvasSize('whatsapp');
        
        // Make sure canvas has proper styling
        this.ensureCanvasVisible();
        
        console.log('✅ Canvas setup complete');
    }
    
    ensureCanvasVisible() {
        // Force canvas to be visible and properly sized
        this.elements.canvas.style.display = 'block';
        this.elements.canvas.style.visibility = 'visible';
        this.elements.canvas.style.opacity = '1';
        this.elements.canvas.style.position = 'relative';
        this.elements.canvas.style.zIndex = '10';
        this.elements.canvas.style.background = '#FFFFFF';
        this.elements.canvas.style.borderRadius = '8px';
        this.elements.canvas.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        
        // Set canvas size for preview
        this.elements.canvas.style.width = '100%';
        this.elements.canvas.style.maxWidth = '300px';
        this.elements.canvas.style.height = 'auto';
        this.elements.canvas.style.maxHeight = '533px';
        
        console.log('✅ Canvas visibility ensured');
    }
    
    updateCanvasSize(sizeKey) {
        console.log(`📐 Updating canvas size to: ${sizeKey}`);
        const size = this.state.sizes[sizeKey];
        this.canvasWidth = size.width;
        this.canvasHeight = size.height;
        
        // Update canvas internal dimensions
        this.elements.canvas.width = this.canvasWidth;
        this.elements.canvas.height = this.canvasHeight;
        
        // Update display
        this.elements.sizeDisplay.textContent = `${size.width}×${size.height} (${size.ratio})`;
        this.elements.canvasDimensions.textContent = `${size.width}×${size.height}`;
        this.elements.platformName.textContent = size.platform;
        
        // Clear canvas with white background
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Reset state
        this.state.currentSize = sizeKey;
        this.state.elements = [];
        this.currentImageData = null;
        this.imageGenerated = false;
        
        // Show placeholder initially
        this.showCanvasPlaceholder(true);
        
        // Disable download buttons until new image is generated
        this.elements.downloadBtn.disabled = true;
        this.elements.shareBtn.disabled = true;
        this.elements.saveTemplateBtn.disabled = true;
        
        // Enable generate button if there's text
        this.updateGenerateButton();
        
        console.log(`✅ Canvas size updated to ${size.width}x${size.height}`);
    }
    
    loadFonts() {
        // Preload web fonts
        const fontStyles = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        `;
        
        const style = document.createElement('style');
        style.textContent = fontStyles;
        document.head.appendChild(style);
    }
    
    loadStats() {
        try {
            const savedStats = localStorage.getItem('whatssim_stats');
            if (savedStats) {
                this.state.stats = JSON.parse(savedStats);
            }
            this.updateStatsDisplay();
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    saveStats() {
        try {
            localStorage.setItem('whatssim_stats', JSON.stringify(this.state.stats));
            this.updateStatsDisplay();
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }
    
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('whatssim_history');
            if (savedHistory) {
                this.state.history = JSON.parse(savedHistory);
            }
            this.renderHistory();
        } catch (error) {
            console.error('Error loading history:', error);
        }
    }
    
    saveHistory() {
        try {
            // Limit history to 20 items
            if (this.state.history.length > 20) {
                this.state.history = this.state.history.slice(0, 20);
            }
            localStorage.setItem('whatssim_history', JSON.stringify(this.state.history));
            this.renderHistory();
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
    
    loadStickers() {
        // Create simple SVG stickers
        this.state.stickers = [
            this.createStarSticker(),
            this.createHeartSticker(),
            this.createCheckSticker(),
            this.createFireSticker(),
            this.createSparkleSticker(),
            this.createCrownSticker()
        ];
    }
    
    createStarSticker() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FFCC00';
        ctx.beginPath();
        for(let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
            
            const innerAngle = angle + Math.PI / 5;
            const innerX = 50 + 15 * Math.cos(innerAngle);
            const innerY = 50 + 15 * Math.sin(innerAngle);
            ctx.lineTo(innerX, innerY);
        }
        ctx.closePath();
        ctx.fill();
        
        return canvas.toDataURL('image/png');
    }
    
    createHeartSticker() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FF2D55';
        ctx.beginPath();
        ctx.moveTo(50, 90);
        ctx.bezierCurveTo(20, 70, 10, 40, 30, 25);
        ctx.bezierCurveTo(40, 15, 60, 15, 70, 25);
        ctx.bezierCurveTo(90, 40, 80, 70, 50, 90);
        ctx.closePath();
        ctx.fill();
        
        return canvas.toDataURL('image/png');
    }
    
    createCheckSticker() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#25D366';
        ctx.beginPath();
        ctx.arc(50, 50, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(30, 50);
        ctx.lineTo(45, 65);
        ctx.lineTo(70, 35);
        ctx.stroke();
        
        return canvas.toDataURL('image/png');
    }
    
    createFireSticker() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(50, 50, 0, 50, 50, 40);
        gradient.addColorStop(0, '#FF9500');
        gradient.addColorStop(1, '#FF3B30');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.bezierCurveTo(30, 40, 40, 70, 50, 90);
        ctx.bezierCurveTo(60, 70, 70, 40, 50, 20);
        ctx.closePath();
        ctx.fill();
        
        return canvas.toDataURL('image/png');
    }
    
    createSparkleSticker() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#5AC8FA';
        for(let i = 0; i < 8; i++) {
            const angle = (i * Math.PI * 2) / 8;
            const x = 50 + 30 * Math.cos(angle);
            const y = 50 + 30 * Math.sin(angle);
            
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(50, 50, 15, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas.toDataURL('image/png');
    }
    
    createCrownSticker() {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#FFCC00';
        // Crown base
        ctx.fillRect(20, 60, 60, 20);
        
        // Crown points
        const points = [25, 45, 65, 20, 75];
        for(let i = 0; i < points.length; i++) {
            const x = 20 + i * 15;
            ctx.beginPath();
            ctx.moveTo(x, 60);
            ctx.lineTo(x + 7.5, points[i]);
            ctx.lineTo(x + 15, 60);
            ctx.closePath();
            ctx.fill();
        }
        
        // Jewels
        ctx.fillStyle = '#AF52DE';
        ctx.beginPath();
        ctx.arc(50, 40, 8, 0, Math.PI * 2);
        ctx.fill();
        
        return canvas.toDataURL('image/png');
    }
    
    renderSizePresets() {
        const sizes = Object.entries(this.state.sizes).map(([key, size]) => ({
            key,
            name: size.name,
            dimensions: `${size.width}×${size.height}`,
            ratio: size.ratio,
            icon: size.icon
        }));
        
        this.elements.sizePresets.innerHTML = sizes.map(size => `
            <div class="size-preset ${size.key === this.state.currentSize ? 'active' : ''}" 
                 data-size="${size.key}">
                <div class="size-preset-icon">
                    <i class="${size.icon}"></i>
                </div>
                <div>${size.name}</div>
                <small>${size.dimensions}</small>
            </div>
        `).join('');
    }
    
    renderFontPresets() {
        const fonts = [
            { id: 'bold', name: 'Bold / Motivational', icon: 'fas fa-bold' },
            { id: 'clean', name: 'Clean / Business', icon: 'fas fa-briefcase' },
            { id: 'script', name: 'Script / Love', icon: 'fas fa-heart' },
            { id: 'modern', name: 'Modern / Tech', icon: 'fas fa-laptop-code' },
            { id: 'handwritten', name: 'Handwritten / Casual', icon: 'fas fa-pen' }
        ];
        
        this.elements.fontPresets.innerHTML = fonts.map(font => `
            <div class="font-preset ${font.id === this.state.currentFont ? 'active' : ''}" 
                 data-font="${font.id}">
                <i class="${font.icon}"></i>
                <div>${font.name}</div>
            </div>
        `).join('');
    }
    
    renderColorPresets() {
        this.elements.colorPresets.innerHTML = this.state.colors.map((color, index) => `
            <div class="color-preset ${color.value === this.state.currentColor ? 'active' : ''}" 
                 style="background-color: ${color.value}"
                 data-color="${color.value}"
                 title="${color.name}"></div>
        `).join('');
    }
    
    setupEventListeners() {
        console.log('🔗 Setting up event listeners...');
        
        // Text input
        this.elements.textInput.addEventListener('input', (e) => {
            this.state.currentText = e.target.value;
            this.updateCharCounter();
            this.updateGenerateButton();
        });
        
        // Char counter
        this.updateCharCounter();
        
        // Size selection
        this.elements.sizePresets.addEventListener('click', (e) => {
            const sizePreset = e.target.closest('.size-preset');
            if (sizePreset) {
                const sizeKey = sizePreset.dataset.size;
                
                // Update active state
                document.querySelectorAll('.size-preset').forEach(sp => {
                    sp.classList.remove('active');
                });
                sizePreset.classList.add('active');
                
                this.updateCanvasSize(sizeKey);
            }
        });
        
        // Font selection
        this.elements.fontPresets.addEventListener('click', (e) => {
            const fontPreset = e.target.closest('.font-preset');
            if (fontPreset) {
                const fontId = fontPreset.dataset.font;
                this.state.currentFont = fontId;
                
                // Update active state
                document.querySelectorAll('.font-preset').forEach(fp => {
                    fp.classList.remove('active');
                });
                fontPreset.classList.add('active');
            }
        });
        
        // Color selection
        this.elements.colorPresets.addEventListener('click', (e) => {
            const colorPreset = e.target.closest('.color-preset');
            if (colorPreset) {
                const color = colorPreset.dataset.color;
                this.state.currentColor = color;
                
                // Update active state
                document.querySelectorAll('.color-preset').forEach(cp => {
                    cp.classList.remove('active');
                });
                colorPreset.classList.add('active');
            }
        });
        
        // Custom color
        this.elements.applyCustomColor.addEventListener('click', () => {
            this.state.currentColor = this.elements.customColorPicker.value;
            this.renderColorPresets();
        });
        
        // Toggles
        this.elements.textShadowToggle.addEventListener('change', () => {});
        this.elements.watermarkToggle.addEventListener('change', () => {});
        this.elements.safeAreaToggle.addEventListener('change', () => {
            const overlay = document.getElementById('safeAreaOverlay');
            if (overlay) {
                overlay.style.display = this.elements.safeAreaToggle.checked ? 'block' : 'none';
            }
        });
        this.elements.autoResizeToggle.addEventListener('change', () => {});
        
        // Opacity slider
        this.elements.opacitySlider.addEventListener('input', (e) => {
            const value = e.target.value;
            this.state.currentOpacity = value / 100;
            this.elements.opacityValue.textContent = `${value}%`;
        });
        
        // Generate button - FIXED with direct function call
        this.elements.generateImageBtn.addEventListener('click', (e) => {
            console.log('🖱️ Generate button clicked!');
            e.preventDefault();
            e.stopPropagation();
            
            // Direct call to generate function
            this.handleGenerateClick();
        });
        
        // Download button
        this.elements.downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.downloadImage();
        });
        
        // Share button
        this.elements.shareBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.shareImage();
        });
        
        // Save template button
        this.elements.saveTemplateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.saveTemplate();
        });
        
        // Zoom preview
        this.elements.zoomPreviewBtn.addEventListener('click', () => this.toggleZoom());
        
        // Reset preview
        this.elements.resetPreviewBtn.addEventListener('click', () => this.resetCanvas());
        
        // Clear history
        this.elements.clearSimHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Toggle history view
        this.elements.toggleSimHistoryView.addEventListener('click', () => this.toggleHistoryView());
        
        // Emoji tabs
        document.querySelectorAll('.emoji-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = tab.dataset.category;
                
                // Update active tab
                document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                this.renderEmojiCategory(category);
            });
        });
        
        // Initial emoji category
        this.renderEmojiCategory('emojis');
        
        console.log('✅ Event listeners setup complete');
    }
    
    renderEmojiCategory(category) {
        let html = '';
        
        if (category === 'emojis') {
            this.state.emojis.forEach(emoji => {
                html += `<div class="emoji-item" data-emoji="${emoji}">${emoji}</div>`;
            });
        } else if (category === 'stickers') {
            this.state.stickers.forEach((sticker, index) => {
                html += `
                    <img src="${sticker}" 
                         class="sticker-item" 
                         alt="Sticker ${index + 1}"
                         data-sticker="${sticker}">
                `;
            });
        } else if (category === 'shapes') {
            const shapes = ['●', '■', '▲', '◆', '★', '☀'];
            shapes.forEach(shape => {
                html += `<div class="emoji-item" data-shape="${shape}">${shape}</div>`;
            });
        }
        
        this.elements.emojiContainer.innerHTML = html;
        
        // Add emoji event listeners
        this.addEmojiEventListeners();
    }
    
    addEmojiEventListeners() {
        const emojiItems = this.elements.emojiContainer.querySelectorAll('.emoji-item, .sticker-item');
        emojiItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!this.imageGenerated) {
                    this.showToast('Generate Image First', 'Please generate an image before adding emojis', 'warning');
                    return;
                }
                
                if (item.classList.contains('emoji-item')) {
                    const emoji = item.dataset.emoji || item.dataset.shape;
                    this.addElementToCanvas('emoji', emoji);
                } else if (item.classList.contains('sticker-item')) {
                    const sticker = item.dataset.sticker;
                    this.addElementToCanvas('sticker', sticker);
                }
            });
        });
    }
    
    addElementToCanvas(type, content) {
        if (!this.imageGenerated) return;
        
        const element = {
            id: Date.now() + Math.random(),
            type: type,
            content: content,
            x: this.canvasWidth / 2,
            y: this.canvasHeight / 2,
            fontSize: type === 'emoji' ? 80 : 100,
            rotation: 0
        };
        
        this.state.elements.push(element);
        this.renderCanvasFromData();
    }
    
    updateCharCounter() {
        const length = this.state.currentText.length;
        this.elements.charCounter.textContent = `${length}/500`;
        
        // Update color based on length
        if (length > 400) {
            this.elements.charCounter.style.color = '#FF3B30';
        } else if (length > 300) {
            this.elements.charCounter.style.color = '#FF9500';
        } else {
            this.elements.charCounter.style.color = 'var(--text-tertiary)';
        }
    }
    
    updateGenerateButton() {
        const hasContent = this.state.currentText.trim().length > 0;
        this.elements.generateImageBtn.disabled = !hasContent;
        
        if (!hasContent) {
            this.elements.generateImageBtn.classList.add('disabled-state');
        } else {
            this.elements.generateImageBtn.classList.remove('disabled-state');
        }
    }
    
    // New direct handler for generate button
    handleGenerateClick() {
        console.log('🔧 Direct handleGenerateClick called');
        this.generateImage();
    }
    
    async generateImage() {
        console.log('🎨 === STARTING IMAGE GENERATION ===');
        
        if (this.state.isGenerating) {
            console.log('⏳ Already generating, returning');
            return;
        }
        
        if (!this.state.currentText.trim()) {
            this.showToast('Enter Text', 'Please enter some text first', 'warning');
            return;
        }
        
        this.state.isGenerating = true;
        this.elements.generateImageBtn.classList.add('loading');
        this.elements.generateImageBtn.disabled = true;
        
        console.log('⚙️ Generating image with settings:', {
            text: this.state.currentText.substring(0, 50) + '...',
            font: this.state.currentFont,
            color: this.state.currentColor,
            size: this.state.currentSize,
            canvasWidth: this.canvasWidth,
            canvasHeight: this.canvasHeight
        });
        
        try {
            // FIRST: Hide placeholder BEFORE drawing
            this.showCanvasPlaceholder(false);
            
            // Ensure canvas is visible
            this.ensureCanvasVisible();
            
            // Clear canvas with white background
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            
            // Draw background
            this.drawBackground();
            
            // Draw text
            this.drawText();
            
            // Draw watermark if enabled
            if (this.elements.watermarkToggle.checked) {
                this.drawWatermark();
            }
            
            // Draw elements (emojis, stickers)
            this.drawElements();
            
            // Force immediate canvas update
            this.forceCanvasUpdate();
            
            // Get the image data
            this.currentImageData = this.elements.canvas.toDataURL('image/png', 1.0);
            this.imageGenerated = true;
            
            console.log('✅ Image generated successfully!');
            
            // Enable download buttons
            this.elements.downloadBtn.disabled = false;
            this.elements.shareBtn.disabled = false;
            this.elements.saveTemplateBtn.disabled = false;
            
            // Update stats
            this.state.stats.imagesGenerated++;
            this.saveStats();
            
            // Save to history
            await this.saveToHistory(this.currentImageData);
            
            // Show success message
            this.showToast('🎉 Image Generated!', 'Your image is ready to download!', 'success');
            
            // Trigger WhatsApp follow popup
            this.triggerFollowPopup();
            
            console.log('✅ === IMAGE GENERATION COMPLETE ===');
            
        } catch (error) {
            console.error('❌ Error generating image:', error);
            this.state.stats.failures++;
            this.showToast('Generation Failed', 'Please try again', 'error');
        } finally {
            this.state.isGenerating = false;
            this.elements.generateImageBtn.classList.remove('loading');
            this.updateGenerateButton();
        }
    }
    
    // NEW: Force canvas update immediately
    forceCanvasUpdate() {
        console.log('🔄 Forcing canvas update...');
        
        // Method 1: Get image data and put it back
        try {
            const imageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.putImageData(imageData, 0, 0);
        } catch (e) {
            console.log('Using alternative canvas update method');
        }
        
        // Method 2: Force style changes
        this.elements.canvas.style.transform = 'translateZ(0)';
        
        // Method 3: Trigger a small animation
        this.elements.canvas.classList.add('canvas-updated');
        setTimeout(() => {
            this.elements.canvas.classList.remove('canvas-updated');
        }, 100);
        
        // Method 4: Draw a tiny invisible pixel to force redraw
        const currentFill = this.ctx.fillStyle;
        this.ctx.fillStyle = 'transparent';
        this.ctx.fillRect(0, 0, 1, 1);
        this.ctx.fillStyle = currentFill;
        
        console.log('✅ Canvas update forced');
    }
    
    drawBackground() {
        console.log('🎨 Drawing background...');
        
        // Create gradient based on selected color
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Adjust gradient based on color brightness
        const rgb = this.hexToRgb(this.state.currentColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        
        if (brightness > 128) {
            // Light color, make gradient slightly darker
            gradient.addColorStop(0, this.state.currentColor);
            gradient.addColorStop(1, this.adjustColor(this.state.currentColor, -20));
        } else {
            // Dark color, make gradient slightly lighter
            gradient.addColorStop(0, this.adjustColor(this.state.currentColor, 20));
            gradient.addColorStop(1, this.state.currentColor);
        }
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        console.log('✅ Background drawn');
    }
    
    drawText() {
        console.log('📝 Drawing text...');
        
        const fontConfig = this.state.fonts[this.state.currentFont];
        const fontSize = this.calculateOptimalFontSize();
        const lines = this.wrapText(this.state.currentText, this.canvasWidth - 200);
        
        console.log('📊 Font settings:', { font: fontConfig.family, fontSize, linesCount: lines.length });
        
        // Set font
        this.ctx.font = `${fontConfig.weight} ${fontSize}px ${fontConfig.family}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = this.getTextColor();
        
        // Apply opacity
        this.ctx.globalAlpha = this.state.currentOpacity;
        
        // Apply text shadow if enabled
        if (this.elements.textShadowToggle.checked) {
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }
        
        // Calculate total height and starting position
        const totalHeight = lines.length * fontSize * 1.2;
        const startY = (this.canvasHeight - totalHeight) / 2;
        
        // Draw each line
        lines.forEach((line, index) => {
            const y = startY + (index * fontSize * 1.2) + (fontSize / 2);
            this.ctx.fillText(line, this.canvasWidth / 2, y);
        });
        
        // Reset shadow and opacity
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.globalAlpha = 1;
        
        console.log('✅ Text drawn');
    }
    
    drawWatermark() {
        console.log('💧 Drawing watermark...');
        
        // Enhanced watermark with better visibility
        this.ctx.font = '600 36px Inter, sans-serif';
        
        // Add background for better visibility
        const text = 'WhatsHUB+';
        const metrics = this.ctx.measureText(text);
        const x = this.canvasWidth - 30;
        const y = this.canvasHeight - 30;
        const padding = 12;
        
        // Draw background
        this.ctx.fillStyle = 'rgba(37, 211, 102, 0.9)';
        this.ctx.fillRect(
            x - metrics.width - padding, 
            y - 30 - padding, 
            metrics.width + padding * 2, 
            40 + padding * 2
        );
        
        // Draw text
        this.ctx.fillStyle = 'white';
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText(text, x, y);
        
        // Add subtle border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            x - metrics.width - padding, 
            y - 30 - padding, 
            metrics.width + padding * 2, 
            40 + padding * 2
        );
        
        console.log('✅ Watermark drawn');
    }
    
    drawElements() {
        if (this.state.elements.length === 0) return;
        
        console.log('🎭 Drawing elements:', this.state.elements.length);
        
        this.state.elements.forEach((element, index) => {
            this.ctx.save();
            this.ctx.translate(element.x, element.y);
            this.ctx.rotate(element.rotation * Math.PI / 180);
            
            if (element.type === 'emoji') {
                // Draw emoji
                this.ctx.font = `${element.fontSize}px Arial, sans-serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(element.content, 0, 0);
            } else if (element.type === 'sticker') {
                // Draw sticker
                const img = new Image();
                img.src = element.content;
                const size = element.fontSize;
                
                // Draw if image is already loaded
                if (img.complete) {
                    this.ctx.drawImage(img, -size/2, -size/2, size, size);
                } else {
                    // Wait for image to load
                    img.onload = () => {
                        this.ctx.drawImage(img, -size/2, -size/2, size, size);
                    };
                }
            }
            
            this.ctx.restore();
        });
        
        console.log('✅ Elements drawn');
    }
    
    renderCanvasFromData() {
        if (!this.currentImageData) {
            console.log('⚠️ No image data to render');
            return;
        }
        
        console.log('🔄 Rendering canvas from saved data');
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        
        // Draw saved image
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
            
            // Draw elements
            this.drawElements();
            
            console.log('✅ Canvas rendered from saved data');
        };
        img.onerror = (error) => {
            console.error('❌ Error loading image:', error);
        };
        img.src = this.currentImageData;
    }
    
    calculateOptimalFontSize() {
        const text = this.state.currentText;
        const maxWidth = this.canvasWidth - 200;
        const maxHeight = this.canvasHeight - 400;
        
        if (!text.trim()) return 60;
        
        // Start with a large font size
        let fontSize = 120;
        const fontConfig = this.state.fonts[this.state.currentFont];
        
        // Reduce font size until text fits
        while (fontSize > 24) {
            this.ctx.font = `${fontConfig.weight} ${fontSize}px ${fontConfig.family}`;
            
            // Split text into lines
            const words = text.split(' ');
            const lines = [];
            let currentLine = words[0] || '';
            
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = this.ctx.measureText(currentLine + ' ' + word).width;
                if (width < maxWidth) {
                    currentLine += ' ' + word;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            
            // Check if text fits vertically
            const totalHeight = lines.length * fontSize * 1.2;
            if (totalHeight <= maxHeight) {
                break;
            }
            
            fontSize -= 4;
        }
        
        // Apply auto resize toggle
        if (!this.elements.autoResizeToggle.checked) {
            fontSize = Math.min(fontSize, 80);
        }
        
        // Ensure minimum font size
        return Math.max(fontSize, 24);
    }
    
    wrapText(text, maxWidth) {
        if (!text.trim()) return [];
        
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0] || '';
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const fontConfig = this.state.fonts[this.state.currentFont];
            this.ctx.font = `${fontConfig.weight} 80px ${fontConfig.family}`;
            const width = this.ctx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        
        return lines;
    }
    
    getTextColor() {
        // Determine text color based on background brightness
        const rgb = this.hexToRgb(this.state.currentColor);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        
        return brightness > 128 ? '#000000' : '#FFFFFF';
    }
    
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }
    
    adjustColor(color, amount) {
        const rgb = this.hexToRgb(color);
        
        rgb.r = Math.min(255, Math.max(0, rgb.r + amount));
        rgb.g = Math.min(255, Math.max(0, rgb.g + amount));
        rgb.b = Math.min(255, Math.max(0, rgb.b + amount));
        
        return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    
    showCanvasPlaceholder(show) {
        if (this.elements.canvasPlaceholder) {
            if (show) {
                // Show placeholder, hide canvas
                this.elements.canvasPlaceholder.style.display = 'flex';
                this.elements.canvas.style.display = 'none';
                this.elements.canvas.style.visibility = 'hidden';
            } else {
                // Hide placeholder, show canvas
                this.elements.canvasPlaceholder.style.display = 'none';
                this.elements.canvas.style.display = 'block';
                this.elements.canvas.style.visibility = 'visible';
                
                // Force canvas to be on top
                this.elements.canvas.style.zIndex = '100';
                this.elements.canvas.style.position = 'relative';
            }
        }
    }
    
    async downloadImage() {
        if (!this.currentImageData || !this.imageGenerated) {
            this.showToast('No Image', 'Please generate an image first', 'warning');
            return;
        }
        
        try {
            const format = document.querySelector('input[name="exportFormat"]:checked').value;
            const size = this.state.sizes[this.state.currentSize];
            const timestamp = new Date().toISOString().split('T')[0];
            const filename = `${size.platform.toLowerCase()}-image-${timestamp}.${format}`;
            
            // Convert data URL to blob
            const blob = this.dataURLtoBlob(this.currentImageData);
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            // Update stats
            this.state.stats.downloads++;
            this.saveStats();
            
            this.showToast('✅ Download Started', `Image saved as ${filename}`, 'success');
            
        } catch (error) {
            console.error('Error downloading image:', error);
            this.showToast('Download Failed', 'Please try again', 'error');
        }
    }
    
    dataURLtoBlob(dataUrl) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new Blob([u8arr], { type: mime });
    }
    
    async shareImage() {
        if (!this.currentImageData || !this.imageGenerated) {
            this.showToast('No Image', 'Please generate an image first', 'warning');
            return;
        }
        
        try {
            if (navigator.share) {
                const blob = this.dataURLtoBlob(this.currentImageData);
                const file = new File([blob], 'whatsapp-status.png', { type: 'image/png' });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'WhatsApp Status Image',
                        text: 'Created with WhatsS.I.M+'
                    });
                } else {
                    await navigator.share({
                        title: 'WhatsApp Status Image',
                        text: 'Created with WhatsS.I.M+'
                    });
                }
            } else {
                // Fallback: Copy data URL to clipboard
                await navigator.clipboard.writeText(this.currentImageData);
                this.showToast('📋 Copied!', 'Image URL copied to clipboard', 'info');
            }
        } catch (error) {
            console.error('Error sharing image:', error);
            this.showToast('Share Failed', 'Please try downloading instead', 'error');
        }
    }
    
    saveTemplate() {
        if (!this.currentImageData || !this.imageGenerated) {
            this.showToast('No Image', 'Please generate an image first', 'warning');
            return;
        }
        
        const template = {
            id: Date.now(),
            text: this.state.currentText,
            font: this.state.currentFont,
            color: this.state.currentColor,
            size: this.state.currentSize,
            elements: [...this.state.elements],
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        try {
            const templates = JSON.parse(localStorage.getItem('whatssim_templates') || '[]');
            templates.unshift(template);
            if (templates.length > 10) templates.pop();
            localStorage.setItem('whatssim_templates', JSON.stringify(templates));
            
            this.showToast('💾 Template Saved', 'Template saved for future use', 'success');
        } catch (error) {
            console.error('Error saving template:', error);
            this.showToast('Save Failed', 'Could not save template', 'error');
        }
    }
    
    async saveToHistory(dataUrl) {
        try {
            const historyItem = {
                id: Date.now(),
                thumbnail: await this.createThumbnail(dataUrl),
                dataUrl: dataUrl,
                title: this.state.currentText.substring(0, 30) + (this.state.currentText.length > 30 ? '...' : ''),
                size: this.state.currentSize,
                timestamp: new Date().toISOString()
            };
            
            this.state.history.unshift(historyItem);
            this.saveHistory();
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    }
    
    createThumbnail(dataUrl) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            canvas.width = 200;
            canvas.height = 355; // Maintain 9:16 aspect ratio
            
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                try {
                    // Draw image scaled down
                    ctx.drawImage(img, 0, 0, 200, 355);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                } catch (error) {
                    reject(error);
                }
            };
            
            img.onerror = reject;
            img.src = dataUrl;
        });
    }
    
    renderHistory() {
        if (this.state.history.length === 0) {
            this.elements.simHistoryEmpty.style.display = 'flex';
            this.elements.simHistoryGrid.style.display = 'none';
            return;
        }
        
        this.elements.simHistoryEmpty.style.display = 'none';
        this.elements.simHistoryGrid.style.display = 'grid';
        
        this.elements.simHistoryGrid.innerHTML = this.state.history.map(item => {
            const size = this.state.sizes[item.size];
            return `
                <div class="history-item-sim" data-id="${item.id}">
                    <img src="${item.thumbnail || item.dataUrl}" alt="History item" loading="lazy">
                    <div class="history-item-overlay-sim">
                        <div class="history-title">${item.title}</div>
                        <div class="history-time-sim">${this.formatTime(item.timestamp)}</div>
                        <small>${size.name}</small>
                        <div class="history-actions">
                            <button class="btn-history-download" data-id="${item.id}" title="Download">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="btn-history-delete" data-id="${item.id}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        this.addHistoryEventListeners();
    }
    
    addHistoryEventListeners() {
        // History item click
        const historyItems = this.elements.simHistoryGrid.querySelectorAll('.history-item-sim');
        historyItems.forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.history-actions')) {
                    const id = item.dataset.id;
                    this.loadFromHistory(id);
                }
            });
        });
        
        // Download button
        const downloadBtns = this.elements.simHistoryGrid.querySelectorAll('.btn-history-download');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                this.downloadFromHistory(id);
            });
        });
        
        // Delete button
        const deleteBtns = this.elements.simHistoryGrid.querySelectorAll('.btn-history-delete');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                this.deleteFromHistory(id);
            });
        });
    }
    
    loadFromHistory(id) {
        const item = this.state.history.find(h => h.id == id);
        if (item) {
            // Update canvas size if needed
            if (item.size !== this.state.currentSize) {
                this.updateCanvasSize(item.size);
            }
            
            // Load image data
            this.currentImageData = item.dataUrl;
            this.imageGenerated = true;
            
            const img = new Image();
            img.onload = () => {
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
                
                // Hide placeholder and show canvas
                this.showCanvasPlaceholder(false);
                
                // Enable download buttons
                this.elements.downloadBtn.disabled = false;
                this.elements.shareBtn.disabled = false;
                this.elements.saveTemplateBtn.disabled = false;
                
                this.showToast('📁 Loaded from History', 'Image loaded successfully', 'info');
            };
            img.src = item.dataUrl;
        }
    }
    
    async downloadFromHistory(id) {
        const item = this.state.history.find(h => h.id == id);
        if (item) {
            const a = document.createElement('a');
            a.href = item.dataUrl;
            a.download = `whatsapp-status-${item.id}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Update stats
            this.state.stats.downloads++;
            this.saveStats();
            
            this.showToast('✅ Downloaded', 'Image downloaded from history', 'success');
        }
    }
    
    deleteFromHistory(id) {
        if (confirm('Delete this history item?')) {
            this.state.history = this.state.history.filter(h => h.id != id);
            this.saveHistory();
            this.showToast('🗑️ Deleted', 'History item removed', 'success');
        }
    }
    
    clearHistory() {
        if (this.state.history.length === 0) return;
        
        if (confirm('Clear all history?')) {
            this.state.history = [];
            this.saveHistory();
            this.showToast('🧹 History Cleared', 'All history items removed', 'success');
        }
    }
    
    toggleHistoryView() {
        const grid = this.elements.simHistoryGrid;
        if (grid.classList.contains('history-list-view')) {
            grid.classList.remove('history-list-view');
            grid.classList.add('history-grid-view');
            this.elements.toggleSimHistoryView.innerHTML = '<i class="fas fa-th"></i>';
        } else {
            grid.classList.remove('history-grid-view');
            grid.classList.add('history-list-view');
            this.elements.toggleSimHistoryView.innerHTML = '<i class="fas fa-list"></i>';
        }
    }
    
    toggleZoom() {
        const canvas = this.elements.canvas;
        
        if (this.state.isZoomed) {
            // Reset zoom
            canvas.classList.remove('zoomed');
            canvas.style.maxWidth = '300px';
            canvas.style.maxHeight = '533px';
            canvas.style.cursor = 'default';
            this.state.isZoomed = false;
            this.elements.zoomPreviewBtn.innerHTML = '<i class="fas fa-search-plus"></i>';
        } else {
            // Zoom in
            canvas.classList.add('zoomed');
            canvas.style.maxWidth = '100%';
            canvas.style.maxHeight = '100%';
            canvas.style.cursor = 'grab';
            this.state.isZoomed = true;
            this.elements.zoomPreviewBtn.innerHTML = '<i class="fas fa-search-minus"></i>';
        }
    }
    
    resetCanvas() {
        if (confirm('Reset canvas? This will clear all elements and settings.')) {
            this.state.currentText = '';
            this.elements.textInput.value = '';
            this.state.elements = [];
            this.state.currentColor = '#25D366';
            this.state.currentFont = 'bold';
            this.state.currentOpacity = 1;
            
            this.elements.customColorPicker.value = '#25D366';
            this.elements.opacitySlider.value = 100;
            this.elements.opacityValue.textContent = '100%';
            this.elements.textShadowToggle.checked = true;
            this.elements.watermarkToggle.checked = true;
            this.elements.safeAreaToggle.checked = false;
            this.elements.autoResizeToggle.checked = true;
            
            this.renderFontPresets();
            this.renderColorPresets();
            this.updateCharCounter();
            
            // Clear canvas and show placeholder
            this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.currentImageData = null;
            this.imageGenerated = false;
            this.showCanvasPlaceholder(true);
            
            // Disable buttons
            this.elements.downloadBtn.disabled = true;
            this.elements.shareBtn.disabled = true;
            this.elements.saveTemplateBtn.disabled = true;
            
            // Update generate button
            this.updateGenerateButton();
            
            this.showToast('🔄 Canvas Reset', 'All settings cleared', 'info');
        }
    }
    
    formatTime(timestamp) {
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
    
    updateStatsDisplay() {
        this.elements.totalImagesGenerated.textContent = this.state.stats.imagesGenerated;
        this.elements.totalDownloads.textContent = this.state.stats.downloads;
        
        const total = this.state.stats.imagesGenerated + this.state.stats.failures;
        const successRate = total > 0 
            ? Math.round((this.state.stats.imagesGenerated / total) * 100)
            : 100;
        this.elements.successRateSim.textContent = `${successRate}%`;
    }
    
    updateUI() {
        this.updateGenerateButton();
    }
    
    showToast(title, message, type = 'info') {
        // Reuse existing toast system from main app
        if (window.whatsDPApp && window.whatsDPApp.showToast) {
            window.whatsDPApp.showToast(title, message, type);
        } else {
            // Fallback toast
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
            `;
            
            const container = document.getElementById('toastContainer') || document.body;
            container.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 3000);
        }
    }
    
    triggerFollowPopup() {
        // Reuse existing follow popup from main app
        if (window.whatsDPApp && window.whatsDPApp.openFollowPopup) {
            setTimeout(() => {
                window.whatsDPApp.openFollowPopup();
            }, 1500);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== WHATSSIM+ LOADING ===');
    try {
        window.whatsSIMApp = new WhatsSIMPlus();
        console.log('=== WHATSSIM+ LOADED SUCCESSFULLY ===');
        
        // Test if elements are properly accessible
        console.log('Canvas element:', document.getElementById('simCanvas'));
        console.log('Generate button:', document.getElementById('generateImageBtn'));
        console.log('Canvas placeholder:', document.getElementById('canvasPlaceholder'));
        
    } catch (error) {
        console.error('❌ Error initializing WhatsSIMPlus:', error);
    }
});

// Add CSS for canvas update animation
const style = document.createElement('style');
style.textContent = `
    .canvas-updated {
        animation: canvasUpdate 0.3s ease;
    }
    
    @keyframes canvasUpdate {
        0% { opacity: 0.9; transform: scale(0.99); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    #simCanvas {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);