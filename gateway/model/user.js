var mongoose = require('mongoose');  
var connectionone = require('./connection');  
mongoose.Promise = global.Promise;
var blobSchema = mongoose.Schema({  
  phone:{
	  type: String
  },
  name:{
	  type: String
  },
  unique_token: {
	  type: String
  },
  date: {
	  type: String
  }
  
});
module.exports = connectionone.model('tb_users', blobSchema);