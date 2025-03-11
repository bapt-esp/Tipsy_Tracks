
export default class jeux extends Phaser.Scene {
    constructor() {
        super({ key: "jeux" });
        this.perso = null;
        this.sky = null;
        this.barrière = null;
        this.cursors = null;
        this.isJumping = false;
        this.moveCooldown = 0;
        this.positions = [200, 400, 600];
        this.currentPositionIndex = 1;
        this.background = null;
    }


/*Ce morceau de code relie le jeu à index
et définit plusieurs variables qui seront utilisées 
pour la gestion du personnage et du gameplay.*/




/*Cette fonction charge les ressources du jeu 
(images et spritesheets) avant son démarrage.*/

 preload() {
    this.load.spritesheet("img_perso", "src/assets/perso.png", { frameWidth: 32, frameHeight: 32 });
    this.load.image("img_background", "src/assets/background.png");
    this.load.spritesheet("img_barrière", "src/assets/barrière.png", {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet("img_train", "src/assets/Train.png",{frameWidth: 64, frameHeight: 64});
    this.load.spritesheet("img_piece","src/assets/piece(2).png",{frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("img_bouteille","src/assetes/boutille.png",{frameWidth: 16, frameHeight: 16});
}

/*La fonction create() initialise les objets du jeu après le chargement des ressources. 
Elle crée le sol, le personnage, les obstacles et les animations.*/


create() {

    this.background = this.add.tileSprite(400, 300, 800, 800, "img_background");

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


update(time) {

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
}