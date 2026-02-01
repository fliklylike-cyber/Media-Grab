// script.js

/**
 * Media Grab - Frontend Demo Application
 * Handles URL validation, UI interactions, and download simulation
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const downloadForm = document.getElementById('download-form');
    const urlInput = document.getElementById('url-input');
    const formatSelect = document.getElementById('format-select');
    const downloadBtn = document.getElementById('download-btn');
    const spinner = document.getElementById('spinner');
    const message = document.getElementById('message');
    const btnText = downloadBtn.querySelector('.btn-text');

    // Supported platform patterns for validation
    const supportedPatterns = [
        /youtube\.com/i,
        /youtu\.be/i,
        /instagram\.com/i,
        /facebook\.com/i,
        /fb\.watch/i,
        /tiktok\.com/i,
        /twitter\.com/i,
        /x\.com/i,
        /vimeo\.com/i,
        /dailymotion\.com/i
    ];

    /**
     * Validates if string is a valid URL format
     * @param {string} string - URL to validate
     * @returns {boolean}
     */
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch (_) {
            return false;
        }
    }

    /**
     * Checks if URL is from a supported platform
     * @param {string} url - URL to check
     * @returns {boolean}
     */
    function isSupportedPlatform(url) {
        return supportedPatterns.some(pattern => pattern.test(url));
    }

    /**
     * Shows message to user
     * @param {string} text - Message text
     * @param {string} type - 'success' or 'error'
     */
    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type}`;
        message.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }

    /**
     * Hides message container
     */
    function hideMessage() {
        message.style.display = 'none';
    }

    /**
     * Sets loading state
     * @param {boolean} loading - Loading state
     */
    function setLoading(loading) {
        if (loading) {
            spinner.style.display = 'block';
            downloadBtn.disabled = true;
            btnText.textContent = 'Processing...';
            urlInput.disabled = true;
            formatSelect.disabled = true;
        } else {
            spinner.style.display = 'none';
            downloadBtn.disabled = false;
            btnText.textContent = 'Download';
            urlInput.disabled = false;
            formatSelect.disabled = false;
            downloadBtn.focus();
        }
    }

    /**
     * Simulates download process
     * @param {string} url - Video URL
     * @param {string} format - Selected format (mp4/mp3)
     */
    async function simulateDownload(url, format) {
        // Simulate network delay (1.5-2.5 seconds)
        const delay = Math.floor(Math.random() * 1000) + 1500;
        
        try {
            await new Promise(resolve => setTimeout(resolve, delay));
            
            // Simulate success (90% success rate for demo)
            if (Math.random() > 0.1) {
                const formatName = format === 'mp3' ? 'MP3 Audio' : 'MP4 Video';
                showMessage(
                    `Success! Your ${formatName} is ready for download. (Demo: No actual file was downloaded)`,
                    'success'
                );
                
                // Log to console for demonstration purposes
                console.log('[Media Grab Demo]', {
                    url: url,
                    format: format,
                    timestamp: new Date().toISOString(),
                    status: 'simulated_success'
                });
            } else {
                throw new Error('Network error');
            }
        } catch (error) {
            showMessage(
                'Download failed. Please check the URL and try again. (Demo mode)',
                'error'
            );
        } finally {
            setLoading(false);
        }
    }

    /**
     * Handles form submission
     * @param {Event} e - Submit event
     */
    function handleSubmit(e) {
        e.preventDefault();
        
        const url = urlInput.value.trim();
        const format = formatSelect.value;
        
        // Reset previous messages
        hideMessage();
        
        // Validation: Empty input
        if (!url) {
            showMessage('Please enter a video URL', 'error');
            urlInput.focus();
            return;
        }
        
        // Validation: Valid URL format
        if (!isValidUrl(url)) {
            showMessage('Please enter a valid URL (e.g., https://youtube.com/watch?v=...)', 'error');
            urlInput.focus();
            return;
        }
        
        // Validation: Supported platform (warning only, not blocking)
        if (!isSupportedPlatform(url)) {
            console.warn('[Media Grab] URL may not be from a supported platform:', url);
        }
        
        // Start download simulation
        setLoading(true);
        simulateDownload(url, format);
    }

    /**
     * Real-time input validation feedback
     */
    urlInput.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        
        // Clear error when user starts typing
        if (message.classList.contains('error')) {
            hideMessage();
        }
        
        // Visual feedback for valid URL
        if (value && isValidUrl(value)) {
            urlInput.style.borderColor = 'var(--success)';
        } else if (value) {
            urlInput.style.borderColor = 'var(--border-color)';
        } else {
            urlInput.style.borderColor = '';
        }
    });

    /**
     * Handle paste event
     */
    urlInput.addEventListener('paste', (e) => {
        // Small delay to allow paste to complete
        setTimeout(() => {
            const pastedText = urlInput.value.trim();
            if (isValidUrl(pastedText)) {
                urlInput.style.borderColor = 'var(--success)';
                // Auto-hide message if visible
                hideMessage();
            }
        }, 0);
    });

    /**
     * Keyboard accessibility for platform cards
     */
    document.querySelectorAll('.platform-card').forEach(card => {
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
        
        card.addEventListener('click', () => {
            // Add ripple effect or visual feedback
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 150);
        });
    });

    // Form submission handler
    downloadForm.addEventListener('submit', handleSubmit);

    // Initialize: Focus input on load for desktop
    if (window.innerWidth > 768) {
        urlInput.focus();
    }

    // Expose to global scope for debugging (optional)
    window.MediaGrab = {
        version: '1.0.0',
        isValidUrl,
        isSupportedPlatform
    };
});