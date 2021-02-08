const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

// Load User model
const User = require("../models/user");
const Admin = require("../models/admin");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      //console.log(email + password);
      const adminpassword = password;
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          Admin.findOne({
            email: email,
          }).then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That email is not registered",
              });
            } else {
              // Match password
              bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                  //console.log("Admin Logado");
                  return done(null, user);
                  
                } else {
                  console.log("Password incorrect");
                  return done(null, false, { message: "Password incorrect" });
                }
              });
            }
          });
        } else {
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          });
        }
      });
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);    
  });
  

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {      
      if (user != null){
        done(err, user);
      } 
      else {
        Admin.findById(id, function (err, user) {
          done(err, user);
        });
      } 
      
    });
  });
};
