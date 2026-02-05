// Import GSAP and ScrollTrigger
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import WOW from 'wow.js';
new WOW().init();
// Register ScrollTrigger plugin once
gsap.registerPlugin(ScrollTrigger);

/**
 * Theme Switcher Module
 * Handles dark/light theme switching functionality
 */
const ThemeSwitcher = (function () {
    'use strict';

    // DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    /**
     * Get saved theme from localStorage or return default
     * @returns {string} Theme name ('dark' or 'light')
     */
    const getSavedTheme = () => {
        return localStorage.getItem('theme') || 'dark';
    };

    /**
     * Apply theme to the document
     * @param {string} theme - Theme name ('dark' or 'light')
     */
    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update button aria-pressed state for accessibility
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
        }

        // Update iOS status bar style
        const statusBarMeta = document.getElementById('status-bar-theme');
        if (statusBarMeta) {
            // 'black' = white text on black background (dark theme)
            // 'default' = black text on white background (light theme)
            statusBarMeta.setAttribute('content', theme === 'dark' ? '#121212' : '#F7F7F7');
        }
    };

    /**
     * Initialize theme on page load
     */
    const init = () => {
        const savedTheme = getSavedTheme();
        setTheme(savedTheme);
    };

    /**
     * Handle theme toggle click event
     * @param {Event} e - Click event
     */
    const handleToggle = (e) => {
        e.preventDefault();
        const currentTheme = getSavedTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    };

    /**
     * Setup event listeners
     */
    const setupEventListeners = () => {
        if (themeToggle) {
            themeToggle.addEventListener('click', handleToggle);
        }
    };

    /**
     * Public API
     */
    return {
        init,
        setupEventListeners
    };
})();

/**
 * Modal Popup Module
 * Handles modal popup opening, closing and form submission
 */
const ModalPopup = (function () {
    'use strict';

    // DOM elements
    const waitlistPopup = document.getElementById('waitlist-popup');
    const donePopup = document.getElementById('done-popup');
    const popupOverlay = document.getElementById('popup-overlay');
    const waitlistForm = document.querySelector('#waitlist-popup .popup__form');

    /**
     * Enable or disable body scroll
     * @param {boolean} disable - Whether to disable scroll
     */
    const toggleBodyScroll = (disable) => {
        document.body.style.overflow = disable ? 'hidden' : '';
    };

    /**
     * Open a popup modal
     * @param {HTMLElement} popup - Popup element to open
     */
    const openPopup = (popup) => {
        if (!popup) return;
        
        popupOverlay?.classList.add('active');
        popup.classList.add('active');
        toggleBodyScroll(true);
    };

    /**
     * Close a popup modal
     * @param {HTMLElement} popup - Popup element to close
     */
    const closePopup = (popup) => {
        if (!popup) return;
        
        popup.classList.remove('active');
        popupOverlay?.classList.remove('active');
        toggleBodyScroll(false);
    };

    /**
     * Close all popups
     */
    const closeAllPopups = () => {
        if (waitlistPopup) waitlistPopup.classList.remove('active');
        if (donePopup) donePopup.classList.remove('active');
        if (popupOverlay) popupOverlay.classList.remove('active');
        toggleBodyScroll(false);
    };

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    const validateEmail = (email) => {
        return email && email.includes('@') && email.length > 3;
    };

    /**
     * Handle waitlist form submission
     * @param {Event} e - Submit event
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        
        const emailInput = waitlistForm.querySelector('input[type="email"]');
        const email = emailInput?.value.trim() || '';

        // Validate email
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // ============================================
        // TEMPORARY SOLUTION - AUTOMATIC EMAIL SENDING
        // TODO: Remove this temporary solution later
        // Automatically sends form submission to dmytro@improvs.com
        // Uses Formspree service for automatic email delivery
        // Setup: 1. Go to https://formspree.io and create account
        //        2. Create a new form and get the form ID
        //        3. Replace 'YOUR_FORMSPREE_FORM_ID' below with your form ID
        //        4. Configure form to send emails to dmytro@improvs.com
        // ============================================
        const sendEmail = async () => {
            try {
                // Using Formspree service for automatic email sending
                // This is a temporary solution - replace with proper backend API later
                const formData = new FormData();
                formData.append('email', email);

                const response = await fetch('https://formspree.io/f/xeeljvqv', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();
                if (!response.ok) {
                    console.error('Email sending failed:', result);
                }
            } catch (error) {
                console.error('Error sending email:', error);
            }
        };

        // Send email automatically (non-blocking)
        sendEmail();
        // ============================================
        // END OF TEMPORARY SOLUTION
        // ============================================

        // Close waitlist popup
        closePopup(waitlistPopup);

        // Open done popup after delay for smooth transition
        setTimeout(() => {
            openPopup(donePopup);
        }, 300);

        // Reset form
        if (emailInput) {
            emailInput.value = '';
        }
    };

    /**
     * Handle join waitlist button click
     * @param {Event} e - Click event
     */
    const handleJoinWaitlistClick = (e) => {
        e.preventDefault();
        openPopup(waitlistPopup);
    };

    /**
     * Handle close button click
     * @param {Event} e - Click event
     */
    const handleCloseButtonClick = (e) => {
        const popup = e.currentTarget.closest('.popup');
        closePopup(popup);
    };

    /**
     * Handle overlay click
     */
    const handleOverlayClick = () => {
        closeAllPopups();
    };

    /**
     * Handle Escape key press
     * @param {Event} e - Keyboard event
     */
    const handleEscapeKey = (e) => {
        if (e.key === 'Escape') {
            closeAllPopups();
        }
    };

    /**
     * Prevent popup from closing when clicking inside
     * @param {Event} e - Click event
     */
    const handlePopupClick = (e) => {
        e.stopPropagation();
    };

    /**
     * Setup event listeners for popups
     */
    const setupEventListeners = () => {
        // Find and attach click handlers to all "Join Waitlist" buttons
        const joinWaitlistButtons = document.querySelectorAll('[data-join-waitlist]');
        joinWaitlistButtons.forEach((button) => {
            button.addEventListener('click', handleJoinWaitlistClick);
        });

        // Close buttons
        const closeButtons = document.querySelectorAll('.popup__close');
        closeButtons.forEach((button) => {
            button.addEventListener('click', handleCloseButtonClick);
        });

        // Overlay click
        if (popupOverlay) {
            popupOverlay.addEventListener('click', handleOverlayClick);
        }

        // Escape key
        document.addEventListener('keydown', handleEscapeKey);

        // Form submission
        if (waitlistForm) {
            waitlistForm.addEventListener('submit', handleFormSubmit);
        }

        // Prevent popup closing on inner click
        [waitlistPopup, donePopup].forEach((popup) => {
            if (popup) {
                popup.addEventListener('click', handlePopupClick);
            }
        });
    };

    /**
     * Public API
     */
    return {
        setupEventListeners,
        openPopup,
        closePopup,
        closeAllPopups
    };
})();

