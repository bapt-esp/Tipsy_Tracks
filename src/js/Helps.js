export default class help extends Phaser.Scene {
    constructor() {
      super({ key: "help" }); // mettre le meme nom que le nom de la classe
    }

    
preload(){
this.load.image("img_regle", "src/assets/menu.png")
}

create(){
this.regle = this.add.image(400, 300, "img_regle");
}

update(){

}

}