const Entity = require("Entity");

cc.Class({
    extends: Entity,

    ReSet(){
        this.mDirection = 0;
        this.mLastTimes = 0;
        this.mIsRotate = false;
    },

    Setimes(times){
        this.mLastTimes = times;
    },

    onLoad(){
        this.mGameManager = cc.find("GameManager").getComponent("GameManager");

        this.node.tag = Const.Tag.Dart;
    },

    update(dt){
        if(this.mGameManager.IsGameRunning()){
            this.Move(dt);
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

    CheckPos(){
        if(Math.abs(this.node.x) > Const.AreaSize.x/2 || Math.abs(this.node.y) > Const.AreaSize.y/2){
            if(!this.mIsRotate){
                if(this.mLastTimes >= 1){
                    let newDir = Math.atan(-Math.tan(this.mDirection));

                    //X轴转向，需要保证新方向和原方向关于Y轴对称
                    if(Math.abs(this.node.x) > Const.AreaSize.x/2){
                        if(Math.cos(newDir) === Math.cos(this.mDirection)){
                            newDir = (newDir + Math.PI) % (Math.PI * 2);
                        }
                    }
                    //Y轴转向，需要保证新方向和原方向关于X轴对称
                    else if(Math.abs(this.node.y) > Const.AreaSize.y/2){
                        if(Math.sin(newDir) === Math.sin(this.mDirection)){
                            newDir = (newDir + Math.PI) % (Math.PI * 2);
                        }
                    }
                    this.SetDirection(newDir);
                    this.mLastTimes--;
                    this.mIsRotate = true;
                }else{
                    this.node.destroy();
                }
            }
        }else{
            this.mIsRotate = false;
        }
    },
});