// ============================================
// INITIALIZE EMAILJS - WITH YOUR CREDENTIALS
// ============================================

const EMAILJS_PUBLIC_KEY = 'C1281xwfX4O2NAW8K';
const EMAILJS_SERVICE_ID = 'service_u97eqto';
const EMAILJS_TEMPLATE_ID = 'template_uaroyvs';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ============================================
// ACTIVE STATE FOR NAVIGATION LINKS
// ============================================

// Active state for navigation links
const navLinks = document.querySelectorAll('nav ul li a');
const sections = document.querySelectorAll('section');

// Flag to check if we're currently scrolling via click
let isScrollingViaClick = false;
let scrollTimeout;

// Function to remove 'active' class from all links
function removeActiveClass() {
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
}

// Function to update active link based on scroll position
function updateActiveLinkOnScroll() {
    // DON'T update if we're in the middle of a click-scroll animation
    if (isScrollingViaClick) {
        return;
    }
    
    let current = '';
    const scrollPosition = window.scrollY + 80;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // SPECIAL CASE: At the very top (scroll position 0 or very close)
    if (window.scrollY < 100) {
        current = 'home';
    }
    // Check if at the bottom of the page
    else if (window.scrollY + windowHeight >= documentHeight - 50) {
        current = 'contact';
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
    }
    
    // Update active classes
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Set Home as active initially
window.addEventListener('DOMContentLoaded', () => {
    // Remove any existing active classes
    removeActiveClass();
    
    // Make Home active
    const homeLink = document.querySelector('nav ul li a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
    
    // Setup download CV button
    const downloadBtn = document.getElementById('downloadCVBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadCV);
    }
});

// Listen for scroll events
window.addEventListener('scroll', updateActiveLinkOnScroll);

// Handle clicks on navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        
        // Set flag to disable scroll detection during animation
        isScrollingViaClick = true;
        
        // Remove active from all and add to clicked link
        removeActiveClass();
        link.classList.add('active');
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        // Re-enable scroll detection after animation completes
        scrollTimeout = setTimeout(() => {
            isScrollingViaClick = false;
            // Force one final update to set correct active state
            updateActiveLinkOnScroll();
        }, 900);
    });
});

// Handle button clicks from hero section
const viewProjectsBtn = document.querySelector('.view-projects-btn');
const contactMeBtn = document.querySelector('.contact-me-btn');

if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        isScrollingViaClick = true;
        
        const targetSection = document.querySelector('#projects');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            isScrollingViaClick = false;
            updateActiveLinkOnScroll();
        }, 900);
    });
}

if (contactMeBtn) {
    contactMeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        
        isScrollingViaClick = true;
        
        const targetSection = document.querySelector('#contact');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            isScrollingViaClick = false;
            updateActiveLinkOnScroll();
        }, 900);
    });
}

