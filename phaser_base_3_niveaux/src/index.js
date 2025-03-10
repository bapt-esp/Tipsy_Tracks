
// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 800, // largeur en pixels
  height: 600, // hauteur en pixels
   scale: {
        // Or set parent divId here
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
   },
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      // parametres du mode arcade
      gravity: {
        y: 300 // gravité verticale : acceleration ddes corps en pixels par seconde
      },
      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [selection, niveau1, niveau2, niveau3]
};

// création et lancement du jeu
var game = new Phaser.Game(config);
game.scene.start("selection");

var slime,

function preload() {
  this.load.image("img_rail-parallele", "src/assets/rail-parallele.png"); 
  this.load.image("img_sky", "src/assets/sky.png"); 
  this.load.image("img_platform", "src/assets/platform.png"); 


  this.load.spritesheet("img_perso", "src/assets/perso.png", {
    frameWidth: 64,
    frameHeight: 64
  }); 

  this.load.spritesheet("img_piece", "src/assets/piece.png", {
    frameWidth: 64,
    frameHeight: 64
  }); 
  
}