/**
 * Weather Bulletin System - Language JavaScript
 * Handles language switching between English and Hindi
 */

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    en: {
        // App
        appName: 'Weather',
        
        // Navigation
        home: 'Home',
        dashboard: 'Dashboard',
        reportGenerator: 'Report Generator',
        weeklyReport: 'Weekly Report',
        monthlyReport: 'Monthly Report',
        extendedReport: 'Extended Report',
        
        // Home Page
        weatherBulletin: 'Weather Bulletin System',
        stateForecasting: 'State Weather Forecasting Centre',
        quickActions: 'Quick Actions',
        currentStatus: 'Current Status',
        
        // Action Cards
        weeklyDesc: 'Generate weekly weather bulletins',
        monthlyDesc: 'Generate monthly weather reports',
        extendedDesc: 'Long range forecast generator',
        
        // Weather Stats
        temperature: 'Temperature',
        windSpeed: 'Wind Speed',
        humidity: 'Humidity',
        pressure: 'Pressure',
        
        // Report Pages
        weeklyFullDesc: 'Upload daily bulletins to generate a comprehensive weekly weather bulletin report.',
        monthlyFullDesc: 'Upload monthly weather data to generate a comprehensive monthly weather analysis report.',
        extendedFullDesc: 'Generate long-range weather forecasts using advanced meteorological models and historical data analysis.',
        
        // Upload Section
        uploadDaily: 'Upload Daily Bulletins',
        uploadMonthly: 'Upload Monthly Data',
        dragDrop: 'Drag & drop files here',
        orBrowse: 'or click to browse',
        selectedFiles: 'Selected Files',
        
        // Data Sources
        dataSources: 'Data Sources',
        uploadFiles: 'Upload Files',
        fromDatabase: 'From Database',
        fromAPI: 'From Weather API',
        
        // Report Options
        reportOptions: 'Report Options',
        weekStarting: 'Week Starting',
        weekEnding: 'Week Ending',
        selectMonth: 'Select Month',
        reportFormat: 'Report Format',
        includeCharts: 'Include Charts',
        includeSections: 'Include Sections',
        temperatureAnalysis: 'Temperature Analysis',
        rainfallData: 'Rainfall Data',
        windPatterns: 'Wind Patterns',
        humidityLevels: 'Humidity Levels',
        forecastSummary: 'Forecast Summary',
        
        // Extended Report Options
        forecastDuration: 'Forecast Duration',
        days: 'Days',
        forecastModel: 'Forecast Model',
        ensembleModel: 'Ensemble Model',
        ensembleDesc: 'Combines multiple models for higher accuracy',
        numericalModel: 'Numerical Weather Prediction',
        numericalDesc: 'Physics-based atmospheric simulation',
        statisticalModel: 'Statistical Model',
        statisticalDesc: 'Historical pattern analysis',
        aiModel: 'AI-Powered Model',
        aiDesc: 'Machine learning predictions',
        selectRegions: 'Select Regions',
        northRegion: 'North Region',
        southRegion: 'South Region',
        eastRegion: 'East Region',
        westRegion: 'West Region',
        centralRegion: 'Central Region',
        coastalRegion: 'Coastal Region',
        confidenceLevel: 'Confidence Level',
        includeInReport: 'Include in Report',
        temperatureForecast: 'Temperature Forecast',
        precipitationForecast: 'Precipitation Forecast',
        windForecast: 'Wind Forecast',
        severeWeather: 'Severe Weather Alerts',
        confidenceIntervals: 'Confidence Intervals',
        
        // Generate Button
        generateReport: 'Generate Report',
        generateForecast: 'Generate Extended Forecast',
        
        // Progress
        generating: 'Generating Report...',
        generatingForecast: 'Generating Forecast...',
        processingFiles: 'Processing files...',
        runningModels: 'Running prediction models...',
        
        // Result
        reportGenerated: 'Report Generated Successfully!',
        forecastGenerated: 'Forecast Generated Successfully!',
        download: 'Download',
        preview: 'Preview',
        
        // Loading
        loading: 'Loading...'
    },
    
    hi: {
        // App
        appName: 'मौसम',
        
        // Navigation
        home: 'होम',
        dashboard: 'डैशबोर्ड',
        reportGenerator: 'रिपोर्ट जनरेटर',
        weeklyReport: 'साप्ताहिक रिपोर्ट',
        monthlyReport: 'मासिक रिपोर्ट',
        extendedReport: 'विस्तारित रिपोर्ट',
        
        // Home Page
        weatherBulletin: 'मौसम बुलेटिन प्रणाली',
        stateForecasting: 'राज्य मौसम पूर्वानुमान केंद्र',
        quickActions: 'त्वरित कार्रवाई',
        currentStatus: 'वर्तमान स्थिति',
        
        // Action Cards
        weeklyDesc: 'साप्ताहिक मौसम बुलेटिन जनरेट करें',
        monthlyDesc: 'मासिक मौसम रिपोर्ट जनरेट करें',
        extendedDesc: 'दीर्घकालिक पूर्वानुमान जनरेटर',
        
        // Weather Stats
        temperature: 'तापमान',
        windSpeed: 'हवा की गति',
        humidity: 'आर्द्रता',
        pressure: 'दबाव',
        
        // Report Pages
        weeklyFullDesc: 'एक व्यापक साप्ताहिक मौसम बुलेटिन रिपोर्ट जनरेट करने के लिए दैनिक बुलेटिन अपलोड करें।',
        monthlyFullDesc: 'एक व्यापक मासिक मौसम विश्लेषण रिपोर्ट जनरेट करने के लिए मासिक मौसम डेटा अपलोड करें।',
        extendedFullDesc: 'उन्नत मौसम विज्ञान मॉडल और ऐतिहासिक डेटा विश्लेषण का उपयोग करके दीर्घकालिक मौसम पूर्वानुमान जनरेट करें।',
        
        // Upload Section
        uploadDaily: 'दैनिक बुलेटिन अपलोड करें',
        uploadMonthly: 'मासिक डेटा अपलोड करें',
        dragDrop: 'फाइल यहां खींचें और छोड़ें',
        orBrowse: 'या ब्राउज़ करने के लिए क्लिक करें',
        selectedFiles: 'चयनित फाइलें',
        
        // Data Sources
        dataSources: 'डेटा स्रोत',
        uploadFiles: 'फाइलें अपलोड करें',
        fromDatabase: 'डेटाबेस से',
        fromAPI: 'मौसम API से',
        
        // Report Options
        reportOptions: 'रिपोर्ट विकल्प',
        weekStarting: 'सप्ताह प्रारंभ',
        weekEnding: 'सप्ताह समाप्ति',
        selectMonth: 'माह चुनें',
        reportFormat: 'रिपोर्ट प्रारूप',
        includeCharts: 'चार्ट शामिल करें',
        includeSections: 'अनुभाग शामिल करें',
        temperatureAnalysis: 'तापमान विश्लेषण',
        rainfallData: 'वर्षा डेटा',
        windPatterns: 'हवा के पैटर्न',
        humidityLevels: 'आर्द्रता स्तर',
        forecastSummary: 'पूर्वानुमान सारांश',
        
        // Extended Report Options
        forecastDuration: 'पूर्वानुमान अवधि',
        days: 'दिन',
        forecastModel: 'पूर्वानुमान मॉडल',
        ensembleModel: 'एन्सेम्बल मॉडल',
        ensembleDesc: 'उच्च सटीकता के लिए कई मॉडलों को जोड़ता है',
        numericalModel: 'संख्यात्मक मौसम पूर्वानुमान',
        numericalDesc: 'भौतिकी-आधारित वायुमंडलीय सिमुलेशन',
        statisticalModel: 'सांख्यिकीय मॉडल',
        statisticalDesc: 'ऐतिहासिक पैटर्न विश्लेषण',
        aiModel: 'AI-संचालित मॉडल',
        aiDesc: 'मशीन लर्निंग पूर्वानुमान',
        selectRegions: 'क्षेत्र चुनें',
        northRegion: 'उत्तर क्षेत्र',
        southRegion: 'दक्षिण क्षेत्र',
        eastRegion: 'पूर्व क्षेत्र',
        westRegion: 'पश्चिम क्षेत्र',
        centralRegion: 'मध्य क्षेत्र',
        coastalRegion: 'तटीय क्षेत्र',
        confidenceLevel: 'विश्वास स्तर',
        includeInReport: 'रिपोर्ट में शामिल करें',
        temperatureForecast: 'तापमान पूर्वानुमान',
        precipitationForecast: 'वर्षा पूर्वानुमान',
        windForecast: 'हवा पूर्वानुमान',
        severeWeather: 'गंभीर मौसम अलर्ट',
        confidenceIntervals: 'विश्वास अंतराल',
        
        // Generate Button
        generateReport: 'रिपोर्ट जनरेट करें',
        generateForecast: 'विस्तारित पूर्वानुमान जनरेट करें',
        
        // Progress
        generating: 'रिपोर्ट जनरेट हो रही है...',
        generatingForecast: 'पूर्वानुमान जनरेट हो रहा है...',
        processingFiles: 'फाइलें प्रोसेस हो रही हैं...',
        runningModels: 'पूर्वानुमान मॉडल चल रहे हैं...',
        
        // Result
        reportGenerated: 'रिपोर्ट सफलतापूर्वक जनरेट हुई!',
        forecastGenerated: 'पूर्वानुमान सफलतापूर्वक जनरेट हुआ!',
        download: 'डाउनलोड',
        preview: 'पूर्वावलोकन',
        
        // Loading
        loading: 'लोड हो रहा है...'
    }
};

