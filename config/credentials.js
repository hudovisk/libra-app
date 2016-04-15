
//Database info
if (process.env.NODE_ENV === 'production') {
    // Only on production server
    var username = process.env.DB_USERNAME;
    var password = process.env.DB_PASSWORD;
    var host = process.env.DB_HOST;
    var collection = process.env.DB_COLLECTION;

    module.exports.db_url = "mongodb://"+username+":"+password+"@"+host+"/"+collection;   

} else if(process.env.NODE_ENV === 'test'){
    var host = "localhost";
    var collection = "test";

    module.exports.db_url = "mongodb://"+host+"/"+collection;   
} else {
    var host = "localhost";
    var collection = "libra";

    module.exports.db_url = "mongodb://"+host+"/"+collection;   
}

// Session
if (process.env.NODE_ENV === 'production') {
    module.exports.sessionSecret = process.env.SESSION_SECRET;
} else {
    module.exports.sessionSecret = 'secret';
}