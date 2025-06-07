// Video backgrounds for different pages
const videoBackgrounds = {
    loading: 'videos/loading-bg.mp4',
    home: 'videos/widelogin.mp4',
    about: 'videos/about.mp4',
    signup: 'videos/signup.mp4'
}; 

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const homePage = document.getElementById('home-page');
const aboutPage = document.getElementById('about-page');
const bgVideo = document.getElementById('bgVideo');
const bgVideoNext = document.getElementById('bgVideoNext');

// Preload all background videos
const videoCache = {};

function preloadVideos() {
    const sources = Object.values(videoBackgrounds);
    sources.forEach(src => {
        const vid = document.createElement('video');
        vid.src = src;
        vid.muted = true;
        vid.playsInline = true;
        vid.preload = 'auto';
        vid.load();
        videoCache[src] = vid;
    });
}

// Handle video end
bgVideo.addEventListener('ended', function() {
    if (!bgVideo.hasAttribute('loop')) {
        bgVideo.currentTime = bgVideo.duration;
        bgVideo.pause();
    }
});

// Helper to fade overlay in/out
function fadeOverlay(show, cb) {
    const overlay = document.getElementById('fade-overlay');
    if (!overlay) return cb && cb();
    overlay.style.transition = 'opacity 0.5s';
    overlay.style.opacity = show ? '1' : '0';
    if (show) {
        setTimeout(() => cb && cb(), 500);
    } else {
        setTimeout(() => cb && cb(), 10);
    }
}

// Crossfade video source change
let currentVideo = bgVideo;
let nextVideo = bgVideoNext;

function changeVideoSource(videoSrc, shouldLoop = true) {
    // Use preloaded video if available
    const cached = videoCache[videoSrc];
    if (cached) {
        nextVideo.src = cached.src;
    } else {
        nextVideo.src = videoSrc;
    }
    nextVideo.currentTime = 0;
    nextVideo.loop = !!shouldLoop;
    nextVideo.muted = true;
    nextVideo.play().catch(() => {});
    // Prepare styles for crossfade
    nextVideo.style.opacity = '0';
    nextVideo.style.filter = 'blur(10px)';
    nextVideo.style.zIndex = '2';
    currentVideo.style.zIndex = '1';
    // Start crossfade
    setTimeout(() => {
        nextVideo.style.opacity = '1';
        nextVideo.style.filter = 'blur(0)';
        currentVideo.style.opacity = '0';
        currentVideo.style.filter = 'blur(10px)';
        // After transition, swap roles
        setTimeout(() => {
            // Pause the old video
            currentVideo.pause();
            // Swap current/next
            const temp = currentVideo;
            currentVideo = nextVideo;
            nextVideo = temp;
        }, 1000); // match CSS transition duration
    }, 50);
}

// Page configurations
const pages = {
    '': { 
        element: homePage, 
        video: videoBackgrounds.home, 
        showDiagonalBg: true,
        loop: false  // Home/login video doesn't loop
    },
    '#home': { 
        element: homePage, 
        video: videoBackgrounds.home, 
        showDiagonalBg: true,
        loop: false  // Home/login video doesn't loop
    },
    '#about': { 
        element: aboutPage, 
        video: videoBackgrounds.about, 
        showDiagonalBg: false,
        loop: false   // About page video does not loop
    },
    '#signup': {
        element: document.getElementById('signup-page'),
        video: videoBackgrounds.signup,
        showDiagonalBg: false,
        loop: false // Sign up video does not loop
    }
};

// Initialize loading screen
window.addEventListener('load', () => {
    preloadVideos();
    // Show loading screen with its video (no loop)
    changeVideoSource(videoBackgrounds.loading, false);
    loadingScreen.style.display = 'flex';
    
    // Simulate loading time (3 seconds)
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            navigateToCurrentHash();
        }, 1000);
    }, 3000);
});

// Handle navigation
window.addEventListener('hashchange', () => {
    fadeOverlay(true, () => {
        navigateToCurrentHash();
        fadeOverlay(false);
    });
});

function navigateToCurrentHash() {
    const hash = window.location.hash;
    const currentPage = pages[hash] || pages[''];
    
    // Hide all pages
    Object.values(pages).forEach(page => {
        page.element.style.display = 'none';
    });
    
    // Show current page with fade effect
    currentPage.element.style.opacity = '0';
    currentPage.element.style.display = 'block';
    
    // Change video with transition
    if (bgVideo.src !== currentPage.video) {
        changeVideoSource(currentPage.video, currentPage.loop);
    }
    
    // Handle diagonal background visibility
    const diagonalBg = document.querySelector('.diagonal-background');
    if (diagonalBg) {
        diagonalBg.style.opacity = currentPage.showDiagonalBg ? '1' : '0';
    }
    
    // Fade in the page
    setTimeout(() => {
        currentPage.element.style.opacity = '1';
    }, 100);
}

// Initialize page state
if (!window.location.hash) {
    window.location.hash = '#home';
}

