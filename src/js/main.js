// Theme switcher functionality
(function () {
    'use strict';

    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Get saved theme from localStorage or default to dark
    const getSavedTheme = () => {
        return localStorage.getItem('theme') || 'dark';
    };

    // Set theme
    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
        }
    };

    // Initialize theme on page load
    const initTheme = () => {
        const savedTheme = getSavedTheme();
        setTheme(savedTheme);
    };

    // Handle theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            const newTheme = e.target.checked ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // Initialize on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }
})();
