var mongoose = require('mongoose');

function connect(){
    return mongoose.connect("mongodb://192.168.1.201:27017/faceoflove",{ useNewUrlParser: true });
}

exports.connect  = connect;