cc.Class({
    ctor(){
        this.mTime = 0;
    },

    Update(dt){
        if(this.mTime > 0){
            this.mTime -= dt;

            if(this.mTime <= 0){
                this.EffectEnd();
            }
        }
    },

    Clear(){
        this.mTime = 0;
    },
    
    IsActive(){
        return this.mTime > 0;
    },

    Effect(time){
        if(this.mTime <= 0){
            this.mTime += time;
            if(this.mTime > 0){
                this.EffectStart();
            }
        }
        else{
            this.mTime += time;
        }
        
    },

    EffectStart(){

    },

    EffectEnd(){

    },
});