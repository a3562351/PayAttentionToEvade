cc.Class({
    extends: cc.Component,

    properties: {

    },

    ctor(){
        this.mUILayer = null;
        this.mEntityLayer = null;
        this.mOverTip = null;
        this.mReStartButton = null;
        this.mTime = null;
        this.mLastTouchPoint = null;
    },

    AddEventListen(){
        EventDispatcher.AddListener(EventCode.UpdateSurvivalTime, this.UpdateSurvivalTime, this);
        EventDispatcher.AddListener(EventCode.AddToEntityLayer, this.AddToEntityLayer, this);
        EventDispatcher.AddListener(EventCode.AddToUILayer, this.AddToUILayer, this);
        EventDispatcher.AddListener(EventCode.ShowOverTip, this.ShowOverTip, this);
        EventDispatcher.AddListener(EventCode.ClearEntity, this.ClearEntity, this);
    },

    onLoad(){
        this.AddEventListen();

        this.mEntityLayer = this.node.getChildByName("EntityLayer");
        this.mUILayer = this.node.getChildByName("UILayer");
        this.mSurvivalTime = this.mUILayer.getChildByName("SurvivalTime");
        this.mOverTip = this.mUILayer.getChildByName("OverTip");
        this.mReStartButton = this.mOverTip.getChildByName("ReStartButton");
        this.mTime = this.mOverTip.getChildByName("Time");

        let self = this;
        this.mEntityLayer.on(cc.Node.EventType.TOUCH_START, function(event){
            self.mLastTouchPoint = event.getLocation();
        });

        this.mEntityLayer.on(cc.Node.EventType.TOUCH_MOVE, function(event){
            if(self.mLastTouchPoint){
                let nowTouchPoint = event.getLocation();
                let moveData = {};
                moveData.x = nowTouchPoint.x - self.mLastTouchPoint.x;
                moveData.y = nowTouchPoint.y - self.mLastTouchPoint.y;
                EventDispatcher.Dispatch(EventCode.HeroMoveInput, moveData);
                self.mLastTouchPoint = nowTouchPoint;
            }
        });

        this.mEntityLayer.on(cc.Node.EventType.TOUCH_END, function(event){
            self.mLastTouchPoint = null;
        });

        this.mReStartButton.on(cc.Node.EventType.TOUCH_START, function(event){
            EventDispatcher.Dispatch(EventCode.ReStartGame);
            self.mOverTip.active = false;
        });
    },

    AddToEntityLayer(node){
        this.mEntityLayer.addChild(node);
    },

    AddToUILayer(node){
        this.mUILayer.addChild(node);
    },

    UpdateSurvivalTime(survivalTimestr){
        this.mSurvivalTime.getComponent("cc.Label").string = survivalTimestr;
    },

    ShowOverTip(survivalTimestr){
        this.mOverTip.active = true;
        this.mTime.getComponent("cc.Label").string = survivalTimestr;
    },

    ClearEntity(){
        let children = this.mEntityLayer.children;
        for (let i = children.length - 1; i >= 0; --i) {
            if(children[i].tag === Const.Tag.Hero){
                children[i].getComponent("Hero").Release();
            }else if(children[i].tag === Const.Tag.Bullet){
                children[i].getComponent("Bullet").Release();
            }else if(children[i].tag === Const.Tag.Bomb){
                children[i].getComponent("Bomb").Release();
            }else if(children[i].tag === Const.Tag.Goods){
                children[i].getComponent("Goods").Release();
            }else if(children[i].tag === Const.Tag.Dart){
                children[i].getComponent("Dart").Release();
            }
        }
    },
});
