const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'user'     
  },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'place' 
  },
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model('Favorite', favoriteSchema);