// ============================================
// LANGUAGE MANAGER
// ============================================

class LanguageManager {
    constructor() {
        this.currentLang = this.getStoredLanguage() || 'en';
        this.langButtons = document.querySelectorAll('.lang-btn');
        
        this.init();
    }
    
    init() {
        // Apply initial language
        this.applyLanguage(this.currentLang);
        
        // Initialize language buttons
        this.langButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }
    
    // ============================================
    // LANGUAGE STORAGE
    // ============================================
    
    getStoredLanguage() {
        try {
            return localStorage.getItem('weather-app-language');
        } catch (e) {
            console.warn('LocalStorage not available');
            return null;
        }
    }
    
    setStoredLanguage(lang) {
        try {
            localStorage.setItem('weather-app-language', lang);
        } catch (e) {
            console.warn('LocalStorage not available');
        }
    }
    
    // ============================================
    // LANGUAGE APPLICATION
    // ============================================
    
    applyLanguage(lang) {
        this.currentLang = lang;
        
        // Update HTML lang attribute
        document.documentElement.lang = lang;
        
        // Update all elements with data-key attribute
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(el => {
            const key = el.dataset.key;
            const translation = this.getTranslation(key);
            
            if (translation) {
                // Check if element has child elements (like icons)
                if (el.querySelector('svg, img')) {
                    // Find text nodes and update them
                    this.updateTextContent(el, translation);
                } else {
                    el.textContent = translation;
                }
            }
        });
        
        // Update button states
        this.updateButtonStates();
        
        // Update document title if needed
        this.updateDocumentTitle();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('languagechange', { 
            detail: { language: lang } 
        }));
    }
    
    updateTextContent(element, text) {
        // If element has no children, just set textContent
        if (element.children.length === 0) {
            element.textContent = text;
            return;
        }
        
        // Find the first text node and update it
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                node.textContent = text;
                return;
            }
        }
        
        // If no text node found, prepend text
        element.insertBefore(document.createTextNode(text), element.firstChild);
    }
    
    getTranslation(key) {
        const langData = translations[this.currentLang];
        return langData ? langData[key] : null;
    }
    
    updateButtonStates() {
        this.langButtons.forEach(btn => {
            if (btn.dataset.lang === this.currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    updateDocumentTitle() {
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            const titleText = pageTitle.textContent;
            document.title = `${titleText} - Weather Bulletin System`;
        }
    }
    
    // ============================================
    // LANGUAGE SETTING
    // ============================================
    
    setLanguage(lang) {
        if (lang === this.currentLang) return;
        
        // Add transition effect
        document.body.style.opacity = '0.7';
        
        setTimeout(() => {
            this.applyLanguage(lang);
            this.setStoredLanguage(lang);
            document.body.style.opacity = '1';
        }, 150);
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    translate(key) {
        return this.getTranslation(key) || key;
    }
}

// ============================================
// RTL SUPPORT (for future expansion)
// ============================================

function initRTLSupport() {
    // Check if current language is RTL
    const rtlLanguages = ['ar', 'he', 'ur', 'fa'];
    
    window.addEventListener('languagechange', (e) => {
        const isRTL = rtlLanguages.includes(e.detail.language);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    });
}

// ============================================
// LANGUAGE DETECTION
// ============================================

function detectBrowserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const shortLang = browserLang.split('-')[0];
    
    // Check if we support this language
    if (translations[shortLang]) {
        return shortLang;
    }
    
    return 'en'; // Default to English
}

// ============================================
// DYNAMIC TRANSLATION UPDATES
// ============================================

function initDynamicTranslations() {
    // Watch for new elements added to DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if new element has data-key
                    if (node.dataset.key) {
                        const translation = window.languageManager?.getTranslation(node.dataset.key);
                        if (translation) {
                            node.textContent = translation;
                        }
                    }
                    
                    // Check children
                    node.querySelectorAll?.('[data-key]').forEach(el => {
                        const translation = window.languageManager?.getTranslation(el.dataset.key);
                        if (translation) {
                            el.textContent = translation;
                        }
                    });
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// ============================================
// INITIALIZE LANGUAGE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language manager
    window.languageManager = new LanguageManager();
    
    // Initialize RTL support
    initRTLSupport();
    
    // Initialize dynamic translations
    initDynamicTranslations();
});

// ============================================
// EXPORT FOR MODULE SYSTEMS
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageManager, translations };
}
