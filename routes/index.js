const express = require('express')
const router = express.Router()
const Place = require('../models/place')
const User = require('../models/user')
const Favorite = require('../models/favorite')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');



router.get('/', async (req, res) => {

  let query = User.find()
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))}

  let places
  try {
    places = await Place.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    places = []
  }try {
    const users= await query.exec()
    try{
      const favorites = await Favorite.find()
      res.render('index', { places: places, user: req.user, favorites: favorites }) 
    }catch{
      res.render('index', { places: places, user: req.user})
    } 
       
  } catch { 
    res.render('index', { places: places})
    console.log('erro ao pesquisar user')
  }
  
})

module.exports = router