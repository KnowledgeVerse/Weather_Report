/**
 * Weather Bulletin System - Main JavaScript
 * Handles particle effects, file uploads, report generation, and UI interactions
 */

// ============================================
// WEATHER PARTICLE SYSTEM
// ============================================

class WeatherParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.weatherType = 'rain'; // rain, snow, wind, clear
        this.animationId = null;
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.animate();
        
        // Handle resize
        window.addEventListener('resize', () => this.resize());
        
        // Change weather type periodically
        setInterval(() => this.changeWeatherType(), 15000);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        const particleCount = this.getParticleCount();
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    getParticleCount() {
        switch (this.weatherType) {
            case 'rain': return 150;
            case 'snow': return 100;
            case 'wind': return 50;
            default: return 0;
        }
    }
    
    createParticle() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        switch (this.weatherType) {
            case 'rain':
                return {
                    x: Math.random() * width,
                    y: Math.random() * height - height,
                    length: Math.random() * 20 + 10,
                    speed: Math.random() * 10 + 15,
                    opacity: Math.random() * 0.5 + 0.3
                };
            
            case 'snow':
                return {
                    x: Math.random() * width,
                    y: Math.random() * height - height,
                    radius: Math.random() * 3 + 1,
                    speed: Math.random() * 2 + 1,
                    drift: Math.random() * 2 - 1,
                    opacity: Math.random() * 0.6 + 0.4
                };
            
            case 'wind':
                return {
                    x: Math.random() * width - width,
                    y: Math.random() * height,
                    length: Math.random() * 100 + 50,
                    speed: Math.random() * 15 + 10,
                    opacity: Math.random() * 0.3 + 0.1
                };
            
            default:
                return {};
        }
    }
    
    updateParticles() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.particles.forEach(particle => {
            switch (this.weatherType) {
                case 'rain':
                    particle.y += particle.speed;
                    if (particle.y > height) {
                        particle.y = -particle.length;
                        particle.x = Math.random() * width;
                    }
                    break;
                
                case 'snow':
                    particle.y += particle.speed;
                    particle.x += particle.drift;
                    
                    if (particle.y > height) {
                        particle.y = -10;
                        particle.x = Math.random() * width;
                    }
                    if (particle.x > width) particle.x = 0;
                    if (particle.x < 0) particle.x = width;
                    break;
                
                case 'wind':
                    particle.x += particle.speed;
                    if (particle.x > width) {
                        particle.x = -particle.length;
                        particle.y = Math.random() * height;
                    }
                    break;
            }
        });
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            
            switch (this.weatherType) {
                case 'rain':
                    this.ctx.strokeStyle = `rgba(174, 194, 224, ${particle.opacity})`;
                    this.ctx.lineWidth = 1.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(particle.x, particle.y + particle.length);
                    this.ctx.stroke();
                    break;
                
                case 'snow':
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                    this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                    break;
                
                case 'wind':
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${particle.opacity})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(particle.x + particle.length, particle.y);
                    this.ctx.stroke();
                    break;
            }
        });
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    changeWeatherType() {
        const types = ['rain', 'snow', 'wind', 'clear'];
        const currentIndex = types.indexOf(this.weatherType);
        const nextIndex = (currentIndex + 1) % types.length;
        
        this.weatherType = types[nextIndex];
        this.createParticles();
        
        // Update background based on weather
        this.updateBackground();
    }
    
    updateBackground() {
        const bgLayers = document.querySelectorAll('.bg-layer');
        
        bgLayers.forEach(layer => {
            layer.style.opacity = '0';
        });
        
        setTimeout(() => {
            switch (this.weatherType) {
                case 'rain':
                    document.querySelector('.bg-storm').style.opacity = '0.7';
                    break;
                case 'snow':
                    document.querySelector('.bg-sky').style.opacity = '1';
                    break;
                case 'wind':
                    document.querySelector('.bg-sunset').style.opacity = '0.5';
                    break;
                case 'clear':
                    document.querySelector('.bg-sky').style.opacity = '1';
                    break;
            }
        }, 500);
    }
    
    triggerLightning() {
        const flash = document.querySelector('.lightning-flash');
        if (flash) {
            flash.style.animation = 'none';
            flash.offsetHeight; // Trigger reflow
            flash.style.animation = 'lightningFlash 0.2s ease-out';
        }
    }
    
    destroy() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// ============================================
// FILE UPLOAD HANDLER
// ============================================

class FileUploadHandler {
    constructor() {
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileList = document.getElementById('fileList');
        this.fileListContainer = document.getElementById('fileListContainer');
        this.files = [];
        
        if (this.uploadArea) {
            this.init();
        }
    }
    
    init() {
        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // File input change
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Click to browse
        this.uploadArea.addEventListener('click', () => {
            this.fileInput.click();
        });
    }
    
    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }
    
    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const droppedFiles = Array.from(e.dataTransfer.files);
        this.addFiles(droppedFiles);
    }
    
    handleFileSelect(e) {
        const selectedFiles = Array.from(e.target.files);
        this.addFiles(selectedFiles);
    }
    
    addFiles(newFiles) {
        this.files = [...this.files, ...newFiles];
        this.updateFileList();
    }
    
    removeFile(index) {
        this.files.splice(index, 1);
        this.updateFileList();
    }
    
    updateFileList() {
        if (this.files.length === 0) {
            this.fileList.classList.remove('has-files');
            return;
        }
        
        this.fileList.classList.add('has-files');
        this.fileListContainer.innerHTML = '';
        
        this.files.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'file-item';
            li.innerHTML = `
                <span class="file-name">${file.name}</span>
                <button class="file-remove" data-index="${index}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            `;
            this.fileListContainer.appendChild(li);
        });
        
        // Add remove event listeners
        this.fileListContainer.querySelectorAll('.file-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.removeFile(index);
            });
        });
    }
}

