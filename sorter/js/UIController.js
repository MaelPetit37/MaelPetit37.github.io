/**
 * Manages the user interface elements and user interactions
 */
class UIController {
    /**
     * Create a new UI        // Reset button removedtroller
     * @param {ThemeManager} themeManager - The theme manager
     * @param {function} onSettingChange - Callback for setting changes
     */
    constructor(themeManager, onSettingChange) {
        this.themeManager = themeManager;
        this.onSettingChange = onSettingChange;
        
        // UI elements
        this.algorithmSelect = document.getElementById('algorithm-select');
        this.sizeSlider = document.getElementById('size-slider');
        this.sizeValue = document.getElementById('size-value');
        this.speedSlider = document.getElementById('speed-slider');
        this.speedValue = document.getElementById('speed-value');
        this.displaySelect = document.getElementById('display-select');
        this.colorSelect = document.getElementById('color-select');
        this.themeSwitch = document.getElementById('theme-switch');
        
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.stepBtn = document.getElementById('step-btn');
        // Reset button removed
        
        this.comparisonCount = document.getElementById('comparison-count');
        this.swapCount = document.getElementById('swap-count');
        this.status = document.getElementById('status');
        
        this.initializeControls();
        this.bindEvents();
    }

    /**
     * Set up all UI controls
     */
    initializeControls() {
        // Set initial values
        this.sizeValue.textContent = this.sizeSlider.value;
        this.updateSpeedLabel(parseInt(this.speedSlider.value));
    }
    
    /**
     * Update the speed label based on slider value
     * @param {number} speedValue - Speed slider value (0-100)
     */
    updateSpeedLabel(speedValue) {
        // Remember: slider is flipped (100 = fastest, 0 = slowest)
        if (speedValue >= 90) {
            this.speedValue.textContent = 'Fastest';
        } else if (speedValue >= 75) {
            this.speedValue.textContent = 'Very Fast';
        } else if (speedValue >= 50) {
            this.speedValue.textContent = 'Fast';
        } else if (speedValue >= 25) {
            this.speedValue.textContent = 'Medium';
        } else if (speedValue >= 10) {
            this.speedValue.textContent = 'Slow';
        } else {
            this.speedValue.textContent = 'Very Slow';
        }
    }

    /**
     * Attach event listeners
     */
    bindEvents() {
        // Algorithm selection
        this.algorithmSelect.addEventListener('change', () => {
            this.onSettingChange('algorithm', this.algorithmSelect.value);
        });
        
        // Size slider
        this.sizeSlider.addEventListener('input', () => {
            this.sizeValue.textContent = this.sizeSlider.value;
            this.onSettingChange('size', parseInt(this.sizeSlider.value));
        });
        
        // Speed slider
        this.speedSlider.addEventListener('input', () => {
            const speedValue = parseInt(this.speedSlider.value);
            this.updateSpeedLabel(speedValue);
            this.onSettingChange('speed', speedValue);
        });
        
        // Display type
        this.displaySelect.addEventListener('change', () => {
            this.onSettingChange('displayMode', this.displaySelect.value);
        });
        
        // Color scheme
        this.colorSelect.addEventListener('change', () => {
            const scheme = this.colorSelect.value;
            this.themeManager.setColorScheme(scheme);
            this.onSettingChange('colorScheme', scheme);
            // Immediately redraw with the new color scheme
            this.onSettingChange('action', 'updateColors');
        });
        
        // Theme toggle
        this.themeSwitch.addEventListener('change', () => {
            const theme = this.themeSwitch.checked ? 'dark' : 'light';
            this.themeManager.setTheme(theme);
            this.onSettingChange('theme', theme);
        });
        
        // Buttons
        this.shuffleBtn.addEventListener('click', () => {
            this.onSettingChange('action', 'shuffle');
        });
        
        this.startBtn.addEventListener('click', () => {
            this.onSettingChange('action', 'start');
            this.updateButtonStates(true);
        });
        
        this.pauseBtn.addEventListener('click', () => {
            this.onSettingChange('action', 'pause');
            this.updateButtonStates(false);
        });
        
        this.stepBtn.addEventListener('click', () => {
            this.onSettingChange('action', 'step');
        });
        
        // Reset button removed
    }

    /**
     * Update UI elements based on current state
     * @param {Object} state - Current state
     */
    updateControls(state) {
        if (state.comparisons !== undefined) {
            this.comparisonCount.textContent = state.comparisons;
        }
        
        if (state.swaps !== undefined) {
            this.swapCount.textContent = state.swaps;
        }
        
        if (state.status !== undefined) {
            this.status.textContent = state.status;
        }
        
        if (state.isRunning !== undefined) {
            this.updateButtonStates(state.isRunning, state.finished);
        }
        
        if (state.finished === true) {
            this.status.textContent = 'Sorted';
            this.updateButtonStates(false, true);
        } else if (state.finished === false) {
            // Explicitly re-enable buttons when marked as not finished (after shuffle)
            this.updateButtonStates(false, false);
        }
    }

    /**
     * Update button states based on running status
     * @param {boolean} isRunning - Whether sorting is running
     * @param {boolean} isSorted - Whether array is sorted (default: false)
     */
    updateButtonStates(isRunning, isSorted = false) {
        this.startBtn.disabled = isRunning || isSorted;
        this.pauseBtn.disabled = !isRunning;
        this.shuffleBtn.disabled = isRunning;
        this.stepBtn.disabled = isSorted;
        this.algorithmSelect.disabled = isRunning;
        this.sizeSlider.disabled = isRunning;
    }

    /**
     * Get current settings from UI controls
     * @returns {Object} Current settings
     */
    getSettings() {
        return {
            algorithm: this.algorithmSelect.value,
            size: parseInt(this.sizeSlider.value),
            speed: parseInt(this.speedSlider.value),
            displayMode: this.displaySelect.value,
            colorScheme: this.colorSelect.value,
            theme: this.themeSwitch.checked ? 'dark' : 'light'
        };
    }
}
