document.addEventListener('DOMContentLoaded', function() {
        initCountrySelector();
        
        function initCountrySelector() {
            const countryModal = document.getElementById('countryModal');
            const countryModalOverlay = document.getElementById('countryModalOverlay');
            const countryModalClose = document.getElementById('countryModalClose');
            const countrySearch = document.getElementById('countrySearch');
            const clearSearch = document.getElementById('clearSearch');
            const countryList = document.getElementById('countryList');
            const addCountryBtn = document.getElementById('addCountryBtn');
            const addCountryModal = document.getElementById('addCountryModal');
            const addCountryModalOverlay = document.getElementById('addCountryModalOverlay');
            const addCountryModalClose = document.getElementById('addCountryModalClose');
            const customCountryName = document.getElementById('customCountryName');
            const customCountryCode = document.getElementById('customCountryCode');
            const customCountryFlag = document.getElementById('customCountryFlag');
            const flagPreview = document.getElementById('flagPreview');
            const cancelAddCountry = document.getElementById('cancelAddCountry');
            const saveCountryBtn = document.getElementById('saveCountryBtn');
            const countryNameError = document.getElementById('countryNameError');
            const countryCodeError = document.getElementById('countryCodeError');
            
            const defaultCountries = [
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
    
            
            const customCountries = JSON.parse(localStorage.getItem('whatsdp_custom_countries')) || [];
            const recentCountries = JSON.parse(localStorage.getItem('whatsdp_recent_countries')) || [];
            const selectedCountry = JSON.parse(localStorage.getItem('whatsdp_selected_country')) || defaultCountries[0];
            
            const walinkNumberGroup = document.querySelector('.walink-number-group');
            if (walinkNumberGroup) {
                const numberInputCombined = walinkNumberGroup.querySelector('.number-input-combined');
                if (numberInputCombined) {
                    const existingSelector = numberInputCombined.querySelector('.country-selector-container');
                    if (existingSelector) {
                        existingSelector.remove();
                    }
                    
                    const countrySelectorContainer = document.createElement('div');
                    countrySelectorContainer.className = 'country-selector-container';
                    countrySelectorContainer.id = 'walinkCountrySelector';
                    
                    const countryTrigger = document.createElement('div');
                    countryTrigger.className = 'country-selector-trigger';
                    countryTrigger.innerHTML = `
                        <span class="country-flag">${selectedCountry.flag}</span>
                        <span class="country-name">${selectedCountry.name}</span>
                        <span class="country-code">+${selectedCountry.code}</span>
                        <span class="chevron"><i class="fas fa-chevron-down"></i></span>
                    `;
                    
                    countryTrigger.addEventListener('click', () => openCountryModal());
                    countrySelectorContainer.appendChild(countryTrigger);
                    
                    numberInputCombined.insertBefore(countrySelectorContainer, numberInputCombined.firstChild);
                }
            }
            function openCountryModal() {
                if (countryModal) {
                    countryModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    renderCountryList();
                    
                    setTimeout(() => {
                        if (countrySearch) countrySearch.focus();
                    }, 100);
                }
            }
            
            function closeCountryModal() {
                if (countryModal) {
                    countryModal.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    if (countrySearch) {
                        countrySearch.value = '';
                        filterCountries('');
                    }
                }
            }
            
            function openAddCountryModal() {
                closeCountryModal();
                if (addCountryModal) {
                    addCountryModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    if (customCountryName) customCountryName.value = '';
                    if (customCountryCode) customCountryCode.value = '';
                    if (customCountryFlag) customCountryFlag.value = '';
                    if (flagPreview) flagPreview.textContent = '';
                    clearFormErrors();
                    
                    setTimeout(() => {
                        if (customCountryName) customCountryName.focus();
                    }, 100);
                }
            }
            
            function closeAddCountryModal() {
                if (addCountryModal) {
                    addCountryModal.classList.remove('active');
                    document.body.style.overflow = '';
                    openCountryModal();
                }
            }
            
            function renderCountryList(searchTerm = '') {
                if (!countryList) return;
                
                const allCountries = [...defaultCountries, ...customCountries];
                
                let filteredCountries = allCountries;
                if (searchTerm) {
                    const searchLower = searchTerm.toLowerCase();
                    filteredCountries = allCountries.filter(country => 
                        country.name.toLowerCase().includes(searchLower) ||
                        country.code.includes(searchTerm) ||
                        country.flag.includes(searchTerm)
                    );
                }
                
                const recentCountryCodes = recentCountries.map(c => c.code);
                const recentCountriesList = filteredCountries.filter(c => recentCountryCodes.includes(c.code));
                const otherCountries = filteredCountries.filter(c => !recentCountryCodes.includes(c.code));
                
                let html = '';
                
                if (window.innerWidth <= 768 && searchTerm) {
                    html += `
                        <div class="search-results-info">
                            <span class="results-count">${filteredCountries.length} countries found</span>
                        </div>
                    `;
                }
                
                if (recentCountriesList.length > 0) {
                    html += `<div class="recent-countries">`;
                    if (!searchTerm) {
                        html += `<div class="section-title">Recent Countries</div>`;
                    }
                    recentCountriesList.forEach(country => {
                        html += renderCountryItem(country);
                    });
                    html += `</div>`;
                }
                
                if (otherCountries.length > 0) {
                    if (recentCountriesList.length > 0 && !searchTerm) {
                        html += `<div class="section-title">All Countries</div>`;
                    }
                    otherCountries.forEach(country => {
                        html += renderCountryItem(country);
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
                
                countryList.innerHTML = html;
                addCountryItemListeners();
                const clearSearchBtn = countryList.querySelector('#clearSearchResults');
                if (clearSearchBtn) {
                    clearSearchBtn.addEventListener('click', () => {
                        if (countrySearch) {
                            countrySearch.value = '';
                            filterCountries('');
                            countrySearch.focus();
                        }
                    });
                }
            }
            
            function renderCountryItem(country) {
                const isSelected = selectedCountry.code === country.code;
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
            
            function addCountryItemListeners() {
                const countryItems = countryList.querySelectorAll('.country-item');
                
                countryItems.forEach(item => {
                    const code = item.dataset.code;
                    
                    item.addEventListener('click', (e) => {
                        if (!e.target.closest('.country-item-remove')) {
                            selectCountry(code);
                        }
                    });
                    
                    const removeBtn = item.querySelector('.country-item-remove');
                    if (removeBtn) {
                        removeBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            removeCustomCountry(code);
                        });
                    }
                });
            }
            
            function selectCountry(code) {
                const allCountries = [...defaultCountries, ...customCountries];
                const country = allCountries.find(c => c.code === code);
                
                if (country) {
                    
                    const newSelectedCountry = { ...country };
                    
                    localStorage.setItem('whatsdp_selected_country', JSON.stringify(newSelectedCountry));
                    
                    const countryTrigger = document.querySelector('.country-selector-trigger');
                    if (countryTrigger) {
                        if (window.innerWidth <= 768) {
                            countryTrigger.innerHTML = `
                                <span class="country-flag">${country.flag}</span>
                                <span class="country-code">+${country.code}</span>
                                <span class="chevron"><i class="fas fa-chevron-down"></i></span>
                            `;
                        } else {
                            countryTrigger.innerHTML = `
                                <span class="country-flag">${country.flag}</span>
                                <span class="country-name">${country.name}</span>
                                <span class="country-code">+${country.code}</span>
                                <span class="chevron"><i class="fas fa-chevron-down"></i></span>
                            `;
                        }
                    }
                    
                    addToRecentCountries(country);
                    
                    closeCountryModal();
                    
                    showToast('Country Selected', `${country.name} (+${country.code}) selected`, 'success');
                }
            }
            
            function addToRecentCountries(country) {
                const updatedRecent = recentCountries.filter(c => c.code !== country.code);
                updatedRecent.unshift(country);
                
                if (updatedRecent.length > 5) {
                    updatedRecent.length = 5;
                }
                
                localStorage.setItem('whatsdp_recent_countries', JSON.stringify(updatedRecent));
            }
            
            function removeCustomCountry(code) {
                if (confirm('Remove this custom country?')) {
                    const updatedCustom = customCountries.filter(c => c.code !== code);
                    const updatedRecent = recentCountries.filter(c => c.code !== code);
                    
                    localStorage.setItem('whatsdp_custom_countries', JSON.stringify(updatedCustom));
                    localStorage.setItem('whatsdp_recent_countries', JSON.stringify(updatedRecent));
                    
                    if (selectedCountry.code === code) {
                        selectCountry(defaultCountries[0].code);
                    }
                    
                    renderCountryList(countrySearch ? countrySearch.value : '');
                    
                    showToast('Country Removed', 'Custom country removed successfully', 'success');
                }
            }
            
            function filterCountries(searchTerm) {
                renderCountryList(searchTerm);
            }
            
            function saveCustomCountry() {
                if (!customCountryName || !customCountryCode) return;
                
                const name = customCountryName.value.trim();
                const code = customCountryCode.value.trim();
                const flag = customCountryFlag ? customCountryFlag.value.trim() : '';
                
                clearFormErrors();
                
                let isValid = true;
                
                if (!name) {
                    if (countryNameError) countryNameError.textContent = 'Country name is required';
                    isValid = false;
                }
                
                if (!code) {
                    if (countryCodeError) countryCodeError.textContent = 'Country code is required';
                    isValid = false;
                } else if (!/^\d{1,5}$/.test(code)) {
                    if (countryCodeError) countryCodeError.textContent = 'Country code must be 1-5 digits';
                    isValid = false;
                }
                
                const allCountries = [...defaultCountries, ...customCountries];
                if (allCountries.some(c => c.code === code)) {
                    if (countryCodeError) countryCodeError.textContent = 'Country code already exists';
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
                
                const updatedCustom = [country, ...customCountries];
                localStorage.setItem('whatsdp_custom_countries', JSON.stringify(updatedCustom));
                
                closeAddCountryModal();
                selectCountry(code);
            }
            
            function clearFormErrors() {
                if (countryNameError) countryNameError.textContent = '';
                if (countryCodeError) countryCodeError.textContent = '';
            }
            
            function updateFlagPreview() {
                if (customCountryFlag && flagPreview) {
                    const flag = customCountryFlag.value.trim();
                    flagPreview.textContent = flag || '🏳️';
                }
            }
            
            function showToast(title, message, type = 'info') {
                let toastContainer = document.getElementById('toastContainer');
                if (!toastContainer) {
                    toastContainer = document.createElement('div');
                    toastContainer.id = 'toastContainer';
                    toastContainer.className = 'toast-container';
                    document.body.appendChild(toastContainer);
                }
                
                const toast = document.createElement('div');
                toast.className = `toast ${type}`;
                toast.innerHTML = `
                    <div class="toast-icon">
                        ${getToastIcon(type)}
                    </div>
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div class="toast-message">${message}</div>
                    </div>
                    <button class="toast-close">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                toastContainer.appendChild(toast);
                
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
            
            function getToastIcon(type) {
                switch (type) {
                    case 'success': return '<i class="fas fa-check-circle"></i>';
                    case 'error': return '<i class="fas fa-exclamation-circle"></i>';
                    case 'warning': return '<i class="fas fa-exclamation-triangle"></i>';
                    case 'info': return '<i class="fas fa-info-circle"></i>';
                    default: return '<i class="fas fa-info-circle"></i>';
                }
            }
            
            if (countryModalOverlay) {
                countryModalOverlay.addEventListener('click', closeCountryModal);
            }
            
            if (countryModalClose) {
                countryModalClose.addEventListener('click', closeCountryModal);
            }
            
            if (countrySearch) {
                countrySearch.addEventListener('input', (e) => filterCountries(e.target.value));
            }
            
            if (clearSearch) {
                clearSearch.addEventListener('click', () => {
                    if (countrySearch) {
                        countrySearch.value = '';
                        filterCountries('');
                        countrySearch.focus();
                    }
                });
            }
            
            if (addCountryBtn) {
                addCountryBtn.addEventListener('click', openAddCountryModal);
            }
            
            if (addCountryModalOverlay) {
                addCountryModalOverlay.addEventListener('click', closeAddCountryModal);
            }
            
            if (addCountryModalClose) {
                addCountryModalClose.addEventListener('click', closeAddCountryModal);
            }
            
            if (cancelAddCountry) {
                cancelAddCountry.addEventListener('click', closeAddCountryModal);
            }
            
            if (saveCountryBtn) {
                saveCountryBtn.addEventListener('click', saveCustomCountry);
            }
            
            if (customCountryFlag) {
                customCountryFlag.addEventListener('input', updateFlagPreview);
            }
            
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    if (countryModal && countryModal.classList.contains('active')) {
                        closeCountryModal();
                    } else if (addCountryModal && addCountryModal.classList.contains('active')) {
                        closeAddCountryModal();
                    }
                }
            });
        }
    });
