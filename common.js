document.addEventListener('DOMContentLoaded', function() {
    const followPopup = document.getElementById('followPopup');
    const followPopupOverlay = document.getElementById('followPopupOverlay');
    const followPopupClose = document.getElementById('followPopupClose');
    const followNowBtn = document.getElementById('followNowBtn');
    const followLaterBtn = document.getElementById('followLaterBtn');
    
    if (!followPopup) return;
    
    function openFollowPopup() {
        followPopup.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (followNowBtn) {
            followNowBtn.classList.add('pulse');
        }
    }
    
    function closeFollowPopup() {
        followPopup.classList.remove('active');
        document.body.style.overflow = '';
        if (followNowBtn) {
            followNowBtn.classList.remove('pulse');
        }
    }
    
    function openFollowChannel() {
        const whatsappChannelUrl = 'https://whatsapp.com/channel/0029VaYvyvZ11ulN0pNKHX1u';
        window.open(whatsappChannelUrl, '_blank', 'noopener,noreferrer');
        closeFollowPopup();
        showSuccessNotification('Thanks for following!', 'You\'ll receive updates in your WhatsApp.');
    }
    
    function showSuccessNotification(title, message) {
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
    
    if (followPopupOverlay) {
        followPopupOverlay.addEventListener('click', closeFollowPopup);
    }
    
    if (followPopupClose) {
        followPopupClose.addEventListener('click', closeFollowPopup);
    }
    
    if (followNowBtn) {
        followNowBtn.addEventListener('click', openFollowChannel);
    }
    
    if (followLaterBtn) {
        followLaterBtn.addEventListener('click', closeFollowPopup);
    }
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && followPopup.classList.contains('active')) {
            closeFollowPopup();
        }
    });
    
    const now = Date.now();
    const lastShown = localStorage.getItem('whatsdp_follow_popup_shown');
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (!lastShown || (now - parseInt(lastShown)) > oneDay) {
        setTimeout(() => {
            if (!followPopup.classList.contains('active')) {
                openFollowPopup();
                localStorage.setItem('whatsdp_follow_popup_shown', now.toString());
            }
        }, 3000);
    }
});