/**
 * Weather Bulletin System - Theme JavaScript
 * Handles dark mode toggle and theme persistence
 */

// ============================================
// THEME MANAGER
// ============================================

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        
        this.init();
    }
    
    init() {
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Initialize toggle button
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Listen for system theme changes
        this.initSystemThemeListener();
    }
    
    // ============================================
    // THEME STORAGE
    // ============================================
    
    getStoredTheme() {
        try {
            return localStorage.getItem('weather-app-theme');
        } catch (e) {
            console.warn('LocalStorage not available');
            return null;
        }
    }
    
    setStoredTheme(theme) {
        try {
            localStorage.setItem('weather-app-theme', theme);
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
    
    // ============================================
    // PREFERRED THEME
    // ============================================
    
    getPreferredTheme() {
        // Check if user has a system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    initSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', (e) => {
                // Only auto-switch if user hasn't manually set a preference
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        } else if (mediaQuery.addListener) {
            // Older browsers
            mediaQuery.addListener((e) => {
                if (!this.getStoredTheme()) {
                    this.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }
    
    // ============================================
    // THEME APPLICATION
    // ============================================
    
    applyTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('themechange', { 
            detail: { theme } 
        }));
    }
    
    updateMetaThemeColor(theme) {
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a2e' : '#667eea');
        } else {
            // Create meta tag if it doesn't exist
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme === 'dark' ? '#1a1a2e' : '#667eea';
            document.head.appendChild(meta);
        }
    }
    
    // ============================================
    // THEME TOGGLE
    // ============================================
    
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        this.setStoredTheme(newTheme);
        
        // Add toggle animation
        this.animateToggle();
    }
    
    animateToggle() {
        if (!this.themeToggle) return;
        
        this.themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 150);
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    setTheme(theme) {
        this.applyTheme(theme);
        this.setStoredTheme(theme);
    }
    
    resetToSystem() {
        this.setStoredTheme('');
        this.applyTheme(this.getPreferredTheme());
    }
}

// ============================================
// THEME TRANSITION EFFECTS
// ============================================

function initThemeTransitions() {
    // Add smooth transition for theme changes
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            transition: background-color 0.3s ease, 
                        color 0.3s ease, 
                        border-color 0.3s ease,
                        box-shadow 0.3s ease;
        }
        
        /* Exclude certain elements from transition */
        .weather-canvas, .cloud, .float-icon {
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// THEME-AWARE COMPONENTS
// ============================================

function initThemeAwareComponents() {
    // Update chart colors based on theme
    window.addEventListener('themechange', (e) => {
        updateChartColors(e.detail.theme);
        updateMapColors(e.detail.theme);
    });
}

function updateChartColors(theme) {
    // This would be called if you have charts on the page
    const charts = document.querySelectorAll('.chart-canvas');
    charts.forEach(chart => {
        // Update chart colors based on theme
        chart.dataset.theme = theme;
    });
}

function updateMapColors(theme) {
    // This would be called if you have maps on the page
    const maps = document.querySelectorAll('.weather-map');
    maps.forEach(map => {
        map.dataset.theme = theme;
    });
}

// ============================================
// DYNAMIC BACKGROUND BASED ON THEME
// ============================================

function initDynamicBackground() {
    window.addEventListener('themechange', (e) => {
        const bgLayers = document.querySelectorAll('.bg-layer');
        
        bgLayers.forEach(layer => {
            if (e.detail.theme === 'dark') {
                layer.style.filter = 'brightness(0.6)';
            } else {
                layer.style.filter = 'brightness(1)';
            }
        });
    });
}

// ============================================
// THEME SCHEDULER (OPTIONAL)
// ============================================

class ThemeScheduler {
    constructor() {
        this.schedule = null;
        this.checkInterval = null;
    }
    
    // Schedule theme changes based on time
    scheduleTheme(lightStart = '07:00', darkStart = '19:00') {
        this.schedule = { lightStart, darkStart };
        this.checkSchedule();
        
        // Check every minute
        this.checkInterval = setInterval(() => this.checkSchedule(), 60000);
    }
    
    checkSchedule() {
        if (!this.schedule) return;
        
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        const { lightStart, darkStart } = this.schedule;
        
        // Determine which theme should be active
        let targetTheme;
        if (lightStart < darkStart) {
            // Normal case: light starts before dark
            targetTheme = (currentTime >= lightStart && currentTime < darkStart) ? 'light' : 'dark';
        } else {
            // Inverted case: dark starts before light (crosses midnight)
            targetTheme = (currentTime >= darkStart && currentTime < lightStart) ? 'dark' : 'light';
        }
        
        // Apply if different from current
        if (window.themeManager && window.themeManager.getCurrentTheme() !== targetTheme) {
            // Only auto-switch if user hasn't manually set a preference
            if (!window.themeManager.getStoredTheme()) {
                window.themeManager.applyTheme(targetTheme);
            }
        }
    }
    
    stop() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }
}

// ============================================
// INITIALIZE THEME
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Initialize theme transitions
    initThemeTransitions();
    
    // Initialize theme-aware components
    initThemeAwareComponents();
    
    // Initialize dynamic background
    initDynamicBackground();
    
    // Optional: Initialize theme scheduler
    // window.themeScheduler = new ThemeScheduler();
    // window.themeScheduler.scheduleTheme('07:00', '19:00');
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Shift + L to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        if (window.themeManager) {
            window.themeManager.toggleTheme();
        }
    }
});

// ============================================
// EXPORT FOR MODULE SYSTEMS
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager, ThemeScheduler };
}
