document.addEventListener('mousemove', (e) => {
    const horizontalLine = document.querySelector('.horizontal-line');
    const verticalLine = document.querySelector('.vertical-line');
    
    // Update position of horizontal line
    horizontalLine.style.top = `${e.clientY}px`;
    
    // Update position of vertical line
    verticalLine.style.left = `${e.clientX}px`;
}); 