/**
 * Swipe Section Module
 * Handles swipe section scroll animations
 */
const SwipeSection = (function () {
    'use strict';

    /**
     * Initialize swipe section animation
     */
    const init = () => {
        const swipeSection = document.querySelector('.swipe');
        
        if (!swipeSection) {
            return;
        }

        gsap.timeline({
            scrollTrigger: {
                trigger: '.swipe__content',
                start: 'top bottom',
                onEnter: () => {
                    swipeSection.classList.add('active');
                },
            }
        });
    };

    /**
     * Public API
     */
    return {
        init
    };
})();


/**
 * Logo Scroll Animation Module
 * Handles logo movement based on scroll progress
 */
const LogoScrollAnimation = (function () {
    'use strict';

    /**
     * Initialize logo scroll animation
     */
    const init = () => {
        const logoTrack = document.querySelector('.header__logo-track');
        const logo = document.querySelector('.header__logo');
        const headerInner = document.querySelector('.header__inner');
        
        if (!logoTrack || !logo || !headerInner) {
            return;
        }

        let scrollTriggerInstance = null;

        // Function to calculate and update animation
        const updateAnimation = () => {
            // Kill existing ScrollTrigger if any
            if (scrollTriggerInstance) {
                scrollTriggerInstance.kill();
                scrollTriggerInstance = null;
            }

            // Calculate maximum movement distance based on track width
            const trackWidth = logoTrack.offsetWidth;
            const logoWidth = logo.offsetWidth;
            const maxMovement = Math.max(0, trackWidth - logoWidth);

            // Create animation based on scroll progress
            const animation = gsap.to(logo, {
                x: maxMovement,
                ease: 'none',
                scrollTrigger: {
                    trigger: 'body',
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            });

            // Store ScrollTrigger instance for cleanup
            scrollTriggerInstance = animation.scrollTrigger;
        };

        // Initialize animation after a short delay to ensure layout is ready
        setTimeout(() => {
            updateAnimation();
        }, 100);

        // Update on window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                updateAnimation();
            }, 250);
        });
    };

    /**
     * Public API
     */
    return {
        init
    };
})();

const MeetSection = (function () {
    'use strict';

    /**
     * Initialize meet section animation
     */
    const init = () => {
        const meetSection = document.querySelector('.meet');
        const meetTextElements = document.querySelectorAll('.meet__text');
        
        if (!meetSection || meetTextElements.length === 0) {
            return;
        }

        // Add wow classes with delays to each text element
        meetTextElements.forEach((text, index) => {
            if (!text.classList.contains('wow')) {
                text.classList.add('wow');
            }
            text.classList.add(`wow-delay-${index * 0.1}s`);
        });

        // Helper function to add animation classes to all text elements
        const addAnimationClasses = () => {
            meetTextElements.forEach((text) => {
                text.classList.add('animate__animated', 'animate__fadeInUp');
            });
        };

        // Helper function to remove animation classes from all text elements
        const removeAnimationClasses = () => {
            meetTextElements.forEach((text) => {
                text.classList.remove('animate__animated', 'animate__fadeInUp');
            });
        };

        gsap.timeline({
            scrollTrigger: {
                trigger: ".meet__img",
                start: 'bottom bottom',
                onEnter: () => {
                    meetSection.classList.add('active');
                    addAnimationClasses();
                },
                onLeave: () => {
                    meetSection.classList.remove('active');
                    removeAnimationClasses();
                },
                onEnterBack: () => {
                    meetSection.classList.add('active');
                    addAnimationClasses();
                },
                onLeaveBack: () => {
                    meetSection.classList.remove('active');
                    removeAnimationClasses();
                }
            }
        });
    };

    /**
     * Public API
     */
    return {
        init
    };
})();

/**
 * Initialize all modules when DOM is ready
 */
const initApp = () => {
    ThemeSwitcher.init();
    ThemeSwitcher.setupEventListeners();
    ModalPopup.setupEventListeners();
    SwipeSection.init();
    // WalletScroll.init();
    MeetSection.init();
    HeaderButtonBackground.init();
    if(window.innerWidth > 480) {LogoScrollAnimation.init();}
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
    window.addEventListener('resize', initApp);
} else {
    initApp();
    window.addEventListener('resize', initApp);
}
