const mongoose = require('mongoose');

const clicksSchema = new mongoose.Schema({
  clicktime: {
    type: String,
      required: true,
          
  }
  
});
module.exports = mongoose.model('Clicks', clicksSchema);



