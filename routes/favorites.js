const { response, query } = require('express');
const express = require('express');
const passport = require("passport");
const router = express.Router()
const Click = require('../models/clicks')
const User = require('../models/user');
const Place = require('../models/place')
const Favorite = require('../models/favorite')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
//const Favorito = tables[2];
//const User = tables[0];
 let novoFav = null;
 
// add a document to the DB collection recording the click event

router.post('/', ensureAuthenticated, async (req, res) => {
  
  const favorite = new Favorite({
    userId: req.body.user,
    placeId: req.body.place})
    //let searchOptions = {}
    //searchOptions.userId = new RegExp(req.body.user, 'i')
    

  try{       
   // const place = await Place.findById(req.body.place)
    //const user = await User.findById(req.body.user)

    const oldFavorite = await Favorite.findOne(
      {
        userId: req.body.user,
        placeId: req.body.place
      }
    )    
   

    if (oldFavorite != null){
      await oldFavorite.remove()
      
    }else{
      const newFavorite = await favorite.save()
      
    }
    
    res.redirect('/')
   /* res.json({
      status: place.name,
      user: user.name
    })*/
  }
  catch (e) {
   /* res.json({
      status: 'não logado',
      error: e
    })*/
    res.redirect('/') 
  }   
  
})
  
  

module.exports = router