// Create bubbles background
function createBubbles() {
    const container = document.querySelector('.bubbles-container');
    // Reduce bubble count on mobile devices for better performance
    const isMobile = window.innerWidth <= 768;
    const bubbleCount = isMobile ? 15 : 30;
    
    for (let i = 0; i < bubbleCount; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        
        // Random size between 20px and 100px
        const size = Math.random() * 80 + 20;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        
        // Random position
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.top = `${Math.random() * 100}%`;
        
        // Random animation duration and delay
        bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;
        bubble.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(bubble);
    }
}

// Handle scroll effect on bubbles
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const bubbles = document.querySelectorAll('.bubble');
    const scrollDiff = window.scrollY - lastScrollY;
    
    bubbles.forEach((bubble, index) => {
        const speed = (index % 3 + 1) * 0.3;
        const currentTransform = bubble.style.transform || '';
        const translateY = scrollDiff * speed;
        
        bubble.style.transform = `${currentTransform} translateY(${-translateY}px)`;
    });
    
    lastScrollY = window.scrollY;
});

// Handle cursor interaction with bubbles
// Detect if device has touch capability
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Only enable cursor interaction on non-touch devices
if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        const bubbles = document.querySelectorAll('.bubble');
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        bubbles.forEach((bubble) => {
            const rect = bubble.getBoundingClientRect();
            const bubbleX = rect.left + rect.width / 2;
            const bubbleY = rect.top + rect.height / 2;
            
            // Calculate distance between cursor and bubble
            const distanceX = mouseX - bubbleX;
            const distanceY = mouseY - bubbleY;
            const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
            
            // If cursor is within 150px of bubble, push it away
            const maxDistance = 150;
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const moveX = -distanceX * force * 0.5;
                const moveY = -distanceY * force * 0.5;
                
                bubble.style.transform = `translate(${moveX}px, ${moveY}px)`;
                bubble.style.transition = 'transform 0.2s ease-out';
            } else {
                // Reset to original animation when cursor is far
                bubble.style.transform = '';
                bubble.style.transition = 'transform 0.8s ease-out';
            }
        });
    });
}

// intersection observer for scroll-triggered appearance
document.addEventListener('DOMContentLoaded', () => {
    createBubbles();
    const items = document.querySelectorAll('.scroll-item, .slide');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, { threshold: 0.1 });
    items.forEach(item => observer.observe(item));

    // obscure mode toggle
    const btn = document.getElementById('obscure-toggle');
    const icon = btn.querySelector('i');
    btn.addEventListener('click', () => {
        document.body.classList.toggle('obscure-mode');
        btn.classList.toggle('active');
        
        // Remove animation class if it exists, force reflow, then add it back
        btn.classList.remove('button-toggle-animation');
        void btn.offsetWidth; // Force reflow
        btn.classList.add('button-toggle-animation');
        
        // Toggle between moon and sun icons with animation
        if (document.body.classList.contains('obscure-mode')) {
            const currentIcon = btn.querySelector('i');
            currentIcon.classList.remove('sunrise-animation');
            void currentIcon.offsetWidth; // Force reflow
            currentIcon.classList.add('night-animation');
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            }, 300);
        } else {
            const currentIcon = btn.querySelector('i');
            currentIcon.classList.remove('night-animation');
            void currentIcon.offsetWidth; // Force reflow
            currentIcon.classList.add('sunrise-animation');
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-moon"></i> Night Mode';
            }, 300);
        }
        
        // Remove button animation class after it completes
        setTimeout(() => {
            btn.classList.remove('button-toggle-animation');
        }, 600);
    });
});
