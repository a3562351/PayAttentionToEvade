cc.Class({
    extends: cc.Component,

    AddEventListen(){
        EventDispatcher.AddListener(EventCode.HeroMove, this.HeroMove, this);
        EventDispatcher.AddListener(EventCode.ShieldEffectStart, this.ShieldEffectStart, this);
        EventDispatcher.AddListener(EventCode.ShieldEffectEnd, this.ShieldEffectEnd, this);
    },

    RemoveEventListen(){
        EventDispatcher.RemoveListener(EventCode.HeroMove, this.HeroMove, this);
        EventDispatcher.RemoveListener(EventCode.ShieldEffectStart, this.ShieldEffectStart, this);
        EventDispatcher.RemoveListener(EventCode.ShieldEffectEnd, this.ShieldEffectEnd, this);
    },

    onLoad(){
        this.AddEventListen();

        this.node.tag = Const.Tag.Hero;
        this.mShield = this.node.getChildByName("Shield");
    },

    HeroMove(moveData){
        this.node.x += moveData.x;
        this.node.y += moveData.y;
    },

    ShieldEffectStart(){
        this.mShield.active = true;
    },

    ShieldEffectEnd(){
        this.mShield.active = false;
    },

    Release(){
        this.RemoveEventListen();
        this.node.destroy();
    },
});
