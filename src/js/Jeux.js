
export default class jeux extends Phaser.Scene {
    constructor() {
        super({ key: "jeux" });
        this.perso = null;
        this.rails = []; //création d'un tableau pour stocker les 3 rails.
        this.barriere = null;
        this.cursors = null;
        this.isJumping = false;
        this.moveCooldown = 0;
        this.jumpCooldown = 0;
        this.positions = [200, 400, 600];
        this.currentPositionIndex = 1;
        this.background2 = null;
        this.isMoving = false;
        this.occupiedPositions = [];
        this.maps = [];
        this.currentMapIndex = 0;
        this.scrollSpeed = 1.2; // Vitesse de défilement uniforme
        this.zone_texte_score;
        this.zone_texte_score2;
        this.isJumpingOverBarrier = false;
        this.persoInitialized = false;
        this.persoCollidersEnabled = true; // Ajout de cette variable
        this.bottlesCollected = 0; // Nombre de bouteilles collectées
        this.controlsInverted = false;
        this.controlsInverted2 = false;
        this.mapTimer = null; // Ajout du timer
    
    }


/*Ce morceau de code relie le jeu à index
et définit plusieurs variables qui seront utilisées 
pour la gestion du personnage et du gameplay.*/



/*Cette fonction charge les ressources du jeu 
(images et spritesheets) avant son démarrage.*/