// Download CV function - Downloads PDF file
function downloadCV() {
    // Replace 'your-cv-file.pdf' with your actual PDF filename
    const pdfUrl = 'Lama-Rajab-CV.pdf';
    
    // Create an invisible link and trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Lama-Rajab-CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================
// RESUME CAROUSEL - COMPLETELY FIXED VERSION
// ============================================

(function() {
    // Data (4 Experiences, 3 Educations)
    const experienceItems = [
        { title: "UI/UX Designer", company: "InternGrup", date: "Mar 2026 - Apr 2026", description: "Enhanced the Social, Blogs, and Blog page designs to improve usability and engagement." },
        { title: "UI/UX Designer Intern", company: "Interphase", date: "Sep 2025 — Dec 2025", description: "Redesigned Populus' website builder to improve usability, efficiency, and overall user experience." },
        { title: "Freelance Designer", company: "Self-employed", date: "Sep 2025", description: "Created a brand logo that reflects the client's identity and strengthens brand recognition." },
        { title: "Freelance Designer", company: "Self-employed", date: "Jun 2025", description: "Designed a physical menu aligned with the restaurant's brand and customer experience." }
    ];
    
    const educationItems = [
        { title: "UI/UX Certification", company: "SE Factory", date: "2025", description: "Completed SE Factory's intensive 9-week UI/UX course, applying design principles through hands-on projects." },
        { title: "UI/UX Certification", company: "Udemy", date: "2025", description: "Andrei Neagoie, Daniel Schifano | Complete Web & Mobile Designer: UI/UX, Figma, +more." },
        { title: "Bachelor in Computer Science", company: "Beirut Arab University", date: "2021 — 2025", description: "Earned my degree in Computer Science, gaining a solid foundation in programming, and problem-solving." }
    ];

    let currentItems = [...experienceItems];
    let scrollContainer = null;
    let dotsContainer = null;
    let carouselContainer = null;
    let isDragging = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let snapTimeout = null;

    // Create card with consistent layout
    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'resume-card';

        const topRow = document.createElement('div');
        topRow.className = 'card-top-row';
        
        const titleSpan = document.createElement('h3');
        titleSpan.className = 'card-title';
        titleSpan.textContent = item.title;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'card-date';
        dateSpan.textContent = item.date;
        
        topRow.appendChild(titleSpan);
        topRow.appendChild(dateSpan);

        const companyElem = document.createElement('p');
        companyElem.className = 'card-company';
        companyElem.textContent = item.company;

        const descElem = document.createElement('p');
        descElem.className = 'card-description';
        descElem.textContent = item.description;

        card.appendChild(topRow);
        card.appendChild(companyElem);
        card.appendChild(descElem);
        
        return card;
    }

    // Render all cards
    function renderCards(items) {
        if (!scrollContainer) return;
        scrollContainer.innerHTML = '';
        items.forEach(item => {
            scrollContainer.appendChild(createCard(item));
        });
        if (carouselContainer) {
            carouselContainer.scrollLeft = 0;
        }
        // Update dots based on number of cards
        updateDotsBasedOnCardCount();
        updateDotsAndScrollPosition();
    }

    // Update dots based on number of cards (2 dots for 4 cards, 1 dot for 3 cards)
    function updateDotsBasedOnCardCount() {
        if (!dotsContainer || !scrollContainer) return;
        
        const totalCards = scrollContainer.children.length;
        // For 2 education cards, only 1 dot; for 4 experience cards, 2 dots
        const numberOfDots = totalCards === 3 ? 1 : 2;
        
        // Only recreate dots if the count changed
        if (dotsContainer.children.length !== numberOfDots) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < numberOfDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) {
                    dot.classList.add('active');
                    dot.style.width = '32px';
                    dot.style.opacity = '1';
                } else {
                    dot.style.width = '8px';
                    dot.style.opacity = '0.5';
                }
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    goToDot(i);
                });
                dotsContainer.appendChild(dot);
            }
        }
    }

    // Get scroll position and update active dot
    function updateDotsAndScrollPosition() {
        if (!carouselContainer || !dotsContainer || !scrollContainer) return;
        
        const scrollLeft = carouselContainer.scrollLeft;
        const cards = Array.from(scrollContainer.children);
        const totalCards = cards.length;
        if (totalCards === 0) return;
        
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        const pageWidth = cardWidth + gap;
        
        // For 2 cards (Education) - only 1 dot, always active
        if (totalCards === 2) {
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            if (dots.length === 1) {
                dots[0].classList.add('active');
                dots[0].style.width = '32px';
                dots[0].style.opacity = '1';
            }
            return;
        }
        
        // For 4 cards (Experience) - 2 dots
        // Calculate which card is currently most visible
        let activeIndex = 0;
        for (let i = 0; i < cards.length; i++) {
            const cardStart = i * pageWidth;
            const cardEnd = cardStart + cardWidth;
            const viewportCenter = scrollLeft + (carouselContainer.clientWidth / 2);
            if (viewportCenter >= cardStart && viewportCenter <= cardEnd) {
                activeIndex = i;
                break;
            }
        }
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        if (dots.length === 2) {
            // First dot active when showing cards 0,1,2 (indices 0,1,2)
            // Second dot active when showing cards 1,2,3 (indices 1,2,3)
            if (activeIndex <= 1) {
                dots[0].classList.add('active');
                dots[0].style.width = '32px';
                dots[0].style.opacity = '1';
                dots[1].classList.remove('active');
                dots[1].style.width = '8px';
                dots[1].style.opacity = '0.5';
            } else {
                dots[1].classList.add('active');
                dots[1].style.width = '32px';
                dots[1].style.opacity = '1';
                dots[0].classList.remove('active');
                dots[0].style.width = '8px';
                dots[0].style.opacity = '0.5';
            }
        }
    }

    // Snap to nearest card (prevents half cards) - LESS RIGID
    function snapToNearestCard() {
        if (!carouselContainer || !scrollContainer) return;
        
        const cards = Array.from(scrollContainer.children);
        const totalCards = cards.length;
        if (totalCards === 0) return;
        
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        const pageWidth = cardWidth + gap;
        const scrollLeft = carouselContainer.scrollLeft;
        
        // For 2 cards (Education) - only one possible position
        if (totalCards === 2) {
            // Just ensure we're not showing half cards
            const maxScroll = (totalCards * pageWidth) - carouselContainer.clientWidth;
            const targetScroll = Math.max(0, Math.min(scrollLeft, maxScroll));
            if (Math.abs(scrollLeft - targetScroll) > 5) {
                carouselContainer.scrollTo({ left: targetScroll, behavior: 'smooth' });
            }
            return;
        }
        
        // For 4 cards - find closest valid snap position (0 or pageWidth)
        const validPositions = [0, pageWidth];
        let closestPosition = 0;
        let minDistance = Infinity;
        
        for (const pos of validPositions) {
            const distance = Math.abs(scrollLeft - pos);
            if (distance < minDistance) {
                minDistance = distance;
                closestPosition = pos;
            }
        }
        
        // Only snap if we're not already close (reduces rigidity)
        if (Math.abs(carouselContainer.scrollLeft - closestPosition) > 15) {
            carouselContainer.scrollTo({ left: closestPosition, behavior: 'smooth' });
        }
        
        setTimeout(() => {
            updateDotsAndScrollPosition();
        }, 300);
    }

    // Go to specific dot
    function goToDot(dotIndex) {
        if (!carouselContainer || !scrollContainer) return;
        
        const cards = Array.from(scrollContainer.children);
        const totalCards = cards.length;
        if (totalCards === 0) return;
        
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = 24;
        const pageWidth = cardWidth + gap;
        
        let targetScrollLeft = 0;
        
        // For 3 cards (Education) - only 1 dot, scroll to beginning
        if (totalCards === 2) {
            targetScrollLeft = 0;
        } else {
            // For 4 cards - dot 0 shows cards 0-2, dot 1 shows cards 1-3
            targetScrollLeft = dotIndex === 0 ? 0 : pageWidth;
        }
        
        carouselContainer.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
        
        // Update dots immediately for visual feedback
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            if (idx === dotIndex) {
                dot.classList.add('active');
                dot.style.width = '32px';
                dot.style.opacity = '1';
            } else {
                dot.classList.remove('active');
                dot.style.width = '8px';
                dot.style.opacity = '0.5';
            }
        });
        
        setTimeout(() => {
            updateDotsAndScrollPosition();
        }, 400);
    }

    // Drag to scroll functionality - LESS RIGID
    function initDragScroll() {
        if (!carouselContainer) return;
        
        // Remove existing listeners to prevent duplicates
        carouselContainer.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
        carouselContainer.removeEventListener('touchstart', onTouchStart);
        carouselContainer.removeEventListener('touchmove', onTouchMove);
        carouselContainer.removeEventListener('touchend', onTouchEnd);
        carouselContainer.removeEventListener('scroll', onScroll);
        
        function onMouseDown(e) {
            isDragging = true;
            carouselContainer.style.cursor = 'grabbing';
            startX = e.pageX - carouselContainer.offsetLeft;
            scrollLeftStart = carouselContainer.scrollLeft;
            e.preventDefault();
        }
        
        function onMouseUp() {
            if (isDragging) {
                isDragging = false;
                carouselContainer.style.cursor = 'grab';
                // Use a longer delay before snapping to feel less rigid
                setTimeout(() => {
                    snapToNearestCard();
                }, 50);
            }
        }
        
        function onMouseMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.pageX - carouselContainer.offsetLeft;
            // Reduced walk multiplier for smoother, less rigid feel (0.8 instead of 1.2)
            const walk = (x - startX) * 0.8;
            carouselContainer.scrollLeft = scrollLeftStart - walk;
        }
        
        function onTouchStart(e) {
            isDragging = true;
            startX = e.touches[0].pageX - carouselContainer.offsetLeft;
            scrollLeftStart = carouselContainer.scrollLeft;
        }
        
        function onTouchMove(e) {
            if (!isDragging) return;
            const x = e.touches[0].pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 0.8;
            carouselContainer.scrollLeft = scrollLeftStart - walk;
            e.preventDefault();
        }
        
        function onTouchEnd() {
            if (isDragging) {
                isDragging = false;
                setTimeout(() => {
                    snapToNearestCard();
                }, 50);
            }
        }
        
        function onScroll() {
            // Update dots during scroll but don't snap aggressively
            updateDotsAndScrollPosition();
            
            // Clear previous timeout
            if (snapTimeout) clearTimeout(snapTimeout);
            
            // Only snap after scrolling completely stops (longer delay for less rigidity)
            snapTimeout = setTimeout(() => {
                snapToNearestCard();
            }, 300);
        }
        
        carouselContainer.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        carouselContainer.addEventListener('touchstart', onTouchStart, { passive: false });
        carouselContainer.addEventListener('touchmove', onTouchMove, { passive: false });
        carouselContainer.addEventListener('touchend', onTouchEnd);
        carouselContainer.addEventListener('scroll', onScroll);
        
        carouselContainer.style.cursor = 'grab';
    }

    // Switch between Experience and Education tabs
    function switchTab(tabId) {
        const expTabBtn = document.querySelector('.resume-tab[data-tab="exp"]');
        const eduTabBtn = document.querySelector('.resume-tab[data-tab="edu"]');
        
        if (tabId === 'exp') {
            expTabBtn.classList.add('active');
            eduTabBtn.classList.remove('active');
            currentItems = [...experienceItems];
        } else {
            eduTabBtn.classList.add('active');
            expTabBtn.classList.remove('active');
            currentItems = [...educationItems];
        }
        
        renderCards(currentItems);
        
        if (carouselContainer) {
            carouselContainer.scrollLeft = 0;
        }
        
        // Reset dots based on card count
        waitForRenderAndUpdateDots();
    }

    function waitForRenderAndUpdateDots() {
        setTimeout(() => {
            const totalCards = scrollContainer.children.length;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            if (totalCards === 2 && dots.length === 1) {
                dots[0].classList.add('active');
                dots[0].style.width = '32px';
                dots[0].style.opacity = '1';
            } else if (totalCards === 4 && dots.length === 2) {
                dots[0].classList.add('active');
                dots[0].style.width = '32px';
                dots[0].style.opacity = '1';
                dots[1].classList.remove('active');
                dots[1].style.width = '8px';
                dots[1].style.opacity = '0.5';
            }
            updateDotsAndScrollPosition();
        }, 20);
    }

    // Initialize everything
    function initResumeCarousel() {
        scrollContainer = document.getElementById('cards-scrollable');
        dotsContainer = document.getElementById('carousel-dots');
        carouselContainer = document.getElementById('carousel-container');
        
        if (!scrollContainer || !dotsContainer || !carouselContainer) return;
        
        // Initialize with experience items
        renderCards(experienceItems);
        
        // Initialize drag scroll
        initDragScroll();
        
        // Set up tab switching
        const expBtn = document.querySelector('.resume-tab[data-tab="exp"]');
        const eduBtn = document.querySelector('.resume-tab[data-tab="edu"]');
        
        if (expBtn) expBtn.addEventListener('click', () => switchTab('exp'));
        if (eduBtn) eduBtn.addEventListener('click', () => switchTab('edu'));
        
        // Update on window resize
        window.addEventListener('resize', () => {
            setTimeout(() => {
                updateDotsBasedOnCardCount();
                snapToNearestCard();
                updateDotsAndScrollPosition();
            }, 100);
        });
        
        // Initial snap
        setTimeout(() => {
            snapToNearestCard();
        }, 200);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResumeCarousel);
    } else {
        initResumeCarousel();
    }
})();

