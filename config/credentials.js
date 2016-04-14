
//This file is replaced on production server!.

//Database info
if (process.env.NODE_ENV === 'production') {
    // Only on production server
} else if(process.env.NODE_ENV === 'test'){
    module.exports.db = {
        username: "",
        psswd: "",
        host: "localhost",
        collection: "test",
        get url () {
            return "mongodb://"+this.host+"/"+this.collection;   
        } 
    };
} else {
    module.exports.db = {
        username: "",
        psswd: "",
        host: "localhost",
        collection: "libra",
        get url () {
            return "mongodb://"+this.host+"/"+this.collection;   
        } 
    };
}

// Session
module.exports.sessionSecret = 'secret';