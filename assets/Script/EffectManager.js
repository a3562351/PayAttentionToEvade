const ShieldEffect = require("ShieldEffect");

cc.Class({
    ctor(){
        this.mEffectList = [];
        this.mEffectList[Const.Effect.Shield] = new ShieldEffect();
        this.AddEventListen();
    },

    AddEventListen(){
        EventDispatcher.AddListener(EventCode.GetShield, this.AddShieldTime, this);
    },

    Update(dt){ 
        for (let i = 0; i < this.mEffectList.length; i++) {
            this.mEffectList[i].Update(dt);
        }
    },

    HaveEffect(effectIdx){
        return this.mEffectList[effectIdx].IsActive();
    },

    ClearAllEffect(){
        for (let i = 0; i < this.mEffectList.length; i++) {
            this.mEffectList[i].Clear();
        }
    },

    AddShieldTime(time){
        this.mEffectList[Const.Effect.Shield].Effect(time);
        console.log("Shield Effect Add Time:" + time);
    },
});
