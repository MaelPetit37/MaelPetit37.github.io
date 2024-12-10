class Circle {
    constructor(x, y, type, vy = 0) {
        this.type = type; // Type of the fruit (e.g., 'cherry', 'watermelon')

        this.x = x; // X position
        this.y = y; // Y position

        this.vx = 0; // Horizontal speed
        this.vy = vy; // Vertical speed

        this.size = type * typetosize; // Radius based on the type
        this.radius = this.size / 2; // Radius of the circle
        this.mass = this.size ** 2; // Mass proportional to the size

        this.isMerged = false; // To prevent multiple merges in one frame

        // Créer un élément HTML pour le cercle
        this.element = document.createElement('div');
        this.element.classList.add('circle');
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.backgroundColor = `hsl(${type * 72}, 80%, 60%)`;
        this.updatePosition();
        document.body.appendChild(this.element);
    }

    randomizeType() {
        this.type = getRandomInt(maxTypes);

        this.size = type * 25; // Radius based on the type
        this.radius = this.size / 2; // Radius of the circle
        this.mass = this.size ** 2; // Mass proportional to the size

        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        this.element.style.backgroundColor = `hsl(${type * 72}, 80%, 60%)`;
    }

    updatePosition() {
        this.element.style.left = `${this.x - this.radius}px`;
        this.element.style.top = `${this.y - this.radius}px`;
    }

    move() {
        // Mettre à jour la position
        this.x += this.vx;
        this.y += this.vy;

        // Add gravity
        if(this.y < container.bottomInnerBound - this.radius - 5)
            this.vy += gravity;
        else {
            var step = (container.bottomInnerBound - this.radius - this.y) / 2;
            this.y += step;
        }

        // Lose some energy
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Vérifier les collisions avec le container
        if (this.x < container.leftInnerBound + this.radius) {
            this.vx *= -1; // Rebond horizontal
            this.x = container.leftInnerBound + this.radius;
        }
        else if (this.x > container.rightInnerBound - this.radius) {
            this.vx *= -1; // Rebond horizontal
            this.x = container.rightInnerBound - this.radius;
        }
        if (this.y > container.bottomInnerBound - this.radius) {
            this.vy *= -1; // Rebond vertical
            this.y = container.bottomInnerBound - this.radius;
        }

        if (this.y > window.innerHeight - this.radius) {
            // Game over
            // Show a popup with the final score and then reload the page
            alert(`Game over! Your score: ${score}`);
        }

        this.updatePosition();
    }

    handleCollision(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Vérifie si les deux cercles se chevauchent
        if (distance < (this.size + other.size) / 2) {
            if (this.type === other.type && !this.isMerged && !other.isMerged) {
                audio.play();
                const avgx = (this.x + other.x) / 2;
                const avgy = (this.y + other.y) / 2;
                this.isMerged = true;
                other.isMerged = true;
                
                const circle = new Circle(
                    avgx,
                    avgy,
                    this.type + 1, // Upgrade to the next type
                );

                // Remove the old circles from the DOM
                this.element.remove();
                other.element.remove();

                // Remove the old circles from the array
                circles.splice(circles.indexOf(this), 1);
                circles.splice(circles.indexOf(other), 1);

                circles.push(circle);
                score += 2 ** (circle.type - 2);
                scoreElement.textContent = `Score: ${score}`;

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

            // Update velocities of both circles and lose some energy
            this.vx = newV1nX + newV1tX * 0.9;
            this.vy = newV1nY + newV1tY * 0.9;

            other.vx = newV2nX + newV2tX * 0.9;
            other.vy = newV2nY + newV2tY * 0.9;

            // Éloigner légèrement les cercles pour éviter un chevauchement prolongé
            const angle = Math.atan2(dy, dx);
            const overlap = (this.size + other.size) / 2 - distance;
            this.x += Math.cos(angle) * overlap / 2;
            this.y += Math.sin(angle) * overlap / 2;

            other.x -= Math.cos(angle) * overlap / 2;
            other.y -= Math.sin(angle) * overlap / 2;

            this.updatePosition();
            other.updatePosition();
        }
    }
}

// Container dans lequel les cercles sont placés pour le jeu
class Container{
    constructor(width, height, thickness){
        this.width = width;
        this.height = height;
        this.thickness = thickness;

        this.leftInnerBound = centerx - width / 2;
        this.rightInnerBound = centerx + width / 2;
        this.bottomInnerBound = centery + height / 2 - thickness;

        // Créer les murs et sol du conteneur
        const leftWall = document.createElement('div');
        leftWall.classList.add('container');
        leftWall.style.width = `${thickness}px`;
        leftWall.style.height = `${height}px`;
        leftWall.style.left = centerx - width / 2 - thickness + 'px';
        leftWall.style.top = centery - height / 2 + 'px';
        document.body.appendChild(leftWall);

        const rightWall = document.createElement('div');
        rightWall.classList.add('container');
        rightWall.style.width = `${thickness}px`;
        rightWall.style.height = `${height}px`;
        rightWall.style.left = centerx + width / 2 + 'px';
        rightWall.style.top = centery - height / 2 + 'px';
        document.body.appendChild(rightWall);

        const bottomWall = document.createElement('div');
        bottomWall.classList.add('container');
        bottomWall.style.width = `${width}px`;
        bottomWall.style.height = `${thickness}px`;
        bottomWall.style.left = centerx - width / 2 + 'px';
        bottomWall.style.top = centery + height / 2 - thickness + 'px';
        document.body.appendChild(bottomWall);


    }

}

function popup() {
    // Create the popup container
    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.top = '50%';
    popupContainer.style.left = '50%';
    popupContainer.style.transform = 'translate(-50%, -50%)';
    popupContainer.style.backgroundColor = 'white';
    popupContainer.style.padding = '20px';
    popupContainer.style.border = '2px solid black';
    popupContainer.style.zIndex = '1000';
    popupContainer.style.textAlign = 'center';
    popupContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  
    // Create a message to display the score value
    const message = document.createElement('p');
    message.textContent = `Final score: ${score}`;
    popupContainer.appendChild(message);
  
    // Create the reload button
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Reload Page';
    reloadButton.style.marginTop = '10px';
    reloadButton.onclick = function() {
      location.reload();
    };
    popupContainer.appendChild(reloadButton);
  
    // Add the popup to the body
    document.body.appendChild(popupContainer);
  }

function getRandomInt(max) {
    return Math.floor(Math.random() * max + 1);
}

function getNewX(mouseX, radius) {
    return Math.max(centerx - width / 2 + radius, Math.min(centerx + width / 2 - radius, mouseX));
}

function checkGameOver(circle) {
    // Vérifie les collisions avec le nextcircle
    const dx = circle.x - nextcircle.x;
    const dy = circle.y - nextcircle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Vérifie si les deux cercles se chevauchent
    if (distance < (circle.size + nextcircle.size) / 2) {
        // Game over
        // Show a popup with the final score and a button to reload the page
        if (!gameOver) {
            popup();
            gameOver = true;
        }
    }
}

// Animer les cercles
function animate() {
    if (gameOver) return;
    // Déplace chaque cercle
    circles.forEach(circle => circle.move());

    // Vérifie les collisions entre les cercles
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            circles[i].handleCollision(circles[j]);
        }

        if (nextcircle) {
            checkGameOver(circles[i]);
        }
    }

    requestAnimationFrame(animate);
}

