const mongoose = require('mongoose');

const friendSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   friendlist: [{ type: mongoose.Schema.Types.ObjectId , ref: 'user' }]
   
});
 
module.exports = mongoose.model('friendlist', friendSchema);