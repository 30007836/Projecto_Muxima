const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt')
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth-user');
const jwt  = require('jsonwebtoken')
//const alidationResult = require('express-validator')
//const config = require('../config/config');
//const user = require('../models/user');






// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {

 
  try {
      
    const users= req.user
    
    // criando o token
    const token = jwt.sign({users}, 'bragamole',         
      {
        //1000000
        expiresIn: 100,
      });
      // fazendo merge do yoken com o username
      const userToReturn = { ...users.name, ...{ token } };

      //eliminando a password no token
      delete userToReturn.hashedPassword;
      
      //resposta ao servidor para o dashboard
        res.render('users/dashboard', {
        user: req.user,
        users: req.user,
        searchOptions: req.query,
        userToReturn: userToReturn
        })

          
  } catch (e) {
    //em caso de falha vai para a homepage
      res.redirect('/')
       
  }
})


/* 
****
Pagina de Registo
*/
router.get('/register', forwardAuthenticated, (req, res) => {  
  res.render('users/register')
})

/*
Registando utilizadores novos

*/
  router.post('/', async (req, res) => { 
  let user

  if (!req.body.name || !req.body.email || !req.body.password || !req.body.password2) {
      res.render('users/register', {
      user: user,
      errorMessage: 'Por favor, preenche todos os campos'})
  }

  else if (req.body.password != req.body.password2) {
        res.render('users/register', {
        errorMessage: 'Passwords não combinam'})
  }

  else if (req.body.password.length < 6) {
    res.render('users/register', {
     errorMessage: 'Password deve ter pelo menos 6 caracteres'})
  }   
  else { 

    const checkUser = await User.findOne({email: req.body.email})
    
    console.log(checkUser)

    if(checkUser != null) {
      res.render('users/register', {
        errorMessage: 'Usuario já existe'})
        return
    }   

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = new User({
      name : req.body.name,      
      email :  req.body.email,
      password : hashedPassword
      })      

      try {
        const newUser = await user.save()             
        //res.render(`users/${newUser.id}`)
        res.render('users/register', {errorMessage: "Utilizador Criado com Sucesso" })  

      } catch {
        res.redirect(`/`)
        
      }
  }   
})

// Pagina de login
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('users/login')
});

// Login
router.post('/login', (req, res, next) => {
  try{
    passport.authenticate('local', {
      successRedirect: '/users/dashboard',
      fairlueRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);

  }catch(e){
      console.log(e)
  }
 
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//editar user
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
  try {
    const user= await User.findById(req.params.id)
    res.render('users/edit', { user: user })    
  } catch {
    res.redirect('/users')
  }
})

  // Show User
  router.get('/:id', ensureAuthenticated, async (req, res) => {   
    try {
      
      const users = await User.findById(req.params.id)
     // console.log(req.params.id + " : " + users)
      res.render('users/show', { users: users })
    } catch(e) {
      res.redirect('/')
      //console.log(e)
     
    }
  })
  // Update Users
router.put('/:id',  ensureAuthenticated, async (req, res) => {

  let user= await User.findById(req.params.id)

      if (!req.body.name || !req.body.email || !req.body.password || !req.body.password2) {
        res.render('users/edit', { user: user ,
        errorMessage: 'Por favor, preenche todos os campos'})
    }
  
    else if (req.body.password != req.body.password2) {
      res.render('users/edit', { user: user ,
          errorMessage: 'Passwords não combinam'})
    }
  
    else if (req.body.password.length < 6) {
      res.render('users/edit', { user: user ,      
       errorMessage: 'Password deve ter pelo menos 6 caracteres'})
    }/*
    else if (User.find(req.body.email)) {
      res.render('users/register', {
        errorMessage: 'Usuario já existe'})   
    } */
    else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
       
        user= await User.findById(req.params.id)
        user.name = req.body.name,      
        user.mail = req.body.mail,        
        user.password = hashedPassword
        try {
          const newUser = await user.save()
          res.redirect('/users/dashboard')     
          
        } catch {
          res.redirect(`/`)
          
        }
        }
        
  })
     
 // Delete User
 router.delete('/:id',  ensureAuthenticated, async (req, res) => {
  let user
  try {
    user = await User.findById(req.params.id)
    await user.remove()
    res.render('users/login', {
      user: user,
      errorMessage: 'Utilizador Removido'
    })
  } catch {
    if (user!= null) {
      res.render('users/show', {
        user: user,
        errorMessage: 'Não pode remover o Utilizador'
      })
    } else {
      res.redirect('/')
    }
  }
})



module.exports = router;
