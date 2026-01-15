/**
 * WalinkGO - Premium WhatsApp Link Generator
 * Integration for WhatsApp DP Fetcher
 * @version 1.1.0
 */

class WalinkGO {
    constructor() {
        this.namespace = 'walinkgo_';
        this.elements = {};
        this.state = {
            selectedCountry: null,
            generatedLink: null,
            qrCode: null,
            stats: {
                totalLinks: 0,
                linksCopied: 0,
                failedGenerations: 0,
                lastGenerated: null
            },
            history: [],
            isGenerating: false,
            currentHistoryView: 'list' // 'list' or 'grid'
        };
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.setupCountrySelector();
        this.loadStats();
        this.loadHistory();
        this.setupEventListeners();
        this.updateStatsDisplay();
        this.renderHistory();
        this.setupResponsiveBehavior();
    }
    
    cacheElements() {
        const ids = [
            'walinkNumber', 'walinkMessage', 'generateLinkBtn', 'walinkOutput',
            'copyLinkBtn', 'shareLinkBtn', 'downloadQRBtn', 'clearWalinkHistoryBtn',
            'walinkHistoryEmpty', 'walinkHistoryList', 'messageCounter',
            'linkPreview', 'generatedLink', 'outputTime', 'qrCanvas',
            'qrImage', 'qrPlaceholder', 'qrSection', 'totalLinks',
            'linksCopied', 'successRate', 'walinkCountrySelector',
            'testLinkBtn', 'newLinkBtn', 'saveToHistoryBtn', 'shareQRBtn',
            'toggleHistoryView'
        ];
        
        ids.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
    }
    
    setupCountrySelector() {
        const dpCountrySelector = document.querySelector('.country-selector-trigger');
        if (dpCountrySelector) {
            const clone = dpCountrySelector.cloneNode(true);
            clone.id = 'walinkCountryTrigger';
            
            // Update click handler
            clone.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openCountrySelector();
            });
            
            this.elements.walinkCountrySelector.innerHTML = '';
            this.elements.walinkCountrySelector.appendChild(clone);
            
