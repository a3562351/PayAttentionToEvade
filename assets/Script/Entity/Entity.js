cc.Class({
    extends: cc.Component,

    properties: {
        MoveSpeed: 100,
        RotateSpeed: 1080,
    },

    ctor(){
        this.mGameManager = null;
        this.ReSet();
    },

    ReSet(){
        this.mDirection = 0;
    },

    onLoad(){
        this.mGameManager = cc.find("GameManager").getComponent("GameManager");
    },

    update(dt){
        if(this.mGameManager.IsGameRunning()){
            this.Move(dt);
        }
    },

    SetDirection(direction){
        this.mDirection = direction;
    },

    Move(dt){
        let moveX = this.MoveSpeed * Math.cos(this.mDirection) * dt;
        let moveY = this.MoveSpeed * Math.sin(this.mDirection) * dt;
        this.node.x += moveX;
        this.node.y += moveY;
        this.CheckPos();
    },

    Rotate(dt){
        this.node.rotation += this.RotateSpeed * dt;
    },

    CheckPos(){
        if(Math.abs(this.node.x) > Const.AreaSize.x/2 || Math.abs(this.node.y) > Const.AreaSize.y/2){
            this.Release();
        }
    },

    onCollisionEnter(other, self){

    },

    Release(){
        this.node.destroy();
    },
});
