(async () => {
    // Create a new application
    const app = new PIXI.Application({
        backgroundColor: 0x87CEEB,  // Dark background color
        resizeTo: window  // Make the canvas resize with the window
    });

    // Append the application canvas to the document body
    document.body.appendChild(app.view);

    // Circle class to manage each bouncing circle
    class Circle {
        constructor(x, y, type, color) {
            /*
            this.graphics = new PIXI.Graphics();
            this.graphics.beginFill(color);
            this.graphics.drawCircle(0, 0, radius);
            this.graphics.endFill();
            */

            this.type = type;
            this.radius = (type + typetosizeconstant) * typetosizescalar;
            this.mass = this.radius ** 2;
            this.rotationSpeed = 0;
            this.isMerged = false;

            this.graphics = PIXI.Sprite.from('assets/' + images[type - 1] + '.png');
            this.graphics.width = this.radius * 2;
            this.graphics.height = this.radius * 2;
            this.graphics.anchor.set(0.5, 0.5);

            this.graphics.x = x ?? app.view.width / 2;
            this.graphics.y = y;

            // Random speed for movement
            this.vx = 0;
            this.vy = 0;

            backlayer.addChild(this.graphics);  // Add the circle to the stage
        }

        update(delta) {
            this.graphics.x += this.vx * gameSpeed * delta;
            this.graphics.y += this.vy * gameSpeed * delta;
            
            this.graphics.rotation += this.rotationSpeed * delta;
            this.rotationSpeed *= rotationdecay ** delta;

            
            if(this.graphics.y < bottomwall - this.radius - 5)
                // Add gravity if not close to the bottom
                this.vy += gravity * delta;
            else {
                if (this.vy < 0.1 && this.vy > -0.1) {
                    this.vy = 0;
                }
            }

            // Lose some energy
            this.vx *= airResistance ** delta;
            this.vy *= airResistance ** delta;
            
            if (this.graphics.x < leftwall + this.radius) {
                this.vx *= -bounce;
                this.graphics.x = 2 * leftwall - this.graphics.x + 2 * this.radius;
                this.rotationSpeed += rotationScaleWalls * this.vy * this.vx;
            }
            else if (this.graphics.x > rightwall - this.radius) {
                this.vx *= -bounce;
                this.graphics.x = 2 * rightwall - this.graphics.x - 2 * this.radius;
                this.rotationSpeed += rotationScaleWalls * this.vy * this.vx;
            }

            if (this.graphics.y > bottomwall - this.radius) {
                this.vy *= -bounce;
                this.vx *= friction;
                this.graphics.y = 2 * bottomwall - this.graphics.y - 2 * this.radius;
                this.rotationSpeed += rotationScaleWalls * this.vx * Math.abs(this.vy);
            }
        }

        handleCollision(other) {
            const dx = this.graphics.x - other.graphics.x;
            const dy = this.graphics.y - other.graphics.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            // Vérifie si les deux cercles se chevauchent
            if (distance < this.radius + other.radius) {
                if (this.type === other.type && !this.isMerged && !other.isMerged) {
                    audio.play();
                    const avgx = (this.graphics.x + other.graphics.x) / 2;
                    const avgy = (this.graphics.y + other.graphics.y) / 2;
                    this.isMerged = true;
                    other.isMerged = true;
                    
                    const circle = new Circle(
                        avgx,
                        avgy,
                        this.type + 1, // Upgrade to the next type
                    );
    
                    // Remove the old circles from the stage
                    backlayer.removeChild(this.graphics);
                    backlayer.removeChild(other.graphics);
    
                    // Remove the old circles from the array
                    circles.splice(circles.indexOf(this), 1);
                    circles.splice(circles.indexOf(other), 1);
    
                    circles.push(circle);
                    score += 2 ** (circle.type - 2);
                    scoreText.text = `Score: ${score}`;
    
                    return true;
                }

                const normalX = dx / distance;
                const normalY = dy / distance;
    
                // Tangential components (orthogonal to the normal)
                const tangentX = -normalY;
                const tangentY = normalX;
    
                // Project the velocities onto the normal and tangential directions
                const v1n = this.vx * normalX + this.vy * normalY;
                const v1t = this.vx * tangentX + this.vy * tangentY;
                const v2n = other.vx * normalX + other.vy * normalY;
                const v2t = other.vx * tangentX + other.vy * tangentY;
    
                // Masses of the circles
                const m1 = this.mass;
                const m2 = other.mass;
    
                // Calculate the new normal velocities after collision (1D elastic collision formula)
                const v1nAfter = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
                const v2nAfter = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);
    
                // Convert the scalar normal and tangential velocities back into vectors
                const newV1nX = v1nAfter * normalX;
                const newV1nY = v1nAfter * normalY;
                const newV1tX = v1t * tangentX;
                const newV1tY = v1t * tangentY;
    
                const newV2nX = v2nAfter * normalX;
                const newV2nY = v2nAfter * normalY;
                const newV2tX = v2t * tangentX;
                const newV2tY = v2t * tangentY;
    
                // Update velocities of both circles
                this.vx = newV1nX + newV1tX;
                this.vy = newV1nY + newV1tY;
    
                other.vx = newV2nX + newV2tX;
                other.vy = newV2nY + newV2tY;

                // Calculate change in tangential velocity (scaled by radius)
                const velocityChange1 = (v2t - v1t) / this.radius * rotationScale;
                const velocityChange2 = (v1t - v2t) / other.radius * rotationScale;

                // Update rotation speeds (simplified angular velocity update)
                this.rotationSpeed += velocityChange1;
                other.rotationSpeed += velocityChange2;
    
                // Éloigner légèrement les cercles pour éviter un chevauchement prolongé
                const angle = Math.atan2(dy, dx);
                const overlap = this.radius + other.radius - distance;
                this.graphics.x += Math.cos(angle) * overlap / 2;
                this.graphics.y += Math.sin(angle) * overlap / 2;
    
                other.graphics.x -= Math.cos(angle) * overlap / 2;
                other.graphics.y -= Math.sin(angle) * overlap / 2;
            }
        }
    }

    // #region functions

    function randomInt(max) {
        return Math.floor(Math.random() * max + 1);
    }

    function getNewX(mouseX, radius) {
        return Math.max(leftwall + radius, Math.min(rightwall - radius, mouseX));
    }

    function checkGameOver(circle) {
        // Vérifie les collisions avec le nextcircle
        const dx = circle.graphics.x - nextCircle.graphics.x;
        const dy = circle.graphics.y - nextCircle.graphics.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
    
        // Vérifie si les deux cercles se chevauchent
        if (distance < circle.radius + nextCircle.radius) {
            // Game over
            // Show a popup with the final score and a button to reload the page
            if (!gameOver) {
                popup();
                gameOver = true;
            }
        }
    }

    function popup() {
        Swal.fire({
            title: 'Game Over',
            text: `Score: ${score}`,
            imageUrl: './assets/pepe.png',
            imageWidth: 300,
            imageHeight: 300,
            confirmButtonText: 'Restart',
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                startGame();
            }
        })
    }

    function startGame() {
        // Reset the score
        score = 0;
        scoreText.text = `Score: ${score}`;
        gameOver = false;

        // Remove all circles from the stage
        circles.forEach(circle => backlayer.removeChild(circle.graphics));
        circles.length = 0;

        if (nextCircle) backlayer.removeChild(nextCircle.graphics);

        // Create a new circle
        nextCircle = new Circle(centerx, centery - spawnY, randomInt(maxTypes));
    }

    // #endregion


    // #region constants and variables

    // List of images
    const images = [
        "billaut",
        "bocquillon",
        "delalandre",
        "kergosien",
        "makris",
        "monmarche",
        "neron",
        "rault",
        "slimane",
        "soukhal",
        "tkindt",
        "venturini",
    ];

    // Sound effect
    const audio = new Audio('assets/pop.wav');

    // Constants
    const gravity = 0.004;
    const gameSpeed = 0.3;
    const rotationScale = 0.00005;
    const rotationScaleWalls = 0.003;
    const rotationdecay = 0.997;
    const airResistance = 0.999;
    const friction = 0.98;
    const bounce = 0.99;
    const typetosizeconstant = 3;
    const typetosizescalar = 10;
    const spawnY = 420;
    const spawnDelay = 600;
    const width = 600;
    const height = 800;
    const innerwidth = 560;
    const innerheight = 780;
    const maxTypes = 3;
    const centerx = app.view.width / 2;
    const centery = app.view.height / 2;
    const leftwall = centerx - innerwidth / 2;
    const rightwall = centerx + innerwidth / 2;
    const bottomwall = centery + innerheight / 2;

    // Create an array to store the circles
    const circles = [];

    // Layers
    var backlayer = new PIXI.Container();
    var frontlayer = new PIXI.Container();

    app.stage.addChild(backlayer);
    app.stage.addChild(frontlayer);

    // Shadow filter
    const shadowFilter = new PIXI.filters.DropShadowFilter();
    shadowFilter.angle = 5 / 4 * Math.PI;
    shadowFilter.distance = 6;
    backlayer.filters = [shadowFilter];

    // Variables
    var time1 = Date.now();
    var time2;
    var score = 0;
    var gameOver = false;
    var nextCircle;

    // Puth the jar image in the middle of the screen
    const jar = PIXI.Sprite.from('assets/jar2.png');
    jar.alpha = 0.8;
    jar.width = width;
    jar.height = height;
    jar.anchor.set(0.5, 0.5);
    jar.x = centerx;
    jar.y = app.view.height / 2;

    frontlayer.addChild(jar);

    // Score text
    const scoreText = new PIXI.Text(`Score: ${score}`, {
        fontSize: 36,        // Font size
        fill: 0xffffff,      // White text color
        fontFamily: 'Arial', // Font family
        align: 'center',     // Text alignment
    });

    scoreText.anchor.set(0.5, 0.5);
    scoreText.x = centerx;
    scoreText.y = 50;

    frontlayer.addChild(scoreText);

    // #endregion

    // Game loop to update the circles' position
    app.ticker.add(() => {
        if (gameOver) return;
        time2 = Date.now();
        circles.forEach(circle => circle.update(time2 - time1));
        time1 = time2;

        // Check for collisions between circles
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                circles[i].handleCollision(circles[j]);
            }

            if (nextCircle) {
                checkGameOver(circles[i]);
            }
        }
    });

    document.addEventListener('pointermove', (e) =>
    {
        if (gameOver) return;
        if (!nextCircle) return;

        nextCircle.graphics.x = getNewX(e.clientX, nextCircle.radius);
    });

    document.addEventListener('pointerdown', (e) =>
    {
        if (!nextCircle) return;

        nextCircle.graphics.x = getNewX(e.clientX, nextCircle.radius);
        circles.push(nextCircle);
        nextCircle = null;

        setTimeout(() => {
            if (gameOver) return;
            nextCircle = new Circle(e.clientX, centery - spawnY, randomInt(maxTypes));
            nextCircle.graphics.x = getNewX(e.clientX, nextCircle.radius);
        }, spawnDelay);
    });

    // Start the game
    startGame();
})();

