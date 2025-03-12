
export default class jeux extends Phaser.Scene {
    constructor() {
        super({ key: "jeux" });
        this.Barr = null; // Instance de la classe Fonction
        this.perso = null;
        this.rails = []; //création d'un tableau pour stocker les 3 rails.
        this.barriere = null;
        this.cursors = null;
        this.isJumping = false;
        this.moveCooldown = 0;
        this.positions = [200, 400, 600];
        this.currentPositionIndex = 1;
        this.background = null;
        this.isMoving = false;
        this.occupiedPositions = [];
        this.patterns = [];
    }


/*Ce morceau de code relie le jeu à index
et définit plusieurs variables qui seront utilisées 
pour la gestion du personnage et du gameplay.*/



/*Cette fonction charge les ressources du jeu 
(images et spritesheets) avant son démarrage.*/

 preload() {
    this.load.spritesheet("img_perso", "src/assets/perso.png", { frameWidth: 30, frameHeight: 55 });
    this.load.image("img_background", "src/assets/background.png");
    this.load.spritesheet("img_barriere", "src/assets/barrière.png", {frameWidth: 64, frameHeight: 64});
    this.load.spritesheet("img_train", "src/assets/Train.png",{frameWidth: 64, frameHeight: 174});
    //this.load.spritesheet("img_piece","src/assets/piece.png",{frameWidth: 64, frameHeight: 64});
    //this.load.spritesheet("img_bouteille","src/assets/bouteille.png",{frameWidth: 64, frameHeight: 64});
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
    

    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_barriere",
        frames: this.anims.generateFrameNumbers("img_barriere", { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });
    
    //On crée un grp de barrières et de train pour qu'il puisse y en avoir plusieurs qui apparaîssent.
    this.barriereGroup = this.physics.add.group();
    this.trainGroup = this.physics.add.group();

    this.spawnObstacle(); // Génère le premier obstacle
    this.time.addEvent({
        delay: 2000, // Génère un obstacle toutes les 2 secondes
        callback: this.spawnObstacle,
        callbackScope: this,
        loop: true
    });

    this.occupiedPositions = []; // Tableau pour suivre les positions occupées

    /*
    this.bouteille = this.physics.add.sprite(this.positions[this.currentPositionIndex], 500, "img_bouteille");
    this.bouteille.setCollideWorldBounds(true);
    this.bouteille.setScale(1.5);

    // Création de l'animation de mouvement de la bouteille
    this.anims.create({
        key: "anim_bouteille",
        frames: this.anims.generateFrameNumbers("img_bouteille", { start: 0, end: 35 }),
        frameRate: 24,
        repeat: -1
    });

    // Lancer l'animation de la bouteille de base en boucle
    this.bouteille.anims.play("anim_bouteille");

   
    this.piece = this.physics.add.sprite(this.positions[this.currentPositionIndex], 200, "img_piece");
    this.piece.setCollideWorldBounds(true);
    this.piece.setScale(1.5);

    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_piece",
        frames: this.anims.generateFrameNumbers("img_piece", { start: 0, end: 35 }),
        frameRate: 24,
        repeat: -1
    });

    // Lancer l'animation de base en boucle
    this.piece.anims.play("anim_piece"); */

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


    // Collision entre le perso et les barrières
    this.physics.add.overlap(this.perso, this.barriereGroup, this.gameOver, null, this);
    this.physics.add.overlap(this.perso, this.trainGroup, this.gameOver, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.patterns = [
        [
            { position: 0, type: "barriere" },
            { position: 1, type: "train" },
            { position: 2, type: "barriere" },
        ],
        [
            { position: 0, type: "train" },
            null,
            { position: 2, type: "barriere" },
        ],
        [
            null,
            { position: 1, type: "barriere" },
            null,
        ],
        [
            { position: 1, type: "barriere" },
            null,
            null,
        ],
        [
            null,
            null,
            { position: 1, type: "train" },
        ],
        [
            { position: 0, type: "train" },
            { position: 2, type: "train" },
            null,
        ],
        
    ];

    this.currentPattern = null;
    this.currentPaternIndex = 0;
    this.lastObstacleY = 0;
    this.generatePattern();

}


update(time) {
    
    this.background.tilePositionY -= 1;
    this.rails.forEach(rail => rail.tilePositionY -= 1.2);

    if (this.currentPattern) {
        if (this.currentPatternIndex < this.currentPattern.length) {
            let obstacle = this.currentPattern[this.currentPatternIndex];
            if (obstacle !== null) {
                let xPosition = this.positions[obstacle.position];
                if (obstacle.type === "barriere") {
                    let barriere = this.physics.add.sprite(xPosition, -50, "img_barriere");
                    barriere.setScale(2.5);
                    barriere.play("anim_barriere");
                    this.barriereGroup.add(barriere);
                    this.lastObstacleY = barriere.tilePositionY = 0;
                } else if (obstacle.type === "train") {
                    let train = this.physics.add.sprite(xPosition, -100, "img_train");
                    train.setScale(2.5);
                    this.trainGroup.add(train);
                    this.lastObstacleY = train.tilePositionY = 0;
                }
            }
            this.currentPatternIndex++;
        } else {
            if(this.lastObstacleY > 800){
            this.generatePattern();
        }
    }
    }

    // Défilement des barrières
    this.barriereGroup.getChildren().forEach(barriere => {
        barriere.tilePositionY += 1.2;
        barriere.y = barriere.tilePositionY;
        if (barriere.y > 800) {
            barriere.anims.stop();
            barriere.destroy();
        }
    });

    // Défilement des trains
    this.trainGroup.getChildren().forEach(train => {
        train.tilePositionY += 1.2;
        train.y = train.tilePositionY;
        if (train.y > 800) {
            train.anims.stop();
            train.destroy();
        }
    });

   
 // Gestion des déplacements gauche/droite avec cooldown
 if (!this.isMoving && this.moveCooldown < time) {
    if (this.cursors.left.isDown && this.currentPositionIndex > 0) {
        this.currentPositionIndex--;
        this.moveCharacter();
        this.moveCooldown = time + 200;
    } else if (this.cursors.right.isDown && this.currentPositionIndex < this.positions.length - 1) {
        this.currentPositionIndex++;
        this.moveCharacter();
        this.moveCooldown = time + 200;
    }
 }
    
    // Gestion du saut
    if (this.cursors.up.isDown && !this.isJumping && this.perso.body.blocked.down) { // Ajout de la vérification du sol
        this.isJumping = true;
        this.perso.setVelocityY(-300);
        this.perso.anims.play("anim_jump");

        this.time.delayedCall(500, () => {
            this.isJumping = false;
            this.perso.anims.play("anim_perso");
        });
    }

    // Vérifier si le personnage touche le sol
    if (this.perso.body.blocked.down) {
        if (this.isJumping) {
            this.isJumping = false;
            this.perso.anims.play("anim_perso", true);
        }
    }


}

moveCharacter() {
    console.log("Deplacement vers :", this.positions[this.currentPositionIndex]); // Debug
    this.isMoving = true;

    this.tweens.add({
        targets: this.perso,
        x: this.positions[this.currentPositionIndex],
        duration: 150,
        ease: 'Power2',
        onComplete: () => {
            console.log("Deplacement termine"); // Debug
            this.isMoving = false;
        }
    });
}

spawnObstacle() {
    let randomLane = Phaser.Math.Between(0, 2);
    let xPosition = this.positions[randomLane];

    // Probabilité de 70% pour une barrière, 30% pour un train
    if (Phaser.Math.Between(0, 9) < 7) {
        let barriere = this.physics.add.sprite(xPosition, -50, "img_barriere");
        barriere.setScale(2.5);
        barriere.play("anim_barriere");
        this.barriereGroup.add(barriere);
        barriere.tilePositionY = 0;
    } else {
        let train = this.physics.add.sprite(xPosition, -100, "img_train");
        train.setScale(2.5);
        this.trainGroup.add(train);
        train.tilePositionY = 0;
    }

    // Ajouter la position à la liste des positions occupées
    this.occupiedPositions.push(xPosition);
}

PickUpObjects(){
    
}

generatePattern() {
    this.currentPattern = this.patterns[Phaser.Math.Between(0, this.patterns.length - 1)];
    this.currentPatternIndex = 0;
    this.lastObstacleY = 0;
}

gameOver() {
    this.physics.pause(); // Met le jeu en pause
    this.perso.setTint(0xff0000); // Teinte le personnage en rouge
    this.perso.anims.stop();
    console.log("Game Over !");
}

}
