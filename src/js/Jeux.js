
export default class jeux extends Phaser.Scene {
    constructor() {
        super({ key: "jeux" });
        this.perso = null;
        this.rails = []; //création d'un tableau pour stocker les 3 rails.
        this.barrière = null;
        this.cursors = null;
        this.isJumping = false;
        this.moveCooldown = 0;
        this.positions = [200, 400, 600];
        this.currentPositionIndex = 1;
        this.background = null;
        this.isMoving = false;
    }


/*Ce morceau de code relie le jeu à index
et définit plusieurs variables qui seront utilisées 
pour la gestion du personnage et du gameplay.*/



/*Cette fonction charge les ressources du jeu 
(images et spritesheets) avant son démarrage.*/

 preload() {
    this.load.spritesheet("img_perso", "src/assets/perso.png", { frameWidth: 64, frameHeight: 64 });
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
    this.background = this.add.tileSprite(400, 400, 400, 400, "img_background");
    this.background.setScale(3);

     // Création des trois rails indépendants aux positions 200, 400 et 600
     for (let i = 0; i < 3; i++) {
        let rail = this.add.tileSprite(this.positions[i], 580, 128, 500, "img_rails");
        rail.setScale(2.5); // Ajustement de la hauteur
        this.rails.push(rail); // Ajout dans le tableau pour mise à jour
    }
    






    this.barrière = this.physics.add.sprite(this.positions[this.currentPositionIndex], 500, "img_barrière");
    this.barrière.setCollideWorldBounds(true);
    this.barrière.setScale(2.5);

    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_barrière",
        frames: this.anims.generateFrameNumbers("img_barrière", { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });

    

    // Lancer l'animation de base en boucle
    this.barrière.anims.play("anim_barrière");

    this.cursors = this.input.keyboard.createCursorKeys();
















    this.perso = this.physics.add.sprite(this.positions[this.currentPositionIndex], 500, "img_perso");
    this.perso.setCollideWorldBounds(true);
    this.perso.setScale(2.5);

    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_perso",
        frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 8 }),
        frameRate: 12,
        repeat: -1
    });

    // Création de l'animation de saut
    this.anims.create({
        key: "anim_jump",
        frames: this.anims.generateFrameNumbers("img_perso", { start: 9, end: 16 }),
        frameRate: 7,
        repeat: 0
    });

    // Lancer l'animation de base en boucle
    this.perso.anims.play("anim_perso");

    this.cursors = this.input.keyboard.createCursorKeys();

}


update(time) {
    
    this.background.tilePositionY -= 1;
    this.rails.forEach(rail => rail.tilePositionY -= 1.2); // Faire défiler chaque rail

    //sky.tilePositionY -= 3;
   
 // Gestion des déplacements gauche/droite avec cooldown
 if (!this.isMoving && this.moveCooldown < time) {
    if (this.cursors.left.isDown && this.currentPositionIndex > 0) {
        this.currentPositionIndex--;
        this.moveCharacter();
        this.moveCooldown = time + 200; // Appliquer un cooldown
    } else if (this.cursors.right.isDown && this.currentPositionIndex < this.positions.length - 1) {
        this.currentPositionIndex++;
        this.moveCharacter();
        this.moveCooldown = time + 200;
    }
}    
   
    
    // Gestion du saut
    if (this.cursors.up.isDown && !this.isJumping) {
        this.isJumping = true;
        this.perso.anims.play("anim_jump");
        this.perso.setVelocityY(-300); // Impulsion du saut
    }

    // Vérifier si le personnage touche le sol
    if (this.perso.body.blocked.down || this.perso.body.onFloor()) {
        if (this.isJumping) {
            this.isJumping = false;
            this.perso.anims.play("anim_perso", true);
        }
    }
}

moveCharacter() {
    this.isMoving = true;

    this.tweens.add({
        targets: this.perso,
        x: this.positions[this.currentPositionIndex],
        duration: 150,
        ease: 'Power2',
        onComplete: () => {
            this.isMoving = false;
        }
    });
}
}
