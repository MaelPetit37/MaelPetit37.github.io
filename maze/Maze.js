import Cell from './Cell.js';
import MazePlayer from './MazePlayer.js';

/**
 * Represents a maze.
 * 
 * @class
 */
export default class Maze {
    /**
     * Create a new maze
     * @param {number} width - The width of the maze in cells
     * @param {number} height - The height of the maze in cells
     * @param {PIXI.Application} app - The PixiJS application instance
     */
    constructor(width, height, app) {
        this.width = width;
        this.height = height;
        this.app = app;
        this.grid = this.createGrid();
        this.cellSize = 0;
        this.wallColor = 0x000000; // Default wall color is black
        
        // Create fresh graphics objects
        this.graphics = new PIXI.Graphics();
        this.app.stage.addChild(this.graphics);
        
        this.startCell = null;
        this.endCell = null;
        
        this.cellHighlights = new PIXI.Graphics();
        this.app.stage.addChild(this.cellHighlights);
        
        // Player-related properties
        this.playerGraphics = new PIXI.Graphics();
        this.app.stage.addChild(this.playerGraphics);
        this.player = new MazePlayer(this);
    }

    /**
     * Create the grid of cells for the maze
     * @returns {Array<Array<Cell>>} - 2D array of Cell objects
     */
    createGrid() {
        const grid = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(new Cell(x, y));
            }
            grid.push(row);
        }
        return grid;
    }

    /**
     * Render the maze using PixiJS
     */
    render() {
        // Ensure all graphics are completely cleared
        this.graphics.clear();
        this.cellHighlights.clear();
        this.playerGraphics.clear();
        
        // Calculate cell size to fit the maze in the available space
        const margin = 20;
        // Use the view's clientWidth and clientHeight instead of renderer dimensions
        // This ensures we're using the actual display size, not the internal canvas size
        const availableWidth = this.app.view.clientWidth - (margin * 2);
        const availableHeight = this.app.view.clientHeight - (margin * 2);
        
        // Ensure the maze fits within the container while maintaining its aspect ratio
        this.cellSize = Math.min(
            availableWidth / this.width,
            availableHeight / this.height
        );
        
        // Recalculate the total maze size
        const totalWidth = this.width * this.cellSize;
        const totalHeight = this.height * this.cellSize;
        
        // Calculate the starting position to center the maze
        // Use the view's clientWidth and clientHeight for proper centering
        const startX = (this.app.view.clientWidth - totalWidth) / 2;
        const startY = (this.app.view.clientHeight - totalHeight) / 2;
        
        // Draw the maze walls
        this.graphics.lineStyle(2, this.wallColor);
        
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                const cellX = startX + (x * this.cellSize);
                const cellY = startY + (y * this.cellSize);
                
                // Draw the walls that are active
                if (cell.walls.top) {
                    this.graphics.moveTo(cellX, cellY);
                    this.graphics.lineTo(cellX + this.cellSize, cellY);
                }
                if (cell.walls.right) {
                    this.graphics.moveTo(cellX + this.cellSize, cellY);
                    this.graphics.lineTo(cellX + this.cellSize, cellY + this.cellSize);
                }
                if (cell.walls.bottom) {
                    this.graphics.moveTo(cellX, cellY + this.cellSize);
                    this.graphics.lineTo(cellX + this.cellSize, cellY + this.cellSize);
                }
                if (cell.walls.left) {
                    this.graphics.moveTo(cellX, cellY);
                    this.graphics.lineTo(cellX, cellY + this.cellSize);
                }
            }
        }
        
        // Draw start and end cells if defined
        if (this.startCell) {
            this.highlightCell(this.startCell.y, this.startCell.x, 0x00ff00);
        }
        if (this.endCell) {
            this.highlightCell(this.endCell.y, this.endCell.x, 0xff0000);
        }
    }
    
    /**
     * Highlight a cell with a specified color
     * @param {number} row - The row index
     * @param {number} col - The column index
     * @param {number} color - The color to use for highlighting (hex)
     */
    highlightCell(row, col, color, alpha = 0.5) {
        const startX = (this.app.renderer.width - (this.width * this.cellSize)) / 2;
        const startY = (this.app.renderer.height - (this.height * this.cellSize)) / 2;
        
        const cellX = startX + (col * this.cellSize);
        const cellY = startY + (row * this.cellSize);
        
        this.cellHighlights.beginFill(color, alpha);
        this.cellHighlights.drawRect(
            cellX + 2, 
            cellY + 2, 
            this.cellSize - 4, 
            this.cellSize - 4
        );
        this.cellHighlights.endFill();
    }
    
    /**
     * Generate a maze using the specified algorithm
     * @param {string} algorithm - The algorithm to use ('dfs', 'kruskal', 'prim', or 'wilson')
     */
    generate(algorithm) {
        // Clear all graphics
        this.graphics.clear();
        this.cellHighlights.clear();
        this.playerGraphics.clear();
        
        // Reset all walls to be active
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x].walls = {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true
                };
            }
        }
        
        switch (algorithm) {
            case 'dfs':
                this.generateDFS();
                break;
            case 'kruskal':
                this.generateKruskal();
                break;
            case 'prim':
                this.generatePrim();
                break;
            case 'wilson':
                this.generateWilson();
                break;
            default:
                this.generateDFS();
        }
        
        // Set start and end cells
        this.startCell = this.grid[0][0];
        this.endCell = this.grid[this.height - 1][this.width - 1];
        
        // Render the maze
        this.render();
    }
    
    /**
     * Generate a maze using Depth-First Search algorithm
     */
    generateDFS() {
        // Simple placeholder implementation
        // This would be expanded with the actual DFS algorithm
        const stack = [];
        const startCell = this.grid[0][0];
        startCell.visited = true;
        stack.push(startCell);
        
        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const neighbors = this.getUnvisitedNeighbors(current);
            
            if (neighbors.length === 0) {
                stack.pop();
            } else {
                const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                this.removeWallBetween(current, neighbor);
                neighbor.visited = true;
                stack.push(neighbor);
            }
        }
        
        // Reset visited flags
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                delete this.grid[y][x].visited;
            }
        }
    }
    
    /**
     * Get unvisited neighboring cells
     * @param {Cell} cell - The cell to check neighbors for
     * @returns {Array<Cell>} - Array of unvisited neighboring cells
     */
    getUnvisitedNeighbors(cell) {
        const neighbors = [];
        const { x, y } = cell;
        
        // Check top
        if (y > 0 && !this.grid[y - 1][x].visited) {
            neighbors.push(this.grid[y - 1][x]);
        }
        
        // Check right
        if (x < this.width - 1 && !this.grid[y][x + 1].visited) {
            neighbors.push(this.grid[y][x + 1]);
        }
        
        // Check bottom
        if (y < this.height - 1 && !this.grid[y + 1][x].visited) {
            neighbors.push(this.grid[y + 1][x]);
        }
        
        // Check left
        if (x > 0 && !this.grid[y][x - 1].visited) {
            neighbors.push(this.grid[y][x - 1]);
        }
        
        return neighbors;
    }
    
    /**
     * Remove the wall between two adjacent cells
     * @param {Cell} cell1 - First cell
     * @param {Cell} cell2 - Second cell
     */
    removeWallBetween(cell1, cell2) {
        const dx = cell2.x - cell1.x;
        const dy = cell2.y - cell1.y;
        
        if (dx === 1) { // cell2 is to the right of cell1
            cell1.walls.right = false;
            cell2.walls.left = false;
        } else if (dx === -1) { // cell2 is to the left of cell1
            cell1.walls.left = false;
            cell2.walls.right = false;
        } else if (dy === 1) { // cell2 is below cell1
            cell1.walls.bottom = false;
            cell2.walls.top = false;
        } else if (dy === -1) { // cell2 is above cell1
            cell1.walls.top = false;
            cell2.walls.bottom = false;
        }
    }
    
    /**
     * Generate a maze using Kruskal's algorithm
     * (Placeholder - would be implemented fully)
     */
    generateKruskal() {
        // Simple placeholder - would be expanded with actual implementation
        this.generateDFS(); // Fallback to DFS for now
    }
    
    /**
     * Generate a maze using Prim's algorithm
     * (Placeholder - would be implemented fully)
     */
    generatePrim() {
        // Simple placeholder - would be expanded with actual implementation
        this.generateDFS(); // Fallback to DFS for now
    }
    
    /**
     * Generate a maze using Wilson's algorithm
     * Wilson's algorithm produces an unbiased maze by performing loop-erased random walks
     */
    generateWilson() {
        // Mark all cells as unvisited
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x].visited = false;
                this.grid[y][x].inMaze = false;
            }
        }
        
        // Step 1: Choose a random cell and mark it as part of the maze
        const startY = Math.floor(Math.random() * this.height);
        const startX = Math.floor(Math.random() * this.width);
        this.grid[startY][startX].inMaze = true;
        this.grid[startY][startX].visited = true;
        
        // Count cells in the maze
        let cellsInMaze = 1;
        const totalCells = this.width * this.height;
        
        // Continue until all cells are in the maze
        while (cellsInMaze < totalCells) {
            // Choose a random unvisited cell to start a new random walk
            let currentY, currentX;
            do {
                currentY = Math.floor(Math.random() * this.height);
                currentX = Math.floor(Math.random() * this.width);
            } while (this.grid[currentY][currentX].inMaze);
            
            // Reset path for this walk
            this.resetPath();
            
            // Start a new random walk
            let cell = this.grid[currentY][currentX];
            cell.pathDirection = null;  // No direction yet
            
            // Continue random walk until we hit a cell that's already in the maze
            while (!cell.inMaze) {
                // Mark the current cell as part of the path
                cell.inPath = true;
                
                // Get all available neighboring cells
                const neighbors = this.getAllNeighbors(cell);
                
                // Choose a random neighbor
                const neighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
                
                // Determine direction to the chosen neighbor
                let direction;
                if (neighbor.y < cell.y) direction = 'up';
                else if (neighbor.y > cell.y) direction = 'down';
                else if (neighbor.x < cell.x) direction = 'left';
                else direction = 'right';
                
                // Store the direction taken from this cell
                cell.pathDirection = direction;
                
                // If the neighbor is already in the path (loop), erase the loop
                if (neighbor.inPath) {
                    // Find all cells in the loop and remove them from the path
                    let loopCell = cell;
                    while (loopCell !== neighbor) {
                        loopCell.inPath = false;
                        
                        // Move to the previous cell in the path
                        // Using the directions we've stored
                        switch (loopCell.pathDirection) {
                            case 'up':
                                loopCell = this.grid[loopCell.y - 1][loopCell.x];
                                break;
                            case 'down':
                                loopCell = this.grid[loopCell.y + 1][loopCell.x];
                                break;
                            case 'left':
                                loopCell = this.grid[loopCell.y][loopCell.x - 1];
                                break;
                            case 'right':
                                loopCell = this.grid[loopCell.y][loopCell.x + 1];
                                break;
                        }
                    }
                }
                
                // Move to the next cell
                cell = neighbor;
            }
            
            // Now we have a path from a random cell to a cell that's in the maze
            // Carve passages along this path
            let currentCell = this.grid[currentY][currentX];
            
            // Follow the path using the stored directions
            while (!currentCell.inMaze) {
                // Mark this cell as part of the maze
                currentCell.inMaze = true;
                cellsInMaze++;
                
                // Get the next cell in the path
                let nextCell;
                switch (currentCell.pathDirection) {
                    case 'up':
                        nextCell = this.grid[currentCell.y - 1][currentCell.x];
                        break;
                    case 'down':
                        nextCell = this.grid[currentCell.y + 1][currentCell.x];
                        break;
                    case 'left':
                        nextCell = this.grid[currentCell.y][currentCell.x - 1];
                        break;
                    case 'right':
                        nextCell = this.grid[currentCell.y][currentCell.x + 1];
                        break;
                }
                
                // Remove walls between the current cell and the next cell
                this.removeWallBetween(currentCell, nextCell);
                
                // Move to the next cell
                currentCell = nextCell;
            }
        }
        
        // Clean up all temporary properties we added
        this.cleanupTemporaryProperties();
    }
    
    /**
     * Reset the path information for a new random walk
     */
    resetPath() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.grid[y][x].inPath = false;
                this.grid[y][x].pathDirection = null;
            }
        }
    }
    
    /**
     * Get all neighboring cells regardless of visited status
     * @param {Cell} cell - The cell to check neighbors for
     * @returns {Array<Cell>} - Array of all neighboring cells
     */
    getAllNeighbors(cell) {
        const neighbors = [];
        const { x, y } = cell;
        
        // Check top
        if (y > 0) {
            neighbors.push(this.grid[y - 1][x]);
        }
        
        // Check right
        if (x < this.width - 1) {
            neighbors.push(this.grid[y][x + 1]);
        }
        
        // Check bottom
        if (y < this.height - 1) {
            neighbors.push(this.grid[y + 1][x]);
        }
        
        // Check left
        if (x > 0) {
            neighbors.push(this.grid[y][x - 1]);
        }
        
        return neighbors;
    }
    
    /**
     * Get connected neighboring cells (those without walls between them)
     * @param {Cell} cell - The cell to check for connected neighbors
     * @returns {Array<Cell>} - Array of connected neighboring cells
     */
    getConnectedNeighbors(cell) {
        const neighbors = [];
        const { x, y } = cell;
        
        // Check top
        if (y > 0 && !cell.walls.top) {
            neighbors.push(this.grid[y - 1][x]);
        }
        
        // Check right
        if (x < this.width - 1 && !cell.walls.right) {
            neighbors.push(this.grid[y][x + 1]);
        }
        
        // Check bottom
        if (y < this.height - 1 && !cell.walls.bottom) {
            neighbors.push(this.grid[y + 1][x]);
        }
        
        // Check left
        if (x > 0 && !cell.walls.left) {
            neighbors.push(this.grid[y][x - 1]);
        }
        
        return neighbors;
    }
    
    /**
     * Clean up all temporary properties used during maze generation
     */
    cleanupTemporaryProperties() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                delete this.grid[y][x].visited;
                delete this.grid[y][x].inMaze;
                delete this.grid[y][x].inPath;
                delete this.grid[y][x].pathDirection;
            }
        }
    }
    
    /**
     * Enable play mode and create player
     */
    enablePlayMode() {
        this.player.enable();
    }
    
    /**
     * Disable play mode and remove player
     */
    disablePlayMode() {
        this.player.disable();
    }
    
    /**
     * Move player in the specified direction
     * @param {string} direction - Direction to move ('up', 'right', 'down', 'left')
     * @returns {boolean} - True if move was successful
     */
    movePlayer(direction) {
        return this.player.move(direction);
    }
}

// Cell class moved to Cell.js