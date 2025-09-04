import MazeController from './MazeController.js';

// Global reference to the maze controller
let mazeController;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the maze controller
    mazeController = new MazeController('maze-container');
    
    // Set up dark mode toggle
    setupDarkModeToggle();
});

/**
 * Set up the dark mode toggle functionality
 */
function setupDarkModeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.checked = true;
        updateCanvasTheme(true);
    } else if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        themeToggle.checked = false;
        updateCanvasTheme(false);
    } else {
        // If no saved preference, set dark mode as default
        body.classList.add('dark-theme');
        themeToggle.checked = true;
        updateCanvasTheme(true);
        // Save the default preference
        localStorage.setItem('theme', 'dark');
    }
    
    // Add change event listener to the toggle checkbox
    themeToggle.addEventListener('change', () => {
        // Toggle dark theme class on body based on checkbox state
        if (themeToggle.checked) {
            body.classList.add('dark-theme');
        } else {
            body.classList.remove('dark-theme');
        }
        
        // Check if dark theme is active
        const isDarkTheme = body.classList.contains('dark-theme');
        
        // Save preference to localStorage
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        
        // Update canvas theme
        updateCanvasTheme(isDarkTheme);
    });
}

/**
 * Update the PixiJS canvas theme
 * @param {boolean} isDark - Whether dark mode is active
 */
function updateCanvasTheme(isDark) {
    if (mazeController && mazeController.app) {
        // Update the canvas background color
        const bgColor = isDark ? 0x2D2D3D : 0xFFFFFF;
        mazeController.app.renderer.backgroundColor = bgColor;
        
        // Update the wall color
        const wallColor = isDark ? 0xFFFFFF : 0x000000;
        
        // Re-render the maze if it exists
        if (mazeController.maze) {
            mazeController.maze.wallColor = wallColor;
            mazeController.maze.render();
        }
    }
}
