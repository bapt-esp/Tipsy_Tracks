export default class help extends Phaser.Scene {
    constructor() {
      super({ key: "help" }); // mettre le meme nom que le nom de la classe
    }

    
preload(){
this.load.image("img_regle", "src/assets/menu.png")
this.load.image("img_quitte",'src/assets/boutton_quitter.png')
}

create(){
this.regle = this.add.image(400, 300, "img_regle");

let playButtonhelp = this.add.image(400, 600, "img_quitte").setInteractive();
    playButtonhelp.setScale(2);
    playButtonhelp.on("pointerdown", () => {
        this.scene.start("menu");
    });
}

update(){

}

}