export default class help extends Phaser.Scene {
    constructor() {
      super({ key: "help" }); // mettre le meme nom que le nom de la classe
    }

    
preload(){
this.load.image("img_regle", "src/assets/menu.png")
this.load.image("img_quitte",'src/assets/boutton_quitter.png')
this.load.image("img_reglejeux","src/assets/nouvreglejeux.png")
}

create(){
this.regle = this.add.image(400, 300, "img_regle");

let playButtonhelp = this.add.image(400, 540, "img_quitte").setInteractive();
    playButtonhelp.setScale(2);
    playButtonhelp.on("pointerdown", () => {
        this.scene.start("menu");
    });

this.reglejeux = this.add.image(400, 300, "img_reglejeux");
this.reglejeux.setScale(0.85);
}

update(){

}

}