 preload() {
    this.load.spritesheet("img_perso", "src/assets/perso.png", { frameWidth: 30, frameHeight: 55 });
    this.load.image("img_background2", "src/assets/background2.png");
    this.load.spritesheet("img_barriere", "src/assets/barrière.png", {frameWidth: 64, frameHeight: 32});
    this.load.spritesheet("img_train", "src/assets/Train.png",{frameWidth: 64, frameHeight: 174});
    this.load.spritesheet("img_piece","src/assets/piece_redimentionner.png",{frameWidth: 34, frameHeight: 32});
    this.load.spritesheet("img_bouteille","src/assets/bouteillevin.png",{frameWidth: 18, frameHeight: 48});
    this.load.spritesheet("img_rails", "src/assets/rails.png", { frameWidth: 128, frameHeight: 128 });
    this.load.image("img_boutton_rejouer", "src/assets/boutton_rejouer.png")
    this.load.image("img_boutton_quitter", "src/assets/boutton_quitter.png")
    this.load.audio('musique_fond', 'src/assets/musiquejeu.mp3');

    this.load.audio('son_piece', 'src/assets/piecesound.mp3');
    this.load.audio('son_bouteille', 'src/assets/bouteillesound.mp3');

}

/*La fonction create() initialise les objets du jeu après le chargement des ressources. 
Elle crée le sol, le personnage, les obstacles et les animations.*/


create() {
/*A modifier à la fin si besoin. refaire le fond en 800x800
    avec une fenetre de 800x800 et une bande de terre de 600 de large*/
    this.background2 = this.add.tileSprite(400, 300, 832, 832, "img_background2");
    this.background2.setScale(2);
    this.physics.add.existing(this.background2); // Ajout d'un corps physique
    this.background2.body.setVelocityY(this.scrollSpeedValue); // Définir la vitesse
    this.background2.body.allowGravity = false; // Désactiver la gravité

     // Création des trois rails indépendants aux positions 200, 400 et 600
     for (let i = 0; i < 3; i++) {
        let rail = this.add.tileSprite(this.positions[i], 580, 128, 500, "img_rails");
        rail.setScale(2.5);
        this.rails.push(rail);
        this.physics.add.existing(rail); // Ajout d'un corps physique
        rail.body.setVelocityY(this.scrollSpeedValue); // Définir la vitesse
        rail.body.allowGravity = false; // Désactiver la gravité
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
        child.body.setMaxVelocityY(500); // Ajustez la valeur selon vos besoins
    });
    this.trainGroup.children.iterate(child => {
        child.body.allowGravity = false;
        child.body.setMaxVelocityY(500); // Ajustez la valeur selon vos besoins
    });



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
        frameRate: 20,
        repeat: -1
    });


    this.pieceGroup = this.physics.add.group();
    this.bouteilleGroup = this.physics.add.group();

    this.pieceGroup.children.iterate(child => {
        child.body.allowGravity = false;
        child.body.setMaxVelocityY(500); // Ajustez la valeur selon vos besoins
    });
    this.bouteilleGroup.children.iterate(child => {
        child.body.allowGravity = false;
        child.body.setMaxVelocityY(500); // Ajustez la valeur selon vos besoins
    });



    this.perso = this.physics.add.sprite(this.positions[this.currentPositionIndex], 400, "img_perso");
    this.perso.setCollideWorldBounds(true);
    this.perso.setScale(2.5);
    // Ajuster la hitbox du personnage
    this.perso.body.setSize(18, 34); // Ajustez ces valeurs selon la taille réelle de votre personnage
    this.perso.body.setOffset(6.5, 19); // Ajustez ces valeurs pour centrer la hitbox sur votre personnage
    this.perso.setDepth(8);
    this.persoInitialized = true;

    // Création de l'animation de mouvement
    this.anims.create({
        key: "anim_perso",
        frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 8 }),
        frameRate: 12,
        repeat: -1
    });

    // Création de l'animation de saut
    if (!this.anims.exists('anim_jump')) {
        this.anims.create({
            key: "anim_jump",
            frames: this.anims.generateFrameNumbers("img_perso", { start: 9, end: 16 }),
            frameRate: 5,
            repeat: 0
        });
    }

    // Lancer l'animation de base en boucle
    this.perso.anims.play("anim_perso");


    // Collision entre le perso et les barrières
    this.physics.add.overlap(this.perso, this.barriereGroup, this.gameOver, null, this);
    this.physics.add.overlap(this.perso, this.trainGroup, this.gameOver, null, this);
    this.physics.add.overlap(this.perso, this.pieceGroup, this.PickUpObjects, null, this);
    this.physics.add.overlap(this.perso, this.bouteilleGroup, this.PickUpObjects, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.maps = [
        [
            ["barriere", null, "train"],
        ],

        [
            [null, "train", null],
        ],

        [
            ["bouteille", "piece", null],
        ],

        [ 
            ["barriere", "barriere", "piece"],
        ],

        [
            ["train", "piece", "bouteille"],
        ],
        [
            ["barriere", "barriere",  "barriere"],
        ],
        [
            ["bouteille", "bouteille", "piece"],
        ],
        [
            ["bouteille", "bouteille", "train"],
        ],
        [
            ["barriere", "train", "train"],
        ],
        [
            [null, "train", null],
        ],
        [
            ["barriere", "bouteille", "barriere"],
        ],
        [
            ["bouteille", "bouteille", "barriere"],
        ],
        [
            ["train", "bouteille", "piece"],
        ],
        [
            ["train", null, "barriere"],
        ],
        [
            [null, "train", "barriere"],
        ],
        [
            ["train", "bouteille", "barriere"],
        ],
        [
            ["piece", "train", "barriere"],
        ],
        [
            ["train", "train", "barriere"],
        ],
        [
            ["piece", "bouteille", "bouteille"],
        ],
        [
            ["bouteille", "train", "barriere"],
        ],
        [
            ["train", "train", "barriere"],
        ],
        [
            ["barriere", "train", "barriere"],
        ],
        [
            ["piece", "train", "train"],
        ],
        [
            [null, "barriere", "piece"],
        ],
        [
            ["train", "train", "bouteille"],
        ],
        [
            ["piece", "barriere", "piece"],
        ],
        [
            ["barriere", "barriere", "piece"],
        ],
        [
            ["piece", "barriere",  null],
        ],
        [
            ["piece", "barriere",  "bouteille"],
        ],
        [
            ["bouteille", "train",  "bouteille"],
        ],
        [
            ["train", "bouteille",  "piece"],
        ],
        [
            ["barriere", null,  "piece"],
        ],
        [
            ["bouteille", "barriere",  "piece"],
        ],
        [
            ["piece", "bouteille",  "piece"],
        ],
        [
            ["train", "train",  "barriere"],
        ],
        [
            ["train", null,  "bouteille"],
        ],
        [
            ["piece", "train",  "barriere"],
        ],
        

    ]
    this.currentMap = null;
    this.currentMapRow = 0;
    this.lastObjY = 0;
    this.generateMap();
    this.startMapTimer(); // Démarrage du timer

    this.score = 0;
    this.zone_texte_score = this.add.text(250, 20, 'score: 0', { fontSize: '32px', fill: '#000' }); 
    this.zone_texte_score.setDepth(10);

    this.score2 = 0;
    this.zone_texte_score2 = this.add.text(500, 20, 'score: 0', { fontSize: '32px', fill: '#000' }); 
    this.zone_texte_score2.setDepth(10);

    // Ajouter la musique de fond
    this.musiqueFond = this.sound.add('musique_fond', { loop: true, volume: 0.5 }); // loop: true pour la répétition
    this.musiqueFond.play();

    // Ajouter les effets sonores
    this.sonPiece = this.sound.add('son_piece');
    this.sonBouteille = this.sound.add('son_bouteille');

}