            // Get selected country from main app or localStorage
            this.loadSelectedCountry();
            this.updateCountryDisplay();
        } else {
            this.createFallbackCountrySelector();
        }
    }
    
    loadSelectedCountry() {
        // Try to get from main app first
        if (window.whatsDPApp && window.whatsDPApp.state && window.whatsDPApp.state.selectedCountry) {
            this.state.selectedCountry = window.whatsDPApp.state.selectedCountry;
        } else {
            // Try localStorage
            const savedCountry = localStorage.getItem('whatsdp_selected_country');
            if (savedCountry) {
                this.state.selectedCountry = JSON.parse(savedCountry);
            } else {
                // Default to Ghana
                this.state.selectedCountry = { name: 'Ghana', code: '233', flag: '🇬🇭', isDefault: true };
            }
        }
    }
    
    openCountrySelector() {
        const countryModal = document.getElementById('countryModal');
        if (countryModal) {
            countryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Store current context to know we're selecting for WalinkGO
            countryModal.dataset.context = 'walinkgo';
            
            // Add event listener for country selection
            const handleCountrySelection = (e) => {
                const countryItem = e.target.closest('.country-item');
                if (countryItem && countryModal.dataset.context === 'walinkgo') {
                    const code = countryItem.dataset.code;
                    this.selectCountry(code);
                    countryModal.classList.remove('active');
                    document.body.style.overflow = '';
                    countryModal.removeEventListener('click', handleCountrySelection);
                }
            };
            
            countryModal.addEventListener('click', handleCountrySelection);
            
            // Close modal when clicking overlay or close button
            const closeModal = () => {
                countryModal.classList.remove('active');
                document.body.style.overflow = '';
                countryModal.removeEventListener('click', handleCountrySelection);
                delete countryModal.dataset.context;
            };
            
            const overlay = document.getElementById('countryModalOverlay');
            const closeBtn = document.getElementById('countryModalClose');
            
            overlay.addEventListener('click', closeModal);
            closeBtn.addEventListener('click', closeModal);
        }
    }
    
    selectCountry(code) {
        const allCountries = this.getAllCountries();
        const country = allCountries.find(c => c.code === code);
        
        if (country) {
            this.state.selectedCountry = country;
            this.updateCountryDisplay();
            this.validateInput();
            this.saveSelectedCountry();
        }
    }
    
    getAllCountries() {
        try {
            if (window.whatsDPApp?.state?.countries) {
                const defaultCountries = window.whatsDPApp.state.countries;
                const customCountries = window.whatsDPApp.state.customCountries || [];
                return [...defaultCountries, ...customCountries];
            }
        } catch (error) {
            console.log('Could not get countries from main app, using defaults');
        }
        
        return [
            { name: 'Ghana', code: '233', flag: '🇬🇭', isDefault: true },
            { name: 'Nigeria', code: '234', flag: '🇳🇬', isDefault: true },
            { name: 'United States', code: '1', flag: '🇺🇸', isDefault: true },
            { name: 'United Kingdom', code: '44', flag: '🇬🇧', isDefault: true },
            { name: 'India', code: '91', flag: '🇮🇳', isDefault: true }
        ];
    }
    
    updateCountryDisplay() {
        const trigger = document.getElementById('walinkCountryTrigger');
        if (!trigger || !this.state.selectedCountry) return;
        
        const country = this.state.selectedCountry;
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            trigger.innerHTML = `
                <span class="country-flag">${country.flag}</span>
                <span class="country-code">+${country.code}</span>
                <span class="chevron"><i class="fas fa-chevron-down"></i></span>
            `;
        } else {
            trigger.innerHTML = `
                <span class="country-flag">${country.flag}</span>
                <span class="country-name">${country.name}</span>
                <span class="country-code">+${country.code}</span>
                <span class="chevron"><i class="fas fa-chevron-down"></i></span>
            `;
        }
    }
    
    createFallbackCountrySelector() {
        const defaultCountry = this.getAllCountries()[0];
        this.state.selectedCountry = defaultCountry;
        
        const trigger = document.createElement('div');
        trigger.className = 'country-selector-trigger';
        trigger.id = 'walinkCountryTrigger';
        trigger.innerHTML = `
            <span class="country-flag">${defaultCountry.flag}</span>
            <span class="country-name">${defaultCountry.name}</span>
            <span class="country-code">+${defaultCountry.code}</span>
            <span class="chevron"><i class="fas fa-chevron-down"></i></span>
        `;
        
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openCountrySelector();
        });
        
        this.elements.walinkCountrySelector.appendChild(trigger);
    }
    
    saveSelectedCountry() {
        if (this.state.selectedCountry) {
            localStorage.setItem(`${this.namespace}selected_country`, JSON.stringify(this.state.selectedCountry));
        }
    }
    
    setupEventListeners() {
        // Input validation
        this.elements.walinkNumber.addEventListener('input', () => this.validateInput());
        this.elements.walinkMessage.addEventListener('input', () => this.updateMessageCounter());
        
        // Generate button
        this.elements.generateLinkBtn.addEventListener('click', () => this.generateLink());
        
        // Action buttons
        this.elements.copyLinkBtn.addEventListener('click', () => this.copyLink());
        this.elements.shareLinkBtn.addEventListener('click', () => this.shareLink());
        this.elements.downloadQRBtn.addEventListener('click', () => this.downloadQR());
        this.elements.shareQRBtn.addEventListener('click', () => this.shareQR());
        this.elements.testLinkBtn.addEventListener('click', () => this.testLink());
        this.elements.newLinkBtn.addEventListener('click', () => this.resetForm());
        this.elements.saveToHistoryBtn.addEventListener('click', () => this.saveCurrentToFavorites());
        
        // History
        this.elements.clearWalinkHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.elements.toggleHistoryView.addEventListener('click', () => this.toggleHistoryView());
        
        // Enter key for generation
        this.elements.walinkNumber.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.state.isGenerating && this.isValidInput()) {
                this.generateLink();
            }
        });
        
        this.elements.walinkMessage.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey && !this.state.isGenerating && this.isValidInput()) {
                this.generateLink();
            }
        });
        
        // Window resize for responsive updates
        window.addEventListener('resize', () => {
            this.updateCountryDisplay();
            this.adjustInputPadding();
        });
    }
    
    setupResponsiveBehavior() {
        this.adjustInputPadding();
    }
    
    adjustInputPadding() {
        const numberInput = this.elements.walinkNumber;
        if (!numberInput) return;
        
        if (window.innerWidth <= 480) {
            numberInput.style.paddingLeft = '90px';
            numberInput.style.paddingRight = '40px';
        } else if (window.innerWidth <= 768) {
            numberInput.style.paddingLeft = '110px';
            numberInput.style.paddingRight = '40px';
        } else {
            numberInput.style.paddingLeft = '160px';
            numberInput.style.paddingRight = '40px';
        }
    }
    
    validateInput() {
        const number = this.elements.walinkNumber.value.replace(/\D/g, '');
        const isValid = this.isValidNumber(number);
        
        // Update validation UI
        const numberInput = this.elements.walinkNumber;
        numberInput.classList.toggle('valid', isValid && number.length > 0);
        numberInput.classList.toggle('invalid', !isValid && number.length > 0);
        
        // Show/hide validation icons
        const validIcon = numberInput.parentNode.querySelector('.valid-icon');
        const invalidIcon = numberInput.parentNode.querySelector('.invalid-icon');
        if (validIcon) validIcon.style.opacity = isValid && number.length > 0 ? '1' : '0';
        if (invalidIcon) invalidIcon.style.opacity = !isValid && number.length > 0 ? '1' : '0';
        
        // Update button state
        this.elements.generateLinkBtn.disabled = !isValid || this.state.isGenerating;
        
        return isValid;
    }
    
    isValidNumber(number) {
        if (!number) return false;
        const phoneRegex = /^[0-9]{8,12}$/;
        return phoneRegex.test(number);
    }
    
    updateMessageCounter() {
        const length = this.elements.walinkMessage.value.length;
        this.elements.messageCounter.textContent = `${length}/500`;
        
        // Visual feedback
        const counter = this.elements.messageCounter;
        if (length > 450) {
            counter.style.color = '#ff4757';
            counter.style.fontWeight = '600';
        } else if (length > 400) {
            counter.style.color = '#ffa502';
            counter.style.fontWeight = '500';
        } else {
            counter.style.color = 'var(--text-secondary)';
            counter.style.fontWeight = '400';
        }
    }
    
    isValidInput() {
        const number = this.elements.walinkNumber.value.replace(/\D/g, '');
        return this.isValidNumber(number);
    }
    
    async generateLink() {
        if (!this.isValidInput()) {
            this.showToast('Invalid Input', 'Please enter a valid WhatsApp number (8-12 digits)', 'error');
            return;
        }
        
        this.state.isGenerating = true;
        this.updateUI();
        
        const number = this.elements.walinkNumber.value.replace(/\D/g, '');
        const countryCode = this.state.selectedCountry ? this.state.selectedCountry.code : '233';
        const fullNumber = countryCode + number;
        const message = this.elements.walinkMessage.value.trim();
        
        try {
            // Generate WhatsApp link
            const whatsappLink = this.generateWhatsAppLink(fullNumber, message);
            this.state.generatedLink = whatsappLink;
            
            // Update stats
            this.state.stats.totalLinks++;
            this.state.stats.lastGenerated = new Date().toISOString();
            this.saveStats();
            
            // Show output section
            this.showOutput(whatsappLink, fullNumber, message);
            
            // Generate QR code
            await this.generateQRCode(whatsappLink);
            
            // Add to history
            this.addToHistory(fullNumber, message, whatsappLink);
            
            // Show success feedback
            this.showToast('Success!', 'WhatsApp link generated successfully', 'success');
            
            // Trigger follow popup after 1.5 seconds
            setTimeout(() => {
                this.triggerFollowPopup();
            }, 1500);
            
        } catch (error) {
            console.error('Link generation error:', error);
            this.showToast('Generation Failed', 'Could not generate WhatsApp link. Please try again.', 'error');
            this.state.stats.failedGenerations++;
            this.saveStats();
        } finally {
            this.state.isGenerating = false;
            this.updateUI();
            this.updateStatsDisplay();
        }
    }
    
    generateWhatsAppLink(number, message) {
        let url = `https://wa.me/${number}`;
        
        if (message) {
            const encodedMessage = encodeURIComponent(message);
            url += `?text=${encodedMessage}`;
        }
        
        return url;
    }
    
    showOutput(link, number, message) {
        // Update link display
        this.elements.generatedLink.textContent = link;
        this.elements.outputTime.textContent = this.formatTime(new Date().toISOString());
        
        // Show output section with animation
        this.elements.walinkOutput.style.display = 'block';
        setTimeout(() => {
            this.elements.walinkOutput.style.opacity = '1';
            this.elements.walinkOutput.style.transform = 'translateY(0)';
        }, 10);
        
        // Enable action buttons
        this.elements.copyLinkBtn.disabled = false;
        this.elements.shareLinkBtn.disabled = false;
        this.elements.testLinkBtn.disabled = false;
        
        // Scroll to output if on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                this.elements.walinkOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
    
    async generateQRCode(link) {
        return new Promise((resolve, reject) => {
            try {
                // Use QRCode.js library if available, otherwise use API
                if (typeof QRCode !== 'undefined') {
                    const qrContainer = document.getElementById('qrCanvas');
                    if (qrContainer) {
                        qrContainer.innerHTML = '';
                        new QRCode(qrContainer, {
                            text: link,
                            width: 200,
                            height: 200,
                            colorDark: "#000000",
                            colorLight: "#ffffff",
                            correctLevel: QRCode.CorrectLevel.H
                        });
                        
                        this.elements.qrPlaceholder.style.display = 'none';
                        qrContainer.style.display = 'block';
                        this.elements.downloadQRBtn.disabled = false;
                        this.elements.shareQRBtn.disabled = false;
                        resolve();
                    } else {
                        this.generateQRCodeViaAPI(link).then(resolve).catch(reject);
                    }
                } else {
                    this.generateQRCodeViaAPI(link).then(resolve).catch(reject);
                }
            } catch (error) {
                this.generateQRCodeViaAPI(link).then(resolve).catch(reject);
            }
        });
    }
    
    async generateQRCodeViaAPI(link) {
        try {
            const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}&format=png&margin=10`;
            
            return new Promise((resolve, reject) => {
                const img = this.elements.qrImage;
                img.onload = () => {
                    this.elements.qrPlaceholder.style.display = 'none';
                    img.style.display = 'block';
                    this.elements.downloadQRBtn.disabled = false;
                    this.elements.shareQRBtn.disabled = false;
                    this.state.qrCode = qrCodeURL;
                    resolve();
                };
                
                img.onerror = () => {
                    console.error('QR code failed to load');
                    this.elements.qrPlaceholder.innerHTML = `
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>QR Code Generation Failed</p>
                        <p class="small-text">Try again later</p>
                    `;
                    this.elements.downloadQRBtn.disabled = true;
                    this.elements.shareQRBtn.disabled = true;
                    reject(new Error('QR code generation failed'));
                };
                
                img.src = qrCodeURL;
            });
        } catch (error) {
            console.error('QR API error:', error);
            this.elements.qrPlaceholder.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <p>QR Generation Failed</p>
            `;
            this.elements.downloadQRBtn.disabled = true;
            this.elements.shareQRBtn.disabled = true;
            throw error;
        }
    }
    
    async copyLink() {
        if (!this.state.generatedLink) return;
        
        try {
            await navigator.clipboard.writeText(this.state.generatedLink);
            
            // Update stats
            this.state.stats.linksCopied++;
            this.saveStats();
            this.updateStatsDisplay();
            
            // Visual feedback
            const originalText = this.elements.copyLinkBtn.querySelector('span').textContent;
            const originalIcon = this.elements.copyLinkBtn.querySelector('i').className;
            
            this.elements.copyLinkBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            this.elements.copyLinkBtn.classList.add('success');
            this.elements.copyLinkBtn.style.backgroundColor = 'var(--primary-color)';
            this.elements.copyLinkBtn.style.color = 'white';
            this.elements.copyLinkBtn.style.borderColor = 'var(--primary-color)';
            
            this.showToast('Link Copied!', 'WhatsApp link copied to clipboard', 'success');
            
            setTimeout(() => {
                this.elements.copyLinkBtn.innerHTML = `<i class="${originalIcon}"></i><span>${originalText}</span>`;
                this.elements.copyLinkBtn.classList.remove('success');
                this.elements.copyLinkBtn.style.backgroundColor = '';
                this.elements.copyLinkBtn.style.color = '';
                this.elements.copyLinkBtn.style.borderColor = '';
            }, 2000);
            
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.state.generatedLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showToast('Link Copied!', 'WhatsApp link copied to clipboard', 'success');
        }
    }
    
    async shareLink() {
        if (!this.state.generatedLink) return;
        
        const shareData = {
            title: 'WhatsApp Link',
            text: 'Check out this WhatsApp link I generated with WalinkGO',
            url: this.state.generatedLink
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Shared!', 'Link shared successfully', 'success');
            } else {
                // Fallback to copy
                this.copyLink();
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                this.copyLink();
            }
        }
    }
    
    async shareQR() {
        if (!this.state.qrCode) return;
        
        try {
            const response = await fetch(this.state.qrCode);
            const blob = await response.blob();
            const file = new File([blob], 'whatsapp-qr.png', { type: 'image/png' });
            
            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'WhatsApp QR Code',
                    text: 'Scan this QR code to open WhatsApp'
                });
                this.showToast('QR Shared!', 'QR code shared successfully', 'success');
            } else {
                this.downloadQR();
            }
        } catch (error) {
            console.error('Share QR error:', error);
            this.downloadQR();
        }
    }
    
    async downloadQR() {
        if (!this.state.qrCode) return;
        
        try {
            const response = await fetch(this.state.qrCode);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `whatsapp-qr-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            this.showToast('QR Downloaded!', 'QR code saved to your device', 'success');
            
        } catch (error) {
            console.error('QR download error:', error);
            this.showToast('Download Failed', 'Could not download QR code', 'error');
        }
    }
    
    testLink() {
        if (!this.state.generatedLink) return;
        
        window.open(this.state.generatedLink, '_blank', 'noopener,noreferrer');
        this.showToast('Link Opened', 'Opening WhatsApp link in new tab', 'info');
    }
    
    resetForm() {
        this.elements.walinkNumber.value = '';
        this.elements.walinkMessage.value = '';
        this.updateMessageCounter();
        this.validateInput();
        
        // Hide output section
        this.elements.walinkOutput.style.opacity = '0';
        this.elements.walinkOutput.style.transform = 'translateY(20px)';
        setTimeout(() => {
            this.elements.walinkOutput.style.display = 'none';
        }, 300);
        
        // Reset QR
        this.elements.qrPlaceholder.style.display = 'flex';
        this.elements.qrImage.style.display = 'none';
        const qrCanvas = document.getElementById('qrCanvas');
        if (qrCanvas) qrCanvas.style.display = 'none';
        
        this.elements.downloadQRBtn.disabled = true;
        this.elements.shareQRBtn.disabled = true;
        
        this.showToast('Form Reset', 'Ready to create a new link', 'info');
    }
    
    saveCurrentToFavorites() {
        if (!this.state.generatedLink) return;
        
        const number = this.elements.walinkNumber.value.replace(/\D/g, '');
        const countryCode = this.state.selectedCountry ? this.state.selectedCountry.code : '233';
        const fullNumber = countryCode + number;
        const message = this.elements.walinkMessage.value.trim();
        
        this.addToHistory(fullNumber, message, this.state.generatedLink, true);
        this.showToast('Saved to Favorites!', 'Link added to your history', 'success');
    }
    
    addToHistory(number, message, link, isFavorite = false) {
        const historyItem = {
            id: Date.now(),
            number: '+' + number,
            message: message || 'No message',
            messagePreview: message ? (message.length > 50 ? message.substring(0, 50) + '...' : message) : 'No message',
            link: link,
            timestamp: new Date().toISOString(),
            title: `Link to +${number}`,
            isFavorite: isFavorite
        };
        
        this.state.history.unshift(historyItem);
        
        // Limit history to 50 items
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }
    
    saveHistory() {
        try {
            localStorage.setItem(`${this.namespace}history`, JSON.stringify(this.state.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
    
    loadHistory() {
        try {
            const savedHistory = localStorage.getItem(`${this.namespace}history`);
            if (savedHistory) {
                this.state.history = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.error('Error loading history:', error);
            this.state.history = [];
        }
    }
    
    renderHistory() {
        if (this.state.history.length === 0) {
            this.elements.walinkHistoryEmpty.style.display = 'flex';
            this.elements.walinkHistoryList.style.display = 'none';
            return;
        }
        
        this.elements.walinkHistoryEmpty.style.display = 'none';
        this.elements.walinkHistoryList.style.display = 'grid';
        this.elements.walinkHistoryList.className = `history-list ${this.state.currentHistoryView}`;
        
        this.elements.walinkHistoryList.innerHTML = '';
        
        this.state.history.forEach(item => {
            const historyItem = this.createHistoryItem(item);
            this.elements.walinkHistoryList.appendChild(historyItem);
        });
    }
    
    createHistoryItem(item) {
        const div = document.createElement('div');
        div.className = `history-item ${item.isFavorite ? 'favorite' : ''}`;
        div.dataset.id = item.id;
        
        const isGridView = this.state.currentHistoryView === 'grid';
        
        if (isGridView) {
            div.innerHTML = `
                <div class="history-item-icon">
                    <i class="fab fa-whatsapp"></i>
                    ${item.isFavorite ? '<span class="favorite-badge"><i class="fas fa-star"></i></span>' : ''}
                </div>
                <div class="history-item-content">
                    <div class="history-number">${item.number}</div>
                    <div class="history-time">${this.formatTime(item.timestamp)}</div>
                </div>
                <div class="history-item-actions">
                    <button class="btn-icon-sm history-copy" title="Copy link">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-icon-sm history-open" title="Open link">
                        <i class="fab fa-whatsapp"></i>
                    </button>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="history-item-header">
                    <div class="history-item-title">
                        <i class="fab fa-whatsapp"></i>
                        <span>${item.title}</span>
                        ${item.isFavorite ? '<span class="favorite-tag"><i class="fas fa-star"></i> Favorite</span>' : ''}
                    </div>
                    <div class="history-item-actions">
                        <button class="btn-icon-sm history-copy" title="Copy link">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon-sm history-open" title="Open link">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button class="btn-icon-sm history-delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="history-item-body">
                    <div class="history-number">
                        <i class="fas fa-phone"></i>
                        <span>${item.number}</span>
                    </div>
                    <div class="history-message">
                        <i class="fas fa-comment"></i>
                        <span>${item.messagePreview}</span>
                    </div>
                    <div class="history-link">
                        <i class="fas fa-link"></i>
                        <span class="link-preview">${item.link.substring(0, 40)}...</span>
                    </div>
                </div>
                <div class="history-item-footer">
                    <span class="history-time">${this.formatTime(item.timestamp)}</span>
                </div>
            `;
        }
        
        // Add event listeners
        const copyBtn = div.querySelector('.history-copy');
        const openBtn = div.querySelector('.history-open');
        const deleteBtn = div.querySelector('.history-delete');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(item.link).then(() => {
                    this.showToast('Link Copied!', 'From history to clipboard', 'success');
                });
            });
        }
        
        if (openBtn) {
            openBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.open(item.link, '_blank', 'noopener,noreferrer');
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteHistoryItem(item.id);
            });
        }
        
        if (!isGridView) {
            div.addEventListener('click', (e) => {
                if (!e.target.closest('.history-item-actions')) {
                    this.loadFromHistory(item);
                }
            });
        }
        
        return div;
    }
    
    loadFromHistory(item) {
        // Extract number from link
        const numberMatch = item.link.match(/wa\.me\/(\d+)/);
        if (numberMatch) {
            const fullNumber = numberMatch[1];
            
            // Find matching country
            const countries = this.getAllCountries();
            const country = countries.find(c => fullNumber.startsWith(c.code)) || countries[0];
            
            this.state.selectedCountry = country;
            this.updateCountryDisplay();
            
            // Extract local number
            const localNumber = fullNumber.substring(country.code.length);
            this.elements.walinkNumber.value = localNumber;
            this.elements.walinkMessage.value = item.message === 'No message' ? '' : item.message;
            this.updateMessageCounter();
            this.validateInput();
            
            // Regenerate the link
            this.generateLink();
            
            this.showToast('History Loaded', 'Regenerating link from history', 'info');
        }
    }
    
    deleteHistoryItem(id) {
        this.state.history = this.state.history.filter(item => item.id !== id);
        this.saveHistory();
        this.renderHistory();
        this.showToast('Item Deleted', 'Removed from history', 'success');
    }
    
    clearHistory() {
        if (this.state.history.length === 0) return;
        
        if (confirm('Clear all link history? This action cannot be undone.')) {
            this.state.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showToast('History Cleared', 'All link history removed', 'success');
        }
    }
    
    toggleHistoryView() {
        this.state.currentHistoryView = this.state.currentHistoryView === 'list' ? 'grid' : 'list';
        this.renderHistory();
        
        const icon = this.elements.toggleHistoryView.querySelector('i');
        icon.className = this.state.currentHistoryView === 'list' ? 'fas fa-th' : 'fas fa-list';
        
        this.showToast('View Changed', `Switched to ${this.state.currentHistoryView} view`, 'info');
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
    
    loadStats() {
        try {
            const savedStats = localStorage.getItem(`${this.namespace}stats`);
            if (savedStats) {
                this.state.stats = JSON.parse(savedStats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }
    
    saveStats() {
        try {
            localStorage.setItem(`${this.namespace}stats`, JSON.stringify(this.state.stats));
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }
    
    updateStatsDisplay() {
        this.elements.totalLinks.textContent = this.state.stats.totalLinks.toLocaleString();
        this.elements.linksCopied.textContent = this.state.stats.linksCopied.toLocaleString();
        
        const successRate = this.state.stats.totalLinks > 0 
            ? Math.round(((this.state.stats.totalLinks - this.state.stats.failedGenerations) / this.state.stats.totalLinks) * 100)
            : 100;
        this.elements.successRate.textContent = `${successRate}%`;
        
        // Animate number changes
        this.animateCounter('totalLinks', this.state.stats.totalLinks);
        this.animateCounter('linksCopied', this.state.stats.linksCopied);
    }
    
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        if (currentValue === targetValue) return;
        
        const duration = 500;
        const steps = 20;
        const increment = (targetValue - currentValue) / steps;
        let currentStep = 0;
        
        const updateCounter = () => {
            currentStep++;
            const newValue = Math.round(currentValue + (increment * currentStep));
            element.textContent = newValue.toLocaleString();
            
            if (currentStep < steps) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = targetValue.toLocaleString();
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    updateUI() {
        const isValid = this.isValidInput();
        this.elements.generateLinkBtn.disabled = !isValid || this.state.isGenerating;
        this.elements.generateLinkBtn.classList.toggle('loading', this.state.isGenerating);
        
        const btnText = this.elements.generateLinkBtn.querySelector('.btn-text');
        if (this.state.isGenerating) {
            btnText.textContent = 'Generating...';
        } else {
            btnText.textContent = 'Generate WhatsApp Link';
        }
        
        // Update input border based on validation
        const numberInput = this.elements.walinkNumber;
        if (isValid && numberInput.value.length > 0) {
            numberInput.style.borderColor = 'var(--primary-color)';
        } else if (!isValid && numberInput.value.length > 0) {
            numberInput.style.borderColor = '#ff4757';
        } else {
            numberInput.style.borderColor = 'var(--border-color)';
        }
    }
    
    showToast(title, message, type = 'info') {
        // Use existing toast system if available
        if (window.whatsDPApp && window.whatsDPApp.showToast) {
            window.whatsDPApp.showToast(title, message, type);
            return;
        }
        
        // Fallback toast implementation
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--card-bg);
            border-left: 4px solid ${this.getToastColor(type)};
            border-radius: var(--radius-md);
            padding: 1rem 1.25rem;
            box-shadow: var(--shadow-lg);
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
            z-index: 9999;
            max-width: 350px;
            animation: toastSlideIn 0.3s ease;
        `;
        
        toast.innerHTML = `
            <div class="toast-icon" style="font-size: 1.25rem; color: ${this.getToastColor(type)};">
                ${this.getToastIcon(type)}
            </div>
            <div class="toast-content" style="flex: 1;">
                <div class="toast-title" style="font-weight: 600; margin-bottom: 0.25rem;">${title}</div>
                <div class="toast-message" style="color: var(--text-secondary); font-size: 0.9rem;">${message}</div>
            </div>
            <button class="toast-close" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.style.animation = 'toastSlideOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        });
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
        
        // Add CSS for animations if not present
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes toastSlideOut {
                    from { opacity: 1; transform: translateX(0); }
                    to { opacity: 0; transform: translateX(100%); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    getToastColor(type) {
        switch (type) {
            case 'success': return 'var(--primary-color)';
            case 'error': return '#ff4757';
            case 'warning': return '#ffa502';
            case 'info': return 'var(--accent-color)';
            default: return 'var(--accent-color)';
        }
    }
    
    getToastIcon(type) {
        switch (type) {
            case 'success': return '<i class="fas fa-check-circle"></i>';
            case 'error': return '<i class="fas fa-exclamation-circle"></i>';
            case 'warning': return '<i class="fas fa-exclamation-triangle"></i>';
            case 'info': return '<i class="fas fa-info-circle"></i>';
            default: return '<i class="fas fa-info-circle"></i>';
        }
    }
    
    triggerFollowPopup() {
        // Trigger the existing follow popup
        const followPopup = document.getElementById('followPopup');
        if (followPopup) {
            setTimeout(() => {
                followPopup.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                const followNowBtn = document.getElementById('followNowBtn');
                if (followNowBtn) {
                    followNowBtn.classList.add('pulse');
                }
            }, 500);
        }
    }
}

// Initialize WalinkGO when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for main app to load
    const initWalinkGO = () => {
        if (document.getElementById('walinkgoSection')) {
            window.walinkGO = new WalinkGO();
            console.log('✅ WalinkGO initialized successfully');
            
            // Add QRCode.js if not present
            if (typeof QRCode === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
                script.onload = () => console.log('QRCode.js loaded');
                document.head.appendChild(script);
            }
        } else {
            setTimeout(initWalinkGO, 100);
        }
    };
    
    // Start initialization
    setTimeout(initWalinkGO, 500);
});