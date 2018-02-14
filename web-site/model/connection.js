var mongoose = require('mongoose');

mongoose.connect('mongodb://userNPB:7KWwgoSkwuKam5II@mongodb/nodewebappdbwebsocket');

var connectionOne = mongoose.connection;
module.exports = connectionOne;