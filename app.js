var express = require('express');
var cors = require('cors');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var authenticate = require('./authentication/authenticate');
var config = require('./config');

mongoose.Promise = require('bluebird');

var users = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var favoriteRouter = require('./routes/favoriteRouter');

// Connection URI
mongoose.connect(config.mongoUrl, {useMongoClient: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("Connected correctly to database");
});

var app = express();

// Secure traffic only
app.all('*', function(req, res, next) {
  console.log('req start: ', req.secure, req.hostname, req.url);
  if (req.secure) {
    return next();
  }

  res.redirect('https://'+req.hostname+':'+app.get('secPort')+req.url);
});

// solve cors problem
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Initialize Passport and restore authentication state, if any, from the session
app.use(session({
  secret: config.secretKey,
  resave: false,
  saveUninitialized: true
}));
app.use(authenticate.initialize());
app.use(authenticate.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leadership', leaderRouter);
app.use('/favorites', favoriteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

module.exports = app;
