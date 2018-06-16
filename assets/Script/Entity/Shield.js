const Entity = require("Entity");

cc.Class({
    extends: Entity,

    onLoad(){
        this.mGameManager = cc.find("GameManager").getComponent("GameManager");

        this.node.tag = Const.Tag.Shield;
    },

    update(dt){
        if(this.mGameManager.IsGameRunning()){
            this.Rotate(dt);
        }
    },

    onCollisionEnter(other, self){
        if(other.node.tag === Const.Tag.Bullet){
            other.getComponent("Bullet").Release();
        }else if(other.node.tag === Const.Tag.Bomb){
            other.getComponent("Bomb").Release();
        }
    },
});
