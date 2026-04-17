/**
 * Weather Bulletin System - Navigation JavaScript
 * Handles sidebar navigation, mobile menu, and page transitions
 */

// ============================================
// NAVIGATION MANAGER
// ============================================

class NavigationManager {
  constructor() {
    this.sidebar = document.getElementById("sidebar");
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.sidebarOverlay = document.getElementById("sidebarOverlay");
    this.pageLoader = document.getElementById("pageLoader");

    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initSidebarOverlay();
    this.initPageTransitions();
    this.initActiveNavItem();
    this.initKeyboardNavigation();
  }

  // ============================================
  // MOBILE MENU
  // ============================================

  initMobileMenu() {
    if (!this.mobileMenuToggle) return;

    this.mobileMenuToggle.addEventListener("click", () => {
      this.toggleSidebar();
    });
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("active");
    this.mobileMenuToggle.classList.toggle("active");
    this.sidebarOverlay.classList.toggle("active");

    // Prevent body scroll when sidebar is open
    document.body.style.overflow = this.sidebar.classList.contains("active")
      ? "hidden"
      : "";
  }

  closeSidebar() {
    this.sidebar.classList.remove("active");
    this.mobileMenuToggle.classList.remove("active");
    this.sidebarOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ============================================
  // SIDEBAR OVERLAY
  // ============================================

  initSidebarOverlay() {
    if (!this.sidebarOverlay) return;

    this.sidebarOverlay.addEventListener("click", () => {
      this.closeSidebar();
    });
  }

  // ============================================
  // PAGE TRANSITIONS
  // ============================================

  initPageTransitions() {
    // Handle all internal links
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      const target = link.getAttribute("target");

      // Only handle internal links without a specific target (ignore iframe links)
      if (
        this.isInternalLink(href) &&
        target !== "main-frame" &&
        target !== "_blank"
      ) {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          this.navigateToPage(href);
        });
      }
    });
  }

  isInternalLink(href) {
    // Check if it's an internal link (not external, not anchor, not javascript)
    return (
      href &&
      !href.startsWith("http") &&
      !href.startsWith("#") &&
      !href.startsWith("javascript:") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:")
    );
  }

  navigateToPage(url) {
    // Show page loader
    this.showPageLoader();

    // Close sidebar if open
    this.closeSidebar();

    // Add exit animation
    document.body.classList.add("page-transition-exit");

    // Navigate after animation
    setTimeout(() => {
      window.location.href = url;
    }, 300);
  }

  showPageLoader() {
    if (this.pageLoader) {
      this.pageLoader.classList.add("active");
    }
  }

  hidePageLoader() {
    if (this.pageLoader) {
      this.pageLoader.classList.remove("active");
    }
  }

  // ============================================
  // ACTIVE NAV ITEM
  // ============================================

  initActiveNavItem() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");

      // Check if this link matches current page
      if (this.isCurrentPage(href, currentPath)) {
        // Remove active from all items
        document.querySelectorAll(".nav-item").forEach((item) => {
          item.classList.remove("active");
        });

        // Add active to current item
        link.closest(".nav-item").classList.add("active");
      }
    });
  }

  isCurrentPage(href, currentPath) {
    // Handle both absolute and relative paths
    const normalizedHref = href.replace(/^\.\//, "").replace(/^\.\.\//, "");
    const normalizedCurrent = currentPath.replace(/^\//, "");

    // Check exact match or ends with
    return (
      normalizedCurrent === normalizedHref ||
      normalizedCurrent.endsWith(normalizedHref) ||
      (normalizedHref === "index.html" &&
        (normalizedCurrent === "" ||
          normalizedCurrent === "weather-report-system/"))
    );
  }

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  initKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      // ESC to close sidebar
      if (e.key === "Escape") {
        this.closeSidebar();
      }

      // Alt + M to toggle mobile menu
      if (e.altKey && e.key === "m") {
        e.preventDefault();
        this.toggleSidebar();
      }
    });

    // Focus trap for sidebar
    this.initFocusTrap();
  }

  initFocusTrap() {
    const focusableElements = this.sidebar?.querySelectorAll(
      'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    this.sidebar.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  }
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ============================================
// SCROLL TO TOP
// ============================================

function initScrollToTop() {
  // Create scroll to top button
  const scrollBtn = document.createElement("button");
  scrollBtn.className = "scroll-to-top";
  scrollBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
  scrollBtn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(scrollBtn);

  // Show/hide button based on scroll position
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 300) {
          scrollBtn.classList.add("visible");
        } else {
          scrollBtn.classList.remove("visible");
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Scroll to top on click
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ============================================
// NAVIGATION STYLES
// ============================================

function addNavigationStyles() {
  const style = document.createElement("style");
  style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 48px;
            height: 48px;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            border-radius: 50%;
            color: var(--text-white);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .scroll-to-top:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-4px);
        }
        
        /* Page transition styles */
        .page-transition-exit {
            animation: pageExit 0.3s ease-in forwards;
        }
        
        @keyframes pageExit {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(-20px);
            }
        }
        
        /* Focus styles for navigation */
        .nav-link:focus {
            outline: 2px solid var(--primary-color);
            outline-offset: -2px;
        }
        
        /* Active indicator animation */
        .nav-item.active .nav-link::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 60%;
            background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
            border-radius: 0 4px 4px 0;
            animation: activeIndicator 0.3s ease;
        }
        
        @keyframes activeIndicator {
            from {
                height: 0;
                opacity: 0;
            }
            to {
                height: 60%;
                opacity: 1;
            }
        }
    `;
  document.head.appendChild(style);
}

// ============================================
// BREADCRUMB NAVIGATION
// ============================================

function initBreadcrumbs() {
  const currentPath = window.location.pathname;

  // Hostinger Fix: Hide breadcrumbs on the main dashboard shell (index.html)
  // regardless of the subfolder path it is hosted in.
  if (
    document.getElementById("main-frame") ||
    currentPath.endsWith("index.html") ||
    currentPath.endsWith("/")
  ) {
    return;
  }

  const pathParts = currentPath
    .split("/")
    .filter((part) => part && part !== "weather-report-system");

  const breadcrumbContainer = document.createElement("nav");
  breadcrumbContainer.className = "breadcrumb-nav";
  breadcrumbContainer.setAttribute("aria-label", "Breadcrumb");

  let breadcrumbsHTML = `
        <ol class="breadcrumb-list">
            <li class="breadcrumb-item">
                <a href="${pathParts.length > 1 ? "../" : "./"}index.html">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span>Home</span>
                </a>
            </li>
    `;

  // Add current page
  const pageName =
    document.querySelector(".page-title")?.textContent || "Current Page";
  breadcrumbsHTML += `
            <li class="breadcrumb-item active" aria-current="page">
                <span>${pageName}</span>
            </li>
        </ol>
    `;

  breadcrumbContainer.innerHTML = breadcrumbsHTML;

  // Insert after top bar
  const topBar = document.querySelector(".top-bar");
  if (topBar) {
    topBar.insertAdjacentElement("afterend", breadcrumbContainer);
  }
}

// ============================================
// INITIALIZE NAVIGATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation manager
  window.navigationManager = new NavigationManager();

  // Initialize smooth scroll
  initSmoothScroll();

  // Initialize scroll to top
  initScrollToTop();

  // Add navigation styles
  addNavigationStyles();

  // Initialize breadcrumbs
  initBreadcrumbs();

  // Hide page loader when page is fully loaded
  window.addEventListener("load", () => {
    setTimeout(() => {
      if (window.navigationManager) {
        window.navigationManager.hidePageLoader();
      }
    }, 500);
  });
});

// Handle popstate (browser back/forward buttons)
window.addEventListener("popstate", () => {
  if (window.navigationManager) {
    window.navigationManager.initActiveNavItem();
  }
});
