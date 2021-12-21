const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const userRoute = require('./routes/userRoute');

const app = express();

//Connect DB
mongoose.connect('mongodb+srv://onalnotes:Smartedu-pass1234@cluster0.siih0.mongodb.net/smartedu-db?retryWrites=true&w=majority', {}).then(() => {
  console.log('DB Connected Successfully');
});

//TEMPLATE ENGINE
app.set('view engine', 'ejs');

//GLOBAL VARIABLES
global.userIN = null;

//MIDDLE WARES
app.use(express.static('public'));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
  session({
    secret: 'my-keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://onalnotes:Smartedu-pass1234@cluster0.siih0.mongodb.net/smartedu-db?retryWrites=true&w=majority' }),
  }));
  app.use(flash());
  app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
  });
  app.use(methodOverride('_method', {
    methods: ['POST', 'GET'],
  }));



//ROUTES
app.use('*', (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use('/', pageRoute);
app.use('/courses', courseRoute);
app.use('/categories', categoryRoute);
app.use('/users', userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
