class WhatsDPDownloader {
    constructor() {
        this.elements = {
            gateLoader: document.getElementById('gateLoader'),
            mainContainer: document.getElementById('mainContainer'),
            whatsappNumber: document.getElementById('whatsappNumber'),
            fetchButton: document.getElementById('fetchButton'),
            previewPlaceholder: document.getElementById('previewPlaceholder'),
            previewLoading: document.getElementById('previewLoading'),
            previewActive: document.getElementById('previewActive'),
            previewError: document.getElementById('previewError'),
            previewImage: document.getElementById('previewImage'),
            downloadButton: document.getElementById('downloadButton'),
            zoomButton: document.getElementById('zoomButton'),
            refreshButton: document.getElementById('refreshButton'),
            retryButton: document.getElementById('retryButton'),
            historyGrid: document.getElementById('historyGrid'),
            historyEmpty: document.getElementById('historyEmpty'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            imageModal: document.getElementById('imageModal'),
            modalImage: document.getElementById('modalImage'),
            modalOverlay: document.getElementById('modalOverlay'),
            modalClose: document.getElementById('modalClose'),
            modalDownload: document.getElementById('modalDownload'),
            toastContainer: document.getElementById('toastContainer'),
            themeSwitch: document.getElementById('themeSwitch'),
            historyToggle: document.getElementById('historyToggle'),
            historyCard: document.getElementById('historyCard'),
            shareButton: document.getElementById('shareButton'),
            formatOptions: document.querySelectorAll('input[name="format"]'),
            lengthIndicator: document.getElementById('lengthIndicator'),
            formatIndicator: document.getElementById('formatIndicator'),
            totalFetches: document.getElementById('totalFetches'),
            successRate: document.getElementById('successRate'),
            storageUsed: document.getElementById('storageUsed'),
            previewNumber: document.getElementById('previewNumber'),
            previewTime: document.getElementById('previewTime'),
            countryModal: document.getElementById('countryModal'),
            countryModalOverlay: document.getElementById('countryModalOverlay'),
            countryModalClose: document.getElementById('countryModalClose'),
            countrySearch: document.getElementById('countrySearch'),
            clearSearch: document.getElementById('clearSearch'),
            countryList: document.getElementById('countryList'),
            addCountryBtn: document.getElementById('addCountryBtn'),
            addCountryModal: document.getElementById('addCountryModal'),
            addCountryModalOverlay: document.getElementById('addCountryModalOverlay'),
            addCountryModalClose: document.getElementById('addCountryModalClose'),
            customCountryName: document.getElementById('customCountryName'),
            customCountryCode: document.getElementById('customCountryCode'),
            customCountryFlag: document.getElementById('customCountryFlag'),
            flagPreview: document.getElementById('flagPreview'),
            cancelAddCountry: document.getElementById('cancelAddCountry'),
            saveCountryBtn: document.getElementById('saveCountryBtn'),
            countryNameError: document.getElementById('countryNameError'),
            countryCodeError: document.getElementById('countryCodeError'),
            followPopup: document.getElementById('followPopup'),
            followPopupOverlay: document.getElementById('followPopupOverlay'),
            followPopupClose: document.getElementById('followPopupClose'),
            followNowBtn: document.getElementById('followNowBtn'),
            followLaterBtn: document.getElementById('followLaterBtn')
        };
        this.state = {
            currentImage: null,
            currentNumber: null,
            history: [],
            stats: {
                totalFetches: 0,
                successfulFetches: 0,
                failedFetches: 0
            },
            isFetching: false,
            currentTheme: localStorage.getItem('theme') || 'light',
            isHistoryVisible: true,
            userInfo: {
                deviceType: 'Unknown',
                browserName: 'Unknown',
                browserVersion: 'Unknown',
                osName: 'Unknown',
                osVersion: 'Unknown',
                screenResolution: 'Unknown',
                windowSize: 'Unknown',
                batteryLevel: 'N/A',
                chargingStatus: 'N/A',
                networkType: 'Unknown',
                networkSpeed: 'Unknown',
                ipAddress: 'Fetching...',
                country: 'Unknown',
                city: 'Unknown',
                region: 'Unknown',
                timeZone: 'Unknown',
                timeZoneOffset: 0,
                language: 'Unknown',
                languages: 'Unknown',
                currentTime: 'Unknown',
                currentDate: 'Unknown'
            },
            apiRotationIndex: 0,
            countries: this.getDefaultCountries(),
            selectedCountry: this.getStoredCountry() || this.getDefaultCountries()[0],
            recentCountries: JSON.parse(localStorage.getItem('whatsdp_recent_countries')) || [],
            customCountries: JSON.parse(localStorage.getItem('whatsdp_custom_countries')) || [],
            followPopupShown: JSON.parse(localStorage.getItem('whatsdp_follow_popup_shown')) || 0,
            lastSuccessTime: null
        };
        this.apiEndpoints = [
            {
                name: 'Primary API',
                url: (number) => `https://eliteprotech-apis.zone.id/getpp?prompt=${number}`,
                method: 'json'
            },
            {
                name: 'WhatsApp DP API 1',
                url: (number) => `https://api.whatsapp.com/send?phone=${number}`,
                method: 'scrape'
            },
            {
                name: 'WhatsApp DP API 2',
                url: (number) => `https://wa.me/${number}`,
                method: 'scrape'
            }
        ];
        this.alternativeMethods = [
            this.fetchViaWhatsAppWeb.bind(this),
            this.fetchViaFacebookGraph.bind(this),
            this.fetchViaPublicAPIs.bind(this)
        ];
        this.imageCache = new Map();
        this.whatsappChannelUrl = 'https://whatsapp.com/channel/0029VaYvyvZ11ulN0pNKHX1u';
        this.timeUpdateInterval = null;
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.loadHistory();
        this.loadStats();
        this.applyTheme();
        this.initGateLoader();
        this.updateUI();
        this.updateStatsDisplay();
        await this.initUserInfo();
        this.setupCountrySelector();
        this.renderCountryList();
        this.initFollowPopup();
    }
    
    initFollowPopup() {
        const now = Date.now();
        const lastShown = this.state.followPopupShown;
        const oneDay = 24 * 60 * 60 * 1000;
        if (lastShown === 0 || (now - lastShown) > oneDay) {
            setTimeout(() => {
                if (this.shouldShowFollowPopup()) {
                    this.openFollowPopup();
                }
            }, 3000);
        }
    }
    
    getDefaultCountries() {
        return [
            /* ===================== AFRICA ===================== */
            { name: 'Ghana', code: '233', flag: '🇬🇭', isDefault: true },
            { name: 'Nigeria', code: '234', flag: '🇳🇬', isDefault: true },
            { name: 'South Africa', code: '27', flag: '🇿🇦', isDefault: true },
            { name: 'Egypt', code: '20', flag: '🇪🇬', isDefault: true },
            { name: 'Kenya', code: '254', flag: '🇰🇪', isDefault: true },
            { name: 'Ethiopia', code: '251', flag: '🇪🇹', isDefault: true },
            { name: 'Tanzania', code: '255', flag: '🇹🇿', isDefault: true },
            { name: 'Uganda', code: '256', flag: '🇺🇬', isDefault: true },
            { name: 'Rwanda', code: '250', flag: '🇷🇼', isDefault: true },
            { name: 'Morocco', code: '212', flag: '🇲🇦', isDefault: true },
            { name: 'Algeria', code: '213', flag: '🇩🇿', isDefault: true },
            { name: 'Tunisia', code: '216', flag: '🇹🇳', isDefault: true },
            { name: 'Libya', code: '218', flag: '🇱🇾', isDefault: true },
            { name: 'Sudan', code: '249', flag: '🇸🇩', isDefault: true },
            { name: 'South Sudan', code: '211', flag: '🇸🇸', isDefault: true },
            { name: 'Cameroon', code: '237', flag: '🇨🇲', isDefault: true },
            { name: 'Ivory Coast', code: '225', flag: '🇨🇮', isDefault: true },
            { name: 'Senegal', code: '221', flag: '🇸🇳', isDefault: true },
            { name: 'Mali', code: '223', flag: '🇲🇱', isDefault: true },
            { name: 'Burkina Faso', code: '226', flag: '🇧🇫', isDefault: true },
            { name: 'Benin', code: '229', flag: '🇧🇯', isDefault: true },
            { name: 'Togo', code: '228', flag: '🇹🇬', isDefault: true },
            { name: 'Niger', code: '227', flag: '🇳🇪', isDefault: true },
            { name: 'Guinea', code: '224', flag: '🇬🇳', isDefault: true },
            { name: 'Sierra Leone', code: '232', flag: '🇸🇱', isDefault: true },
            { name: 'Liberia', code: '231', flag: '🇱🇷', isDefault: true },
            { name: 'Gambia', code: '220', flag: '🇬🇲', isDefault: true },
            { name: 'Zambia', code: '260', flag: '🇿🇲', isDefault: true },
            { name: 'Zimbabwe', code: '263', flag: '🇿🇼', isDefault: true },
            { name: 'Angola', code: '244', flag: '🇦🇴', isDefault: true },
            { name: 'Namibia', code: '264', flag: '🇳🇦', isDefault: true },
            { name: 'Botswana', code: '267', flag: '🇧🇼', isDefault: true },
            { name: 'Mozambique', code: '258', flag: '🇲🇿', isDefault: true },
            { name: 'Malawi', code: '265', flag: '🇲🇼', isDefault: true },
            { name: 'Somalia', code: '252', flag: '🇸🇴', isDefault: true },
            { name: 'Djibouti', code: '253', flag: '🇩🇯', isDefault: true },
            { name: 'Eritrea', code: '291', flag: '🇪🇷', isDefault: true },
            { name: 'Madagascar', code: '261', flag: '🇲🇬', isDefault: true },
            { name: 'Mauritius', code: '230', flag: '🇲🇺', isDefault: true },
            { name: 'Seychelles', code: '248', flag: '🇸🇨', isDefault: true },
            { name: 'Comoros', code: '269', flag: '🇰🇲', isDefault: true },
            { name: 'Cape Verde', code: '238', flag: '🇨🇻', isDefault: true },
            { name: 'Sao Tome and Principe', code: '239', flag: '🇸🇹', isDefault: true },

            /* ===================== ASIA ===================== */
            { name: 'India', code: '91', flag: '🇮🇳', isDefault: true },
            { name: 'China', code: '86', flag: '🇨🇳', isDefault: true },
            { name: 'Japan', code: '81', flag: '🇯🇵', isDefault: true },
            { name: 'South Korea', code: '82', flag: '🇰🇷', isDefault: true },
            { name: 'Pakistan', code: '92', flag: '🇵🇰', isDefault: true },
            { name: 'Indonesia', code: '62', flag: '🇮🇩', isDefault: true },
            { name: 'Bangladesh', code: '880', flag: '🇧🇩', isDefault: true },
            { name: 'Sri Lanka', code: '94', flag: '🇱🇰', isDefault: true },
            { name: 'Nepal', code: '977', flag: '🇳🇵', isDefault: true },
            { name: 'Afghanistan', code: '93', flag: '🇦🇫', isDefault: true },
            { name: 'Iran', code: '98', flag: '🇮🇷', isDefault: true },
            { name: 'Iraq', code: '964', flag: '🇮🇶', isDefault: true },
            { name: 'Israel', code: '972', flag: '🇮🇱', isDefault: true },
            { name: 'UAE', code: '971', flag: '🇦🇪', isDefault: true },
            { name: 'Saudi Arabia', code: '966', flag: '🇸🇦', isDefault: true },
            { name: 'Qatar', code: '974', flag: '🇶🇦', isDefault: true },
            { name: 'Kuwait', code: '965', flag: '🇰🇼', isDefault: true },
            { name: 'Oman', code: '968', flag: '🇴🇲', isDefault: true },
            { name: 'Turkey', code: '90', flag: '🇹🇷', isDefault: true },
            { name: 'Thailand', code: '66', flag: '🇹🇭', isDefault: true },
            { name: 'Malaysia', code: '60', flag: '🇲🇾', isDefault: true },
            { name: 'Philippines', code: '63', flag: '🇵🇭', isDefault: true },
            { name: 'Vietnam', code: '84', flag: '🇻🇳', isDefault: true },

            /* ===================== EUROPE ===================== */
            { name: 'United Kingdom', code: '44', flag: '🇬🇧', isDefault: true },
            { name: 'Germany', code: '49', flag: '🇩🇪', isDefault: true },
            { name: 'France', code: '33', flag: '🇫🇷', isDefault: true },
            { name: 'Italy', code: '39', flag: '🇮🇹', isDefault: true },
            { name: 'Spain', code: '34', flag: '🇪🇸', isDefault: true },
            { name: 'Russia', code: '7', flag: '🇷🇺', isDefault: true },
            { name: 'Netherlands', code: '31', flag: '🇳🇱', isDefault: true },
            { name: 'Belgium', code: '32', flag: '🇧🇪', isDefault: true },
            { name: 'Portugal', code: '351', flag: '🇵🇹', isDefault: true },
            { name: 'Sweden', code: '46', flag: '🇸🇪', isDefault: true },
            { name: 'Norway', code: '47', flag: '🇳🇴', isDefault: true },
            { name: 'Denmark', code: '45', flag: '🇩🇰', isDefault: true },
            { name: 'Finland', code: '358', flag: '🇫🇮', isDefault: true },
            { name: 'Poland', code: '48', flag: '🇵🇱', isDefault: true },
            { name: 'Ukraine', code: '380', flag: '🇺🇦', isDefault: true },

            /* ===================== AMERICAS ===================== */
            { name: 'United States', code: '1', flag: '🇺🇸', isDefault: true },
            { name: 'Canada', code: '1', flag: '🇨🇦', isDefault: true },
            { name: 'Mexico', code: '52', flag: '🇲🇽', isDefault: true },
            { name: 'Brazil', code: '55', flag: '🇧🇷', isDefault: true },
            { name: 'Argentina', code: '54', flag: '🇦🇷', isDefault: true },
            { name: 'Colombia', code: '57', flag: '🇨🇴', isDefault: true },
            { name: 'Chile', code: '56', flag: '🇨🇱', isDefault: true },
            { name: 'Peru', code: '51', flag: '🇵🇪', isDefault: true },
            { name: 'Venezuela', code: '58', flag: '🇻🇪', isDefault: true },
            { name: 'Jamaica', code: '1876', flag: '🇯🇲', isDefault: true },

            /* ===================== OCEANIA ===================== */
            { name: 'Australia', code: '61', flag: '🇦🇺', isDefault: true },
            { name: 'New Zealand', code: '64', flag: '🇳🇿', isDefault: true },
            { name: 'Fiji', code: '679', flag: '🇫🇯', isDefault: true },
            { name: 'Papua New Guinea', code: '675', flag: '🇵🇬', isDefault: true }
        ];
    }
    
    getStoredCountry() {
        const stored = localStorage.getItem('whatsdp_selected_country');
        if (stored) {
            return JSON.parse(stored);
        }
        return null;
    }
    
    setupCountrySelector() {
        const input = this.elements.whatsappNumber;
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.marginBottom = '1.5rem';
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        const trigger = document.createElement('div');
        trigger.className = 'country-selector-trigger';
        trigger.innerHTML = `
            <span class="country-flag">${this.state.selectedCountry.flag}</span>
            <span class="country-name">${this.state.selectedCountry.name}</span>
            <span class="country-code">+${this.state.selectedCountry.code}</span>
            <span class="chevron"><i class="fas fa-chevron-down"></i></span>
        `;
        
        trigger.addEventListener('click', () => this.openCountryModal());
        
        const triggerWrapper = document.createElement('div');
        triggerWrapper.className = 'country-selector-wrapper';
        triggerWrapper.appendChild(trigger);
        
        wrapper.appendChild(triggerWrapper);
        
        const badge = document.createElement('div');
        badge.className = 'selected-country-badge';
        badge.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>+${this.state.selectedCountry.code}</span>
        `;
        badge.style.display = 'flex';
        wrapper.appendChild(badge);
        
        this.elements.countryTrigger = trigger;
        this.elements.selectedCountryBadge = badge;
        
        const updateInputPadding = () => {
            if (window.innerWidth <= 768) {
                input.style.paddingLeft = '110px';
                input.style.paddingRight = '100px';
            } else if (window.innerWidth <= 480) {
                input.style.paddingLeft = '90px';
                input.style.paddingRight = '85px';
            } else {
                input.style.paddingLeft = '160px';
                input.style.paddingRight = '100px';
            }
        };
        
        updateInputPadding();
        window.addEventListener('resize', updateInputPadding);
    }
    
    openCountryModal() {
        this.elements.countryTrigger.classList.add('active');
        this.elements.countryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.elements.countrySearch.focus();
        }, 100);
    }
    
    closeCountryModal() {
        this.elements.countryTrigger.classList.remove('active');
        this.elements.countryModal.classList.remove('active');
        document.body.style.overflow = '';
        
        this.elements.countrySearch.value = '';
        this.filterCountries('');
    }
    
    openAddCountryModal() {
        this.closeCountryModal();
        this.elements.addCountryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.elements.customCountryName.value = '';
        this.elements.customCountryCode.value = '';
        this.elements.customCountryFlag.value = '';
        this.elements.flagPreview.textContent = '';
        this.clearFormErrors();
        
        setTimeout(() => {
            this.elements.customCountryName.focus();
        }, 100);
    }
    
    closeAddCountryModal() {
        this.elements.addCountryModal.classList.remove('active');
        document.body.style.overflow = '';
        this.openCountryModal();
    }
    
    renderCountryList(searchTerm = '') {
        const allCountries = [...this.state.countries, ...this.state.customCountries];
        
        let filteredCountries = allCountries;
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredCountries = allCountries.filter(country => 
                country.name.toLowerCase().includes(searchLower) ||
                country.code.includes(searchTerm) ||
                country.flag.includes(searchTerm)
            );
        }
        
        const recentCountryCodes = this.state.recentCountries.map(c => c.code);
        const recentCountries = filteredCountries.filter(c => recentCountryCodes.includes(c.code));
        const otherCountries = filteredCountries.filter(c => !recentCountryCodes.includes(c.code));
        
        let html = '';
        
        if (window.innerWidth <= 768 && searchTerm) {
            html += `
                <div class="search-results-info">
                    <span class="results-count">${filteredCountries.length} countries found</span>
                </div>
            `;
        }
        
        if (recentCountries.length > 0) {
            html += `<div class="recent-countries">`;
            if (!searchTerm) {
                html += `<div class="section-title">Recent Countries</div>`;
            }
            recentCountries.forEach(country => {
                html += this.renderCountryItem(country);
            });
            html += `</div>`;
        }
        
        if (otherCountries.length > 0) {
            if (recentCountries.length > 0 && !searchTerm) {
                html += `<div class="section-title">All Countries</div>`;
            }
            otherCountries.forEach(country => {
                html += this.renderCountryItem(country);
            });
        }
        
        if (filteredCountries.length === 0) {
            html = `
                <div class="no-results">
                    <i class="fas fa-globe-americas"></i>
                    <p>No countries found</p>
                    <p class="small-text">Try a different search term</p>
                    <button class="btn-secondary" id="clearSearchResults" style="margin-top: 1rem; padding: 0.5rem 1rem;">
                        <i class="fas fa-times"></i>
                        Clear Search
                    </button>
                </div>
            `;
        }
        
        this.elements.countryList.innerHTML = html;
        const clearSearchBtn = this.elements.countryList.querySelector('#clearSearchResults');
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                this.elements.countrySearch.value = '';
                this.filterCountries('');
                this.elements.countrySearch.focus();
            });
        }
        
        this.addCountryItemListeners();
    }
    
    renderCountryItem(country) {
        const isSelected = this.state.selectedCountry.code === country.code;
        const isCustom = !country.isDefault;
        
        return `
            <div class="country-item ${isSelected ? 'selected' : ''}" data-code="${country.code}">
                <span class="country-item-flag">${country.flag}</span>
                <span class="country-item-name">${country.name}</span>
                <span class="country-item-code">+${country.code}</span>
                ${isCustom ? `
                    <button class="country-item-remove" data-action="remove" title="Remove country">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    addCountryItemListeners() {
        const countryItems = this.elements.countryList.querySelectorAll('.country-item');
        
        countryItems.forEach(item => {
            const code = item.dataset.code;
            
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.country-item-remove')) {
                    this.selectCountry(code);
                }
            });
            
            const removeBtn = item.querySelector('.country-item-remove');
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.removeCustomCountry(code);
                });
            }
        });
    }
    
    selectCountry(code) {
        const allCountries = [...this.state.countries, ...this.state.customCountries];
        const country = allCountries.find(c => c.code === code);
        
        if (country) {
            this.state.selectedCountry = country;
            if (window.innerWidth <= 768) {
                this.elements.countryTrigger.innerHTML = `
                    <span class="country-flag">${country.flag}</span>
                    <span class="country-code">+${country.code}</span>
                    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
                `;
            } else {
                this.elements.countryTrigger.innerHTML = `
                    <span class="country-flag">${country.flag}</span>
                    <span class="country-name">${country.name}</span>
                    <span class="country-code">+${country.code}</span>
                    <span class="chevron"><i class="fas fa-chevron-down"></i></span>
                `;
            }
            
            this.elements.selectedCountryBadge.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>+${country.code}</span>
            `;
            
            this.addToRecentCountries(country);
            
            localStorage.setItem('whatsdp_selected_country', JSON.stringify(country));
            
            this.closeCountryModal();
            
            this.showToast('Country Selected', `${country.name} (+${country.code}) selected`, 'success');
        }
    }
    
    addToRecentCountries(country) {
        this.state.recentCountries = this.state.recentCountries.filter(c => c.code !== country.code);
        
        this.state.recentCountries.unshift(country);
        
        if (this.state.recentCountries.length > 5) {
            this.state.recentCountries = this.state.recentCountries.slice(0, 5);
        }
        
        localStorage.setItem('whatsdp_recent_countries', JSON.stringify(this.state.recentCountries));
    }
    
    removeCustomCountry(code) {
        if (confirm('Remove this custom country?')) {
            this.state.customCountries = this.state.customCountries.filter(c => c.code !== code);
            
            this.state.recentCountries = this.state.recentCountries.filter(c => c.code !== code);
            
            if (this.state.selectedCountry.code === code) {
                this.selectCountry(this.state.countries[0].code);
            }
            
            localStorage.setItem('whatsdp_custom_countries', JSON.stringify(this.state.customCountries));
            localStorage.setItem('whatsdp_recent_countries', JSON.stringify(this.state.recentCountries));
            
            this.renderCountryList(this.elements.countrySearch.value);
            
            this.showToast('Country Removed', 'Custom country removed successfully', 'success');
        }
    }
    
    filterCountries(searchTerm) {
        this.renderCountryList(searchTerm);
    }
    
    saveCustomCountry() {
        const name = this.elements.customCountryName.value.trim();
        const code = this.elements.customCountryCode.value.trim();
        const flag = this.elements.customCountryFlag.value.trim();
        
        this.clearFormErrors();
        
        let isValid = true;
        
        if (!name) {
            this.elements.countryNameError.textContent = 'Country name is required';
            isValid = false;
        }
        
        if (!code) {
            this.elements.countryCodeError.textContent = 'Country code is required';
            isValid = false;
        } else if (!/^\d{1,5}$/.test(code)) {
            this.elements.countryCodeError.textContent = 'Country code must be 1-5 digits';
            isValid = false;
        }
        
        const allCountries = [...this.state.countries, ...this.state.customCountries];
        if (allCountries.some(c => c.code === code)) {
            this.elements.countryCodeError.textContent = 'Country code already exists';
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        const country = {
            name,
            code,
            flag: flag || '🏳️',
            isDefault: false
        };
        
        this.state.customCountries.unshift(country);
        
        localStorage.setItem('whatsdp_custom_countries', JSON.stringify(this.state.customCountries));
        
        this.closeAddCountryModal();
        this.selectCountry(code);
        
        this.showToast('Country Added', `${name} (+${code}) added successfully`, 'success');
    }
    
    clearFormErrors() {
        this.elements.countryNameError.textContent = '';
        this.elements.countryCodeError.textContent = '';
    }
    
    updateFlagPreview() {
        const flag = this.elements.customCountryFlag.value.trim();
        this.elements.flagPreview.textContent = flag || '🏳️';
    }
    
    openFollowPopup() {
        this.elements.followPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.elements.followNowBtn.classList.add('pulse');
        this.state.followPopupShown = Date.now();
        localStorage.setItem('whatsdp_follow_popup_shown', JSON.stringify(this.state.followPopupShown));
    }
    
    closeFollowPopup() {
        this.elements.followPopup.classList.remove('active');
        document.body.style.overflow = '';
        this.elements.followNowBtn.classList.remove('pulse');
    }
    
    openFollowChannel() {
        window.open(this.whatsappChannelUrl, '_blank', 'noopener,noreferrer');
        this.closeFollowPopup();
        this.showSuccessNotification('Thanks for following!', 'You\'ll receive updates in your WhatsApp.');
    }
    
    showSuccessNotification(title, message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <div class="success-notification-content">
                <div class="success-notification-title">${title}</div>
                <div class="success-notification-message">${message}</div>
            </div>
            <button class="success-notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        const closeBtn = notification.querySelector('.success-notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    shouldShowFollowPopup() {
        return true;
    }
    
    async initUserInfo() {
        this.detectDeviceInfo();
        await this.getBatteryInfo();
        await this.getNetworkInfo();
        await this.fetchIPAddress();
        this.getTimezoneInfo();
        this.getLanguageInfo();
        this.getCurrentTime();
        this.getScreenResolution();
        this.updateUserInfoUI();
    }
    
    detectDeviceInfo() {
        const ua = navigator.userAgent;
        
        if (/mobile/i.test(ua)) {
            if (/iPhone|iPad|iPod/.test(ua)) {
                this.state.userInfo.deviceType = 'iPhone';
                this.state.userInfo.osName = 'iOS';
            } else if (/Android/.test(ua)) {
                this.state.userInfo.deviceType = 'Android';
                this.state.userInfo.osName = 'Android';
            } else {
                this.state.userInfo.deviceType = 'Mobile';
                this.state.userInfo.osName = 'Unknown';
            }
        } else {
            this.state.userInfo.deviceType = 'Desktop';
            if (/Mac/.test(ua)) {
                this.state.userInfo.osName = 'macOS';
            } else if (/Win/.test(ua)) {
                this.state.userInfo.osName = 'Windows';
            } else if (/Linux/.test(ua)) {
                this.state.userInfo.osName = 'Linux';
            } else {
                this.state.userInfo.osName = 'Unknown';
            }
        }
        
        this.state.userInfo.osVersion = this.getOSVersion(ua);
        this.state.userInfo.browserName = this.getBrowserName(ua);
        this.state.userInfo.browserVersion = this.getBrowserVersion(ua);
    }
    
    getOSVersion(ua) {
        if (/Windows NT 10/.test(ua)) return '10';
        if (/Windows NT 6.3/.test(ua)) return '8.1';
        if (/Windows NT 6.2/.test(ua)) return '8';
        if (/Windows NT 6.1/.test(ua)) return '7';
        if (/Windows NT 6.0/.test(ua)) return 'Vista';
        if (/Windows NT 5.1/.test(ua)) return 'XP';
        
        if (/Mac OS X (\d+[._]\d+)/.test(ua)) {
            const version = /Mac OS X (\d+[._]\d+)/.exec(ua)[1].replace('_', '.');
            return version;
        }
        
        if (/Android (\d+)/.test(ua)) {
            return /Android (\d+)/.exec(ua)[1];
        }
        
        if (/CPU (?:iPhone )?OS (\d+)/.test(ua)) {
            const version = /CPU (?:iPhone )?OS (\d+)/.exec(ua)[1];
            return version.split('_').join('.');
        }
        
        return 'Unknown';
    }
    
    getBrowserName(ua) {
        if (/Chrome/.test(ua) && !/Edge/.test(ua)) return 'Chrome';
        if (/Firefox/.test(ua)) return 'Firefox';
        if (/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
        if (/Edge/.test(ua)) return 'Edge';
        if (/Opera/.test(ua) || /OPR/.test(ua)) return 'Opera';
        if (/Trident/.test(ua)) return 'Internet Explorer';
        return 'Unknown';
    }
    
    getBrowserVersion(ua) {
        const matches = {
            'Chrome': /Chrome\/(\d+)/,
            'Firefox': /Firefox\/(\d+)/,
            'Safari': /Version\/(\d+)/,
            'Edge': /Edge\/(\d+)/,
            'Opera': /(?:Opera|OPR)\/(\d+)/
        };
        
        const browser = this.state.userInfo.browserName;
        if (matches[browser]) {
            const match = ua.match(matches[browser]);
            if (match) return match[1];
        }
        
        return 'Unknown';
    }
    
    async getBatteryInfo() {
        try {
            if ('getBattery' in navigator) {
                const battery = await navigator.getBattery();
                this.state.userInfo.batteryLevel = `${Math.round(battery.level * 100)}%`;
                this.state.userInfo.chargingStatus = battery.charging ? 'Charging' : 'Not Charging';
                
                battery.addEventListener('levelchange', () => {
                    this.state.userInfo.batteryLevel = `${Math.round(battery.level * 100)}%`;
                    this.updateUserInfoUI();
                });
                
                battery.addEventListener('chargingchange', () => {
                    this.state.userInfo.chargingStatus = battery.charging ? 'Charging' : 'Not Charging';
                    this.updateUserInfoUI();
                });
            } else {
                this.state.userInfo.batteryLevel = 'N/A';
                this.state.userInfo.chargingStatus = 'N/A';
            }
        } catch (error) {
            this.state.userInfo.batteryLevel = 'N/A';
            this.state.userInfo.chargingStatus = 'N/A';
        }
    }
    
    async getNetworkInfo() {
        try {
            if ('connection' in navigator) {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                if (connection) {
                    this.state.userInfo.networkType = connection.effectiveType || 'Unknown';
                    this.state.userInfo.networkSpeed = connection.downlink ? `${connection.downlink} Mbps` : 'Unknown';
                } else {
                    this.state.userInfo.networkType = 'Unknown';
                    this.state.userInfo.networkSpeed = 'Unknown';
                }
            } else {
                this.state.userInfo.networkType = 'Unknown';
                this.state.userInfo.networkSpeed = 'Unknown';
            }
        } catch (error) {
            this.state.userInfo.networkType = 'Unknown';
            this.state.userInfo.networkSpeed = 'Unknown';
        }
    }
    
    async fetchIPAddress() {
        try {
            const response = await fetch('https://api.ipify.org?format=json', { timeout: 3000 });
            if (response.ok) {
                const data = await response.json();
                this.state.userInfo.ipAddress = data.ip || 'Not found';
                this.fetchLocationInfo(data.ip);
            } else {
                this.state.userInfo.ipAddress = 'Not available';
            }
        } catch (error) {
            this.state.userInfo.ipAddress = 'Not available';
        }
    }
    
    async fetchLocationInfo(ip) {
        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`, { timeout: 3000 });
            if (response.ok) {
                const data = await response.json();
                this.state.userInfo.country = data.country_name || 'Unknown';
                this.state.userInfo.city = data.city || 'Unknown';
                this.state.userInfo.region = data.region || 'Unknown';
                this.updateUserInfoUI();
            }
        } catch (error) {
        }
    }
    
    getTimezoneInfo() {
        try {
            this.state.userInfo.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            this.state.userInfo.timeZoneOffset = new Date().getTimezoneOffset();
        } catch (error) {
            this.state.userInfo.timeZone = 'Unknown';
            this.state.userInfo.timeZoneOffset = 0;
        }
    }
    
    getLanguageInfo() {
        try {
            this.state.userInfo.language = navigator.language || 'Unknown';
            this.state.userInfo.languages = navigator.languages ? navigator.languages.join(', ') : 'Unknown';
        } catch (error) {
            this.state.userInfo.language = 'Unknown';
            this.state.userInfo.languages = 'Unknown';
        }
    }
    
    getCurrentTime() {
        const now = new Date();
        this.state.userInfo.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.state.userInfo.currentDate = now.toLocaleDateString();
        
        this.timeUpdateInterval = setInterval(() => {
            const newTime = new Date();
            this.state.userInfo.currentTime = newTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            this.updateUserInfoUI();
        }, 60000);
    }
    
    getScreenResolution() {
        this.state.userInfo.screenResolution = `${window.screen.width} × ${window.screen.height}`;
        this.state.userInfo.windowSize = `${window.innerWidth} × ${window.innerHeight}`;
    }
    
    updateUserInfoUI() {
        let userInfoSection = document.querySelector('.user-info-section');
        
        if (!userInfoSection) {
            userInfoSection = document.createElement('div');
            userInfoSection.className = 'user-info-section';
            const statsCard = document.querySelector('.stats-card .card-body');
            if (statsCard) {
                statsCard.appendChild(userInfoSection);
            }
        }
        
        const batteryIcon = this.state.userInfo.batteryLevel !== 'N/A' && this.state.userInfo.chargingStatus === 'Charging' 
            ? '<i class="fas fa-bolt battery-charging"></i>' 
            : '<i class="fas fa-battery-three-quarters battery-icon"></i>';
        
        let networkIcon = '<i class="fas fa-wifi network-wifi"></i>';
        if (this.state.userInfo.networkType === 'cellular' || this.state.userInfo.networkType.includes('4g') || this.state.userInfo.networkType.includes('3g')) {
            networkIcon = '<i class="fas fa-signal network-cellular"></i>';
        } else if (this.state.userInfo.networkType === 'unknown') {
            networkIcon = '<i class="fas fa-question-circle network-offline"></i>';
        }
        
        userInfoSection.innerHTML = `
            <h4><i class="fas fa-laptop-medical"></i> Device Information</h4>
            <div class="user-info-grid">
                <div class="user-info-item" data-tooltip="Your device type">
                    <span class="user-info-label">
                        <i class="fas fa-mobile-alt"></i> Device:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.deviceType}
                        <span class="status-indicator status-online"></span>
                    </span>
                    <span class="user-info-badge">Active</span>
                </div>
                
                <div class="user-info-item" data-tooltip="Your browser information">
                    <span class="user-info-label">
                        <i class="fas fa-globe"></i> Browser:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.browserName} ${this.state.userInfo.browserVersion || ''}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="Operating system version">
                    <span class="user-info-label">
                        <i class="fas fa-cog"></i> OS:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.osName} ${this.state.userInfo.osVersion || ''}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="Screen resolution">
                    <span class="user-info-label">
                        <i class="fas fa-desktop"></i> Screen:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.screenResolution}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="Current battery level">
                    <span class="user-info-label">
                        <i class="fas fa-battery-three-quarters"></i> Battery:
                    </span>
                    <span class="user-info-value battery-container">
                        ${batteryIcon}
                        ${this.state.userInfo.batteryLevel}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="Charging status">
                    <span class="user-info-label">
                        <i class="fas fa-plug"></i> Charging:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.chargingStatus}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="Network connection type">
                    <span class="user-info-label">
                        <i class="fas fa-network-wired"></i> Network:
                    </span>
                    <span class="user-info-value network-indicator">
                        ${networkIcon}
                        ${this.state.userInfo.networkType}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="Your time zone">
                    <span class="user-info-label">
                        <i class="fas fa-clock"></i> Time Zone:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.timeZone || 'Unknown'}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="System languages">
                    <span class="user-info-label">
                        <i class="fas fa-language"></i> Language:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.languages || 'Unknown'}
                    </span>
                </div>
                
                <div class="user-info-item" data-tooltip="Current time">
                    <span class="user-info-label">
                        <i class="fas fa-calendar-alt"></i> Time:
                    </span>
                    <span class="user-info-value">
                        ${this.state.userInfo.currentTime || 'Unknown'}
                    </span>
                </div>
            </div>
        `;
    }
    
    setupEventListeners() {
        this.elements.whatsappNumber.addEventListener('input', (e) => this.validateInput(e.target.value));
        this.elements.whatsappNumber.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.state.isFetching && this.isValidNumber(this.elements.whatsappNumber.value)) {
                this.fetchDP();
            }
        });
        this.elements.fetchButton.addEventListener('click', () => this.fetchDP());
        this.elements.downloadButton.addEventListener('click', () => this.downloadImage());
        this.elements.modalDownload.addEventListener('click', () => this.downloadImage());
        this.elements.zoomButton.addEventListener('click', () => this.openImageModal());
        this.elements.modalOverlay.addEventListener('click', () => this.closeImageModal());
        this.elements.modalClose.addEventListener('click', () => this.closeImageModal());
        this.elements.refreshButton.addEventListener('click', () => {
            if (this.state.currentNumber) {
                this.elements.whatsappNumber.value = this.state.currentNumber.replace('+', '');
                this.fetchDP();
            }
        });
        this.elements.retryButton.addEventListener('click', () => this.fetchDP());
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.elements.historyToggle.addEventListener('click', () => this.toggleHistory());
        this.elements.themeSwitch.addEventListener('change', () => this.toggleTheme());
        this.elements.themeSwitch.checked = this.state.currentTheme === 'dark';
        this.elements.shareButton.addEventListener('click', () => this.shareImage());
        this.elements.formatOptions.forEach(option => {
            option.addEventListener('change', () => this.updateDownloadFormat());
        });

        this.elements.countryModalOverlay.addEventListener('click', () => this.closeCountryModal());
        this.elements.countryModalClose.addEventListener('click', () => this.closeCountryModal());
        this.elements.countrySearch.addEventListener('input', (e) => this.filterCountries(e.target.value));
        this.elements.clearSearch.addEventListener('click', () => {
            this.elements.countrySearch.value = '';
            this.filterCountries('');
            this.elements.countrySearch.focus();
        });
        
        this.elements.addCountryBtn.addEventListener('click', () => this.openAddCountryModal());
        this.elements.addCountryModalOverlay.addEventListener('click', () => this.closeAddCountryModal());
        this.elements.addCountryModalClose.addEventListener('click', () => this.closeAddCountryModal());
        this.elements.cancelAddCountry.addEventListener('click', () => this.closeAddCountryModal());
        this.elements.saveCountryBtn.addEventListener('click', () => this.saveCustomCountry());
        this.elements.customCountryFlag.addEventListener('input', () => this.updateFlagPreview());
        this.elements.followPopupOverlay.addEventListener('click', () => this.closeFollowPopup());
        this.elements.followPopupClose.addEventListener('click', () => this.closeFollowPopup());
        this.elements.followNowBtn.addEventListener('click', () => this.openFollowChannel());
        this.elements.followLaterBtn.addEventListener('click', () => this.closeFollowPopup());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.elements.countryModal.classList.contains('active')) {
                    this.closeCountryModal();
                } else if (this.elements.addCountryModal.classList.contains('active')) {
                    this.closeAddCountryModal();
                } else if (this.elements.imageModal.classList.contains('active')) {
                    this.closeImageModal();
                } else if (this.elements.followPopup.classList.contains('active')) {
                    this.closeFollowPopup();
                }
            }
        });
        
        window.addEventListener('resize', () => {
            this.renderCountryList(this.elements.countrySearch.value);
        });
    }

    openImageModal() {
        if (!this.state.currentImage) return;
        this.elements.imageModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeImageModal() {
        this.elements.imageModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    initGateLoader() {
        setTimeout(() => {
            this.elements.gateLoader.classList.add('fade-out');
            setTimeout(() => {
                this.elements.gateLoader.style.display = 'none';
                this.showToast('WhatsDP Downloader Ready', 'Enter a WhatsApp number to fetch profile picture', 'info');
            }, 300);
        }, 2000);
    }

    validateInput(value) {
        const cleanValue = value.replace(/\D/g, '');
        const length = cleanValue.length;
        
        this.elements.lengthIndicator.textContent = length;
        
        const isValid = this.isValidNumber(cleanValue);
        
        this.elements.formatIndicator.textContent = isValid ? 'Valid' : 'Invalid';
        this.elements.formatIndicator.className = isValid ? 'stat-value valid' : 'stat-value invalid';
        
        this.elements.whatsappNumber.classList.toggle('valid', isValid && length > 0);
        this.elements.whatsappNumber.classList.toggle('invalid', !isValid && length > 0);
        
        this.elements.fetchButton.disabled = !isValid || this.state.isFetching;
        
        return isValid;
    }

    isValidNumber(number) {
        if (!number) return false;
        const phoneRegex = /^[0-9]{8,12}$/;
        return phoneRegex.test(number);
    }

    async fetchDP() {
        let number = this.elements.whatsappNumber.value.replace(/\D/g, '');
        
        if (!this.isValidNumber(number)) {
            this.showToast('Invalid Number', 'Please enter a valid WhatsApp number (8-12 digits)', 'error');
            return;
        }

        const fullNumber = this.state.selectedCountry.code + number;
        this.state.isFetching = true;
        this.state.currentNumber = '+' + fullNumber;
        this.updateUI();
        
        this.showPreviewState('loading');
        this.elements.fetchButton.classList.add('loading');
        
        try {
            let imageData = null;
            try {
                imageData = await this.tryPrimaryAPI(fullNumber);
            } catch (error) {
                console.log('Primary API failed, trying alternatives...');
            }
            
            if (!imageData) {
                for (let i = 0; i < this.apiEndpoints.length && !imageData; i++) {
                    try {
                        const api = this.apiEndpoints[i];
                        imageData = await this.tryAPIEndpoint(api, fullNumber);
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            if (!imageData) {
                for (const method of this.alternativeMethods) {
                    try {
                        imageData = await method(fullNumber);
                        if (imageData) break;
                    } catch (error) {
                        continue;
                    }
                }
            }
            
            if (!imageData) {
                throw new Error('Profile not found or set to private');
            }
            
            this.handleSuccess(imageData.dataUrl, fullNumber, imageData.mimeType);
            
        } catch (error) {
            console.error('Fetch error:', error);
            
            let userMessage = 'Profile not found or set to private';
            
            if (error.message.includes('Network') || error.message.includes('Failed to fetch')) {
                userMessage = 'Network error. Please check your connection.';
            }
            
            this.handleError(userMessage);
        }
    }

    async tryPrimaryAPI(number) {
        const apiUrl = `https://eliteprotech-apis.zone.id/getpp?prompt=${number}`;
        
        const response = await this.safeFetch(apiUrl, {
            headers: { 'Accept': 'application/json' },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.profilePicture || !data.status) {
            throw new Error('No profile picture in response');
        }
        
        const imageUrl = data.profilePicture;
        return await this.fetchAndProcessImage(imageUrl);
    }

    async tryAPIEndpoint(api, number) {
        const url = api.url(number);
        
        switch (api.method) {
            case 'json':
                return await this.fetchViaJSONAPI(url);
            case 'scrape':
                return await this.scrapeWhatsAppPage(url);
            default:
                return await this.fetchViaJSONAPI(url);
        }
    }

    async fetchViaJSONAPI(url) {
        const response = await this.safeFetch(url, {
            headers: { 'Accept': 'application/json' },
            timeout: 8000
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        const imageUrl = data.profilePicture || data.picture || data.avatar || data.url;
        
        if (!imageUrl) {
            throw new Error('No image URL in response');
        }
        
        return await this.fetchAndProcessImage(imageUrl);
    }

    async scrapeWhatsAppPage(url) {
        const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
        
        const response = await this.safeFetch(proxyUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`Scraping failed: ${response.status}`);
        }
        
        const html = await response.text();
        const imageRegex = /https:\/\/pps\.whatsapp\.net[^"\s]+/g;
        const matches = html.match(imageRegex);
        
        if (!matches || matches.length === 0) {
            throw new Error('No profile picture found on page');
        }
        
        const imageUrl = matches[0];
        return await this.fetchAndProcessImage(imageUrl);
    }

    async fetchViaWhatsAppWeb(number) {
        const url = `https://web.whatsapp.com/send?phone=${number}`;
        return await this.scrapeWhatsAppPage(url);
    }

    async fetchViaFacebookGraph(number) {
        const url = `https://graph.facebook.com/v17.0/${number}/picture?type=large&redirect=false`;
        
        const response = await this.safeFetch(url, { timeout: 8000 });
        
        if (!response.ok) {
            throw new Error('Facebook Graph API failed');
        }
        
        const data = await response.json();
        
        if (!data.data || !data.data.url) {
            throw new Error('No Facebook profile picture');
        }
        
        return await this.fetchAndProcessImage(data.data.url);
    }

    async fetchViaPublicAPIs(number) {
        const publicAPIs = [
            `https://api.whatsapp.com/send?phone=${number}&text=hello`,
            `https://api.dpdownload.net/v1/profile?phone=${number}`
        ];
        
        for (const apiUrl of publicAPIs) {
            try {
                const result = await this.fetchViaJSONAPI(apiUrl);
                if (result) return result;
            } catch (error) {
                continue;
            }
        }
        
        throw new Error('All public APIs failed');
    }

    async fetchAndProcessImage(imageUrl) {
        const cacheKey = imageUrl;
        if (this.imageCache.has(cacheKey)) {
            return this.imageCache.get(cacheKey);
        }
        
        let imageResponse;
        
        try {
            imageResponse = await fetch(imageUrl, {
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Accept': 'image/*',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
        } catch (error) {
            const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
            imageResponse = await fetch(proxyUrl, {
                mode: 'cors',
                headers: { 'Accept': 'image/*' }
            });
        }
        
        if (!imageResponse.ok) {
            throw new Error(`Image fetch failed: ${imageResponse.status}`);
        }
        
        const blob = await imageResponse.blob();
        
        if (blob.size === 0 || !blob.type.startsWith('image/')) {
            throw new Error('Not a valid image file');
        }
        
        const dataUrl = await this.blobToDataURL(blob);
        
        const result = {
            dataUrl,
            mimeType: blob.type,
            size: blob.size
        };
        
        this.imageCache.set(cacheKey, result);
        
        if (this.imageCache.size > 50) {
            const firstKey = this.imageCache.keys().next().value;
            this.imageCache.delete(firstKey);
        }
        
        return result;
    }

    async safeFetch(url, options = {}) {
        const { timeout = 8000, ...fetchOptions } = options;
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    blobToDataURL(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to convert image'));
            reader.readAsDataURL(blob);
        });
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

    handleSuccess(dataUrl, number, mimeType) {
        this.state.isFetching = false;
        
        this.state.stats.totalFetches++;
        this.state.stats.successfulFetches++;
        this.saveStats();
        
        const blob = this.dataURLtoBlob(dataUrl);
        const blobUrl = URL.createObjectURL(blob);
        
        this.state.currentImage = {
            dataUrl,
            blobUrl,
            number: '+' + number,
            timestamp: new Date().toISOString(),
            mimeType: mimeType || 'image/jpeg'
        };
        
        this.elements.previewImage.onload = () => {
            console.log('Preview image loaded successfully');
        };
        
        this.elements.previewImage.onerror = (e) => {
            console.error('Preview image failed to load:', e);
            setTimeout(() => {
                this.elements.previewImage.src = blobUrl + '?retry=' + Date.now();
            }, 100);
        };
        
        this.elements.previewImage.src = blobUrl;
        this.elements.modalImage.src = blobUrl;
        this.elements.previewNumber.textContent = '+' + number;
        this.elements.previewTime.textContent = 'Just now';
        
        this.saveToHistory(dataUrl, number);
        
        this.showPreviewState('active');
        this.updateUI();
        this.updateStatsDisplay();
        
        this.showToast('Success!', 'Profile picture fetched successfully', 'success');
        
        setTimeout(() => {
            this.openFollowPopup();
        }, 1500);
    }

    handleError(errorMessage) {
        this.state.isFetching = false;
        
        this.state.stats.totalFetches++;
        this.state.stats.failedFetches++;
        this.saveStats();
        
        this.showPreviewState('error');
        this.updateUI();
        this.updateStatsDisplay();
        
        document.getElementById('errorTitle').textContent = 'Profile Not Found';
        document.getElementById('errorMessage').textContent = errorMessage;
        
        this.showToast('Profile Not Found', 'Profile not found or set to private', 'error');
    }

    updateUI() {
        this.elements.fetchButton.disabled = !this.isValidNumber(this.elements.whatsappNumber.value) || this.state.isFetching;
        this.elements.fetchButton.classList.toggle('loading', this.state.isFetching);
        
        const hasCurrentImage = this.state.currentImage !== null;
        this.elements.previewPlaceholder.classList.toggle('active', !hasCurrentImage && !this.state.isFetching);
        this.elements.refreshButton.disabled = !hasCurrentImage;
        this.elements.zoomButton.disabled = !hasCurrentImage;
        this.elements.downloadButton.disabled = !hasCurrentImage;
        this.elements.shareButton.disabled = !hasCurrentImage;
    }

    showPreviewState(state) {
        ['placeholder', 'loading', 'active', 'error'].forEach(s => {
            this.elements[`preview${s.charAt(0).toUpperCase() + s.slice(1)}`].classList.remove('active');
        });
        
        this.elements[`preview${state.charAt(0).toUpperCase() + state.slice(1)}`].classList.add('active');
    }

    downloadImage() {
        if (!this.state.currentImage) return;
        
        const format = document.querySelector('input[name="format"]:checked').value;
        const number = this.state.currentNumber.replace('+', '');
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `whatsapp-dp-${number}-${timestamp}.${format}`;
        
        const blob = this.dataURLtoBlob(this.state.currentImage.dataUrl);
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        this.showToast('Download Started', `Image saved as ${filename}`, 'success');
    }

    updateDownloadFormat() {
    }

    async shareImage() {
        if (!this.state.currentImage) return;
        
        try {
            if (navigator.share) {
                const blob = this.dataURLtoBlob(this.state.currentImage.dataUrl);
                const file = new File([blob], 'whatsapp-profile.jpg', { type: 'image/jpeg' });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        files: [file],
                        title: 'WhatsApp Profile Picture',
                        text: `Profile picture from ${this.state.currentNumber}`
                    });
                } else {
                    await navigator.share({
                        title: 'WhatsApp Profile Picture',
                        text: `Profile picture from ${this.state.currentNumber}`
                    });
                }
            } else {
                this.copyToClipboard(this.state.currentImage.dataUrl);
                this.showToast('Link Copied', 'Image data copied to clipboard', 'info');
            }
        } catch (error) {
            this.copyToClipboard(this.state.currentImage.dataUrl);
            this.showToast('Link Copied', 'Image URL copied to clipboard', 'info');
        }
    }

    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    toggleTheme() {
        this.state.currentTheme = this.state.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
        localStorage.setItem('theme', this.state.currentTheme);
        this.updateUserInfoUI();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.currentTheme);
    }

    toggleHistory() {
        this.state.isHistoryVisible = !this.state.isHistoryVisible;
        this.elements.historyCard.classList.toggle('hidden', !this.state.isHistoryVisible);
        this.elements.historyToggle.innerHTML = this.state.isHistoryVisible 
            ? '<i class="fas fa-history"></i>' 
            : '<i class="fas fa-eye"></i>';
    }

    saveToHistory(dataUrl, number) {
        const historyItem = {
            id: Date.now(),
            dataUrl,
            number: '+' + number,
            timestamp: new Date().toISOString(),
            mimeType: dataUrl.split(';')[0].split(':')[1] || 'image/jpeg'
        };
        
        this.state.history.unshift(historyItem);
        
        if (this.state.history.length > 50) {
            this.state.history = this.state.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    saveHistory() {
        try {
            localStorage.setItem('whatsdp_history', JSON.stringify(this.state.history));
            this.updateStorageDisplay();
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    loadHistory() {
        try {
            const savedHistory = localStorage.getItem('whatsdp_history');
            if (savedHistory) {
                this.state.history = JSON.parse(savedHistory);
                this.renderHistory();
            }
        } catch (error) {
            console.error('Error loading history:', error);
            this.state.history = [];
        }
    }

    renderHistory() {
        if (this.state.history.length === 0) {
            this.elements.historyEmpty.classList.remove('hidden');
            this.elements.historyGrid.classList.add('hidden');
            return;
        }
        
        this.elements.historyEmpty.classList.add('hidden');
        this.elements.historyGrid.classList.remove('hidden');
        
        this.elements.historyGrid.innerHTML = '';
        
        this.state.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <img src="${item.dataUrl}" alt="WhatsApp DP" loading="lazy" onerror="this.style.display='none'">
                <div class="history-item-overlay">
                    <div class="history-number">${item.number}</div>
                    <div class="history-time">${this.formatTime(item.timestamp)}</div>
                </div>
            `;
            
            historyItem.addEventListener('click', () => {
                this.elements.whatsappNumber.value = item.number.replace('+', '');
                this.validateInput(item.number.replace('+', ''));
                this.state.currentImage = item;
                this.state.currentNumber = item.number;
                
                const blob = this.dataURLtoBlob(item.dataUrl);
                const blobUrl = URL.createObjectURL(blob);
                
                this.elements.previewImage.src = blobUrl;
                this.elements.modalImage.src = blobUrl;
                this.elements.previewNumber.textContent = item.number;
                this.elements.previewTime.textContent = this.formatTime(item.timestamp);
                this.showPreviewState('active');
                this.updateUI();
                this.showToast('Loaded from History', 'Image loaded', 'info');
                
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            });
            
            this.elements.historyGrid.appendChild(historyItem);
        });
    }

    clearHistory() {
        if (this.state.history.length === 0) return;
        
        if (confirm('Clear all history?')) {
            this.state.history.forEach(item => {
                if (item.blobUrl) {
                    URL.revokeObjectURL(item.blobUrl);
                }
            });
            
            this.state.history = [];
            localStorage.removeItem('whatsdp_history');
            this.renderHistory();
            this.updateStorageDisplay();
            this.showToast('History Cleared', 'All history removed', 'success');
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

    loadStats() {
        try {
            const savedStats = localStorage.getItem('whatsdp_stats');
            if (savedStats) {
                this.state.stats = JSON.parse(savedStats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    saveStats() {
        try {
            localStorage.setItem('whatsdp_stats', JSON.stringify(this.state.stats));
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }

    updateStatsDisplay() {
        this.elements.totalFetches.textContent = this.state.stats.totalFetches;
        
        const successRate = this.state.stats.totalFetches > 0 
            ? Math.round((this.state.stats.successfulFetches / this.state.stats.totalFetches) * 100)
            : 100;
        this.elements.successRate.textContent = `${successRate}%`;
        
        this.updateStorageDisplay();
    }

    updateStorageDisplay() {
        try {
            let totalBytes = 0;
            
            this.state.history.forEach(item => {
                if (item.dataUrl) {
                    totalBytes += (item.dataUrl.length * 3) / 4;
                }
            });
            
            const kb = totalBytes / 1024;
            this.elements.storageUsed.textContent = kb < 1024 
                ? `${Math.round(kb)} KB` 
                : `${(kb / 1024).toFixed(1)} MB`;
        } catch (error) {
            this.elements.storageUsed.textContent = '0 KB';
        }
    }

    showToast(title, message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                ${this.getToastIcon(type)}
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.elements.toastContainer.appendChild(toast);
        
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        });
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.add('fade-out');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
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
    
    destroy() {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.whatsDPApp = new WhatsDPDownloader();
});