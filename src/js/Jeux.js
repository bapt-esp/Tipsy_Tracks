
export default class jeux extends Phaser.Scene {
    constructor() {
        super({ key: "jeux" });
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
        this.maps = [];
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
    this.load.spritesheet("img_piece","src/assets/piece.png",{frameWidth: 64, frameHeight: 64});
    this.load.spritesheet("img_bouteille","src/assets/bouteille.png",{frameWidth: 64, frameHeight: 64});
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
    this.barriereGroup.children.iterate(child => {
        child.body.allowGravity = false;
    });
    this.trainGroup.children.iterate(child => {
        child.body.allowGravity = false;
    });

    this.spawnObstacle(); // Génère le premier obstacle
    this.time.addEvent({
        delay: 2000, // Génère un obstacle toutes les 2 secondes
        callback: this.spawnObstacle,
        callbackScope: this,
        loop: true
    });

    this.occupiedPositions = []; // Tableau pour suivre les positions occupées


    // Création de l'animation de mouvement de la bouteille
    this.anims.create({
        key: "anim_bouteille",
        frames: this.anims.generateFrameNumbers("img_bouteille", { start: 0, end: 35 }),
        frameRate: 24,
        repeat: -1
    });


    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_piece",
        frames: this.anims.generateFrameNumbers("img_piece", { start: 0, end: 5 }),
        frameRate: 24,
        repeat: -1
    });


    this.pieceGroup = this.physics.add.group();
    this.bouteilleGroup = this.physics.add.group();

    this.pieceGroup.children.iterate(child => {
        child.body.allowGravity = false;
    });
    this.bouteilleGroup.children.iterate(child => {
        child.body.allowGravity = false;
    });



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
    this.physics.add.overlap(this.perso, this.pieceGroup, this.PickUpObjects, null, this);
    this.physics.add.overlap(this.perso, this.bottleGroup, this.PickUpObjects, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.maps = [
        [
            [null, null, null],
            ["piece", null, "bouteille"],
            [null, null, null],
            ["barriere", null, "train"],
            [null, null, null],
            [null, "piece", null],
            [null, null, null],
            ["bouteille", null, "barriere"],
            [null, null, null],
            [null, null, "piece"],
        ],

        [
            [null, "piece", null],
            [null, null, null],
            ["barriere", null, "bouteille"],
            [null, null, null],
            [null, "train", null],
            [null, null, null],
            ["bouteille", null, "piece"],
            [null, null, null],
            [null, "barriere", null],
            [null, null, null],

        ],
        [
            ["piece", null, null],
            [null, null, null],
            [null, "bouteille", null],
            [null, null, null],
            ["train", null, "barriere"],
            [null, null, null],
            [null, "piece", null],
            [null, null, null],
            ["bouteille", null, "train"],
            [null, null, null],

        ],
    ]
    this.currentMap = null;
    this.currentMapRow = 0;
    this.lastObjY = 0;
    this.generateMap();

}


update(time) {
    
    this.background.tilePositionY -= 1;
    this.rails.forEach(rail => rail.tilePositionY -= 1.2);

    if (this.currentMap) {
        if (this.currentMapRow < this.currentMap.length) {
            let row = this.currentMap[this.currentMapRow];
            for (let i = 0; i < row.length; i++) {
                let element = row[i];
                let xPosition = this.positions[i];
                if (element === "barriere") {
                    let barriere = this.physics.add.sprite(xPosition, -50, "img_barriere");
                    barriere.setScale(2.5);
                    barriere.play("anim_barriere");
                    this.barriereGroup.add(barriere);
                    barriere.tilePositionY = 0;
                } else if (element === "train") {
                    let train = this.physics.add.sprite(xPosition, -100, "img_train");
                    train.setScale(2.5);
                    this.trainGroup.add(train);
                    train.tilePositionY = 0;
                } else if (element === "piece") {
                    let piece = this.physics.add.sprite(xPosition, -50, "img_piece");
                    piece.setScale(1.5);
                    piece.play("anim_piece");
                    this.pieceGroup.add(piece);
                    piece.tilePositionY = 0;
                    piece.body.allowGravity = false;
                } else if (element === "bouteille") {
                    let bouteille = this.physics.add.sprite(xPosition, -50, "img_bouteille");
                    bouteille.setScale(1.5);
                    bouteille.play("anim_bouteille");
                    this.bouteilleGroup.add(bouteille);
                    bouteille.tilePositionY = 0;
                    bouteille.body.allowGravity = false;
                }
            }
            this.currentMapRow++;
        } else {
            if (this.lastObjY > 800) {
                this.generateMap();
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

    //Défilement des pièces
    this.pieceGroup.getChildren().forEach(piece => {
        piece.tilePositionY += 1.2;
        if (piece.tilePositionY > 800) {
            piece.anims.stop();
            piece.destroy();
        }
    });

    // Défilement des bouteilles
    this.bouteilleGroup.getChildren().forEach(bouteille => {
        bouteille.tilePositionY += 1.2;
        if (bouteille.tilePositionY > 800) {
            bouteille.anims.stop();
            bouteille.destroy();
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

PickUpObjects(perso, objet) {
    if (objet.texture.key === "img_piece") {
        // Objet ramassé : pièce
        this.score += 10; // Exemple : ajouter 10 points pour une pièce
        objet.destroy();
        console.log("Pièce ramassée. Score :", this.score);
    } else if (objet.texture.key === "img_bouteille") {
        // Objet ramassé : bouteille
        this.score += 20; // Exemple : ajouter 20 points pour une bouteille
        objet.destroy();
        console.log("Bouteille ramassée. Score :", this.score);
    }

    // Ajouter d'autres actions si nécessaire (effets visuels, sonores, etc.)
}

generateMap() {
    this.currentMap = this.maps[Phaser.Math.Between(0, this.maps.length - 1)];
    this.currentMapRow = 0;
    this.lastObjY = 0;
}

gameOver() {
    this.physics.pause(); // Met le jeu en pause
    this.perso.setTint(0xff0000); // Teinte le personnage en rouge
    this.perso.anims.stop();
    console.log("Game Over !");
}

}
