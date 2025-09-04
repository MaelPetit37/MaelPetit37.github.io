import Maze from './Maze.js';
import MazeSolver from './MazeSolver.js';

/**
 * Controller for the maze UI
 */
export default class MazeController {
    /**
     * Initialize the maze controller
     * @param {string} containerId - ID of the container element
     */
    constructor(containerId) {
        // References to DOM elements
        this.mazeContainer = document.getElementById(containerId);
        this.generateBtn = document.getElementById('generate-btn');
        this.solveBtn = document.getElementById('solve-btn');
        this.playBtn = document.getElementById('play-btn');
        this.resetVizBtn = document.getElementById('reset-viz-btn');
        this.colorDistanceBtn = document.getElementById('color-distance-btn');
        this.mazeWidthInput = document.getElementById('maze-width');
        this.mazeHeightInput = document.getElementById('maze-height');
        this.generationAlgorithmSelect = document.getElementById('generation-algorithm');
        this.solvingAlgorithmSelect = document.getElementById('solving-algorithm');
        this.solvingSpeedInput = document.getElementById('solving-speed');
        this.speedValueDisplay = document.getElementById('speed-value');
        this.playInstructions = document.querySelector('.play-instructions');
        
        // State variables
        this.app = null;
        this.maze = null;
        this.mazeSolver = null;
        this.pathGraphics = null;
        this.explorationGraphics = null;
        this.finalPathGraphics = null; // For the animated final path
        this.isGenerating = false;
        this.isSolving = false;
        this.isPlaying = false;
        this.solveAnimationSpeed = parseInt(this.solvingSpeedInput.value);
        
        // Initialize the application
        this.initPixiApp();
        this.attachEventListeners();
    }
    
    /**
     * Initialize the PixiJS application
     */
    initPixiApp() {
        // Create the PixiJS application
        this.app = new PIXI.Application({
            width: this.mazeContainer.offsetWidth,
            height: this.mazeContainer.offsetHeight,
            backgroundColor: 0xFFFFFF,
            antialias: true,
            resolution: window.devicePixelRatio || 1,
            autoDensity: true // Adjust for pixel density
        });
        
        // Add the view to the DOM
        this.mazeContainer.appendChild(this.app.view);
        this.app.view.style.display = 'block';
        this.app.view.style.margin = '0 auto';
        this.app.view.style.width = '100%';
        this.app.view.style.height = '100%';
        
        // Create exploration graphics for visualizing algorithm progress
        this.explorationGraphics = new PIXI.Graphics();
        this.app.stage.addChild(this.explorationGraphics);
        
        // Create path graphics for the current shortest path during exploration
        this.pathGraphics = new PIXI.Graphics();
        this.app.stage.addChild(this.pathGraphics);
        
        // Create final path graphics for the animated final path (add last to be on top)
        this.finalPathGraphics = new PIXI.Graphics();
        this.app.stage.addChild(this.finalPathGraphics);
        
        // Create distance graphics for coloring cells by distance
        this.distanceGraphics = new PIXI.Graphics();
        this.app.stage.addChild(this.distanceGraphics);
        
        // Handle window resize
        this.setupResizeHandlers();
        
        // Create an initial maze
        const initialWidth = parseInt(this.mazeWidthInput.value);
        const initialHeight = parseInt(this.mazeHeightInput.value);
        this.maze = new Maze(initialWidth, initialHeight, this.app);
        
        // Set the wall color based on current theme before generating
        const isDarkTheme = document.body.classList.contains('dark-theme');
        this.maze.wallColor = isDarkTheme ? 0xFFFFFF : 0x000000;
        
        this.maze.generate('dfs');
        this.mazeSolver = new MazeSolver(this.maze);
        this.solveBtn.disabled = false;
        this.playBtn.disabled = false;
    }
    
