const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load admin model
const Admin = require('../models/admin');
const User = require('../models/user');
const bcrypt = require('bcrypt')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {

  let query = Admin.find()
  let queryUsers = User.find()
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }
  if (req.query.name != null && req.query.name != '') {
    query = query.regex('name', new RegExp(req.query.name, 'i'))
  }     
  try {    
    const admins= await query.exec()
    const users= await queryUsers.exec()
    res.render('admins/dashboard', {
      admin: req.user,
      admins: admins,
      users: users,
      searchOptions: req.query
      })
       
  } catch {
      res.redirect('/')
      console.log("Erro ao Pequisar")   
  }
})

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('admins/login', {admin: req.user})
});

// Register Page - forwardAuthenticated,
router.get('/register', ensureAuthenticated, (req, res) => {  
  res.render('admins/register', {admin: req.user})
})

// Register
router.post('/', ensureAuthenticated, async (req, res) => { 
  let admin

  if (!req.body.name || !req.body.email || !req.body.password || !req.body.password2) {
      res.render('admins/register', {
      
      errorMessage: 'Por favor, preenche todos os campos', admin: admin})
  }

  else if (req.body.password != req.body.password2) {
        res.render('admins/register', {
        errorMessage: 'Passwords não combinam', admin: admin})
  }

  else if (req.body.password.length < 6) {
    res.render('admins/register', {
     errorMessage: 'Password deve ter pelo menos 6 caracteres',  admin: admin})
  }
  else {

    const checkUser = await Admin.findOne({email: req.body.email})
    
      
    if(checkUser != null) {
      res.render('admins/register', {
        errorMessage: 'Usuario já existe', admin: admin})
        
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const admin = new Admin({
        name : req.body.name,      
        email :  req.body.email,
        password : hashedPassword
        })
        try {
          const newadmin = await admin.save()          
          res.render('admins/register', {errorMessage: "Utilizador Criado com Sucesso", admin: admin })     
          
        } catch {
          res.render('admins/register', {
            errorMessage: 'Ocorreu um Erro de Redirecionamento da Página', admin: admin})
    }
        
      }
  }   
})

// Login
router.post('/login', async (req, res, next) => {

  const checkUser = await User.findOne({email: req.body.email})
    
      
  if(checkUser != null) {
    res.render('admins/login', {errorMessage: "O Utilizador não é Adminstrador"})
  }


  try{
    passport.authenticate('local', {
      successRedirect: '/admins/dashboard',
      fairlueRedirect: '/',
      failureFlash: true
    })(req, res, next);
  }catch(e){
      res.render('admins/login', {errorMessage: e})
      console.log(e)
      
  }
 
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/admins/login');
});


//editar admin
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const admin= await Admin.findById(req.params.id)
    res.render('admins/edit', { admin: admin })    
  } catch {
    res.redirect('/admins')
  }
})

  // Show admin
  router.get('/:id', ensureAuthenticated, async (req, res) => {   
    try {
      const admins = await Admin.find({ name: req.params.id}).limit(6).exec()
      res.render('admins/show', { admins: admins, admin: req.user })
    } catch(e) {
      res.redirect('/')
      console.log(e)
     
    }
  })
  // Update Place Route
router.put('/:id',  ensureAuthenticated, async (req, res) => {

  let admin= await Admin.findById(req.params.id)

      if (!req.body.name || !req.body.email || !req.body.password || !req.body.password2) {
        res.render('admins/edit', { admin: admin ,
        errorMessage: 'Por favor, preenche todos os campos'})
    }
  
    else if (req.body.password != req.body.password2) {
      res.render('admins/edit', { admin: admin ,
          errorMessage: 'Passwords não combinam'})
    }
  
    else if (req.body.password.length < 6) {
      res.render('admins/edit', { admin: admin ,      
       errorMessage: 'Password deve ter pelo menos 6 caracteres'})
    }/*
    else if (admin.find(req.body.email)) {
      res.render('admins/register', {
        errorMessage: 'Usuario já existe'})   
    } */
    else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
       
        admin= await Admin.findById(req.params.id)
        admin.name = req.body.name,      
        admin.mail = req.body.mail,        
        admin.password = hashedPassword
        try {
          const newadmin = await admin.save()
          res.render('admins/edit', { admin: admin, errorMessage: 'Utilizador Actualizado com Sucesso' })   
          
        } catch {
          res.render('admins/edit', { admin: admin, errorMessage: 'Utilizador Não foi Actualizado' })          
        }
        }
        
  })
     
 // Delete Administrador
 router.delete('/:id',  ensureAuthenticated, async (req, res) => {
  let admin
  try {
    admin = await Admin.findById(req.params.id)
    await admin.remove()
    res.redirect('/admins/dashboard')
  } catch {
    if (admin!= null) {
      res.render('/admins/dashboard', {
        admin: admin,
        errorMessage: 'Não pode remover o Utilizador'        
      })
    } else {
      res.redirect('/admins/dashboard')
    }
  }
})





module.exports = router;
