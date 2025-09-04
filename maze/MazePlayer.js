/**
 * Class responsible for player movement and interaction within a maze
 */
export default class MazePlayer {
    /**
     * Create a new MazePlayer
     * @param {Maze} maze - The maze to play in
     */
    constructor(maze) {
        this.maze = maze;
        this.currentCell = null;
        this.isActive = false;
    }
    
    /**
     * Enable player mode
     */
    enable() {
        this.isActive = true;
        this.currentCell = this.maze.startCell;
        this.render();
    }
    
    /**
     * Disable player mode
     */
    disable() {
        this.isActive = false;
        this.currentCell = null;
        this.maze.playerGraphics.clear();
    }
    
    /**
     * Render the player
     */
    render() {
        if (!this.isActive || !this.currentCell) return;
        
        this.maze.playerGraphics.clear();
        
        const startX = (this.maze.app.renderer.width - (this.maze.width * this.maze.cellSize)) / 2;
        const startY = (this.maze.app.renderer.height - (this.maze.height * this.maze.cellSize)) / 2;
        
        const playerX = startX + (this.currentCell.x * this.maze.cellSize) + (this.maze.cellSize / 2);
        const playerY = startY + (this.currentCell.y * this.maze.cellSize) + (this.maze.cellSize / 2);
        
        // Draw player as a circle
        const playerRadius = this.maze.cellSize * 0.3;
        this.maze.playerGraphics.beginFill(0x00BFFF);
        this.maze.playerGraphics.drawCircle(playerX, playerY, playerRadius);
        this.maze.playerGraphics.endFill();
        
        // Add a subtle glow effect
        this.maze.playerGraphics.beginFill(0x00BFFF, 0.3);
        this.maze.playerGraphics.drawCircle(playerX, playerY, playerRadius * 1.3);
        this.maze.playerGraphics.endFill();
        
        // Check if player reached the end
        if (this.currentCell === this.maze.endCell) {
            this.handleMazeComplete();
        }
    }
    
    /**
     * Handle maze completion
     */
    handleMazeComplete() {
        // Create a victory animation
        const totalWidth = this.maze.width * this.maze.cellSize;
        const totalHeight = this.maze.height * this.maze.cellSize;
        const startX = (this.maze.app.renderer.width - totalWidth) / 2;
        const startY = (this.maze.app.renderer.height - totalHeight) / 2;
        
        const victoryGraphics = new PIXI.Graphics();
        this.maze.app.stage.addChild(victoryGraphics);
        
        // Animate a ripple effect
        let radius = 0;
        const maxRadius = Math.max(totalWidth, totalHeight);
        const ticker = new PIXI.Ticker();
        ticker.add(() => {
            victoryGraphics.clear();
            victoryGraphics.beginFill(0x00FF00, 0.1);
            victoryGraphics.lineStyle(2, 0x00FF00, 0.7);
            victoryGraphics.drawCircle(
                startX + (this.maze.endCell.x * this.maze.cellSize) + (this.maze.cellSize / 2),
                startY + (this.maze.endCell.y * this.maze.cellSize) + (this.maze.cellSize / 2),
                radius
            );
            victoryGraphics.endFill();
            
            radius += 5;
            if (radius > maxRadius) {
                ticker.destroy();
                victoryGraphics.destroy();
                
                // Show victory message
                Swal.fire({
                    title: 'Congratulations!',
                    text: 'You solved the maze!',
                    icon: 'success',
                    confirmButtonText: 'Play Again'
                }).then(() => {
                    // Reset player position
                    this.currentCell = this.maze.startCell;
                    this.render();
                });
            }
        });
        ticker.start();
    }
    
    /**
     * Move player in the specified direction
     * @param {string} direction - Direction to move ('up', 'right', 'down', 'left')
     * @returns {boolean} - True if move was successful
     */
    move(direction) {
        if (!this.isActive || !this.currentCell) return false;
        
        let canMove = false;
        let nextCell = null;
        
        // Check if there's a wall in the direction we want to move
        switch (direction) {
            case 'up':
                if (!this.currentCell.walls.top && this.currentCell.y > 0) {
                    nextCell = this.maze.grid[this.currentCell.y - 1][this.currentCell.x];
                    canMove = true;
                }
                break;
            case 'right':
                if (!this.currentCell.walls.right && this.currentCell.x < this.maze.width - 1) {
                    nextCell = this.maze.grid[this.currentCell.y][this.currentCell.x + 1];
                    canMove = true;
                }
                break;
            case 'down':
                if (!this.currentCell.walls.bottom && this.currentCell.y < this.maze.height - 1) {
                    nextCell = this.maze.grid[this.currentCell.y + 1][this.currentCell.x];
                    canMove = true;
                }
                break;
            case 'left':
                if (!this.currentCell.walls.left && this.currentCell.x > 0) {
                    nextCell = this.maze.grid[this.currentCell.y][this.currentCell.x - 1];
                    canMove = true;
                }
                break;
        }
        
        if (canMove && nextCell) {
            this.currentCell = nextCell;
            this.render();
            return true;
        }
        
        return false;
    }
}