    /**
     * Setup resize handlers for responsive behavior
     */
    setupResizeHandlers() {
        // Handle window resize
        window.addEventListener('resize', () => {
            // Resize renderer to match container
            this.app.renderer.resize(this.mazeContainer.offsetWidth, this.mazeContainer.offsetHeight);
            
            // Re-render maze if it exists
            if (this.maze) {
                this.maze.render();
            }
        });
        
        // Use ResizeObserver to detect container size changes
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === this.mazeContainer) {
                    this.app.renderer.resize(this.mazeContainer.offsetWidth, this.mazeContainer.offsetHeight);
                    if (this.maze) {
                        this.maze.render();
                    }
                }
            }
        });
        
        // Start observing the container
        resizeObserver.observe(this.mazeContainer);
    }
    
    /**
     * Attach event listeners to UI elements
     */
    attachEventListeners() {
        // Generate button
        this.generateBtn.addEventListener('click', () => this.generateMaze());
        
        // Solve button
        this.solveBtn.addEventListener('click', () => this.solveMaze());
        
        // Play button
        this.playBtn.addEventListener('click', () => this.togglePlayMode());
        
        // Color by distance button
        this.colorDistanceBtn.addEventListener('click', () => this.colorByDistance());
        
        // Solving speed slider
        this.solvingSpeedInput.addEventListener('input', (e) => {
            const speed = e.target.value;
            this.solveAnimationSpeed = parseInt(speed);
            this.speedValueDisplay.textContent = `${speed}ms`;
        });
        
        // Reset visualization button
        this.resetVizBtn.addEventListener('click', () => this.resetVisualization());
        
        // Keyboard event listeners for player movement
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
    }
    
    /**
     * Generate a new maze
     */
    generateMaze() {
        if (this.isGenerating) return;
        
        this.isGenerating = true;
        // Disable all controls except for the generate button (which is already disabled)
        this.disableAllControls();
        
        // Clear any existing path and exploration
        if (this.pathGraphics) {
            this.pathGraphics.clear();
        }
        
        if (this.explorationGraphics) {
            this.explorationGraphics.clear();
        }
        
        if (this.finalPathGraphics) {
            this.finalPathGraphics.clear();
        }
        
        if (this.distanceGraphics) {
            this.distanceGraphics.clear();
        }
        
        // Exit play mode if active
        if (this.isPlaying) {
            this.exitPlayMode();
        }
        
        // Remove any existing graphics
        if (this.maze) {
            this.app.stage.removeChild(this.maze.graphics);
            this.app.stage.removeChild(this.maze.cellHighlights);
            this.app.stage.removeChild(this.maze.playerGraphics);
        }
        
        // Clear graphics completely
        if (this.pathGraphics) {
            this.app.stage.removeChild(this.pathGraphics);
            this.pathGraphics = new PIXI.Graphics();
            this.app.stage.addChild(this.pathGraphics);
        }
        
        if (this.finalPathGraphics) {
            this.app.stage.removeChild(this.finalPathGraphics);
            this.finalPathGraphics = new PIXI.Graphics();
            this.app.stage.addChild(this.finalPathGraphics);
        }
        
        const width = parseInt(this.mazeWidthInput.value);
        const height = parseInt(this.mazeHeightInput.value);
        const algorithm = this.generationAlgorithmSelect.value;
        console.log(`Generating maze: Width=${width}, Height=${height}, Algorithm=${algorithm}`);
        
        // Create and generate maze
        this.maze = new Maze(width, height, this.app);
        
        // Set the wall color based on current theme before generating
        const isDarkTheme = document.body.classList.contains('dark-theme');
        this.maze.wallColor = isDarkTheme ? 0xFFFFFF : 0x000000;
        
        this.maze.generate(algorithm);
        this.mazeSolver = new MazeSolver(this.maze);
        
        this.isGenerating = false;
        // Re-enable all controls
        this.enableAllControls();
    }
    
    /**
     * Solve the current maze
     */
    solveMaze() {
        if (!this.maze || this.isSolving) return;
        
        // Exit play mode if active
        if (this.isPlaying) {
            this.exitPlayMode();
        }
        
        this.isSolving = true;
        this.disableAllControls();
        
        // Reset cell predecessors for a fresh search
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                this.maze.grid[y][x].predecessor = null;
            }
        }
        
        // Clear exploration and final path graphics
        this.explorationGraphics.clear();
        this.finalPathGraphics.clear();
        
        const algorithm = this.solvingAlgorithmSelect.value;
        console.log(`Solving maze using ${algorithm}...`);
        
        // Choose algorithm based on selection
        if (algorithm === 'bfs') {
            this.solveBFS();
        } else {
            this.solveAStar();
        }
    }
    
    /**
     * Solve the maze using A* algorithm
     */
    solveAStar() {
        // Use A* algorithm to find the path
        const result = this.mazeSolver.findPathAStar(
            this.maze.startCell, 
            this.maze.endCell,
            (visitedCells) => this.visualizeExploration(visitedCells),
            this.solveAnimationSpeed
        );
        
        result.then(path => {
            if (path.length > 0) {
                // For zero delay, visualize final exploration state once
                if (this.solveAnimationSpeed === 0) {
                    // Create a set of all cells that were visited during the algorithm
                    const allVisitedCells = [];
                    let current = this.maze.endCell;
                    while (current.predecessor !== null) {
                        allVisitedCells.push(current);
                        current = current.predecessor;
                    }
                    allVisitedCells.push(this.maze.startCell);
                    
                    // Show the final exploration state
                    this.visualizeExploration(allVisitedCells);
                }
                
                // Draw the final path
                this.drawPath(path);
                
                // The path is already highlighted through the predecessors
                // The final animation just makes it more pronounced
            } else {
                // No path found
                Swal.fire({
                    title: 'No Path Found',
                    text: 'There is no valid path from start to end.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                this.isSolving = false;
                this.enableAllControls();
            }
        });
    }
    
    /**
     * Solve the maze using BFS algorithm
     */
    solveBFS() {
        // Use BFS algorithm to find the path
        const result = this.mazeSolver.findPathBFS(
            this.maze.startCell, 
            this.maze.endCell,
            (visitedCells) => this.visualizeExploration(visitedCells),
            this.solveAnimationSpeed
        );
        
        result.then(path => {
            if (path.length > 0) {
                // For zero delay, visualize final exploration state once
                if (this.solveAnimationSpeed === 0) {
                    // Create a set of all cells that were visited during the algorithm
                    const allVisitedCells = [];
                    let current = this.maze.endCell;
                    while (current.predecessor !== null) {
                        allVisitedCells.push(current);
                        current = current.predecessor;
                    }
                    allVisitedCells.push(this.maze.startCell);
                    
                    // Show the final exploration state
                    this.visualizeExploration(allVisitedCells);
                }
                
                // Draw the final path
                this.drawPath(path);
                
                // The path is already highlighted through the predecessors
                // The final animation just makes it more pronounced
            } else {
                // No path found
                Swal.fire({
                    title: 'No Path Found',
                    text: 'There is no valid path from start to end.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                this.isSolving = false;
                this.enableAllControls();
            }
        });
    }
    
    /**
     * Visualize the exploration progress of the algorithm
     * @param {Array<Cell>} visitedCells - Array of cells being explored
     */
    visualizeExploration(visitedCells) {
        // Clear previous exploration visualization
        this.explorationGraphics.clear();
        
        // Calculate positioning
        const cellSize = this.maze.cellSize;
        const totalWidth = this.maze.width * cellSize;
        const totalHeight = this.maze.height * cellSize;
        const startX = (this.app.renderer.width - totalWidth) / 2;
        const startY = (this.app.renderer.height - totalHeight) / 2;
        
        // Draw all visited cells
        this.explorationGraphics.beginFill(0xffcc00, 0.3);
        
        for (const cell of visitedCells) {
            this.explorationGraphics.drawRect(
                startX + (cell.x * cellSize) + 2,
                startY + (cell.y * cellSize) + 2,
                cellSize - 4,
                cellSize - 4
            );
        }
        
        this.explorationGraphics.endFill();
        
        // Draw current shortest path from end to start (if a path to the end exists)
        if (this.maze.endCell.predecessor !== null) {
            this.drawCurrentShortestPath();
        }
    }
    
    /**
     * Reset visualization of the shortest path
     */
    resetVisualization() {
        if (!this.maze) return;
        
        // Don't reset if we're in the middle of solving
        if (this.isSolving) return;
        
        console.log('Resetting path visualization...');
        
        // Only clear the path graphics, keep exploration graphics
        if (this.pathGraphics) {
            this.pathGraphics.clear();
        }
        
        if (this.finalPathGraphics) {
            this.finalPathGraphics.clear();
        }
        
        if (this.distanceGraphics) {
            this.distanceGraphics.clear();
        }
        
        // No need to clear exploration graphics or reset cell predecessors
        // as exploration graphics are already cleared automatically at the end of solving
    }
    
    /**
     * Draw the current shortest path based on cell predecessors
     */
    drawCurrentShortestPath() {
        // Calculate positioning
        const cellSize = this.maze.cellSize;
        const totalWidth = this.maze.width * cellSize;
        const totalHeight = this.maze.height * cellSize;
        const startX = (this.app.renderer.width - totalWidth) / 2;
        const startY = (this.app.renderer.height - totalHeight) / 2;
        
        // Clear previous path
        this.pathGraphics.clear();
        
        // Set line style for the shortest path - thinner than final path but still visible
        this.pathGraphics.lineStyle(cellSize / 4, 0x3a86ff, 0.6);
        
        // Start from the end cell
        let current = this.maze.endCell;
        
        if (current.predecessor === null) {
            return; // No path to draw yet
        }
        
        // Draw from end to the second-to-last cell
        this.pathGraphics.moveTo(
            startX + (current.x * cellSize) + cellSize / 2,
            startY + (current.y * cellSize) + cellSize / 2
        );
        
        // Follow predecessors to draw the path
        while (current.predecessor !== null) {
            const prev = current.predecessor;
            this.pathGraphics.lineTo(
                startX + (prev.x * cellSize) + cellSize / 2,
                startY + (prev.y * cellSize) + cellSize / 2
            );
            current = prev;
        }
    }
    
    /**
     * Draw the solution path on the maze
     * @param {Array<Cell>} path - The path to draw
     */
    drawPath(path) {
        // Calculate positioning
        const cellSize = this.maze.cellSize;
        const totalWidth = this.maze.width * cellSize;
        const totalHeight = this.maze.height * cellSize;
        const startX = (this.app.renderer.width - totalWidth) / 2;
        const startY = (this.app.renderer.height - totalHeight) / 2;
        
        // Clear exploration graphics to prepare for path drawing
        this.explorationGraphics.clear();
        
        // Keep the current shortest path visible
        // Use finalPathGraphics for the animated path with thicker/more visible line
        this.finalPathGraphics.clear();
        this.finalPathGraphics.lineStyle(cellSize / 2.5, 0x3a86ff, 0.9);
        this.finalPathGraphics.moveTo(
            startX + (path[0].x * cellSize) + cellSize / 2,
            startY + (path[0].y * cellSize) + cellSize / 2
        );
        
        // Special handling for 0 delay - draw the path immediately without animation
        if (this.solveAnimationSpeed === 0) {
            for (let i = 1; i < path.length; i++) {
                const cell = path[i];
                this.finalPathGraphics.lineTo(
                    startX + (cell.x * cellSize) + cellSize / 2,
                    startY + (cell.y * cellSize) + cellSize / 2
                );
            }
            this.isSolving = false;
            this.enableAllControls();
            return;
        }
        
        // Animate the path if delay > 0
        let i = 1;
        const drawInterval = setInterval(() => {
            if (i >= path.length) {
                clearInterval(drawInterval);
                this.isSolving = false;
                this.enableAllControls();
                return;
            }
            
            const cell = path[i];
            this.finalPathGraphics.lineTo(
                startX + (cell.x * cellSize) + cellSize / 2,
                startY + (cell.y * cellSize) + cellSize / 2
            );
            
            i++;
        }, this.solveAnimationSpeed);
    }
    
    /**
     * Toggle play mode on/off
     */
    togglePlayMode() {
        if (!this.maze) return;
        
        if (this.isPlaying) {
            this.exitPlayMode();
        } else {
            this.enterPlayMode();
        }
    }
    
    /**
     * Enter play mode
     */
    enterPlayMode() {
        this.isPlaying = true;
        this.playBtn.classList.add('active');
        this.playBtn.textContent = 'Exit Play Mode';
        
        // Clear exploration but keep the path
        if (this.explorationGraphics) {
            this.explorationGraphics.clear();
        }
        
        // Keep the current path visualization to help the player
        
        // Enable play mode on the maze
        this.maze.enablePlayMode();
        
        // Show instructions
        this.playInstructions.classList.add('visible');
        
        // Disable other buttons while in play mode
        this.disableAllControls('play-btn');
        
        // Make sure the canvas has focus for keyboard events
        this.mazeContainer.focus();
    }
    
    /**
     * Exit play mode
     */
    exitPlayMode() {
        this.isPlaying = false;
        this.playBtn.classList.remove('active');
        this.playBtn.textContent = 'Play Maze';
        
        // Disable play mode on the maze
        if (this.maze) {
            this.maze.disablePlayMode();
        }
        
        // Hide instructions
        this.playInstructions.classList.remove('visible');
        
        // Re-enable all buttons
        this.enableAllControls();
    }
    
    /**
     * Handle keyboard events for player movement
     * @param {KeyboardEvent} e - The keyboard event
     */
    handleKeydown(e) {
        if (!this.isPlaying || !this.maze) return;
        
        // Prevent default behavior for arrow keys to avoid page scrolling
        if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(e.key)) {
            e.preventDefault();
        }
        
        let direction;
        switch (e.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            default:
                return; // Exit if not an arrow key
        }
        
        this.maze.movePlayer(direction);
    }
    
    /**
     * Disable all control buttons and inputs
     * @param {string} [exceptButton] - Optional button ID to keep enabled
     */
    disableAllControls(exceptButton = null) {
        // Disable buttons
        if (exceptButton !== 'generate-btn') this.generateBtn.disabled = true;
        if (exceptButton !== 'solve-btn') this.solveBtn.disabled = true;
        if (exceptButton !== 'play-btn') this.playBtn.disabled = true;
        if (exceptButton !== 'reset-viz-btn') this.resetVizBtn.disabled = true;
        if (exceptButton !== 'color-distance-btn') this.colorDistanceBtn.disabled = true;
        
        // Disable inputs
        this.mazeWidthInput.disabled = true;
        this.mazeHeightInput.disabled = true;
        this.generationAlgorithmSelect.disabled = true;
        this.solvingAlgorithmSelect.disabled = true;
        this.solvingSpeedInput.disabled = true;
    }
    
    /**
     * Enable all control buttons and inputs
     * @param {string} [exceptButton] - Optional button ID to keep disabled
     */
    enableAllControls(exceptButton = null) {
        // Enable buttons
        if (exceptButton !== 'generate-btn') this.generateBtn.disabled = false;
        if (exceptButton !== 'solve-btn') this.solveBtn.disabled = false;
        if (exceptButton !== 'play-btn') this.playBtn.disabled = false;
        if (exceptButton !== 'reset-viz-btn') this.resetVizBtn.disabled = false;
        if (exceptButton !== 'color-distance-btn') this.colorDistanceBtn.disabled = false;
        
        // Enable inputs
        this.mazeWidthInput.disabled = false;
        this.mazeHeightInput.disabled = false;
        this.generationAlgorithmSelect.disabled = false;
        this.solvingAlgorithmSelect.disabled = false;
        this.solvingSpeedInput.disabled = false;
    }
    
    /**
     * Color cells by distance from the start
     */
    colorByDistance() {
        if (!this.maze || this.isSolving || this.isGenerating) return;
        
        console.log('Coloring cells by distance from start...');
        
        // Clear any previous visualization
        this.resetVisualization();
        
        // Clear distance graphics
        this.distanceGraphics.clear();
        
        // Calculate cell distances using BFS
        const distances = this.calculateDistances();
        const maxDistance = Math.max(...Object.values(distances));
        
        // Calculate positioning
        const cellSize = this.maze.cellSize;
        const totalWidth = this.maze.width * cellSize;
        const totalHeight = this.maze.height * cellSize;
        const startX = (this.app.renderer.width - totalWidth) / 2;
        const startY = (this.app.renderer.height - totalHeight) / 2;
        
        // Draw cells with colors based on distance
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                const cell = this.maze.grid[y][x];
                const cellKey = `${cell.x},${cell.y}`;
                
                // Skip cells that aren't reachable
                if (!distances[cellKey] && distances[cellKey] !== 0) continue;
                
                const distance = distances[cellKey];
                const ratio = distance / maxDistance;
                
                // Use a rainbow gradient: violet → blue → green → yellow → orange → red
                const color = this.getRainbowColor(ratio);
                
                // Draw the cell interior
                this.distanceGraphics.beginFill(color, 0.7);
                this.distanceGraphics.drawRect(
                    startX + (cell.x * cellSize) + 2,
                    startY + (cell.y * cellSize) + 2,
                    cellSize - 4,
                    cellSize - 4
                );
                this.distanceGraphics.endFill();
                
                // Draw the passages (removed walls) with the same color
                // We'll draw half a passage from each cell to create smooth connections
                const wallThickness = 2; // Same thickness as maze walls
                const halfPassage = (cellSize - wallThickness) / 2;
                
                // Right passage
                if (x < this.maze.width - 1 && !cell.walls.right) {
                    const rightCellKey = `${x+1},${y}`;
                    if (distances[rightCellKey] !== undefined) {
                        // Average the colors between adjacent cells for smoother transitions
                        const rightRatio = distances[rightCellKey] / maxDistance;
                        const avgColor = this.getAverageColor(ratio, rightRatio);
                        
                        this.distanceGraphics.beginFill(avgColor, 0.7);
                        this.distanceGraphics.drawRect(
                            startX + (cell.x * cellSize) + cellSize - 2,
                            startY + (cell.y * cellSize) + 2,
                            4, // Slightly wider than wall thickness for seamless look
                            cellSize - 4
                        );
                        this.distanceGraphics.endFill();
                    }
                }
                
                // Bottom passage
                if (y < this.maze.height - 1 && !cell.walls.bottom) {
                    const bottomCellKey = `${x},${y+1}`;
                    if (distances[bottomCellKey] !== undefined) {
                        // Average the colors between adjacent cells for smoother transitions
                        const bottomRatio = distances[bottomCellKey] / maxDistance;
                        const avgColor = this.getAverageColor(ratio, bottomRatio);
                        
                        this.distanceGraphics.beginFill(avgColor, 0.7);
                        this.distanceGraphics.drawRect(
                            startX + (cell.x * cellSize) + 2,
                            startY + (cell.y * cellSize) + cellSize - 2,
                            cellSize - 4,
                            4 // Slightly wider than wall thickness for seamless look
                        );
                        this.distanceGraphics.endFill();
                    }
                }
            }
        }
    }
    
    /**
     * Calculate the distance of each cell from the start cell using BFS
     * @returns {Object} A mapping from cell coordinates to distances
     */
    calculateDistances() {
        const distances = {};
        const queue = [];
        const visited = new Set();
        
        // Start with the start cell
        const startCell = this.maze.startCell;
        const startKey = `${startCell.x},${startCell.y}`;
        
        queue.push(startCell);
        distances[startKey] = 0;
        visited.add(startKey);
        
        while (queue.length > 0) {
            const current = queue.shift();
            const currentKey = `${current.x},${current.y}`;
            const currentDistance = distances[currentKey];
            
            // Get neighbors that are connected (no walls between them)
            const neighbors = this.maze.getConnectedNeighbors(current);
            
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                
                if (!visited.has(neighborKey)) {
                    queue.push(neighbor);
                    distances[neighborKey] = currentDistance + 1;
                    visited.add(neighborKey);
                }
            }
        }
        
        return distances;
    }
    
    /**
     * Get a color from the rainbow gradient based on a ratio from 0 to 1
     * @param {number} ratio - A value from 0 to 1 (0 = violet, 1 = red)
     * @returns {number} A hex color value
     */
    getRainbowColor(ratio) {
        // Use HSL color model where we only change the hue
        // Hue goes from 270 (violet) to 0 (red) in the rainbow spectrum
        const hue = 270 - (ratio * 270); // 270° (violet) to 0° (red)
        const saturation = 100; // 100% saturation for vibrant colors
        const lightness = 50;   // 50% lightness for balanced brightness
        
        // Convert HSL to RGB
        return this.hslToRgb(hue, saturation, lightness);
    }
    
    /**
     * Get the average color between two distance ratios
     * @param {number} ratio1 - First distance ratio (0-1)
     * @param {number} ratio2 - Second distance ratio (0-1) 
     * @returns {number} Averaged hex color
     */
    getAverageColor(ratio1, ratio2) {
        // Average the ratios
        const avgRatio = (ratio1 + ratio2) / 2;
        
        // Get color using the average ratio
        return this.getRainbowColor(avgRatio);
    }
    
    /**
     * Convert HSL color values to RGB hex value
     * @param {number} h - Hue (0-360)
     * @param {number} s - Saturation (0-100)
     * @param {number} l - Lightness (0-100)
     * @returns {number} RGB value as a hex number
     */
    hslToRgb(h, s, l) {
        // Normalize values
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            // Achromatic (gray)
            r = g = b = l;
        } else {
            const hueToRgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hueToRgb(p, q, h + 1/3);
            g = hueToRgb(p, q, h);
            b = hueToRgb(p, q, h - 1/3);
        }
        
        // Convert to 0-255 range and combine to hex
        const toHex = c => Math.round(c * 255);
        return (toHex(r) << 16) | (toHex(g) << 8) | toHex(b);
    }
}
