
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
    this.load.spritesheet("img_bouteille","src/assets/bouteille.png",{frameWidth: 16, frameHeight: 16});
    this.load.spritesheet("img_rails", "src/assets/rails.png", { frameWidth: 128, frameHeight: 128 });
}

/*La fonction create() initialise les objets du jeu après le chargement des ressources. 
Elle crée le sol, le personnage, les obstacles et les animations.*/


create() {
/*A modifier à la fin si besoin. refaire le fond en 800x800
    avec une fenetre de 800x800 et une bande de terre de 600 de large*/
    this.background = this.add.image(400, 400, "img_background");
    this.background.setScale(3);



    // Ajouter 3 rails au centre de l'écran
    let railWidth = 64;  // Largeur de chaque rail
    let railHeight = 64; // Hauteur de chaque rail
    let centerX = 400;   // Position X centrale de la scène
    let centerY = 400;   // Position Y centrale de la scène

    // Espacement entre les rails
    let spacing = 70; // Distance entre les rails, ajustable si nécessaire

    // Créer les 3 rails au centre de la scène
    for (let i = -1; i <= 1; i++) {
        // Créer chaque rail, espacé de manière égale autour de la position centrale
        this.add.image(centerX + (i * spacing), centerY, "img_rails").setOrigin(0.5, 0.5).setScale(1);
    }




    

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