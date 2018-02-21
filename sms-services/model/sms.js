var mongoose = require('mongoose');  
var connectionone = require('./connection');  
mongoose.Promise = global.Promise;
var blobSchema = mongoose.Schema({  
  receiver_number:{
	  type: String
  },
  SMS_text: {
	  type: String
  },
  sent_time: {
	  type: String
  },
  sms_status: {
	  type: String
  },
  sender_number: {
	  type: String
  },
  messageid: {
	  type: Number
  }
  
});
module.exports = connectionone.model('sms_logs', blobSchema);