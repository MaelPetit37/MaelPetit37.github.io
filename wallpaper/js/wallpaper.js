class Cercle {
    constructor(parent) {
        // Créer un élément HTML pour le cercle
        this.element = document.createElement('div');
        this.element.classList.add('fish');
        parent.appendChild(this.element);

        // Définir une position et une direction aléatoires
        this.resetProperties();
    }

    resetProperties() {
        // Position initiale aléatoire
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;

        // Vitesse aléatoire (entre -3 et 3)
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;

        // Taille aléatoire
        this.size = Math.random() * 30 + 20; // Entre 20px et 50px
        this.mass = this.size ** 2; // Masse proportionnelle à la taille
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;

        // Couleur aléatoire
        this.element.style.backgroundColor = `hsl(${Math.random() * 360}, 80%, 60%)`;

        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    move() {
        // Mettre à jour la position
        this.x += this.vx;
        this.y += this.vy;

        // Vérifier les collisions avec les bords
        if (this.x < 0 || this.x > window.innerWidth - this.size) {
            this.vx *= -1; // Rebond horizontal

            if (this.x < 0) this.x = 0;
            if (this.x > window.innerWidth - this.size) this.x = window.innerWidth - this.size;
        }
        if (this.y < 0 || this.y > window.innerHeight - this.size) {
            this.vy *= -1; // Rebond vertical

            if (this.y < 0) this.y = 0;
            if (this.y > window.innerHeight - this.size) this.y = window.innerHeight - this.size;
        }

        this.updatePosition();
    }

    handleCollision(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Vérifie si les deux cercles se chevauchent
        if (distance < (this.size + other.size) / 2) {
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

    handleClick() {
        // Réinitialise les propriétés quand le cercle est cliqué
        console.log(`Cercle cliqué à la position (${this.x}, ${this.y})`);
        

        // Create the text element
        const floatingText = document.createElement('div');
        floatingText.textContent = "+1";
        floatingText.style.position = 'absolute';
        floatingText.style.left = `${this.x+16}px`;
        floatingText.style.top = `${this.y}px`;
        floatingText.style.color = 'white';
        floatingText.style.fontSize = '32px';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        floatingText.style.transform = 'translate(-50%, 0)';
        floatingText.style.opacity = '1';

        // Append the text to the body
        document.body.appendChild(floatingText);

        // Trigger the animation
        setTimeout(() => {
            floatingText.style.transform = 'translate(-50%, -50px)';
            floatingText.style.opacity = '0';
        }, 0);

        // Remove the text after the animation ends
        floatingText.addEventListener('transitionend', () => {
            floatingText.remove();
        });

        this.resetProperties();
    }
}

// Créer et animer les cercles
const cercles = [];
for (let i = 0; i < 100; i++) { // Ajoute 10 cercles
    const cercle = new Cercle(document.body);
    cercle.element.onclick = () => cercle.handleClick();
    cercles.push(cercle);
}

// Animer les cercles
function animate() {
    // Déplace chaque cercle
    cercles.forEach(cercle => cercle.move());

    // Vérifie les collisions entre les cercles
    for (let i = 0; i < cercles.length; i++) {
        for (let j = i + 1; j < cercles.length; j++) {
            cercles[i].handleCollision(cercles[j]);
        }
    }

    requestAnimationFrame(animate);
}
animate();

document.addEventListener('click', function(event) {
    console.log(`Clic à la position (${event.clientX}, ${event.clientY})`);

    // Create the ripple element
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.border = '1px solid white';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(1)';
    ripple.style.opacity = '0.8';
    ripple.style.pointerEvents = 'none';
    ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';

    // Append the ripple to the body
    document.body.appendChild(ripple);

    // Trigger the animation
    setTimeout(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(15)';
        ripple.style.opacity = '0';
    }, 0);

    // Remove the ripple after the animation ends
    ripple.addEventListener('transitionend', () => {
        ripple.remove();
    });
});
