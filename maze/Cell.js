/**
 * Represents a single cell in the maze.
 */
export default class Cell {
    /**
     * Create a new cell
     * @param {number} x - The x-coordinate (column)
     * @param {number} y - The y-coordinate (row)
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this.predecessor = null; // Store the previous cell in the path
    }
}
