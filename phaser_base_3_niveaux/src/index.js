
// chargement des librairies
import menu from "/src/js/menu.js";


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

      debug: true // permet de voir les hitbox et les vecteurs d'acceleration quand mis à true
    }
  },
  scene: [menu]
};

// création et lancement du jeu
var game = new Phaser.Game(config);
game.scene.start("menu");


//My name is Aliénor and I am 19 years old,

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
