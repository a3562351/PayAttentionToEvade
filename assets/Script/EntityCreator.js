cc.Class({
    ctor(){
        this.mPerfabPath = null;
        this.mPerfab = null;
        this.mCallBack = null;
        this.mEntityName = "Entity";
        this.mCreateInterval = 1;
        this.mLastCreateInterval = 0;
        this.mMaxEntityId = 0;
        this.mPool = new cc.NodePool();
    },

    SetPerfabPath(perfabPath){
        this.mPerfabPath = perfabPath;
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
        if(!this.mPerfab){
            let self = this;
            cc.loader.loadRes(this.mPerfabPath, function(err, prefab){
                self.mPerfab = prefab;
                for (let i = 0; i < createCount; i++) {
                    let entity = self.Create();
                    callback(entity, i + 1);
                }
            });
        }
        else{
            for (let i = 0; i < createCount; i++) {
                let entity = this.Create();
                callback(entity, i + 1);
            }
        }
    },

    Create(){
        let entity;
        if (this.mPool.size() > 0) {
            entity = this.mPool.get();
        }
        else {
            entity = cc.instantiate(this.mPerfab);
            entity.name = this.mEntityName + "_" + this.GetEntityId();
            // console.log("CreateEntity:" + entity.name);
        }
        entity.active = true;

        return entity;
    },

    ReleaseEntity(entity){
        entity.active = false;
        this.mPool.put(entity);
        // console.log("ReleaseEntity:" + entity.name);
    },
});
