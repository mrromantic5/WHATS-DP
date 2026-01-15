/**
 * WhatsPOST - Premium WhatsApp Status Generator
 * Integration for WhatsApp DP Fetcher & WalinkGO
 * @version 1.1.0
 */

class WhatsPOST {
    constructor() {
        this.namespace = 'whatspost_';
        this.elements = {};
        this.state = {
            currentCategory: 'love',
            generatedQuote: null,
            stats: {
                totalQuotesGenerated: 0,
                quotesCopied: 0,
                failedGenerations: 0,
                lastGenerated: null
            },
            history: [],
            customCategories: [],
            dailyQuotesIndex: 0,
            isGenerating: false,
            currentHistoryView: 'list',
            sliderInterval: null,
            categoryRequests: []
        };
        
        this.categories = {
            love: { icon: 'fas fa-heart', color: '#FF6B6B' },
            business: { icon: 'fas fa-briefcase', color: '#3498DB' },
            motivation: { icon: 'fas fa-fire', color: '#FF8E53' },
            inspiration: { icon: 'fas fa-lightbulb', color: '#F1C40F' },
            godly: { icon: 'fas fa-church', color: '#9B59B6' },
            jokes: { icon: 'fas fa-laugh', color: '#2ECC71' },
            savage: { icon: 'fas fa-bolt', color: '#E74C3C' },
            riddles: { icon: 'fas fa-question-circle', color: '#1ABC9C' },
            proverbs: { icon: 'fas fa-book', color: '#34495E' },
            entertainment: { icon: 'fas fa-film', color: '#9B59B6' },
            tech: { icon: 'fas fa-laptop-code', color: '#3498DB' },
            friendship: { icon: 'fas fa-user-friends', color: '#1ABC9C' },
            birthday_wishes: { icon: 'fas fa-birthday-cake', color: '#E74C3C' },
            graduation_wishes: { icon: 'fas fa-graduation-cap', color: '#9B59B6' }
        };
        
        this.init();
    }
    
    async init() {
        this.cacheElements();
        this.loadStats();
        this.loadHistory();
        this.loadCustomCategories();
        this.loadCategoryRequests();
        this.setupEventListeners();
        this.setupRequestCategoryFeature();
        this.renderCategories();
        this.initDailyQuotesSlider();
        this.updateStatsDisplay();
        this.renderHistory();
    }
    
    cacheElements() {
        const ids = [
            'dailyQuotesSlider', 'quotesContainer', 'sliderDots',
            'categoryPills', 'customCategoryInput', 'addCustomCategoryBtn',
            'cancelCustomCategoryBtn', 'addCategoryBtn', 'generateQuoteBtn',
            'quoteOutput', 'generatedQuote', 'quoteAuthor', 'copyQuoteBtn',
            'shareQuoteBtn', 'saveQuoteBtn', 'regenerateQuoteBtn',
            'outputCategory', 'outputTime', 'totalQuotesGenerated',
            'quotesCopied', 'successRate', 'quoteHistoryEmpty',
            'quoteHistoryList', 'clearQuoteHistoryBtn', 'toggleQuoteHistoryView'
        ];
        
        ids.forEach(id => {
            this.elements[id] = document.getElementById(id);
        });
        
        // Slider controls
        this.elements.sliderPrev = document.querySelector('.slider-prev');
        this.elements.sliderNext = document.querySelector('.slider-next');
    }
    
