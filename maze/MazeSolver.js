/**
 * Class responsible for solving mazes using various algorithms
 */
export default class MazeSolver {
    /**
     * Creates a new MazeSolver
     * @param {Maze} maze - The maze to solve
     */
    constructor(maze) {
        this.maze = maze;
    }
    
    /**
     * Legacy method for backward compatibility
     * @param {Cell} start - The starting cell
     * @param {Cell} end - The ending cell
     * @returns {Array<Cell>} - The path as an array of cells
     */
    findPath(start, end) {
        return this.findPathAStarSync(start, end);
    }
    
/**
 * Find a path from start to end using A* algorithm with animation
 * @param {Cell} start - The starting cell
 * @param {Cell} end - The ending cell
 * @param {Function} visualizeCallback - Callback for visualization
 * @param {number} delay - Delay between steps in milliseconds
 * @returns {Promise<Array<Cell>>} - Promise resolving to the path
 */
async findPathAStar(start, end, visualizeCallback, delay = 50) {
    // Reset all cell predecessors in the maze
    for (let y = 0; y < this.maze.height; y++) {
        for (let x = 0; x < this.maze.width; x++) {
            this.maze.grid[y][x].predecessor = null;
        }
    }
    
    // A* algorithm implementation
    const openSet = [start];
    const closedSet = new Set();
    
    // Initialize scores
    const gScore = new Map();
    const fScore = new Map();
    
    gScore.set(this.getCellKey(start), 0);
    fScore.set(this.getCellKey(start), this.heuristic(start, end));
    
    // For visualization
    const visitedCells = [start];        while (openSet.length > 0) {
            // Call the visualization callback only if delay > 0
            if (visualizeCallback && delay > 0) {
                visualizeCallback([...visitedCells]);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            // Find node with lowest fScore
            let current = openSet[0];
            let lowestFScore = fScore.get(this.getCellKey(current));
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                const f = fScore.get(this.getCellKey(openSet[i])) || Infinity;
                if (f < lowestFScore) {
                    lowestFScore = f;
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            // If we've reached the end
            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPathFromCells(current);
            }
        
            // Remove current from openSet and add to closedSet
            openSet.splice(currentIndex, 1);
            closedSet.add(this.getCellKey(current));
            
            // Check neighbors
            const neighbors = this.getNeighbors(current);
            
            for (const neighbor of neighbors) {
                if (closedSet.has(this.getCellKey(neighbor))) {
                    continue;
                }
                
                // Add to visited cells for visualization
                if (!visitedCells.includes(neighbor)) {
                    visitedCells.push(neighbor);
                }
                
                // Calculate tentative gScore
                const tentativeGScore = (gScore.get(this.getCellKey(current)) || Infinity) + 1;
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore.get(this.getCellKey(neighbor)) || Infinity)) {
                    continue;
                }
                
                // This path is the best so far
                neighbor.predecessor = current; // Store predecessor directly in the cell
                gScore.set(this.getCellKey(neighbor), tentativeGScore);
                fScore.set(this.getCellKey(neighbor), tentativeGScore + this.heuristic(neighbor, end));
            }
        }
        
