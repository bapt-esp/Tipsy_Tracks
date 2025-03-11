export default class Barr {
    constructor(scene) {
        this.scene = scene; // Récupère la scène du jeu
        this.barriereGroup = this.scene.physics.add.group(); // Groupe de barrières
    }

    spawnBarriere() {
        let randomX = Phaser.Utils.Array.GetRandom(this.scene.positions);
        let barriere = this.barriereGroup.create(randomX, -50, "img_barriere");
    
        console.log("Nouvelle barrière à :", randomX); // Debug
    
        barriere.setScale(2.5);
        barrieàre.setVelocityY(2); // Réduit la vitesse pour voir si ça fonctionne
        barriere.setImmovable(true);
        barriere.anims.play("anim_barriere");
    
        barriere.setCollideWorldBounds(false);
    };
    }