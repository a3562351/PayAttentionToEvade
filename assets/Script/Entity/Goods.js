const Entity = require("Entity");

cc.Class({
    extends: Entity,

    properties: {
        GoodsType: 1,
        Time: 3,        //效果持续事件
        Times: 10,      //效果持续反弹次数
        Count: 5,       //创建个数
    },

    onLoad(){
        this.mGameManager = cc.find("GameManager").getComponent("GameManager");

        this.node.tag = Const.Tag.Goods;
    },

    onCollisionEnter(other, self){
        if(other.node.tag === Const.Tag.Hero){
            this.Release();
            if(this.GoodsType === 1){
                EventDispatcher.Dispatch(EventCode.GetShield, this.Time);
            }else if(this.GoodsType === 2){
                EventDispatcher.Dispatch(EventCode.GetDart, {Times: this.Times, Count: this.Count});
            }
        }
    },

    Release(){
        this.node.destroy();
    },
});
