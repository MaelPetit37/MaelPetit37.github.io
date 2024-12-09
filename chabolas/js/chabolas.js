class Circle {
    constructor(x, y, type, vy = 0, color = 'red') {
        // Créer un élément HTML pour le cercle
        this.element = document.createElement('div');
        this.element.classList.add('circle');
        document.body.appendChild(this.element);

        this.type = type; // Type of the fruit (e.g., 'cherry', 'watermelon')

        this.x = x; // X position
        this.y = y; // Y position

        this.vx = 0; // Horizontal speed
        this.vy = vy; // Vertical speed

        this.color = color; // Visual representation (can be changed to an image later)

        this.size = type * 25; // Radius based on the type
        this.radius = this.size / 2; // Radius of the circle
        this.mass = this.size ** 2; // Mass proportional to the size

        this.isMerged = false; // To prevent multiple merges in one frame

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
        if(this.y < window.innerHeight - this.radius - 5)
            this.vy += 0.1;

        // Lose some energy
        this.vx *= 0.98;
        this.vy *= 0.98;

        // Vérifier les collisions avec les bords
        if (this.x < this.radius || this.x > window.innerWidth - this.radius) {
            this.vx *= -1; // Rebond horizontal

            if (this.x < this.radius) this.x = this.radius;
            if (this.x > window.innerWidth - this.radius) this.x = window.innerWidth - this.radius;
        }
        if (this.y < this.radius || this.y > window.innerHeight - this.radius) {
            this.vy *= -1; // Rebond vertical

            if (this.y < this.radius) this.y = this.radius;
            if (this.y > window.innerHeight - this.radius) this.y = window.innerHeight - this.radius;
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

        const centerx = window.innerWidth / 2;
        const centery = window.innerHeight / 2;

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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

//const container = new Container(800, 800, 20);

// Créer et animer les cercles
const circles = [];

for (let i = 0; i < 10; i++) { // Ajoute 10 cercles
    const circle = new Circle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight,
        getRandomInt(5));
    circle.element.onclick = () => circle.handleClick();
    circles.push(circle);
}

// Animer les cercles
function animate() {
    // Déplace chaque cercle
    circles.forEach(circle => circle.move());

    // Vérifie les collisions entre les cercles
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            circles[i].handleCollision(circles[j]);
        }
    }

    requestAnimationFrame(animate);
}
animate();

document.addEventListener('click', function(event) {
    console.log(`Clic à la position (${event.clientX}, ${event.clientY})`);

    // Create a circle at the clicked position
    const circle = new Circle(event.clientX, event.clientY, 1);
    circles.push(circle);
});

var score = 0;
const scoreElement = document.createElement('div');
scoreElement.classList.add('score');
document.body.appendChild(scoreElement);
scoreElement.textContent = `Score: ${score}`;

