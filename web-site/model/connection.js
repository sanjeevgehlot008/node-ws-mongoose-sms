var mongoose = require('mongoose');

//mongoose.connect('mongodb://userNPB:7KWwgoSkwuKam5II@mongodb/nodewebappdbwebsocket');
mongoose.connect('mongodb://192.168.99.100/nodewebappdbwebsocket');

var connectionOne = mongoose.connection;
module.exports = connectionOne;