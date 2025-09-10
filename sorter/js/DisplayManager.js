/**
 * Handles the visualization rendering using PixiJS
 */
class DisplayManager {
    /**
     * Create a new DisplayManager
     * @param {HTMLElement} container - The container to render to
     * @param {ThemeManager} themeManager - The theme manager
     */
    constructor(container, themeManager) {
        this.container = container;
        this.themeManager = themeManager;
        this.displayMode = 'bars';
        this.elements = [];
        this.app = null;
        this.arrayContainer = null;
        
        this.initializePixi();
    }

    /**
     * Initialize the PixiJS application
     */
    initializePixi() {
        // Clean up existing application if it exists
        if (this.app) {
            this.app.destroy(true, { children: true });
        }
        
        // Make sure the container is available
        if (!this.container) {
            console.error("Display container not found!");
            return;
        }
        
        // Ensure the container has dimensions
        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;
        
        console.log(`Initializing PixiJS with container size: ${width}x${height}`);
        
        // Create a new PIXI application with explicit sizing
        this.app = new PIXI.Application({
            width: width,
            height: height,
            backgroundColor: this.themeManager.getBackgroundColor(),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            antialias: true
        });

        // Add the canvas to the DOM
        this.container.innerHTML = ''; // Clear any existing content
        this.container.appendChild(this.app.view);
        
        // Set the canvas to fill the container
        this.app.view.style.display = 'block';
        this.app.view.style.width = '100%';
        this.app.view.style.height = '100%';

        // Create a container for the array elements
        this.arrayContainer = new PIXI.Container();
        this.app.stage.addChild(this.arrayContainer);

        // Position the array container
        this.arrayContainer.x = 0;
        this.arrayContainer.y = this.app.screen.height;

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    /**
     * Handle window resize
     */
    handleResize() {
        if (this.app) {
            this.app.renderer.resize(
                this.container.clientWidth,
                this.container.clientHeight
            );
            this.arrayContainer.y = this.app.screen.height;
            this.updateElements(this.lastArray || [], {});
        }
    }

    /**
     * Create visual elements for each array item
     * @param {Array} array - The array of values
     */
    createElements(array) {
        this.lastArray = [...array];
        this.clearElements();

        const maxValue = Math.max(...array);
        // Calculate total width and spacing
        const totalElements = array.length;
        const margin = 1; // Pixels between elements
        const totalMargins = totalElements - 1;
        const availableWidth = this.app.screen.width - (totalMargins * margin);
        const elementWidth = availableWidth / totalElements;
        
        // Calculate x positions for equally spaced elements
        const positions = Array.from({ length: totalElements }, (_, i) => 
            i * (elementWidth + margin)
        );
        
        for (let i = 0; i < array.length; i++) {
            let element;
            
            if (this.displayMode === 'bars') {
                const height = (array[i] / maxValue) * (this.app.screen.height - 20);
                element = this.createBar(elementWidth, height);
            } else if (this.displayMode === 'dots') {
                const radius = Math.min(elementWidth / 2, 10);
                const yPosition = -((array[i] / maxValue) * (this.app.screen.height - 40)) - 20;
                element = this.createDot(radius, yPosition);
            }
            
            element.x = positions[i];
            element.tint = this.themeManager.getColorForValue(array[i], maxValue);
            
            this.arrayContainer.addChild(element);
            this.elements.push(element);
        }
    }

    /**
     * Create a bar element
     * @param {number} width - The width of the bar
     * @param {number} height - The height of the bar
     * @returns {PIXI.Graphics} The bar element
     */
    createBar(width, height) {
        const bar = new PIXI.Graphics();
        bar.beginFill(0xFFFFFF);
        bar.drawRect(0, -height, width - 1, height);
        bar.endFill();
        return bar;
    }

    /**
     * Create a dot element
     * @param {number} radius - The radius of the dot
     * @param {number} yPosition - The y position of the dot
     * @returns {PIXI.Graphics} The dot element
     */
    createDot(radius, yPosition) {
        const dot = new PIXI.Graphics();
        dot.beginFill(0xFFFFFF);
        dot.drawCircle(radius, yPosition, radius);
        dot.endFill();
        return dot;
    }

    /**
     * Update positions and states of elements
     * @param {Array} array - The array of values
     * @param {Object} activeIndices - Indices of elements with special states
     */
    updateElements(array, activeIndices) {
        this.lastArray = [...array];
        const maxValue = Math.max(...array);
        
        if (!this.elements.length || array.length !== this.elements.length) {
            this.createElements(array);
            return;
        }
        
        // Calculate element positions (same logic as createElements)
        const totalElements = array.length;
        const margin = 1;
        const totalMargins = totalElements - 1;
        const availableWidth = this.app.screen.width - (totalMargins * margin);
        const elementWidth = availableWidth / totalElements;
        
        // Calculate x positions for equally spaced elements
        const positions = Array.from({ length: totalElements }, (_, i) => 
            i * (elementWidth + margin)
        );
        
        for (let i = 0; i < array.length; i++) {
            const element = this.elements[i];
            element.x = positions[i];
            
            if (this.displayMode === 'bars') {
                const height = (array[i] / maxValue) * (this.app.screen.height - 20);
                element.clear();
                element.beginFill(0xFFFFFF);
                element.drawRect(0, -height, elementWidth - 1, height);
                element.endFill();
            } else if (this.displayMode === 'dots') {
                const radius = Math.min(elementWidth / 2, 10);
                const yPosition = -((array[i] / maxValue) * (this.app.screen.height - 40)) - 20;
                element.clear();
                element.beginFill(0xFFFFFF);
                element.drawCircle(radius, yPosition, radius);
                element.endFill();
            }
            
            if (activeIndices.comparing && activeIndices.comparing.includes(i)) {
                element.tint = this.themeManager.getCompareColor();
            } else if (activeIndices.swapping && activeIndices.swapping.includes(i)) {
                element.tint = this.themeManager.getSwapColor();
            } else if (activeIndices.sorted && activeIndices.sorted.includes(i)) {
                element.tint = this.themeManager.getSortedColor();
            } else {
                element.tint = this.themeManager.getColorForValue(array[i], maxValue);
            }
        }
    }

    /**
     * Animate the swapping of two elements
     * @param {number} i - First index
     * @param {number} j - Second index
     * @returns {Promise} A promise that resolves when the animation is complete
     */
    animateSwap(i, j) {
        return new Promise(resolve => {
            if (i >= this.elements.length || j >= this.elements.length) {
                resolve();
                return;
            }
            
            const element1 = this.elements[i];
            const element2 = this.elements[j];
            
            if (!element1 || !element2) {
                resolve();
                return;
            }
            
            const startX1 = element1.x;
            const startX2 = element2.x;
            
            const duration = 300; // ms
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function
                const eased = progress < 0.5 
                    ? 2 * progress * progress 
                    : -1 + (4 - 2 * progress) * progress;
                
                element1.x = startX1 + (startX2 - startX1) * eased;
                element2.x = startX2 + (startX1 - startX2) * eased;
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // Swap elements in the array
                    [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
                    // Reset positions
                    element1.x = startX2;
                    element2.x = startX1;
                    resolve();
                }
            };
            
            animate();
        });
    }

