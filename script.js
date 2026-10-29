document.addEventListener('DOMContentLoaded', () => {

    // Auth Guard: Redirect to login if unauthenticated
    if (localStorage.getItem('isLoggedIn') !== 'true' && !window.location.pathname.endsWith('login.html')) {
        window.location.href = 'login.html';
        return;
    }

    // Active Navigation Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.textContent = '🌙';
    }

    window.toggleTheme = function () {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            if (themeToggle) themeToggle.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeToggle) themeToggle.textContent = '🌙';
        }
    };

    // Custom Toast Notification
    window.showToast = function (message) {
        let toast = document.getElementById('toastNotification');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toastNotification';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    };

    // Custom Logout Modal Controls
    window.confirmLogout = function () {
        const modal = document.getElementById('logoutModal');
        if (modal) {
            modal.classList.add('show');
        } else if (confirm('Are you sure you want to logout?')) {
            executeLogout();
        }
    };

    window.closeLogoutModal = function () {
        const modal = document.getElementById('logoutModal');
        if (modal) {
            modal.classList.remove('show');
        }
    };

    window.executeLogout = function () {
        closeLogoutModal();
        if (typeof showToast === 'function') {
            showToast('👋 Logging out... See you soon!');
        }
        localStorage.removeItem('isLoggedIn');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    };

    // Close modal when clicking outside card
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('logoutModal');
        if (e.target === modal) {
            closeLogoutModal();
        }
    });

    // Easter Egg: Double-click Profile Avatar
    const profileAvatar = document.querySelector('.profile-avatar');
    if (profileAvatar) {
        profileAvatar.addEventListener('dblclick', () => {
            showToast('🎮 Victory favors the prepared mind!');
        });
    }

    // Goal Cards Toggle Handler
    window.toggleDetails = function (card) {
        const details = card.querySelector('.goal-details');
        if (!details) return;
        const isOpen = details.style.display === 'block';
        document.querySelectorAll('.goal-details').forEach(el => el.style.display = 'none');
        details.style.display = isOpen ? 'none' : 'block';
    };

    // Skill Progress Bars Animation
    const skillLevels = document.querySelectorAll('.skill-level');
    if (skillLevels.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.width = entry.target.getAttribute('data-width');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        skillLevels.forEach(bar => observer.observe(bar));
    }

    // Lightbox Functionality for Cards & Thumbnails
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxText = document.getElementById('lightboxText');
    const zoomCards = document.querySelectorAll('.zoomable-card');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    let items = [];
    let currentIndex = 0;

    if (zoomCards.length > 0) {
        // Collect card data (image + title + paragraph text)
        items = Array.from(zoomCards).map(card => {
            const img = card.querySelector('img');
            const title = card.querySelector('.goal-header');
            const text = card.querySelector('p');
            return {
                src: img ? img.src : '',
                title: title ? title.innerHTML : '',
                text: text ? text.innerHTML : ''
            };
        });

        zoomCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                currentIndex = index;
                openLightboxItem(items[currentIndex]);
            });
        });
    } else if (thumbnails.length > 0) {
        // Gallery images
        items = Array.from(thumbnails).map(img => ({
            src: img.src,
            title: '',
            text: ''
        }));

        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                currentIndex = index;
                openLightboxItem(items[currentIndex]);
            });
        });
    }

    window.openLightboxItem = function (item) {
        if (!lightbox || !lightboxImage) return;
        lightboxImage.src = item.src;
        if (lightboxTitle) lightboxTitle.innerHTML = item.title;
        if (lightboxText) lightboxText.innerHTML = item.text;
        
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    window.closeLightbox = function () {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    };

    window.changeImage = function (direction) {
        if (items.length === 0) return;
        currentIndex = (currentIndex + direction + items.length) % items.length;
        openLightboxItem(items[currentIndex]);
    };

    document.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.style.display !== 'block') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') changeImage(-1);
        if (e.key === 'ArrowRight') changeImage(1);
    });

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Scroll Progress Bar
    const progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Scroll Reveal with Automatic Fallback
    const revealElements = document.querySelectorAll('.reveal');
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 50) {
                el.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    // Fallback reveal force
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add('active'));
    }, 200);
});