// --- SIGNUP PAGE LOGIC ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    const favColorInput = document.getElementById('favColor');
    const colorBubble = document.getElementById('color-bubble');
    const colorHex = document.getElementById('color-hex');
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarPlaceholder = document.querySelector('.avatar-placeholder');

    favColorInput.addEventListener('input', function() {
        colorBubble.style.background = favColorInput.value;
        colorHex.textContent = favColorInput.value;
    });

    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                avatarPlaceholder.style.background = `url('${evt.target.result}') center/cover no-repeat`;
                avatarPlaceholder.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
    });

    // --- SIGNUP PAGE ANIMATION LOGIC ---
    function getRandomBlueHex() {
        // Generate a random blue hex code
        // Hues between 200-250, high saturation, medium-lightness
        const h = Math.floor(Math.random() * 50) + 200;
        const s = Math.floor(Math.random() * 40) + 60;
        const l = Math.floor(Math.random() * 30) + 40;
        // Convert HSL to hex
        const rgb = hslToRgb(h / 360, s / 100, l / 100);
        return rgbToHex(rgb[0], rgb[1], rgb[2]);
    }
    function hslToRgb(h, s, l) {
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join("");
    }

    const signupPage = document.getElementById('signup-page');
    if (signupForm && signupPage) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Change headings and user input text to random blue hex codes
            const headings = signupPage.querySelectorAll('.signup-title, .signup-subtitle, .signup-left label, .color-picker-row span');
            headings.forEach(h => {
                const hex = getRandomBlueHex();
                h.textContent = hex;
                h.style.color = hex;
            });
            // Change all input values to random blue hex codes
            const inputs = signupPage.querySelectorAll('.signup-input');
            inputs.forEach(inp => {
                const hex = getRandomBlueHex();
                inp.value = hex;
                inp.style.color = hex;
            });
            // Show configuring text with animated ellipses
            let configuring = document.createElement('div');
            configuring.className = 'configuring-text';
            configuring.innerHTML = 'Configuring<span class="dot1">.</span><span class="dot2">.</span><span class="dot3">.</span>';
            signupPage.appendChild(configuring);
            // Animate ellipses
            let dots = configuring.querySelectorAll('span');
            let i = 0;
            setInterval(() => {
                dots.forEach((dot, idx) => {
                    dot.style.opacity = (i % 3 === idx) ? '1' : '0.3';
                });
                i++;
            }, 350);
            // After 5 seconds, redirect
            setTimeout(() => {
                window.location.href = 'skybox.html';
            }, 5000);
        });
    }
}

// --- LOGIN MODAL LOGIC ---
const loginNav = document.querySelector('.nav-link[href="#login"]');
const loginModal = document.getElementById('login-modal');
const closeLoginModal = document.getElementById('close-login-modal');
if (loginNav && loginModal && closeLoginModal) {
    loginNav.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
    closeLoginModal.addEventListener('click', function() {
        loginModal.style.display = 'none';
    });
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
}

// --- ABOUT PAGE PARALLAX ZOOM EFFECT ---
if (aboutPage && bgVideo) {
    let parallaxActive = false;
    function enableParallax() {
        if (parallaxActive) return;
        parallaxActive = true;
        bgVideo.style.transition = 'transform 0.3s cubic-bezier(.25,.1,.25,1)';
        bgVideo.style.transform = 'scale(1.08)';
        document.addEventListener('mousemove', parallaxMove);
    }
    function disableParallax() {
        parallaxActive = false;
        bgVideo.style.transform = 'scale(1)';
        document.removeEventListener('mousemove', parallaxMove);
    }
    function parallaxMove(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        bgVideo.style.transform = `scale(1.08) translate(${x * 18}px, ${y * 12}px)`;
    }
    bgVideo.addEventListener('pause', function() {
        if (window.location.hash === '#about') {
            enableParallax();
        }
    });
    // Remove effect if navigating away
    window.addEventListener('hashchange', function() {
        if (window.location.hash !== '#about') {
            disableParallax();
        }
    });
}

// --- BEGIN TODAY LINK LOGIC ---
const beginTodayLink = document.querySelector('.begin-today');
if (beginTodayLink) {
    beginTodayLink.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.hash = '#signup';
    });
}

// --- PARALLAX ZOOM EFFECT ON ALL PAGES ---
if (bgVideo) {
    let parallaxActive = false;
    function enableParallax() {
        if (parallaxActive) return;
        parallaxActive = true;
        bgVideo.style.transition = 'transform 0.3s cubic-bezier(.25,.1,.25,1)';
        bgVideo.style.transform = 'scale(1.08)';
        document.addEventListener('mousemove', parallaxMove);
    }
    function disableParallax() {
        parallaxActive = false;
        bgVideo.style.transform = 'scale(1)';
        document.removeEventListener('mousemove', parallaxMove);
    }
    function parallaxMove(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        bgVideo.style.transform = `scale(1.08) translate(${x * 18}px, ${y * 12}px)`;
    }
    // Enable on all pages
    enableParallax();
    // Optionally, you can disable on certain pages by listening to hashchange and calling disableParallax() if needed.
} 