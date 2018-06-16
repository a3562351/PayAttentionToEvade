cc.Class({
    ctor(){
        this.mPerfabPathList = [];
        this.mPerfabList = [];
        this.mCallBack = null;
        this.mEntityName = "Goods";
        this.mCreateInterval = 1;
        this.mLastCreateInterval = 0;
        this.mMaxEntityId = 0;
    },

    AddEntityPath(perfabPath){
        this.mPerfabPathList.push(perfabPath);
    },

    SetCallBack(callback){
        this.mCallBack = callback;
    },

    SetEntityName(name){
        this.mEntityName = name;
    },

    SetCreateInterval(interval){
        if(interval < 0){
            interval = 0;
        }
        this.mCreateInterval = interval;
    },

    GetEntityId(){
        return ++this.mMaxEntityId;
    },

    Update(dt){
        this.mLastCreateInterval += dt;
        let createCount = 0;
        if(this.mLastCreateInterval >= this.mCreateInterval){
            createCount = Math.floor(this.mLastCreateInterval/this.mCreateInterval);
            this.mLastCreateInterval -= this.mCreateInterval * createCount;
        }

        if(createCount > 0){
            this.CreateEntity(createCount, this.mCallBack);
        }
    },

    CreateEntity(createCount, callback){        
        for (let i = 0; i < createCount; i++) {
            let idx = Tool.GetRandom(this.mPerfabPathList.length) - 1;

            if(!this.mPerfabList[idx]){
                let self = this;
                cc.loader.loadRes(this.mPerfabPathList[idx], function(err, prefab){
                    self.mPerfabList[idx] = prefab;
                    let entity = self.Create(idx);
                    callback(entity, i + 1);
                });
            }
            else{
                for (let i = 0; i < createCount; i++) {
                    let entity = this.Create(idx);
                    callback(entity, i + 1);
                }
            }
        }
    },

    Create(idx){
        let entity = cc.instantiate(this.mPerfabList[idx]);
        entity.name = this.mEntityName + "_" + this.GetEntityId();
        // console.log("CreateEntity:" + entity.name);

        return entity;
    },

    ReleaseEntity(entity){
        entity.active = false;
        entity.destroy();
        // console.log("ReleaseEntity:" + entity.name);
    },
});
