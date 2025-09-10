/**
 * Main controller class that connects UI, algorithms, and visualization
 */
class SorterVisualizer {
    /**
     * Create a new SorterVisualizer
     * @param {HTMLElement} container - The container for visualization
     */
    constructor(container) {
        this.container = container;
        
        // Create theme manager and initialize with the current theme
        this.themeManager = new ThemeManager();
        const isDarkTheme = document.body.classList.contains('dark-theme');
        this.themeManager.setTheme(isDarkTheme ? 'dark' : 'light');
        
        // Initialize display manager after theme is set
        this.displayManager = new DisplayManager(container, this.themeManager);
        
        // Initialize UI controller
        this.uiController = new UIController(this.themeManager, this.handleSettingChange.bind(this));
        
        this.algorithms = {
            bubble: BubbleSort,
            selection: SelectionSort,
            insertion: InsertionSort
        };
        
        this.currentAlgorithm = null;
        this.dataArray = [];
        this.arraySize = 30;
        this.stepDelay = 50; // ms
        this.isRunning = false;
        this.animationId = null;
        
        this.initialize();
    }

    /**
     * Set up the visualization environment
     */
    initialize() {
        this.generateRandomArray();
        this.setAlgorithm('bubble');
        this.displayManager.createElements(this.dataArray);
    }

    /**
     * Generate a sequential array and then shuffle it
     */
    generateRandomArray() {
        // Create a sequential array from 1 to arraySize
        this.dataArray = Array.from({ length: this.arraySize }, (_, i) => i + 1);
        
        // Fisher-Yates shuffle
        for (let i = this.dataArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.dataArray[i], this.dataArray[j]] = [this.dataArray[j], this.dataArray[i]];
        }
    }

    /**
     * Change the current algorithm
     * @param {string} algorithmName - Name of the algorithm
     */
    setAlgorithm(algorithmName) {
        if (this.algorithms[algorithmName]) {
            this.currentAlgorithm = new this.algorithms[algorithmName]();
            this.currentAlgorithm.run(this.dataArray);
            this.uiController.updateControls({
                comparisons: 0,
                swaps: 0,
                status: `Ready with ${algorithmName} sort`
            });
        }
    }

    /**
     * Randomize the data array
     */
    shuffleArray() {
        if (this.isRunning) return;
        
        // Fisher-Yates shuffle
        for (let i = this.dataArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.dataArray[i], this.dataArray[j]] = [this.dataArray[j], this.dataArray[i]];
        }
        
        this.displayManager.createElements(this.dataArray);
        
        if (this.currentAlgorithm) {
            this.currentAlgorithm.run(this.dataArray);
            this.uiController.updateControls({
                comparisons: 0,
                swaps: 0,
                status: 'Array shuffled'
            });
        }
    }

    /**
     * Change the number of elements
     * @param {number} size - New array size
     */
    resizeArray(size) {
        if (this.isRunning) return;
        
        this.arraySize = size;
        this.generateRandomArray();
        this.displayManager.createElements(this.dataArray);
        
        if (this.currentAlgorithm) {
            this.currentAlgorithm.run(this.dataArray);
            this.uiController.updateControls({
                comparisons: 0,
                swaps: 0,
                status: 'Array resized'
            });
        }
    }

    /**
     * Begin the sorting visualization
     */
    start() {
        if (this.isRunning || !this.currentAlgorithm) return;
        
        this.isRunning = true;
        this.uiController.updateControls({ isRunning: true, status: 'Sorting...' });
        
        const runStep = () => {
            if (!this.isRunning) return;
            
            if (!this.currentAlgorithm.isFinished()) {
                this.step();
                this.animationId = setTimeout(runStep, this.getStepDelay());
            } else {
                this.isRunning = false;
                this.uiController.updateControls({ isRunning: false, status: 'Sorted', finished: true });
            }
        };
        
        runStep();
    }

    /**
     * Pause the visualization
     */
    pause() {
        this.isRunning = false;
        clearTimeout(this.animationId);
        this.uiController.updateControls({ isRunning: false, status: 'Paused' });
    }

    // Reset method removed as it was redundant with shuffleArray()

    /**
     * Perform a single step
     */
    step() {
        if (!this.currentAlgorithm || this.currentAlgorithm.isFinished()) return;
        
        const state = this.currentAlgorithm.step();
        this.updateVisualization(state);
        
        this.uiController.updateControls({
            comparisons: state.comparisons,
            swaps: state.swaps,
            finished: state.finished,
            status: state.finished ? 'Sorted' : 'Sorting...'
        });
        
        if (state.finished && this.isRunning) {
            this.pause();
            this.uiController.updateControls({ status: 'Sorted', finished: true });
        }
    }

    /**
     * Update the visual representation
     * @param {Object} state - Current state
     */
    updateVisualization(state) {
        if (!state) return;
        
        this.displayManager.updateElements(state.array, state.currentIndices);
    }

    /**
     * Handle setting changes from UI
     * @param {string} setting - Setting name
     * @param {any} value - New value
     */
    handleSettingChange(setting, value) {
        switch (setting) {
            case 'algorithm':
                this.setAlgorithm(value);
                break;
                
            case 'size':
                this.resizeArray(value);
                break;
                
            case 'speed':
                this.stepDelay = this.calculateStepDelay(value);
                break;
                
            case 'displayMode':
                this.displayManager.setDisplayMode(value);
                break;
                
            case 'theme':
                this.displayManager.setTheme(value);
                break;
                
            case 'action':
                this.handleAction(value);
                break;
                
            default:
                console.log(`Setting '${setting}' changed to ${value}`);
        }
    }

    /**
     * Handle user actions
     * @param {string} action - Action name
     */
    handleAction(action) {
        switch (action) {
            case 'shuffle':
                this.shuffleArray();
                break;
                
            case 'start':
                this.start();
                break;
                
            case 'pause':
                this.pause();
                break;
                
            case 'step':
                this.step();
                break;
                
            case 'updateColors':
                // Just redraw the current array with the new color scheme
                if (this.currentAlgorithm) {
                    const state = this.currentAlgorithm.getState();
                    this.updateVisualization(state);
                } else {
                    this.displayManager.createElements(this.dataArray);
                }
                break;
                
            default:
                console.log(`Unknown action: ${action}`);
        }
    }

    /**
     * Get the current step delay based on speed setting
     * @returns {number} Delay in milliseconds
     */
    getStepDelay() {
        // Speed value now directly translates:
        // 0 = no delay (max speed)
        // 100 = max delay (slowest speed)
        
        if (this.stepDelay === 0) {
            // No delay for max speed
            return 0;
        }
        
        // Exponential scale for more intuitive control
        // Min delay: 0ms (instant), Max delay: 500ms
        return Math.floor(5 * Math.pow(1.055, this.stepDelay));
    }

    /**
     * Calculate step delay from speed value
     * @param {number} speedValue - Speed value (0-100)
     * @returns {number} Stored speed value (higher = slower)
     */
    calculateStepDelay(speedValue) {
        // We store the direct slider value
        // The slider is flipped in the UI (100 = fastest, 0 = slowest)
        // But we store it normally (higher = more delay = slower)
        return 100 - speedValue;
    }
}
