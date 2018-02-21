var mongoose = require('mongoose');

//mongoose.connect('mongodb://userNPB:7KWwgoSkwuKam5II@mongodb/nodewebappdbwebsocket');
mongoose.connect(process.env.DATABASE_URL);

var connectionOne = mongoose.connection;
module.exports = connectionOne;