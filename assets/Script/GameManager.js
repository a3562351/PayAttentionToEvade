const EntityCreator = require("EntityCreator");
const GoodsCreator = require("GoodsCreator");
const EffectManager = require("EffectManager");

cc.Class({
    extends: cc.Component,

    ctor(){
        this.mOrangeArea = {startX: -Const.AreaSize.x/2, startY: -Const.AreaSize.y/2, endX: Const.AreaSize.x/2, endY: Const.AreaSize.y/2};
        this.mBoundDis = 10;
        this.mSurvivalTime = 0;
        this.mIsRunning = false;
        this.mHero = null;
        this.mAudioSource = null;
        this.mCreateBulletInterval = 0.2;
        this.mCreateGoodsInterval = 10;
        this.mIncreaseTime = 60;
        this.mMixIntervalRatio = 1/4;

        let self = this;

        //子弹创建器
        this.mBulletCreator = new EntityCreator();
        this.mBulletCreator.SetPerfabPath("Prefab/Entity/Bullet");
        this.mBulletCreator.SetEntityName("Bullet");
        this.mBulletCreator.SetCallBack(function(bullet){
            self.BulletCreate(bullet);
        });
        this.mBulletCreator.SetCreateInterval(this.mCreateBulletInterval);

        //炸弹创建器
        this.mBombCreator = new EntityCreator();
        this.mBombCreator.SetPerfabPath("Prefab/Entity/Bomb");
        this.mBombCreator.SetEntityName("Bomb");

        //飞镖创建器
        this.mDartCreator = new EntityCreator();
        this.mDartCreator.SetPerfabPath("Prefab/Entity/Dart");
        this.mDartCreator.SetEntityName("Dart");

        //货物创建器
        this.mGoodsCreator = new GoodsCreator();
        this.mGoodsCreator.AddEntityPath("Prefab/Entity/ShieldGoods");
        this.mGoodsCreator.AddEntityPath("Prefab/Entity/DartGoods");
        this.mGoodsCreator.SetEntityName("Goods");
        this.mGoodsCreator.SetCallBack(function(goods){
            self.GoodsCreate(goods);
        });
        this.mGoodsCreator.SetCreateInterval(this.mCreateGoodsInterval);

        this.mEffectManager = new EffectManager();
    },

    AddEventListen(){
        EventDispatcher.AddListener(EventCode.InitGame, this.InitGame, this);
        EventDispatcher.AddListener(EventCode.HeroMoveInput, this.HeroMoveInput, this);
        EventDispatcher.AddListener(EventCode.BulletRelease, this.BulletRelease, this);
        EventDispatcher.AddListener(EventCode.OverGame, this.OverGame, this);
        EventDispatcher.AddListener(EventCode.ReStartGame, this.ReStartGame, this);
        EventDispatcher.AddListener(EventCode.BulletBoom, this.BulletBoom, this);
        EventDispatcher.AddListener(EventCode.BombRelease, this.BombRelease, this);
        EventDispatcher.AddListener(EventCode.GetDart, this.CreateDart, this);
    },

    onLoad() {
        this.AddEventListen();

        this.mAudioSource = this.getComponent("cc.AudioSource");
        cc.game.addPersistRootNode(this.node);

        cc.director.getCollisionManager().enabled = true;
    },

    update(dt) {
        if(this.IsGameRunning()){
            this.UpdateSurvivalTime(this.mSurvivalTime += dt);
            this.CheckCreateEntity(dt);
            this.mEffectManager.Update(dt);

            if(this.mSurvivalTime <= this.mIncreaseTime){
                let interval = this.mMixInterval + (this.mCreateBulletInterval - this.mMixInterval) * (1 - Math.sin(this.mSurvivalTime/this.mIncreaseTime * Math.PI/2));
                this.mBulletCreator.SetCreateInterval(this.GetIntervalTime(this.mCreateBulletInterval));
                this.mGoodsCreator.SetCreateInterval(this.GetIntervalTime(this.mCreateGoodsInterval));
            }
        }
    },

    GetIntervalTime(interval){
        let mixInterval = interval * this.mMixIntervalRatio;
        let nowInterval = mixInterval + (interval - mixInterval) * (1 - Math.sin(this.mSurvivalTime/this.mIncreaseTime * Math.PI/2));        
        return nowInterval;
    },

    InitGame(){
        let self = this;
        cc.director.loadScene("Game", function(){
            self.StartGame();
            self.mAudioSource.play();
            console.log("Init Game!");
        })
    },

    StartGame(){
        let self = this;
        cc.loader.loadRes("Prefab/Entity/Hero", function(err, prefab){    
            let hero = cc.instantiate(prefab);
            hero.name = "Hero";
            hero.setPosition(0, 0);
            EventDispatcher.Dispatch(EventCode.AddToEntityLayer, hero);
            self.mHero = hero;
            self.mIsRunning = true;

            self.mEffectManager.ClearAllEffect();
        });
    },

    ResumeGame(){
        this.mIsRunning = true;
    },

    PauseGame(){
        this.mIsRunning = false;
    },

    OverGame(){
        this.PauseGame();
        EventDispatcher.Dispatch(EventCode.ShowOverTip, this.TimeFormat(this.mSurvivalTime));
    },

    ReStartGame(){
        this.UpdateSurvivalTime(0);
        EventDispatcher.Dispatch(EventCode.ClearEntity);
        this.StartGame();
    },

    IsGameRunning(){
        return this.mIsRunning;
    },

    TimeFormat(time){
        return Math.floor(time) + "S";
    },

    UpdateSurvivalTime(survival_time){
        this.mSurvivalTime = survival_time;
        EventDispatcher.Dispatch(EventCode.UpdateSurvivalTime, this.TimeFormat(this.mSurvivalTime));
    },

    CheckCreateEntity(dt){
        this.mBulletCreator.Update(dt);
        this.mGoodsCreator.Update(dt);
    },

    HaveEffect(effectIdx){
        return this.mEffectManager.HaveEffect(effectIdx);
    },

    GetMoveArea(){
        return this.mOrangeArea;
    },

    HeroMoveInput(moveData){
        let pos = this.mHero.getPosition();
        let area = this.GetMoveArea();

        if(pos.x + moveData.x < area.startX){
            moveData.x = area.startX - pos.x;
        }

        if(pos.x + moveData.x > area.endX){
            moveData.x = area.endX - pos.x;
        }

        if(pos.y + moveData.y < area.startY){
            moveData.y = area.startY - pos.y;
        }

        if(pos.y + moveData.y > area.endY){
            moveData.y = area.endY - pos.y;
        }
    
        if(this.IsGameRunning()){
            EventDispatcher.Dispatch(EventCode.HeroMove, moveData);
        }
    },

    RandomDirection(){
        return Math.random() * Math.PI * 2;
    },

    RandomPos(direction){
        let pos = {};
        let isLeft = true;
        let isBottom = true;

        //根据象限判断选应从何处入射
        if(direction <= Math.PI/2){
            //左下边
            isLeft = true;
            isBottom = true;
        }else if(direction <= Math.PI){
            //右下边
            isLeft = false;
            isBottom = true;
        }else if(direction <= Math.PI * 3/2){
            //右上边
            isLeft = false;
            isBottom = false;
        }else{
            //左上边
            isLeft = true;
            isBottom = false;
        }

        //判断应该固定X边或Y边的坐标
        if(Math.random() < (Const.AreaSize.x / (Const.AreaSize.x + Const.AreaSize.y))){
            //固定Y边
            pos.x = Math.random() * Const.AreaSize.x - Const.AreaSize.x/2;
            if(isBottom){
                pos.y = -Const.AreaSize.y/2;
            }else{
                pos.y = Const.AreaSize.y/2;
            }
        }else{
            //固定X边
            pos.y = Math.random() * Const.AreaSize.y - Const.AreaSize.y/2;
            if(isLeft){
                pos.x = -Const.AreaSize.x/2;
            }else{
                pos.x = Const.AreaSize.x/2;
            }
        }

        return pos;
    },

    BulletCreate(bullet){
        let direction = this.RandomDirection();
        let pos = this.RandomPos(direction);

        bullet.getComponent("Bullet").ReSet();
        bullet.setPosition(pos.x, pos.y);
        bullet.getComponent("Bullet").SetDirection(direction);
        EventDispatcher.Dispatch(EventCode.AddToEntityLayer, bullet);
    },

    BulletRelease(bullet){
        this.mBulletCreator.ReleaseEntity(bullet);
    },

    BulletBoom(pos){       
        let count = 5;
        let angle =  Math.random();
        this.mBombCreator.CreateEntity(count, function(bomb, idx){
            let direction = Math.PI * 2 * (idx / count + angle);

            bomb.getComponent("Bomb").ReSet();
            bomb.setPosition(pos.x, pos.y);
            bomb.getComponent("Bomb").SetDirection(direction);
            EventDispatcher.Dispatch(EventCode.AddToEntityLayer, bomb);
        });
    },

    BombRelease(bomb){
        this.mBombCreator.ReleaseEntity(bomb);
    },

    GoodsCreate(goods){
        let direction = this.RandomDirection();
        let pos = this.RandomPos(direction);

        goods.getComponent("Goods").ReSet();
        goods.setPosition(pos.x, pos.y);
        goods.getComponent("Goods").SetDirection(direction);
        EventDispatcher.Dispatch(EventCode.AddToEntityLayer, goods);
    },

    CreateDart(param){
        let direction = this.RandomDirection();
        let pos = this.mHero.getPosition();

        let times = param.Times;
        let count = param.Count;
        let angle =  Math.random();
        this.mDartCreator.CreateEntity(count, function(dart, idx){
            let direction = Math.PI * 2 * (idx / count + angle);

            dart.getComponent("Dart").ReSet();
            dart.setPosition(pos.x, pos.y);
            dart.getComponent("Dart").SetDirection(direction);
            dart.getComponent("Dart").Setimes(times);
            EventDispatcher.Dispatch(EventCode.AddToEntityLayer, dart);
        });
    },
});