    /**
     * Highlight elements being compared/swapped
     * @param {Array} indices - Indices of elements to highlight
     * @param {string} highlightType - Type of highlight ('compare', 'swap', 'sorted')
     */
    highlightElements(indices, highlightType) {
        for (let i = 0; i < this.elements.length; i++) {
            if (indices.includes(i)) {
                if (highlightType === 'compare') {
                    this.elements[i].tint = this.themeManager.getCompareColor();
                } else if (highlightType === 'swap') {
                    this.elements[i].tint = this.themeManager.getSwapColor();
                } else if (highlightType === 'sorted') {
                    this.elements[i].tint = this.themeManager.getSortedColor();
                }
            } else if (!this.lastHighlighted || !this.lastHighlighted.sorted || !this.lastHighlighted.sorted.includes(i)) {
                const value = this.lastArray ? this.lastArray[i] : 0;
                const maxValue = this.lastArray ? Math.max(...this.lastArray) : 1;
                this.elements[i].tint = this.themeManager.getColorForValue(value, maxValue);
            }
        }
        
        this.lastHighlighted = { [highlightType]: [...indices] };
    }

    /**
     * Change the visualization style
     * @param {string} mode - Display mode ('bars', 'dots')
     */
    setDisplayMode(mode) {
        this.displayMode = mode;
        if (this.lastArray) {
            this.createElements(this.lastArray);
        }
    }

    /**
     * Apply a color theme
     * @param {string} theme - Theme name ('light', 'dark')
     */
    setTheme(theme) {
        if (this.app) {
            this.app.renderer.backgroundColor = this.themeManager.getBackgroundColor();
            if (this.lastArray) {
                this.updateElements(this.lastArray, this.lastHighlighted || {});
            }
        }
    }

    /**
     * Clear all elements
     */
    clearElements() {
        if (this.arrayContainer) {
            for (let i = this.arrayContainer.children.length - 1; i >= 0; i--) {
                this.arrayContainer.removeChild(this.arrayContainer.children[i]);
            }
        }
        this.elements = [];
    }
}
