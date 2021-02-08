/*if (process.env.NODE_ENV != 'production'){
    require('dotnev').load
}*/
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

//adicionado
const passport = require('passport');
const passport1 = require('passport');
const flash = require('connect-flash');
const session = require('express-session');

// Passport Config
require('./config/passport')(passport);
// Passport Config
//require('./config/passport1')(passport);

// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );

  // Passport middleware
app.use(passport.initialize());
app.use(passport.session());


  // Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//

const indexRouter = require('./routes/index')
const placeRouter = require('./routes/places')
const adminRouter = require('./routes/admins')
const categoryRouter = require('./routes/categories')
const userRouter = require('./routes/users')
const favoriteRouter = require('./routes/favorites')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.json({limit: '1mb'}))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))


const mongoose = require('mongoose')
const { brotliDecompress } = require('zlib')
mongoose.connect("mongodb://localhost/muxima", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Conectado ao Mongoose'))

app.use('/', indexRouter)
app.use('/admins', adminRouter)
app.use('/categories', categoryRouter)
app.use('/places', placeRouter)
app.use('/users', userRouter)
app.use('/favorites', favoriteRouter)


app.listen(process.env.PORT || 3000 , () =>{
    console.log('Servidor a funcionar')
})
