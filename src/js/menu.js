

/***********************************************************************/
/** VARIABLES GLOBALES 
/***********************************************************************/


// définition de la classe "selection"
export default class selection extends Phaser.Scene {
  constructor() {
    super({ key: "menu" }); // mettre le meme nom que le nom de la classe
  }

  /***********************************************************************/
  /** FONCTION PRELOAD 
/***********************************************************************/

  /** La fonction preload est appelée une et une seule fois,
   * lors du chargement de la scene dans le jeu.
   * On y trouve surtout le chargement des assets (images, son ..)
   */
  preload() {
    // tous les assets du jeu sont placés dans le sous-répertoire src/assets/
    this.load.image("img_ciel", "src/assets/sky.png")
    this.load.image("img_bouton", "src/assets/Boutton.png")
  
  }

  /***********************************************************************/
  /** FONCTION CREATE 
/***********************************************************************/

  /* La fonction create est appelée lors du lancement de la scene
   * si on relance la scene, elle sera appelée a nouveau
   * on y trouve toutes les instructions permettant de créer la scene
   * placement des peronnages, des sprites, des platesformes, création des animations
   * ainsi que toutes les instructions permettant de planifier des evenements
   */
  create() {
    this.background = this.add.tileSprite(400, 300, 800, 600, "img_ciel");

    let playButton = this.add.image(400, 500, "img_bouton").setInteractive();
    playButton.on("pointerdown", () => {
        this.scene.start("jeux");
    });
}
  

  /***********************************************************************/
  /** FONCTION UPDATE 
/***********************************************************************/

update() {
  this.background.tilePositionY -= 2;
}
}


/***********************************************************************/
/** CONFIGURATION GLOBALE DU JEU ET LANCEMENT 
/***********************************************************************/
