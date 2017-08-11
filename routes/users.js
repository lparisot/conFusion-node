var express = require('express');
var passport = require('passport');

var User = require('../models/user');
var Verify = require('./verify');

var router = express.Router();

function login(req, res, next, err, user, info) {
  if (err) {
    return next(err);
  }
  if (!user) {
    return res.status(401).json({
      err: info
    });
  }
  req.logIn(user, function(err) {
    if (err) {
      return res.status(500).json({
        err: 'Could not log in user'
      });
    }

    var token = Verify.getToken(user);
    res.status(200).json({
      status: 'Login successful!',
      success: true,
      token: token
    });
  });
}

/* GET users listing if admin */
router.get('/', Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
    User.find({}, function (err, users) {
      if (err) throw err;

      res.json(users);
    });
});

router.post('/register', function(req, res) {
  User.register(
    new User({ username : req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        return res.status(500).json({err: err});
      }

      if(req.body.firstname) {
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname) {
        user.lastname = req.body.lastname;
      }
      user.save(function(err, user) {
        if (err) {
          return res.status(500).json({err: err});
        }

        passport.authenticate('local')(req, res, function () {
          return res.status(200).json({status: 'Registration Successful!'});
        });
      });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    login(req, res, next, err, user, info);
  })(req, res, next);
});

router.get('/login/facebook',
  passport.authenticate('facebook')
);

router.get('/login/facebook/callback', function(req,res,next) {
  passport.authenticate('facebook', function(err, user, info) {
    login(req, res, next, err, user, info);
  })(req,res,next);
});

router.get('/login/google',
  passport.authenticate('google', { scope : ['profile', 'email'] })
);

router.get('/login/google/callback', function(req, res, next) {
  passport.authenticate('google', function(err, user, info) {
    login(req, res, next, err, user, info);
  })(req,res,next);
});

router.get('/login/twitter',
  passport.authenticate('twitter')
);

router.get('/login/twitter/callback', function(req, res, next) {
  passport.authenticate('twitter', function(err, user, info) {
    login(req, res, next, err, user, info);
  })(req,res,next);
});

router.get('/logout', function(req, res) {
  req.logout();
  // must also destroy the token
  res.status(200).json({
    status: 'Bye!'
  });
});

module.exports = router;
