
// chargement des librairies
import menu from "/src/js/menu.js";
import jeux from "/src/js/Jeux.js";
import help from "/src/js/helps.js";

// configuration générale du jeu
var config = {
  type: Phaser.AUTO,
  width: 800, // largeur en pixels
  height: 710, // hauteur en pixels
   scale: {
        // Or set parent divId here
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
   },
  physics: {
    // définition des parametres physiques
    default: "arcade", // mode arcade : le plus simple : des rectangles pour gérer les collisions. Pas de pentes
    arcade: {
      gravity: { y: 500 },
      debug: true
  }
    
  },
  scene: [menu, jeux, help]
};

// création et lancement du jeu
var game = new Phaser.Game(config);
game.scene.start("menu");





