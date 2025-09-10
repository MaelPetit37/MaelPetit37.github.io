/**
 * Manages light/dark mode and visualization color schemes
 */
class ThemeManager {
    /**
     * Create a new ThemeManager
     */
    constructor() {
        this.theme = 'dark'; // Default to dark theme
        this.colorScheme = 'cool'; // Changed from 'gradient' since we removed that option
    }

    /**
     * Switch between light and dark themes
     * @param {string} theme - Theme name ('light', 'dark')
     */
    setTheme(theme) {
        this.theme = theme;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    /**
     * Apply a color scheme to the visualization
     * @param {string} scheme - Color scheme name ('mono', 'gradient', 'rainbow')
     */
    setColorScheme(scheme) {
        this.colorScheme = scheme;
    }

    /**
     * Get background color based on current theme
     * @returns {number} PixiJS color
     */
    getBackgroundColor() {
        return this.theme === 'dark' ? 0x333333 : 0xffffff;
    }

    /**
     * Get color for a value in the current color scheme
     * @param {number} value - The value
     * @param {number} maxValue - The maximum value
     * @returns {number} PixiJS color
     */
    getColorForValue(value, maxValue) {
        const normalizedValue = value / maxValue;
        
        switch (this.colorScheme) {
            case 'mono':
                return this.theme === 'dark' ? 0x6699ff : 0x3366cc;
                
            case 'gradient':
                return this.interpolateColor(
                    this.theme === 'dark' ? 0x1a53ff : 0x66b3ff, 
                    this.theme === 'dark' ? 0x00cccc : 0x006666, 
                    normalizedValue
                );
                
            case 'rainbow':
                return this.getHueColor(normalizedValue * 270);
                
            case 'cool':
                // Purple to cyan gradient
                return this.interpolateColor(
                    this.theme === 'dark' ? 0x9966ff : 0x8833ff,
                    this.theme === 'dark' ? 0x33ccff : 0x00aaff,
                    normalizedValue
                );
                
            case 'warm':
                // Red to yellow gradient
                return this.interpolateColor(
                    this.theme === 'dark' ? 0xff3333 : 0xcc0000,
                    this.theme === 'dark' ? 0xffcc00 : 0xffaa00,
                    normalizedValue
                );
                
            default:
                return 0x3498db;
        }
    }

    /**
     * Get color for comparing elements
     * @returns {number} PixiJS color
     */
    getCompareColor() {
        return this.theme === 'dark' ? 0xffd700 : 0xffa500; // Gold / Orange
    }

    /**
     * Get color for swapping elements
     * @returns {number} PixiJS color
     */
    getSwapColor() {
        return this.theme === 'dark' ? 0xff4d4d : 0xcc0000; // Light Red / Dark Red
    }

    /**
     * Get color for sorted elements
     * @returns {number} PixiJS color
     */
    getSortedColor() {
        return this.theme === 'dark' ? 0x33cc33 : 0x009900; // Light Green / Dark Green
    }

    /**
     * Interpolate between two colors
     * @param {number} color1 - First color
     * @param {number} color2 - Second color
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {number} Interpolated color
     */
    interpolateColor(color1, color2, factor) {
        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;
        
        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;
        
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        
        return (r << 16) | (g << 8) | b;
    }

    /**
     * Get color from hue value
     * @param {number} hue - Hue value (0-360)
     * @returns {number} PixiJS color
     */
    getHueColor(hue) {
        const h = hue % 360 / 60;
        const c = 1;
        const x = c * (1 - Math.abs(h % 2 - 1));
        
        let r, g, b;
        
        if (h >= 0 && h < 1) { r = c; g = x; b = 0; }
        else if (h >= 1 && h < 2) { r = x; g = c; b = 0; }
        else if (h >= 2 && h < 3) { r = 0; g = c; b = x; }
        else if (h >= 3 && h < 4) { r = 0; g = x; b = c; }
        else if (h >= 4 && h < 5) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }
        
        r = Math.round(r * 255);
        g = Math.round(g * 255);
        b = Math.round(b * 255);
        
        return (r << 16) | (g << 8) | b;
    }
}
