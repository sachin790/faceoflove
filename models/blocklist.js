const mongoose = require('mongoose');

const blockSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
   blocklist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
   
});
 
module.exports = mongoose.model('blocklist', blockSchema);













  /* lists: [
  
  {      list: {
        type: Schema.ObjectId,
      
        ref: "List"
      }
  }
  ]
   */
  