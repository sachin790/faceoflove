const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    from_user: {
        type: mongoose.Schema.Types.ObjectId , 
		ref: 'user'
    },
     to_user: {
        type: mongoose.Schema.Types.ObjectId , 
		 ref: 'user'
    },
	message: {
        type: String
		
    },
	timestamp: {
      type : Date,
	  default: Date.now
		
    },
	read_status: {
        type: String
		
    },
	
});

module.exports = mongoose.model('message', messageSchema);