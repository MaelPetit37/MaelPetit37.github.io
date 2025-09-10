/**
 * Main script for the Sorting Algorithm Visualizer
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set dark mode by default
    setupDarkMode();
    
    // Get the container for the visualization
    const container = document.getElementById('canvas-container');
    
    // Create the visualizer
    const visualizer = new SorterVisualizer(container);
    
    // Additional initialization can go here
    console.log('Sorting Algorithm Visualizer initialized');
});

/**
 * Set up dark mode toggle and initialize from saved preference
 */
function setupDarkMode() {
    const themeToggle = document.getElementById('theme-switch');
    const body = document.body;
    
    // Check for saved theme preference or use dark mode by default
    const savedTheme = localStorage.getItem('sorter-theme');
    
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        themeToggle.checked = false;
    } else {
        // Default to dark mode
        body.classList.add('dark-theme');
        themeToggle.checked = true;
        localStorage.setItem('sorter-theme', 'dark');
    }
    
    // Add listener to save preference
    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            body.classList.add('dark-theme');
            localStorage.setItem('sorter-theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            localStorage.setItem('sorter-theme', 'light');
        }
    });
}
