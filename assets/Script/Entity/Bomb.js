const Entity = require("Entity");

cc.Class({
    extends: Entity,

    onLoad(){
        this.mGameManager = cc.find("GameManager").getComponent("GameManager");

        this.node.tag = Const.Tag.Bomb;
    },

    onCollisionEnter(other, self){
        if(other.node.tag === Const.Tag.Hero){
            if(!this.mGameManager.HaveEffect(Const.Effect.Shield)){
                EventDispatcher.Dispatch(EventCode.OverGame);
            }
        }else if(other.node.tag === Const.Tag.Goods){

        }
    },

    Release(){
        EventDispatcher.Dispatch(EventCode.BombRelease, this.node);
    },
});