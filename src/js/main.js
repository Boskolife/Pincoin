// Import GSAP and ScrollTrigger
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
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
     * Handle theme toggle change event
     * @param {Event} e - Change event
     */
    const handleToggle = (e) => {
        const newTheme = e.target.checked ? 'dark' : 'light';
        setTheme(newTheme);
    };

    /**
     * Setup event listeners
     */
    const setupEventListeners = () => {
        if (themeToggle) {
            themeToggle.addEventListener('change', handleToggle);
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
    const joinWaitlistButton = document.querySelector('.header__menu-button');
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
        // Join waitlist button
        if (joinWaitlistButton) {
            joinWaitlistButton.addEventListener('click', handleJoinWaitlistClick);
        }

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
                trigger: '.swipe',
                start: 'top top',
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
 * Wallet Scroll Module
 * Handles wallet section scroll animations with pinning and scaling
 */
const WalletScroll = (function () {
    'use strict';

    /**
     * Initialize wallet scroll animations
     */
    const init = () => {
        const panels = gsap.utils.toArray('.wallet');
        
        if (panels.length === 0) {
            return;
        }

        // Remove last panel from animation (if needed)
        const panelsToAnimate = panels.slice(0, -1);

        panelsToAnimate.forEach((panel, i) => {
            // Get the element holding the content inside the panel
            const innerPanel = panel.querySelector('.wallet .container');
            
            // Skip if innerPanel doesn't exist
            if (!innerPanel) {
                console.warn(`No .wallet .container found in panel ${i}`);
                return;
            }
            
            // Get the height of the content inside the panel
            const panelHeight = innerPanel.offsetHeight;
            
            // Get the window height
            const windowHeight = window.innerHeight;
            
            // Calculate difference for fake scroll
            const difference = panelHeight - windowHeight - 1000;
            
            // Ratio (between 0 and 1) representing the portion of the overall animation 
            // that's for the fake-scrolling. We know that the scale & fade should happen 
            // over the course of 1 windowHeight, so we can figure out the ratio based 
            // on how far we must fake-scroll
            const fakeScrollRatio = difference > 0 ? (difference / (difference + windowHeight)) : 0;
            
            // If we need to fake scroll (because the panel is taller than the window), 
            // add the appropriate amount of margin to the bottom so that the next element 
            // comes in at the proper time.
            // Note: Using inline style here is necessary for dynamic margin calculation
            if (fakeScrollRatio) {
                const marginBottom = panelHeight * fakeScrollRatio;
                panel.style.marginBottom = `${marginBottom}px`;
            }
            
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: panel,
                    start: 'bottom bottom',
                    end: () => fakeScrollRatio ? `+=${innerPanel.offsetHeight}` : 'bottom top',
                    pinSpacing: false,
                    pin: true,
                    scrub: true
                }
            });
            
            // Fake scroll. We use 1 because that's what the rest of the timeline consists of 
            // (0.9 scale + 0.1 fade)
            if (fakeScrollRatio) {
                timeline.to(innerPanel, { 
                    y: window.innerHeight, 
                    duration: 1 / (1 - fakeScrollRatio) - 1, 
                    ease: 'none'
                });
            }
            
            timeline.fromTo(panel, 
                { scale: 1, opacity: 1 }, 
                { scale: 0, opacity: 0, duration: 0.9 }
            ).to(panel, { duration: 0.1 });
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
    WalletScroll.init();
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
