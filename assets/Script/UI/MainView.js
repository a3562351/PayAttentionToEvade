cc.Class({
    extends: cc.Component,

    ctor(){
        this.mStartBtn = null;
    },

    onLoad(){
        this.mStartBtn = this.node.getChildByName("VerticalLayout").getChildByName("StartButton");

        this.mStartBtn.on(cc.Node.EventType.TOUCH_START, function(event){
            EventDispatcher.Dispatch(EventCode.InitGame);
        });
    }
});
