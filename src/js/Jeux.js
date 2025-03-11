
/*  Initialisation des paramètres du jeu, notamment :

Le mode de rendu (Phaser.AUTO )
La taille de l'écran de jeu (800 x 600 pixels)
Le moteur physique (Arcade Physics)
Les différentes phases du jeu (preload, create, update*/

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

/*Ce morceau de code initialise le jeu avec Phaser 
et définit plusieurs variables qui seront utilisées 
pour la gestion du personnage et du gameplay.*/

var game = new Phaser.Game(config);
var perso;
var sky;
var barrière;
var cursors;
var isJumping = false;
var moveCooldown = 0;

// Positions autorisées sur X
const positions = [200, 400, 600];
let currentPositionIndex = 1; // Départ au centre

/*Cette fonction charge les ressources du jeu 
(images et spritesheets) avant son démarrage.*/

function preload() {
    this.load.spritesheet("img_perso", "src/assets/perso.png", { frameWidth: 32, frameHeight: 32 });
    this.load.image("img_sky", "src/assets/sky.png");
    this.load.spritesheet("img_barrière", "src/assets/barrière.png", {frameWidth: 64, frameHeight: 64});
}

/*La fonction create() initialise les objets du jeu après le chargement des ressources. 
Elle crée le sol, le personnage, les obstacles et les animations.*/


function create() {

    sky = this.add.tileSprite(400, 300, 800, 600, "img_sky");

    perso = this.physics.add.sprite(positions[currentPositionIndex], 500, "img_perso");
    perso.setCollideWorldBounds(true);

    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_perso",
        frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    // Création de l'animation de saut
    this.anims.create({
        key: "anim_jump",
        frames: this.anims.generateFrameNumbers("img_perso", { start: 2, end: 5 }),
        frameRate: 3,
        repeat: 0
    });

    // Lancer l'animation de base en boucle
    perso.anims.play("anim_perso");

    cursors = this.input.keyboard.createCursorKeys();

    barrière = this.physics.add.group();

    this.time.addEvent({
        delay: 1000,
        callback: generateObstacle,
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(perso, barrière, hitObstacle, null, this);

}


function update(time) {

    sky.tilePositionY -= 3;
   

    if (moveCooldown < time) {
        if (cursors.left.isDown && currentPositionIndex > 0) {
            currentPositionIndex--;
            moveCooldown = time + 200; // Temps de cooldown pour éviter les déplacements trop rapides
        } else if (cursors.right.isDown && currentPositionIndex < positions.length - 1) {
            currentPositionIndex++;
            moveCooldown = time + 200;
        }
    }

    // Déplacer les obstacles verticalement
    obstacles.getChildren().forEach(obstacle => {
        obstacle.y += 2;
        if (obstacle.y >= 600) {
            obstacle.destroy();
        }
    });
    
    // Déplacement fluide vers la nouvelle position
    this.tweens.add({
        targets: perso,
        x: positions[currentPositionIndex],
        duration: 150,
        ease: 'Power2'
    });

    // Gestion du saut
    if (cursors.up.isDown && !isJumping) {
        isJumping = true;
        perso.anims.play("anim_jump");
        perso.setVelocityY(-200);
    }

     // Vérifier si le perso touche le sol pour arrêter l'état de saut
     if (perso.body.blocked.down || perso.body.touching.down) {
        if (isJumping) {
            isJumping = false;
            perso.anims.play("anim_perso", true);
        }
    }
}