// ============================================
// REPORT GENERATOR
// ============================================

class ReportGenerator {
    constructor() {
        this.generateBtn = document.getElementById('generateBtn');
        this.progressSection = document.getElementById('progressSection');
        this.resultSection = document.getElementById('resultSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressStatus = document.getElementById('progressStatus');
        this.resultFilename = document.getElementById('resultFilename');
        
        if (this.generateBtn) {
            this.init();
        }
    }
    
    init() {
        this.generateBtn.addEventListener('click', () => this.generateReport());
        
        // Download and preview buttons
        const downloadBtn = document.getElementById('downloadBtn');
        const previewBtn = document.getElementById('previewBtn');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadReport());
        }
        
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewReport());
        }
    }
    
    async generateReport() {
        // Hide generate button
        this.generateBtn.style.display = 'none';
        
        // Show progress section
        this.progressSection.classList.add('active');
        
        // Simulate progress
        const stages = [
            { progress: 20, status: 'Reading input files...' },
            { progress: 40, status: 'Analyzing weather data...' },
            { progress: 60, status: 'Generating charts...' },
            { progress: 80, status: 'Compiling report...' },
            { progress: 100, status: 'Finalizing...' }
        ];
        
        for (const stage of stages) {
            await this.delay(800);
            this.progressFill.style.width = `${stage.progress}%`;
            this.progressStatus.textContent = stage.getAttribute ? stage.getAttribute('data-key') : stage.status;
        }
        
        await this.delay(500);
        
        // Hide progress, show result
        this.progressSection.classList.remove('active');
        this.resultSection.classList.add('active');
        
        // Generate filename
        const date = new Date().toISOString().split('T')[0];
        const reportType = window.location.pathname.includes('weekly') ? 'weekly' :
                          window.location.pathname.includes('monthly') ? 'monthly' : 'extended';
        this.resultFilename.textContent = `${reportType}_report_${date}.pdf`;
    }
    
    downloadReport() {
        // Simulate download
        const link = document.createElement('a');
        link.href = '#';
        link.download = this.resultFilename.textContent;
        
        // Show notification
        this.showNotification('Report downloaded successfully!', 'success');
    }
    
    previewReport() {
        // Simulate preview
        this.showNotification('Opening preview...', 'info');
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

function initRippleEffect() {
    document.querySelectorAll('.generate-btn, .result-btn, .action-card').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================

function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-layer, .float-icon');
    
    let ticking = false;
    
    document.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const mouseX = e.clientX / window.innerWidth - 0.5;
                const mouseY = e.clientY / window.innerHeight - 0.5;
                
                parallaxElements.forEach((el, index) => {
                    const speed = (index + 1) * 10;
                    el.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
                });
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.glass-card, .action-card, .stat-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// DATE INPUTS DEFAULT VALUES
// ============================================

function initDateInputs() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekStartDate = document.getElementById('weekStartDate');
    const weekEndDate = document.getElementById('weekEndDate');
    const selectMonth = document.getElementById('selectMonth');
    
    if (weekStartDate) {
        weekStartDate.value = weekAgo.toISOString().split('T')[0];
    }
    
    if (weekEndDate) {
        weekEndDate.value = today.toISOString().split('T')[0];
    }
    
    if (selectMonth) {
        selectMonth.value = today.toISOString().slice(0, 7);
    }
}

// ============================================
// NOTIFICATION STYLES
// ============================================

function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 24px;
            right: 24px;
            padding: 16px 24px;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius-md);
            color: var(--text-white);
            font-weight: 500;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10000;
        }
        
        .notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .notification-success {
            border-left: 4px solid var(--success-color);
        }
        
        .notification-info {
            border-left: 4px solid var(--primary-color);
        }
        
        .notification-error {
            border-left: 4px solid var(--error-color);
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// INITIALIZE EVERYTHING
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize weather particle system
    const weatherSystem = new WeatherParticleSystem('weatherCanvas');
    
    // Initialize file upload handler
    new FileUploadHandler();
    
    // Initialize report generator
    new ReportGenerator();
    
    // Initialize ripple effect
    initRippleEffect();
    
    // Initialize parallax effect
    initParallaxEffect();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize date inputs
    initDateInputs();
    
    // Add notification styles
    addNotificationStyles();
    
    // Add page transition class
    document.body.classList.add('page-transition-enter');
    
    // Trigger random lightning occasionally
    setInterval(() => {
        if (Math.random() > 0.8 && weatherSystem.weatherType === 'rain') {
            weatherSystem.triggerLightning();
        }
    }, 5000);
    
    // Expose weather system globally for debugging
    window.weatherSystem = weatherSystem;
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.weatherSystem) {
        window.weatherSystem.destroy();
    }
});