// ============================
// ✨ SIMPLE SCROLL REVEAL
// ============================
const revealElements = document.querySelectorAll(
    '.hero-section, .about-section, .resume-section, .projects-section, .contact-section'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal', 'active');
        }
    });
}, {
    threshold: 0.15
});

revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
});

// ============================================
// CONTACT MODAL WITH EMAILJS - DIRECT EMAIL
// ============================================

const modal = document.getElementById('contactModal');
const sendMessageBtn = document.querySelector('.btn-send');
const closeBtn = document.querySelector('.modal-close');
const contactForm = document.getElementById('contactForm');
const modalSubmitBtn = document.querySelector('.modal-submit-btn');
const formStatus = document.getElementById('formStatus');

// Open modal when clicking Send Message
if (sendMessageBtn) {
    sendMessageBtn.addEventListener('click', (event) => {
        event.preventDefault();
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    });
}

// Close modal functions
function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (contactForm) contactForm.reset();
    if (formStatus) {
        formStatus.innerHTML = '<i class="fas fa-envelope"></i> Your message will be sent directly to my email';
        formStatus.className = 'modal-note';
    }
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
    }
});

// Handle form submission - DIRECT EMAIL (no external app)
if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('modalName').value.trim();
        const email = document.getElementById('modalEmail').value.trim();
        const message = document.getElementById('modalMessage').value.trim();
        
        // Validate
        if (!name || !email || !message) {
            if (formStatus) {
                formStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please fill in all fields';
                formStatus.className = 'form-error';
            }
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (formStatus) {
                formStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Please enter a valid email address';
                formStatus.className = 'form-error';
            }
            return;
        }
        
        // Show loading state
        if (modalSubmitBtn) {
            modalSubmitBtn.classList.add('loading');
            modalSubmitBtn.disabled = true;
            modalSubmitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        }
        
        // Disable inputs
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => input.disabled = true);
        
        // Prepare template parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            moment_date: new Date().toLocaleString()
        };
        
        try {
            // Send email using EmailJS - THIS SENDS DIRECTLY, NO EMAIL APP
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams
            );
            
            console.log('Email sent successfully!', response);
            
            // Show success
            if (formStatus) {
                formStatus.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I will get back to you soon.';
                formStatus.className = 'form-success';
            }
            
            if (modalSubmitBtn) {
                modalSubmitBtn.innerHTML = 'Message Sent! ✓';
                modalSubmitBtn.classList.add('success');
            }
            
            // Reset form
            contactForm.reset();
            
            // Close modal after delay
            setTimeout(() => {
                closeModal();
                
                // Reset button
                if (modalSubmitBtn) {
                    modalSubmitBtn.innerHTML = 'Send Message <img src="Right Arrow.svg" alt="→" class="btn-icon">';
                    modalSubmitBtn.classList.remove('loading', 'success');
                    modalSubmitBtn.disabled = false;
                }
                
                // Re-enable inputs
                inputs.forEach(input => input.disabled = false);
                
            }, 2000);
            
        } catch (error) {
            console.error('Email sending failed:', error);
            
            let errorMessage = 'Failed to send message. ';
            
            if (error.text) {
                errorMessage += error.text;
            } else {
                errorMessage += 'Please try again or email me directly at lamarajab55@gmail.com';
            }
            
            if (formStatus) {
                formStatus.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`;
                formStatus.className = 'form-error';
            }
            
            // Reset button
            if (modalSubmitBtn) {
                modalSubmitBtn.innerHTML = 'Send Message <img src="Right Arrow.svg" alt="→" class="btn-icon">';
                modalSubmitBtn.classList.remove('loading');
                modalSubmitBtn.disabled = false;
            }
            
            // Re-enable inputs
            inputs.forEach(input => input.disabled = false);
        }
    });
}

// Add input focus effects for better UX
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
    });
});