        // No path found
        return [];
    }
    
    /**
     * Find a path from start to end using A* algorithm without animation
     * @param {Cell} start - The starting cell
     * @param {Cell} end - The ending cell
     * @returns {Array<Cell>} - The path as an array of cells
     */
    findPathAStarSync(start, end) {
        // Reset all cell predecessors in the maze
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                this.maze.grid[y][x].predecessor = null;
            }
        }
    
        // A* algorithm implementation
        const openSet = [start];
        const closedSet = new Set();
        
        // Initialize scores
        const gScore = new Map();
        const fScore = new Map();
        
        gScore.set(this.getCellKey(start), 0);
        fScore.set(this.getCellKey(start), this.heuristic(start, end));
        
        while (openSet.length > 0) {
            // Find node with lowest fScore
            let current = openSet[0];
            let lowestFScore = fScore.get(this.getCellKey(current));
            let currentIndex = 0;
            
            for (let i = 1; i < openSet.length; i++) {
                const f = fScore.get(this.getCellKey(openSet[i])) || Infinity;
                if (f < lowestFScore) {
                    lowestFScore = f;
                    current = openSet[i];
                    currentIndex = i;
                }
            }
            
            // If we've reached the end
            if (current.x === end.x && current.y === end.y) {
                return this.reconstructPathFromCells(current);
            }
            
            // Remove current from openSet and add to closedSet
            openSet.splice(currentIndex, 1);
            closedSet.add(this.getCellKey(current));
            
            // Check neighbors
            const neighbors = this.getNeighbors(current);
            
            for (const neighbor of neighbors) {
                if (closedSet.has(this.getCellKey(neighbor))) {
                    continue;
                }
                
                // Calculate tentative gScore
                const tentativeGScore = (gScore.get(this.getCellKey(current)) || Infinity) + 1;
                
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore.get(this.getCellKey(neighbor)) || Infinity)) {
                    continue;
                }
                
                // This path is the best so far
                neighbor.predecessor = current; // Store predecessor directly in the cell
                gScore.set(this.getCellKey(neighbor), tentativeGScore);
                fScore.set(this.getCellKey(neighbor), tentativeGScore + this.heuristic(neighbor, end));
            }
        }
        
        // No path found
        return [];
    }
    
    /**
     * Get a unique key for a cell
     * @param {Cell} cell - The cell
     * @returns {string} - A unique key
     */
    getCellKey(cell) {
        return `${cell.x},${cell.y}`;
    }
    
    /**
     * Heuristic function for A* (Manhattan distance)
     * @param {Cell} a - First cell
     * @param {Cell} b - Second cell
     * @returns {number} - Heuristic distance
     */
    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    /**
     * Reconstruct path from A* algorithm using the Map approach (legacy)
     * @param {Map} cameFrom - Map of cell navigations
     * @param {Cell} current - The end cell
     * @returns {Array<Cell>} - The path
     */
    reconstructPath(cameFrom, current) {
        const path = [current];
        
        while (cameFrom.has(this.getCellKey(current))) {
            current = cameFrom.get(this.getCellKey(current));
            path.unshift(current);
        }
        
        return path;
    }
    
    /**
     * Reconstruct path using the cell predecessor references
     * @param {Cell} current - The end cell
     * @returns {Array<Cell>} - The path
     */
    reconstructPathFromCells(current) {
        const path = [current];
        
        while (current.predecessor !== null) {
            current = current.predecessor;
            path.unshift(current);
        }
        
        return path;
    }
    
    /**
     * Find a path from start to end using Breadth-First Search algorithm with animation
     * @param {Cell} start - The starting cell
     * @param {Cell} end - The ending cell
     * @param {Function} visualizeCallback - Callback for visualization
     * @param {number} delay - Delay between steps in milliseconds
     * @returns {Promise<Array<Cell>>} - Promise resolving to the path
     */
    async findPathBFS(start, end, visualizeCallback, delay = 50) {
        // Reset all cell predecessors in the maze
        for (let y = 0; y < this.maze.height; y++) {
            for (let x = 0; x < this.maze.width; x++) {
                this.maze.grid[y][x].predecessor = null;
            }
        }
    
        // Initialize the visited set with the start cell
        const visited = new Set();
        visited.add(this.getCellKey(start));
        
        // For visualization
        const visitedCells = [start];
        
        // Initial set of current cells to explore from
        let currentCells = [start];
        
        // Visualize the initial state
        if (visualizeCallback) {
            visualizeCallback([...visitedCells]);
        }
        
        // Continue until there are no more cells to explore or we find the end
        while (currentCells.length > 0) {
            // Wait between steps (not between every cell)
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            // Find all unvisited neighbors from the current cells
            const nextCells = [];
            
            // Process all current cells
            for (const cell of currentCells) {
                // Check if we've reached the end
                if (cell.x === end.x && cell.y === end.y) {
                    // Visualize the final state before returning
                    if (visualizeCallback) {
                        visualizeCallback([...visitedCells]);
                    }
                    return this.reconstructPathFromCells(cell);
                }
                
                // Get all accessible neighbors
                const neighbors = this.getNeighbors(cell);
                
                // Check each neighbor
                for (const neighbor of neighbors) {
                    const key = this.getCellKey(neighbor);
                    
                    // Only process unvisited neighbors
                    if (!visited.has(key)) {
                        visited.add(key);
                        neighbor.predecessor = cell; // Store predecessor directly in the cell
                        nextCells.push(neighbor);
                        visitedCells.push(neighbor);
                    }
                }
            }
            
            // Update visualization with the new cells found in this step
            if (visualizeCallback && nextCells.length > 0) {
                visualizeCallback([...visitedCells]);
            }
            
            // The next set of cells to explore becomes the current set
            currentCells = nextCells;
        }
        
        // No path found
        return [];
    }
    
    /**
     * Get accessible neighboring cells
     * @param {Cell} cell - The cell to check
     * @returns {Array<Cell>} - Array of accessible neighbors
     */
    getNeighbors(cell) {
        const neighbors = [];
        const { x, y } = cell;
        
        // Check top - if there's no wall
        if (y > 0 && !cell.walls.top) {
            neighbors.push(this.maze.grid[y - 1][x]);
        }
        
        // Check right - if there's no wall
        if (x < this.maze.width - 1 && !cell.walls.right) {
            neighbors.push(this.maze.grid[y][x + 1]);
        }
        
        // Check bottom - if there's no wall
        if (y < this.maze.height - 1 && !cell.walls.bottom) {
            neighbors.push(this.maze.grid[y + 1][x]);
        }
        
        // Check left - if there's no wall
        if (x > 0 && !cell.walls.left) {
            neighbors.push(this.maze.grid[y][x - 1]);
        }
        
        return neighbors;
    }
}
