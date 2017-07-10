var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs =  require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');

// Socket IO
var io = require('./socket/websocket');

// Session 
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');

// Message flash
var flash  = require('connect-flash');
var validator = require('express-validator');

// Routes
var index = require('./routes/index');
var users = require('./routes/users');
var cognitiveRoute = require('./routes/cognitive');

var app = express();

// Connect to mongodb
mongoose.connect('mongodb://alexisaiah:alexisaiah@ds153392.mlab.com:53392/koders', function(err) {
  if(err) throw err;
});

// Assigns app io variable
app.io = io;

// view engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

// ROUTES
app.use('/cognitive', cognitiveRoute);
app.use('/users', users);
app.use('/', index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
