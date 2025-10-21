// Katalyst Documentation Custom Scripts
// Enhances the GitBook experience with Katalyst-specific features

(function() {
    'use strict';

    // Wait for the page to fully load
    document.addEventListener('DOMContentLoaded', function() {
        initializeKatalystDocs();
    });

    function initializeKatalystDocs() {
        // Add Katalyst branding and features
        addKatalystBranding();
        enhanceCodeBlocks();
        addVersionSelector();
        addThemeToggle();
        enhanceNavigation();
        addSearchEnhancements();
        addAnalytics();
        smoothScrolling();
        externalLinkHandling();
    }

    // Add Katalyst branding elements
    function addKatalystBranding() {
        const header = document.querySelector('.book-header');
        if (header) {
            const logo = document.createElement('div');
            logo.className = 'katalyst-logo';
            logo.innerHTML = `
                <a href="{{site.url}}" class="katalyst-logo-link">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="6" fill="#2563eb"/>
                        <path d="M8 12L16 8L24 12L24 20L16 24L8 20L8 12Z" fill="white" opacity="0.9"/>
                        <circle cx="16" cy="16" r="3" fill="#2563eb"/>
                    </svg>
                    <span class="katalyst-text">Katalyst Docs</span>
                </a>
            `;
            
            // Insert logo before the title
            const title = header.querySelector('h1');
            if (title) {
                title.parentNode.insertBefore(logo, title);
            }
        }

        // Add footer with Katalyst branding
        const content = document.querySelector('.page-wrapper');
        if (content) {
            const footer = document.createElement('footer');
            footer.className = 'katalyst-custom-footer';
            footer.innerHTML = `
                <div class="katalyst-footer-content">
                    <div class="katalyst-footer-section">
                        <h4>Katalyst Framework</h4>
                        <p>Build modern, scalable applications with our cutting-edge multi-monorepo microfrontend architecture.</p>
                    </div>
                    <div class="katalyst-footer-section">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="{{site.url}}">Website</a></li>
                            <li><a href="{{site.github_url}}">GitHub</a></li>
                            <li><a href="{{site.discord_url}}">Discord</a></li>
                            <li><a href="{{site.api_url}}">API</a></li>
                        </ul>
                    </div>
                    <div class="katalyst-footer-section">
                        <h4>Documentation</h4>
                        <ul>
                            <li><a href="./getting-started/installation.html">Getting Started</a></li>
                            <li><a href="./api/core.html">API Reference</a></li>
                            <li><a href="./guides/creating-components.html">Guides</a></li>
                            <li><a href="./resources/faq.html">FAQ</a></li>
                        </ul>
                    </div>
                    <div class="katalyst-footer-section">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="{{site.discord_url}}">Join Discord</a></li>
                            <li><a href="{{site.github_url}}/discussions">GitHub Discussions</a></li>
                            <li><a href="{{site.github_url}}/issues">Report Issues</a></li>
                            <li><a href="./contributing/setup.html">Contribute</a></li>
                        </ul>
                    </div>
                </div>
                <div class="katalyst-footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} Katalyst Framework. Licensed under MIT.</p>
                    <p>Built with ❤️ by the Katalyst Team</p>
                </div>
            `;
            content.appendChild(footer);
        }
    }

    // Enhance code blocks with additional features
    function enhanceCodeBlocks() {
        const codeBlocks = document.querySelectorAll('pre');
        
        codeBlocks.forEach((block, index) => {
            // Add language label
            const code = block.querySelector('code');
            if (code) {
                const language = getLanguageFromClassName(code.className);
                if (language) {
                    const label = document.createElement('div');
                    label.className = 'katalyst-code-language';
                    label.textContent = language;
                    block.style.position = 'relative';
                    block.appendChild(label);
                }
            }

            // Add "Run in Katalyst" button for applicable code
            if (isRunnableCode(code)) {
                const runButton = document.createElement('button');
                runButton.className = 'katalyst-run-button';
                runButton.textContent = '▶ Run in Katalyst';
                runButton.onclick = () => runCodeInKatalyst(code.textContent);
                block.appendChild(runButton);
            }

            // Add line numbers
            if (!block.classList.contains('no-line-numbers')) {
                addLineNumbers(block);
            }
        });
    }

    function getLanguageFromClassName(className) {
        const match = className.match(/language-(\w+)/);
        return match ? match[1].toUpperCase() : null;
    }

    function isRunnableCode(codeElement) {
        if (!codeElement) return false;
        const code = codeElement.textContent;
        const runnableLanguages = ['javascript', 'js', 'typescript', 'ts', 'python', 'py'];
        const className = codeElement.className;
        
        return runnableLanguages.some(lang => 
            className.includes(`language-${lang}`) || 
            className.includes(`lang-${lang}`)
        ) && code.trim().length > 10;
    }

    function addLineNumbers(preElement) {
        const code = preElement.querySelector('code');
        if (!code) return;

        const lines = code.textContent.split('\n');
        const lineNumbers = lines.map((_, i) => i + 1).join('\n');
        
        const lineNumbersElement = document.createElement('span');
        lineNumbersElement.className = 'katalyst-line-numbers';
        lineNumbersElement.textContent = lineNumbers;
        
        preElement.style.display = 'flex';
        preElement.insertBefore(lineNumbersElement, code);
        code.style.flex = '1';
    }

    function runCodeInKatalyst(code) {
        // This would integrate with Katalyst's online playground
        console.log('Running code in Katalyst:', code);
        
        // Show loading state
        const button = document.querySelector('.katalyst-run-button');
        if (button) {
            button.textContent = '⏳ Running...';
            button.disabled = true;
        }
        
        // Simulate API call to Katalyst playground
        setTimeout(() => {
            if (button) {
                button.textContent = '✅ Ran Successfully';
                setTimeout(() => {
                    button.textContent = '▶ Run in Katalyst';
                    button.disabled = false;
                }, 2000);
            }
        }, 2000);
    }

    // Add version selector
    function addVersionSelector() {
        const header = document.querySelector('.book-header');
        if (header) {
            const versionSelector = document.createElement('select');
            versionSelector.className = 'katalyst-version-selector';
            versionSelector.innerHTML = `
                <option value="v2">Version 2.0 (Current)</option>
                <option value="v1">Version 1.x</option>
                <option value="main">Development (main)</option>
            `;
            
            versionSelector.onchange = function() {
                const version = this.value;
                let url = window.location.href;
                
                // Replace version in URL
                url = url.replace(/\/v[0-9]+\//, `/${version}/`);
                if (!url.includes('/v')) {
                    url = url.replace(/\/docs\//, `/docs/${version}/`);
                }
                
                window.location.href = url;
            };
            
            header.appendChild(versionSelector);
        }
    }

    // Add theme toggle
    function addThemeToggle() {
        const header = document.querySelector('.book-header');
        if (header) {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'katalyst-theme-toggle';
            themeToggle.innerHTML = '🌙';
            themeToggle.title = 'Toggle theme';
            
            themeToggle.onclick = function() {
                document.body.classList.toggle('light-theme');
                this.innerHTML = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
                
                // Save preference
                localStorage.setItem('katalyst-theme', 
                    document.body.classList.contains('light-theme') ? 'light' : 'dark'
                );
            };
            
            // Load saved preference
            const savedTheme = localStorage.getItem('katalyst-theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                themeToggle.innerHTML = '☀️';
            }
            
            header.appendChild(themeToggle);
        }
    }

    // Enhance navigation
    function enhanceNavigation() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('#book-search-input');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape to close search
            if (e.key === 'Escape') {
                const searchInput = document.querySelector('#book-search-input');
                if (searchInput && document.activeElement === searchInput) {
                    searchInput.blur();
                    searchInput.value = '';
                }
            }
        });

        // Add progress indicator
        addProgressIndicator();
    }

    function addProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'katalyst-progress-bar';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            progressBar.style.width = progress + '%';
        });
    }

    // Enhance search functionality
    function addSearchEnhancements() {
        const searchInput = document.querySelector('#book-search-input');
        if (searchInput) {
            // Add search shortcuts
            searchInput.placeholder = 'Search documentation... (Ctrl+K)';
            
            // Add search history
            let searchHistory = JSON.parse(localStorage.getItem('katalyst-search-history') || '[]');
            
            searchInput.addEventListener('focus', function() {
                if (searchHistory.length > 0) {
                    showSearchHistory(searchHistory);
                }
            });
        }
    }

    function showSearchHistory(history) {
        // Create dropdown for search history
        const dropdown = document.createElement('div');
        dropdown.className = 'katalyst-search-history';
        dropdown.innerHTML = history.slice(0, 5).map(item => 
            `<div class="search-history-item">${item}</div>`
        ).join('');
        
        // Position dropdown
        const searchInput = document.querySelector('#book-search-input');
        searchInput.parentNode.appendChild(dropdown);
        
        // Handle clicks
        dropdown.addEventListener('click', function(e) {
            if (e.target.classList.contains('search-history-item')) {
                searchInput.value = e.target.textContent;
                dropdown.remove();
                searchInput.dispatchEvent(new Event('input'));
            }
        });
        
        // Close on outside click
        document.addEventListener('click', function() {
            dropdown.remove();
        }, { once: true });
    }

    // Add analytics (if configured)
    function addAnalytics() {
        // Google Analytics (if GA_ID is configured)
        // Plausible Analytics (if PLAUSIBLE_DOMAIN is configured)
        // This would be configurable based on deployment
        
        console.log('Analytics tracking enabled for Katalyst Documentation');
    }

    // Smooth scrolling for anchor links
    function smoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Handle external links
    function externalLinkHandling() {
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                link.classList.add('external-link');
                
                // Add external link indicator
                if (!link.querySelector('.external-indicator')) {
                    const indicator = document.createElement('span');
                    indicator.className = 'external-indicator';
                    indicator.innerHTML = '↗';
                    indicator.style.fontSize = '0.8em';
                    indicator.style.opacity = '0.7';
                    link.appendChild(indicator);
                }
            }
        });
    }

    // Utility function to detect mobile devices
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Add mobile-specific enhancements
    if (isMobile()) {
        document.body.classList.add('mobile-device');
    }

    // Performance monitoring
    window.addEventListener('load', function() {
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`Katalyst Docs loaded in ${loadTime}ms`);
            
            // Track performance metrics
            if (window.gtag) {
                gtag('event', 'page_load_time', {
                    custom_parameter: loadTime
                });
            }
        }
    });

    // Console branding
    console.log('%c🚀 Katalyst Framework Documentation', 'color: #2563eb; font-size: 20px; font-weight: bold;');
    console.log('%cBuild modern, scalable applications with ease', 'color: #10b981; font-size: 14px;');
    console.log('%chttps://katalyst.io', 'color: #8b5cf6; font-size: 12px;');

})();