update(time) {
    
    if (!this.persoInitialized) {
        return; // Sort de la fonction si perso n'est pas initialisé
    }
    
    // Défilement du background
    if (this.background2.y > 1200) {
        this.background2.y = 400; // Remettre le fond en place
        this.background2.tilePositionY = 0; // Réinitialiser la position de la texture
    }
    this.background2.tilePositionY -= 2.5; // Ajustement mineur pour éviter un blanc

    // Défilement des rails
    this.rails.forEach(rail => {
        if (rail.y > 1200) {
            rail.y = 580; // Remettre les rails en place
            rail.tilePositionY = 0; // Réinitialiser la position de la texture
        }
        rail.tilePositionY -= 2.5; // Ajustement mineur pour éviter un blanc
    });
    

    if (this.currentMap) {
        if (this.currentMapRow < this.currentMap.length) {
            let row = this.currentMap[this.currentMapRow];
            for (let i = 0; i < row.length; i++) {
                let element = row[i];
                let xPosition = this.positions[i];
                if (element === "barriere") {
                    let barriere = this.physics.add.sprite(xPosition, -60, "img_barriere");
                    barriere.setScale(2.5);
                    barriere.play("anim_barriere");
                    this.barriereGroup.add(barriere);
                    barriere.tilePositionY = 0;
                    barriere.body.setSize(64,15);
                    barriere.body.setOffset(2, 7);
                    barriere.setDepth(3);
                } else if (element === "train") {
                    let train = this.physics.add.sprite(xPosition, -150, "img_train");
                    train.setScale(2.5);
                    this.trainGroup.add(train);
                    train.tilePositionY = 0;
                    train.body.setSize(64,144);
                    train.body.setOffset(1.5, 6);
                    train.setDepth(3);
                } else if (element === "piece") {
                    let piece = this.physics.add.sprite(xPosition, -50, "img_piece");
                    piece.setScale(1.5);
                    piece.play("anim_piece");
                    this.pieceGroup.add(piece);
                    piece.tilePositionY = 0;
                    piece.body.allowGravity = false;
                    piece.setDepth(6);
                } else if (element === "bouteille") {
                    let bouteille = this.physics.add.sprite(xPosition, -50, "img_bouteille");
                    bouteille.setScale(1.5);
                    bouteille.play("anim_bouteille");
                    this.bouteilleGroup.add(bouteille);
                    bouteille.tilePositionY = 0;
                    bouteille.body.allowGravity = false;
                    bouteille.setDepth(6);

                }
            }
            this.time.delayedCall(25, () => {
                this.currentMapRow++;
            }, this);
        }
    }

    // Défilement et destruction des obstacles
    this.barriereGroup.getChildren().forEach(barriere => {
        barriere.setVelocityY(300); // Utilisez la même valeur que dans setMaxVelocityY()
        if (barriere.y > 810) {
            barriere.destroy();
        }
    });;


    // Gestion des collisions avec les barrières
    this.jumpOverBarrier(time);
    this.handleCollisions(); // Gestion des collisions

    // Gestion du saut normal
    this.handleJump(time);

    this.trainGroup.getChildren().forEach(train => {
        train.setVelocityY(300); // Utilisez la même valeur que dans setMaxVelocityY()
        if (train.y > 810) {
            train.destroy();
        }
    });

    this.pieceGroup.getChildren().forEach(piece => {
        piece.setVelocityY(300); // Utilisez la même valeur que dans setMaxVelocityY()
        if (piece.y > 810) {
            piece.destroy();
        }
    });

    this.bouteilleGroup.getChildren().forEach(bouteille => {
        bouteille.setVelocityY(300); // Utilisez la même valeur que dans setMaxVelocityY()
        if (bouteille.y > 810) {
            bouteille.destroy();
        }
    });



   
    // Gestion des déplacements gauche/droite avec cooldown
    if (!this.isMoving && this.moveCooldown < time) {
        if (this.controlsInverted2 === false && this.controlsInverted === false){
            if (this.cursors.left.isDown && this.currentPositionIndex > 0) {
                this.currentPositionIndex--;
                this.moveCharacter();
                this.moveCooldown = time + 200;
                return
            
            } else if (this.cursors.right.isDown && this.currentPositionIndex < this.positions.length - 1) {
                this.currentPositionIndex++;
                this.moveCharacter();
                this.moveCooldown = time + 200;
                return
            }
        }
        else if(this.controlsInverted2 === true && this.controlsInverted === false){
            if (this.cursors.up.isDown && this.currentPositionIndex < this.positions.length - 1) {
                this.currentPositionIndex++;
                this.moveCharacter();
                this.moveCooldown = time + 200;
                return
            } else if (this.cursors.down.isDown && this.currentPositionIndex > 0) {
                this.currentPositionIndex--;
                this.moveCharacter();
                this.moveCooldown = time + 200;
                return
            }
        
        }
        else if(this.controlsInverted2 === false && this.controlsInverted === true){
            if (this.cursors.left.isDown && this.currentPositionIndex < this.positions.length - 1) {
                this.currentPositionIndex++;
                this.moveCharacter();
                this.moveCooldown = time + 200;
                return
            } else if (this.cursors.right.isDown && this.currentPositionIndex > 0) {
                this.currentPositionIndex--;
                this.moveCharacter();
                this.moveCooldown = time + 200;
                return
            }
        }
        
        
    }
    
    // Gestion du saut
    if (this.controlsInverted2 === true){
        if (this.cursors.left.isDown && !this.isJumping && this.perso.body.onFloor()) { // Ajout de la vérification du sol
            this.isJumping = true;
            this.perso.setVelocityY(-300);
            this.perso.anims.play("anim_jump");

            this.time.delayedCall(500, () => {
                this.isJumping = false;
                this.perso.anims.play("anim_perso");
            });
            return
        }
    
    }else {
        if (this.cursors.up.isDown && !this.isJumping && this.perso.body.onFloor()) { // Ajout de la vérification du sol
            this.isJumping = true;
            this.perso.setVelocityY(-300);
            this.perso.anims.play("anim_jump");
    
            this.time.delayedCall(500, () => {
                this.isJumping = false;
                this.perso.anims.play("anim_perso");
            });
            return
        }
    
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

PickUpObjects(perso, objet) {
    if (objet.texture.key === "img_piece") {
        // Objet ramassé : pièce
        objet.destroy();
        this.score += 2; // Exemple : ajouter 10 points pour une pièce
        this.zone_texte_score.setText("Score: " + this.score);
        this.sonPiece.play();
        
    } else if (objet.texture.key === "img_bouteille") {
        // Objet ramassé : bouteille
        objet.destroy();
        this.score2 += 0.5; 
        this.zone_texte_score2.setText("Score: " + this.score2); 
        
        //fonction pour inverser les touches en fontion du nb de bouteille.
        this.bottlesCollected +=0.5;
        this.sonBouteille.play();
        if (this.bottlesCollected >=5 ) { 
            this.controlsInverted = true;
            this.controlsInverted2 = false;
        }
        if (this.bottlesCollected ===10){
            this.gameOver();
            let gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'coma éthylique', {
                fontSize: '64px',
                fill: '#ff0000',
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5);
            gameOverText.setDepth(10);
        }
        /*if (this.bottlesCollected >=6 ) {
            this.controlsInverted = false;
            this.controlsInverted2 = true;
    }*/
}

    // Ajouter d'autres actions si nécessaire (effets visuels, sonores, etc.)
    
}



jumpOverBarrier(time) {
    if (this.cursors.up.isDown && this.isCharacterOnFloor() && this.isCharacterOnSameLaneAsBarrier() && !this.isJumpingOverBarrier && time > this.jumpCooldown) {
        this.isJumpingOverBarrier = true;
        this.perso.setVelocityY(-400);
        this.perso.anims.play("anim_jump");

        this.perso.body.checkCollision.none = true; // Désactiver les collisions

        this.time.delayedCall(500, () => {
            this.isJumpingOverBarrier = false;
            this.perso.anims.play("anim_perso");
            this.perso.body.checkCollision.none = false; // Réactiver les collisions
        }, this);

        this.jumpCooldown = time + 1000;
    }
}

disableColliders() {
    if (this.persoCollidersEnabled) {
        this.physics.world.removeCollider(this.perso.body.collider); // Désactiver le collider
        this.persoCollidersEnabled = false;
    }
}

enableColliders() {
    if (!this.persoCollidersEnabled) {
        this.physics.world.addCollider(this.perso, this.barriereGroup, this.gameOver, null, this); // Réactiver le collider
        this.physics.world.addCollider(this.perso, this.trainGroup, this.gameOver, null, this); // Réactiver le collider
        this.persoCollidersEnabled = true;
    }
}

handleCollisions() {
    if (this.persoCollidersEnabled) {
        this.physics.overlap(this.perso, this.barriereGroup, this.gameOver, null, this);
        this.physics.overlap(this.perso, this.trainGroup, this.gameOver, null, this);
    }
}

isCharacterOnFloor() {
    return this.perso.body.blocked.down || this.perso.body.onFloor();
}

handleJump(time) {
    if (this.cursors.up.isDown && !this.isJumping && this.isCharacterOnFloor() && time > this.jumpCooldown) {
        this.isJumping = true;
        this.perso.setVelocityY(-300);
        this.perso.anims.play("anim_jump");

        this.time.delayedCall(500, () => {
            this.isJumping = false;
            this.perso.anims.play("anim_perso");
        }, this);

        this.jumpCooldown = time + 500; // Ajoute un cooldown de 500ms
    }
}

isCharacterOnSameLaneAsBarrier() {
    let characterLane = this.currentPositionIndex;
    let closestBarrier = this.barriereGroup.getChildren().find(barrier => {
        return Math.abs(barrier.x - this.positions[characterLane]) < 50 && barrier.y > this.perso.y - 200; // Augmente la portée de la détection
    });
    return !!closestBarrier;
}

generateMap() {
    this.currentMap = this.maps[this.currentMapIndex];
    this.currentMapRow = 0;
    this.lastObjY = 0;

    // Passer à la carte suivante ou revenir à la première carte si toutes les cartes ont été jouées
    this.currentMapIndex = (this.currentMapIndex + 1) % this.maps.length;
}

startMapTimer() {
    if (!this.mapTimer) {
        this.mapTimer = this.time.addEvent({
            delay: 2000,
            callback: this.generateMap,
            callbackScope: this,
            loop: true
        });
    }
}

stopMapTimer() {
    if (this.mapTimer) {
        this.mapTimer.remove();
        this.mapTimer = null;
    }
}

gameOver() {
    this.physics.pause(); // Met le jeu en pause
    this.perso.setTint(0xff0000); // Teinte le personnage en rouge
    this.perso.anims.stop();
    this.musiqueFond.stop();
    this.stopMapTimer(); // Arrêt du timer
    this.anims.remove('anim_jump'); // Suppression de l'animation
    this.anims.remove('anim_bouteille');
    this.anims.remove('anim_piece');
    this.anims.remove('anim_perso');
    this.anims.remove('anim_barriere');
    this.controlsInverted = false;
    this.controlsInverted2 = false;
    this.bottlesCollected = 0;
    this.score = 0;

    // Arrêter les animations des groupes d'objets
    this.barriereGroup.getChildren().forEach(barriere => barriere.anims.pause());
    this.trainGroup.getChildren().forEach(train => train.anims.pause());
    this.pieceGroup.getChildren().forEach(piece => piece.anims.pause());
    this.bouteilleGroup.getChildren().forEach(bouteille => bouteille.anims.pause());

    // Arrêter le défilement du background
    this.background2.body.setVelocityY(0); // Arrête le mouvement du background
    this.background2.body.allowGravity = false; // Désactive la gravité
    

    // Arrêter le défilement des rails
    this.rails.forEach(rail => {
        if (rail.body) { // Vérification de l'existence de rail.body
            rail.body.setVelocityY(0);
            rail.body.allowGravity = false;
        }
    });

    // Afficher le texte "GAME OVER" au centre de l'écran
    let gameOverText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 50, 'GAME OVER', {
        fontSize: '64px',
        fill: '#ff0000',
        fontStyle: 'bold',
        align: 'center'
    }).setOrigin(0.5);
    gameOverText.setDepth(10);

    // Créer le bouton "Rejouer"
    let replayButton = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 100, "img_boutton_rejouer");
    replayButton.setScale(2); // Ajuste l'échelle du bouton
    replayButton.setInteractive(); // Rendre le bouton interactif
    replayButton.setDepth(10);

    // Ajouter l'événement pour le bouton "Rejouer"
    replayButton.on('pointerdown', () => {
        this.scene.restart("jeux"); // Relance la scène du jeu
    });

    // Créer le bouton "Quitter"
    let quitButton = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY + 200, "img_boutton_quitter");
    quitButton.setScale(2); // Ajuste l'échelle du bouton
    quitButton.setInteractive(); // Rendre le bouton interactif
    quitButton.setDepth(10);

    // Ajouter l'événement pour le bouton "Quitter"
    quitButton.on('pointerdown', () => {
        this.scene.start("menu"); // Retourne au menu principal
    });

    console.log("Game Over !");
}


}