    setupRequestCategoryFeature() {
        // Cache modal elements
        this.elements.requestCategoryModal = document.getElementById('requestCategoryModal');
        this.elements.requestCategoryModalOverlay = document.getElementById('requestCategoryModalOverlay');
        this.elements.requestCategoryModalClose = document.getElementById('requestCategoryModalClose');
        this.elements.requestCategoryBtn = document.getElementById('requestCategoryBtn');
        this.elements.categoryRequest = document.getElementById('categoryRequest');
        this.elements.categoryRequestError = document.getElementById('categoryRequestError');
        this.elements.cancelRequestBtn = document.getElementById('cancelRequestBtn');
        this.elements.submitRequestBtn = document.getElementById('submitRequestBtn');
        this.elements.requestPreview = document.getElementById('requestPreview');
        
        // Success modal elements
        this.elements.requestSuccessModal = document.getElementById('requestSuccessModal');
        this.elements.requestSuccessModalOverlay = document.getElementById('requestSuccessModalOverlay');
        this.elements.requestSuccessModalClose = document.getElementById('requestSuccessModalClose');
        this.elements.successCategoryName = document.getElementById('successCategoryName');
        this.elements.successTimestamp = document.getElementById('successTimestamp');
        this.elements.closeSuccessBtn = document.getElementById('closeSuccessBtn');
        this.elements.viewWhatsAppBtn = document.getElementById('viewWhatsAppBtn');
        
        // Add event listeners for request feature
        if (this.elements.requestCategoryBtn) {
            this.elements.requestCategoryBtn.addEventListener('click', () => this.openRequestCategoryModal());
        }
        
        if (this.elements.requestCategoryModalOverlay) {
            this.elements.requestCategoryModalOverlay.addEventListener('click', () => this.closeRequestCategoryModal());
        }
        
        if (this.elements.requestCategoryModalClose) {
            this.elements.requestCategoryModalClose.addEventListener('click', () => this.closeRequestCategoryModal());
        }
        
        if (this.elements.cancelRequestBtn) {
            this.elements.cancelRequestBtn.addEventListener('click', () => this.closeRequestCategoryModal());
        }
        
        if (this.elements.categoryRequest) {
            this.elements.categoryRequest.addEventListener('input', () => this.updateRequestPreview());
            this.elements.categoryRequest.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && this.isValidCategoryRequest()) {
                    this.submitCategoryRequest();
                }
            });
        }
        
        if (this.elements.submitRequestBtn) {
            this.elements.submitRequestBtn.addEventListener('click', () => this.submitCategoryRequest());
        }
        
        // Success modal events
        if (this.elements.requestSuccessModalOverlay) {
            this.elements.requestSuccessModalOverlay.addEventListener('click', () => this.closeRequestSuccessModal());
        }
        
        if (this.elements.requestSuccessModalClose) {
            this.elements.requestSuccessModalClose.addEventListener('click', () => this.closeRequestSuccessModal());
        }
        
        if (this.elements.closeSuccessBtn) {
            this.elements.closeSuccessBtn.addEventListener('click', () => this.closeRequestSuccessModal());
        }
        
        if (this.elements.viewWhatsAppBtn) {
            this.elements.viewWhatsAppBtn.addEventListener('click', () => this.openWhatsAppAgain());
        }
        
        // Initialize beeping animation
        this.startBeepingAnimation();
    }
    
    startBeepingAnimation() {
        const beepingDot = document.querySelector('.beeping-dot');
        if (beepingDot) {
            // Restart animation every 3 seconds to keep it fresh
            setInterval(() => {
                beepingDot.style.animation = 'none';
                setTimeout(() => {
                    beepingDot.style.animation = 'beep 1.5s infinite';
                }, 10);
            }, 3000);
        }
    }
    
    async initDailyQuotesSlider() {
        // Load daily quotes
        if (typeof window.dailyQuotes === 'undefined') {
            console.error('daily.js not loaded');
            return;
        }
        
        if (!window.dailyQuotes || !Array.isArray(window.dailyQuotes) || window.dailyQuotes.length === 0) {
            console.error('No daily quotes available');
            return;
        }
        
        const quotes = window.dailyQuotes;
        this.elements.quotesContainer.innerHTML = '';
        this.elements.sliderDots.innerHTML = '';
        
        // Create slides and dots
        quotes.forEach((quote, index) => {
            // Create slide
            const slide = document.createElement('div');
            slide.className = `quote-slide ${index === 0 ? 'active' : ''}`;
            slide.innerHTML = `
                <p class="quote-text">${quote.text}</p>
                <div class="quote-author">${quote.author}</div>
            `;
            this.elements.quotesContainer.appendChild(slide);
            
            // Create dot
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            this.elements.sliderDots.appendChild(dot);
            
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Setup auto-rotation
        this.startSliderAutoRotation();
    }
    
    startSliderAutoRotation() {
        if (this.state.sliderInterval) {
            clearInterval(this.state.sliderInterval);
        }
        
        this.state.sliderInterval = setInterval(() => {
            this.nextSlide();
        }, 8000);
    }
    
    goToSlide(index) {
        const slides = document.querySelectorAll('.quote-slide');
        const dots = document.querySelectorAll('.slider-dot');
        
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        // Update current slide
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            } else if (i === this.state.dailyQuotesIndex) {
                slide.classList.add('exiting');
                setTimeout(() => {
                    slide.classList.remove('exiting');
                }, 500);
            }
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        this.state.dailyQuotesIndex = index;
        
        // Reset auto-rotation timer
        clearInterval(this.state.sliderInterval);
        this.startSliderAutoRotation();
    }
    
    nextSlide() {
        this.goToSlide(this.state.dailyQuotesIndex + 1);
    }
    
    prevSlide() {
        this.goToSlide(this.state.dailyQuotesIndex - 1);
    }
    
    renderCategories() {
        this.elements.categoryPills.innerHTML = '';
        
        // Render default categories
        Object.entries(this.categories).forEach(([key, data]) => {
            const pill = this.createCategoryPill(key, data.icon, false);
            this.elements.categoryPills.appendChild(pill);
        });
        
        // Render custom categories
        this.state.customCategories.forEach(category => {
            const pill = this.createCategoryPill(category.id, 'fas fa-plus-circle', true);
            this.elements.categoryPills.appendChild(pill);
        });
        
        // Set first category as selected
        const firstPill = this.elements.categoryPills.querySelector('.category-pill');
        if (firstPill) {
            firstPill.classList.add('selected');
        }
    }
    
    createCategoryPill(categoryId, icon, isCustom = false) {
        const category = this.getCategoryData(categoryId);
        const displayName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
        
        const pill = document.createElement('div');
        pill.className = 'category-pill';
        pill.dataset.category = categoryId;
        pill.innerHTML = `
            <i class="${icon}"></i>
            <span>${displayName}</span>
        `;
        
        pill.addEventListener('click', () => {
            this.selectCategory(categoryId);
        });
        
        return pill;
    }
    
    getCategoryData(categoryId) {
        return this.categories[categoryId] || { 
            icon: 'fas fa-plus-circle', 
            color: '#95A5A6' 
        };
    }
    
    selectCategory(categoryId) {
        this.state.currentCategory = categoryId;
        
        // Update UI
        document.querySelectorAll('.category-pill').forEach(pill => {
            pill.classList.remove('selected');
        });
        
        const selectedPill = document.querySelector(`.category-pill[data-category="${categoryId}"]`);
        if (selectedPill) {
            selectedPill.classList.add('selected');
        }
        
        // Show success feedback
        const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
        this.showToast('Category Selected', `${categoryName} quotes selected`, 'success');
    }
    
    showAddCategoryInput() {
        document.querySelector('.category-pill-container').style.display = 'none';
        document.querySelector('.custom-category-input').style.display = 'flex';
        document.getElementById('addCategoryBtn').style.display = 'none';
        document.getElementById('customCategoryInput').focus();
    }
    
    hideAddCategoryInput() {
        document.querySelector('.category-pill-container').style.display = 'flex';
        document.querySelector('.custom-category-input').style.display = 'none';
        document.getElementById('addCategoryBtn').style.display = 'block';
        document.getElementById('customCategoryInput').value = '';
    }
    
    addCustomCategory() {
        const categoryName = document.getElementById('customCategoryInput').value.trim();
        
        if (!categoryName) {
            this.showToast('Error', 'Please enter a category name', 'error');
            return;
        }
        
        if (categoryName.length > 20) {
            this.showToast('Error', 'Category name too long (max 20 chars)', 'error');
            return;
        }
        
        const categoryId = categoryName.toLowerCase().replace(/\s+/g, '_');
        
        // Check if category already exists
        if (this.categories[categoryId] || this.state.customCategories.find(c => c.id === categoryId)) {
            this.showToast('Error', 'Category already exists', 'error');
            return;
        }
        
        // Add to custom categories
        this.state.customCategories.push({
            id: categoryId,
            name: categoryName,
            icon: 'fas fa-plus-circle'
        });
        
        this.saveCustomCategories();
        this.hideAddCategoryInput();
        this.renderCategories();
        this.selectCategory(categoryId);
        
        this.showToast('Category Added', `${categoryName} added successfully`, 'success');
    }
    
    async generateQuote() {
        if (this.state.isGenerating) return;
        
        this.state.isGenerating = true;
        this.updateUI();
        
        try {
            // Get quotes for current category
            const quotes = this.getQuotesForCategory(this.state.currentCategory);
            
            if (!quotes || quotes.length === 0) {
                throw new Error('No quotes available for this category');
            }
            
            // Select random quote
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const selectedQuote = quotes[randomIndex];
            
            this.state.generatedQuote = selectedQuote;
            
            // Update stats
            this.state.stats.totalQuotesGenerated++;
            this.state.stats.lastGenerated = new Date().toISOString();
            this.saveStats();
            
            // Display the quote
            this.showQuoteOutput(selectedQuote);
            
            // Show success feedback
            this.showToast('Success!', 'Quote generated successfully', 'success');
            
        } catch (error) {
            console.error('Quote generation error:', error);
            this.showToast('Generation Failed', 'Could not generate quote. Please try again.', 'error');
            this.state.stats.failedGenerations++;
            this.saveStats();
        } finally {
            this.state.isGenerating = false;
            this.updateUI();
            this.updateStatsDisplay();
        }
    }
    
    getQuotesForCategory(category) {
        if (typeof window.quotesData === 'undefined') {
            console.error('quotes.js not loaded');
            return [];
        }
        
        return window.quotesData[category] || [];
    }
    
    showQuoteOutput(quote) {
        // Update quote display
        this.elements.generatedQuote.textContent = quote.text;
        this.elements.quoteAuthor.textContent = quote.author || '';
        this.elements.outputCategory.textContent = this.state.currentCategory.toUpperCase();
        this.elements.outputTime.textContent = this.formatTime(new Date().toISOString());
        
        // Add reveal animation
        this.elements.generatedQuote.classList.remove('quote-reveal');
        setTimeout(() => {
            this.elements.generatedQuote.classList.add('quote-reveal');
        }, 10);
        
        // Show output section with animation
        this.elements.quoteOutput.style.display = 'block';
        setTimeout(() => {
            this.elements.quoteOutput.style.opacity = '1';
            this.elements.quoteOutput.style.transform = 'translateY(0)';
        }, 10);
        
        // Enable action buttons
        this.elements.copyQuoteBtn.disabled = false;
        this.elements.shareQuoteBtn.disabled = false;
        this.elements.saveQuoteBtn.disabled = false;
        this.elements.regenerateQuoteBtn.disabled = false;
        
        // Scroll to output if on mobile
        if (window.innerWidth < 768) {
            setTimeout(() => {
                this.elements.quoteOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 300);
        }
    }
    
    async copyQuote() {
        if (!this.state.generatedQuote) return;
        
        const quoteText = this.state.generatedQuote.text;
        const author = this.state.generatedQuote.author ? ` - ${this.state.generatedQuote.author}` : '';
        const fullText = `"${quoteText}"${author}`;
        
        try {
            await navigator.clipboard.writeText(fullText);
            
            // Update stats
            this.state.stats.quotesCopied++;
            this.saveStats();
            this.updateStatsDisplay();
            
            // Add to history
            this.addToHistory(this.state.generatedQuote);
            
            // Visual feedback
            const originalText = this.elements.copyQuoteBtn.querySelector('span').textContent;
            const originalIcon = this.elements.copyQuoteBtn.querySelector('i').className;
            
            this.elements.copyQuoteBtn.innerHTML = '<i class="fas fa-check"></i><span>Copied!</span>';
            this.elements.copyQuoteBtn.classList.add('success');
            this.elements.copyQuoteBtn.style.backgroundColor = 'var(--primary-color)';
            this.elements.copyQuoteBtn.style.color = 'white';
            this.elements.copyQuoteBtn.style.borderColor = 'var(--primary-color)';
            
            this.showToast('Quote Copied!', 'Quote copied to clipboard', 'success');
            
            // Trigger follow popup
            setTimeout(() => {
                this.triggerFollowPopup();
            }, 500);
            
            setTimeout(() => {
                this.elements.copyQuoteBtn.innerHTML = `<i class="${originalIcon}"></i><span>${originalText}</span>`;
                this.elements.copyQuoteBtn.classList.remove('success');
                this.elements.copyQuoteBtn.style.backgroundColor = '';
                this.elements.copyQuoteBtn.style.color = '';
                this.elements.copyQuoteBtn.style.borderColor = '';
            }, 2000);
            
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = fullText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showToast('Quote Copied!', 'Quote copied to clipboard', 'success');
        }
    }
    
    async shareQuote() {
        if (!this.state.generatedQuote) return;
        
        const quoteText = this.state.generatedQuote.text;
        const author = this.state.generatedQuote.author ? ` - ${this.state.generatedQuote.author}` : '';
        const fullText = `"${quoteText}"${author}`;
        
        // Create WhatsApp share URL
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
        
        const shareData = {
            title: 'WhatsApp Quote',
            text: fullText,
            url: whatsappUrl
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.showToast('Shared!', 'Quote shared successfully', 'success');
            } else {
                // Fallback to opening WhatsApp
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                this.showToast('WhatsApp Opened', 'Quote ready to share in WhatsApp', 'success');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            }
        }
    }
    
    saveCurrentQuote() {
        if (!this.state.generatedQuote) return;
        
        this.addToHistory(this.state.generatedQuote, true);
        this.showToast('Saved to Favorites!', 'Quote added to your favorites', 'success');
    }
    
    addToHistory(quote, isFavorite = false) {
        const historyItem = {
            id: Date.now(),
            text: quote.text,
            author: quote.author || 'Unknown',
            category: this.state.currentCategory,
            timestamp: new Date().toISOString(),
            isFavorite: isFavorite,
            customTitle: `Quote from ${this.state.currentCategory}`
        };
        
        this.state.history.unshift(historyItem);
        
        // Limit history to 50 items
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }
    
    openRequestCategoryModal() {
        this.elements.requestCategoryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Reset form
        this.elements.categoryRequest.value = '';
        this.elements.categoryRequestError.textContent = '';
        this.updateRequestPreview();
        
        // Focus on input after animation
        setTimeout(() => {
            this.elements.categoryRequest.focus();
        }, 300);
        
        // Stop beeping when modal opens
        const beepingDot = document.querySelector('.beeping-dot');
        if (beepingDot) {
            beepingDot.style.animation = 'none';
        }
    }
    
    closeRequestCategoryModal() {
        this.elements.requestCategoryModal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Restart beeping after modal closes
        setTimeout(() => {
            this.startBeepingAnimation();
        }, 1000);
    }
    
    updateRequestPreview() {
        const categoryName = this.elements.categoryRequest.value.trim();
        const previewElement = this.elements.requestPreview.querySelector('.preview-category');
        
        if (previewElement) {
            previewElement.textContent = categoryName || 'Your Category';
        }
        
        // Validate and update button state
        const isValid = this.isValidCategoryRequest();
        this.elements.submitRequestBtn.disabled = !isValid;
    }
    
    isValidCategoryRequest() {
        const categoryName = this.elements.categoryRequest.value.trim();
        
        // Clear previous error
        this.elements.categoryRequestError.textContent = '';
        
        if (!categoryName) {
            return false;
        }
        
        if (categoryName.length < 2) {
            return false;
        }
        
        if (categoryName.length > 30) {
            this.elements.categoryRequestError.textContent = 'Category name too long (max 30 characters)';
            return false;
        }
        
        // Check if category already exists
        const allCategories = Object.keys(this.categories).concat(
            this.state.customCategories.map(cat => cat.id)
        );
        
        const normalizedRequest = categoryName.toLowerCase().replace(/\s+/g, '_');
        if (allCategories.includes(normalizedRequest)) {
            this.elements.categoryRequestError.textContent = 'This category already exists!';
            return false;
        }
        
        return true;
    }
    
    submitCategoryRequest() {
        if (!this.isValidCategoryRequest()) {
            return;
        }
        
        const categoryName = this.elements.categoryRequest.value.trim();
        const phoneNumber = '+233540964040';
        const message = `Please Mr.Romantic add "${categoryName}" to the WhatsPOST site`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Show success modal
        this.showRequestSuccessModal(categoryName);
        
        // Track analytics
        this.trackCategoryRequest(categoryName);
    }
    
    showRequestSuccessModal(categoryName) {
        // Close request modal
        this.closeRequestCategoryModal();
        
        // Update success modal content
        this.elements.successCategoryName.textContent = categoryName;
        this.elements.successTimestamp.textContent = new Date().toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        }) + ', ' + new Date().toLocaleDateString();
        
        // Show success modal
        this.elements.requestSuccessModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeRequestSuccessModal() {
        this.elements.requestSuccessModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    openWhatsAppAgain() {
        const categoryName = this.elements.categoryRequest.value.trim() || this.elements.successCategoryName.textContent;
        const phoneNumber = '+233540964040';
        const message = `Please Mr.Romantic add "${categoryName}" to the WhatsPOST site`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        
        // Close modal after opening WhatsApp
        setTimeout(() => {
            this.closeRequestSuccessModal();
        }, 500);
    }
    
    trackCategoryRequest(categoryName) {
        // Track in localStorage
        try {
            const requests = JSON.parse(localStorage.getItem(`${this.namespace}category_requests`)) || [];
            requests.push({
                category: categoryName,
                timestamp: new Date().toISOString(),
                status: 'pending'
            });
            
            localStorage.setItem(`${this.namespace}category_requests`, JSON.stringify(requests));
            
            // Show toast notification
            this.showToast('Request Sent!', `Category "${categoryName}" submitted to our team`, 'success');
            
            // Log for analytics
            console.log(`Category request submitted: ${categoryName}`);
        } catch (error) {
            console.error('Error tracking category request:', error);
        }
    }
    
    loadCategoryRequests() {
        try {
            const savedRequests = localStorage.getItem(`${this.namespace}category_requests`);
            if (savedRequests) {
                this.state.categoryRequests = JSON.parse(savedRequests);
            }
        } catch (error) {
            console.error('Error loading category requests:', error);
            this.state.categoryRequests = [];
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
    
    saveHistory() {
        try {
            localStorage.setItem(`${this.namespace}history`, JSON.stringify(this.state.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }
    
    renderHistory() {
        if (this.state.history.length === 0) {
            this.elements.quoteHistoryEmpty.style.display = 'flex';
            this.elements.quoteHistoryList.style.display = 'none';
            return;
        }
        
        this.elements.quoteHistoryEmpty.style.display = 'none';
        this.elements.quoteHistoryList.style.display = 'grid';
        this.elements.quoteHistoryList.className = `history-list quotes ${this.state.currentHistoryView}`;
        
        this.elements.quoteHistoryList.innerHTML = '';
        
        this.state.history.forEach(item => {
            const historyItem = this.createHistoryItem(item);
            this.elements.quoteHistoryList.appendChild(historyItem);
        });
    }
    
    createHistoryItem(item) {
        const div = document.createElement('div');
        div.className = `quote-history-item ${item.isFavorite ? 'favorite' : ''}`;
        div.dataset.id = item.id;
        
        const isGridView = this.state.currentHistoryView === 'grid';
        
        if (isGridView) {
            div.innerHTML = `
                <div class="quote-history-icon">
                    <i class="fas fa-quote-right"></i>
                    ${item.isFavorite ? '<span class="favorite-badge"><i class="fas fa-star"></i></span>' : ''}
                </div>
                <div class="quote-history-content">
                    <p class="quote-history-text">${item.text}</p>
                    <div class="quote-history-meta">
                        <span class="quote-history-time">${this.formatTime(item.timestamp)}</span>
                    </div>
                </div>
                <div class="quote-history-actions">
                    <button class="btn-icon-sm history-copy" title="Copy quote">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-icon-sm history-delete" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="quote-history-header">
                    <div class="quote-history-title">
                        <i class="fas fa-quote-right"></i>
                        <span class="title-text" contenteditable="true">${item.customTitle}</span>
                        ${item.isFavorite ? '<span class="favorite-tag"><i class="fas fa-star"></i> Favorite</span>' : ''}
                    </div>
                    <div class="quote-history-actions">
                        <button class="btn-icon-sm history-copy" title="Copy quote">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon-sm history-share" title="Share">
                            <i class="fas fa-share-alt"></i>
                        </button>
                        <button class="btn-icon-sm history-delete" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="quote-history-content">
                    <p class="quote-history-text">${item.text}</p>
                    <div class="quote-history-meta">
                        <span class="quote-history-category">${item.category}</span>
                        <span class="quote-history-time">${this.formatTime(item.timestamp)}</span>
                    </div>
                </div>
            `;
        }
        
        // Add event listeners
        const copyBtn = div.querySelector('.history-copy');
        const shareBtn = div.querySelector('.history-share');
        const deleteBtn = div.querySelector('.history-delete');
        const titleElement = div.querySelector('.title-text');
        
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.copyHistoryQuote(item);
            });
        }
        
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.shareHistoryQuote(item);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteHistoryItem(item.id);
            });
        }
        
        if (titleElement) {
            titleElement.addEventListener('blur', () => {
                this.updateHistoryItemTitle(item.id, titleElement.textContent);
            });
            
            titleElement.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    titleElement.blur();
                }
            });
        }
        
        if (!isGridView) {
            div.addEventListener('click', (e) => {
                if (!e.target.closest('.quote-history-actions') && !e.target.closest('.title-text')) {
                    this.loadFromHistory(item);
                }
            });
        }
        
        return div;
    }
    
    copyHistoryQuote(item) {
        const quoteText = item.text;
        const author = item.author ? ` - ${item.author}` : '';
        const fullText = `"${quoteText}"${author}`;
        
        navigator.clipboard.writeText(fullText).then(() => {
            this.showToast('Quote Copied!', 'From history to clipboard', 'success');
        });
    }
    
    shareHistoryQuote(item) {
        const quoteText = item.text;
        const author = item.author ? ` - ${item.author}` : '';
        const fullText = `"${quoteText}"${author}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
        
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
    
    loadFromHistory(item) {
        this.state.currentCategory = item.category;
        this.state.generatedQuote = { text: item.text, author: item.author };
        this.selectCategory(item.category);
        this.showQuoteOutput(this.state.generatedQuote);
        this.showToast('History Loaded', 'Quote loaded from history', 'info');
    }
    
    updateHistoryItemTitle(id, newTitle) {
        const item = this.state.history.find(item => item.id === id);
        if (item && newTitle.trim()) {
            item.customTitle = newTitle.trim();
            this.saveHistory();
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
        
        if (confirm('Clear all quote history? This action cannot be undone.')) {
            this.state.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showToast('History Cleared', 'All quote history removed', 'success');
        }
    }
    
    toggleHistoryView() {
        this.state.currentHistoryView = this.state.currentHistoryView === 'list' ? 'grid' : 'list';
        this.renderHistory();
        
        const icon = document.querySelector('#toggleQuoteHistoryView i');
        icon.className = this.state.currentHistoryView === 'list' ? 'fas fa-th' : 'fas fa-list';
        
        this.showToast('View Changed', `Switched to ${this.state.currentHistoryView} view`, 'info');
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
    
    loadCustomCategories() {
        try {
            const savedCategories = localStorage.getItem(`${this.namespace}custom_categories`);
            if (savedCategories) {
                this.state.customCategories = JSON.parse(savedCategories);
            }
        } catch (error) {
            console.error('Error loading custom categories:', error);
            this.state.customCategories = [];
        }
    }
    
    saveCustomCategories() {
        try {
            localStorage.setItem(`${this.namespace}custom_categories`, JSON.stringify(this.state.customCategories));
        } catch (error) {
            console.error('Error saving custom categories:', error);
        }
    }
    
    updateStatsDisplay() {
        this.elements.totalQuotesGenerated.textContent = this.state.stats.totalQuotesGenerated.toLocaleString();
        this.elements.quotesCopied.textContent = this.state.stats.quotesCopied.toLocaleString();
        
        const successRate = this.state.stats.totalQuotesGenerated > 0 
            ? Math.round(((this.state.stats.totalQuotesGenerated - this.state.stats.failedGenerations) / this.state.stats.totalQuotesGenerated) * 100)
            : 100;
        this.elements.successRate.textContent = `${successRate}%`;
        
        // Animate number changes
        this.animateCounter('totalQuotesGenerated', this.state.stats.totalQuotesGenerated);
        this.animateCounter('quotesCopied', this.state.stats.quotesCopied);
    }
    
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
        if (currentValue === targetValue) return;
        
        element.classList.add('counter-update');
        setTimeout(() => {
            element.textContent = targetValue.toLocaleString();
            element.classList.remove('counter-update');
        }, 300);
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
    
    updateUI() {
        const isValid = this.state.currentCategory && !this.state.isGenerating;
        this.elements.generateQuoteBtn.disabled = !isValid || this.state.isGenerating;
        this.elements.generateQuoteBtn.classList.toggle('loading', this.state.isGenerating);
        
        const btnText = this.elements.generateQuoteBtn.querySelector('.btn-text');
        if (this.state.isGenerating) {
            btnText.textContent = 'Generating...';
        } else {
            btnText.textContent = 'Generate Quote';
        }
    }
    
    setupEventListeners() {
        // Slider controls
        if (this.elements.sliderPrev) {
            this.elements.sliderPrev.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.elements.sliderNext) {
            this.elements.sliderNext.addEventListener('click', () => this.nextSlide());
        }
        
        // Category management
        this.elements.addCategoryBtn.addEventListener('click', () => this.showAddCategoryInput());
        this.elements.addCustomCategoryBtn.addEventListener('click', () => this.addCustomCategory());
        this.elements.cancelCustomCategoryBtn.addEventListener('click', () => this.hideAddCategoryInput());
        
        // Generate button
        this.elements.generateQuoteBtn.addEventListener('click', () => this.generateQuote());
        
        // Quote actions
        this.elements.copyQuoteBtn.addEventListener('click', () => this.copyQuote());
        this.elements.shareQuoteBtn.addEventListener('click', () => this.shareQuote());
        this.elements.saveQuoteBtn.addEventListener('click', () => this.saveCurrentQuote());
        this.elements.regenerateQuoteBtn.addEventListener('click', () => this.generateQuote());
        
        // History
        this.elements.clearQuoteHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.elements.toggleQuoteHistoryView.addEventListener('click', () => this.toggleHistoryView());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey && !this.state.isGenerating) {
                this.generateQuote();
            }
        });
        
        // Pause slider on hover
        if (this.elements.quotesContainer) {
            this.elements.quotesContainer.addEventListener('mouseenter', () => {
                if (this.state.sliderInterval) {
                    clearInterval(this.state.sliderInterval);
                }
            });
            
            this.elements.quotesContainer.addEventListener('mouseleave', () => {
                this.startSliderAutoRotation();
            });
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
            case 'success': return '#FF6B6B';
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

// Initialize WhatsPOST when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const initWhatsPOST = () => {
        if (document.getElementById('whatspostSection')) {
            window.whatsPOST = new WhatsPOST();
            console.log('✅ WhatsPOST initialized successfully');
        } else {
            setTimeout(initWhatsPOST, 100);
        }
    };
    
    // Start initialization
    setTimeout(initWhatsPOST, 500);
});