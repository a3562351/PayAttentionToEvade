const EffectBase = require("EffectBase");

cc.Class({
    extends: EffectBase,

    EffectStart(){
        EventDispatcher.Dispatch(EventCode.ShieldEffectStart);
        console.log("Shield Effect Start");
    },

    EffectEnd(){
        EventDispatcher.Dispatch(EventCode.ShieldEffectEnd);
        console.log("Shield Effect End");
    },
});
