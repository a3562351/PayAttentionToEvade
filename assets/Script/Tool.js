window.Tool = {
    GetFormatTime(){
        
    },

    GetRandom(length){
        let idx = Math.ceil(Math.random() * length)
        if(idx === 0){
            idx = 1;
        }
        return idx;
    },
}
