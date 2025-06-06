// Video backgrounds for different pages
const videoBackgrounds = {
    loading: 'videos/loading-bg.mp4',
    home: 'videos/login.mp4',
    about: 'videos/about-bg.mp4'
};

// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const homePage = document.getElementById('home-page');
const aboutPage = document.getElementById('about-page');
const bgVideo = document.getElementById('bgVideo');

// Handle video end
bgVideo.addEventListener('ended', function() {
    if (!bgVideo.hasAttribute('loop')) {
        // Seek to the last frame for non-looping videos
        bgVideo.currentTime = bgVideo.duration;
    }
});

// Function to handle video source changes
function changeVideoSource(videoSrc, shouldLoop = true) {
    bgVideo.style.opacity = '0';
    setTimeout(() => {
        bgVideo.src = videoSrc;
        if (shouldLoop) {
            bgVideo.setAttribute('loop', '');
        } else {
            bgVideo.removeAttribute('loop');
        }
        bgVideo.style.opacity = '1';
    }, 500);
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
        loop: true   // About page video loops
    }
};

// Initialize loading screen
window.addEventListener('load', () => {
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
window.addEventListener('hashchange', navigateToCurrentHash);

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