// Variables globales
const centerx = window.innerWidth / 2;
const centery = window.innerHeight / 2;

const gravity = 0.5;
const maxTypes = 4;
const typetosize = 25;
const spawnY = 100;
const spawnDelay = 700;
const width = 600;
const height = 800;
const thickness = 20;
const container = new Container(width, height, thickness);

var gameOver = false;

// Créer et animer les cercles
const circles = [];
/*
for (let i = 0; i < 10; i++) { // Ajoute 10 cercles
    const circle = new Circle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight +50,
        getRandomInt(maxTypes));
    circle.element.onclick = () => circle.handleClick();
    circles.push(circle);
}
*/
document.addEventListener('click', function(event) {
    if (gameOver) return;
    if (!nextcircle) return;

    circles.push(new Circle(
        nextcircle.x,
        spawnY,
        nextcircle.type,
        0,
    ));

    // Create a circle at the clicked position
    //nextcircle.randomizeType();

    nextcircle.element.remove();
    nextcircle = null;
    var type = getRandomInt(maxTypes);
    var radius = type * 25 / 2;
    newX = getNewX(event.clientX, radius);

    setTimeout(() => {
        nextcircle = new Circle(newX, spawnY, type);
    }, spawnDelay); // Delay of 1000 milliseconds (1 second)
});

document.addEventListener('mousemove', (event) => {
    if (gameOver) return;
    if (!nextcircle) return;
    newX = getNewX(event.clientX, nextcircle.radius);

    // Update the position of the next circle
    nextcircle.x = newX;
    nextcircle.updatePosition();
});


var score = 0;
const scoreElement = document.createElement('div');
scoreElement.classList.add('score');
document.body.appendChild(scoreElement);
scoreElement.textContent = `Score: ${score}`;
const audio = new Audio('media/pop.wav'); // Provide the path to your sound file

// Créer un cercle au dessus du container, à la position horizontale de la souris
var nextcircle = new Circle(centerx, spawnY, getRandomInt(maxTypes));
nextcircle.element.style.position = 'absolute';

animate();