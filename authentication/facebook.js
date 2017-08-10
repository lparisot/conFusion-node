
var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');
var User = require('../models/user');

module.exports = function(passport) {
  passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ OauthId: profile.id }, function(err, user) {
      if(err) {
        console.log(err);
        // TODO handle errors!
      }
      if(!err && user !=null) {
        done(null, user);
      }
      else {
        user = new User({ username: profile.displayName});
        user.OauthId = profile.id;
        user.OauthToken = accessToken;
        user.save(function(err) {
          if(err) {
            console.log(err);
            // TODO handle errors!
          }
          else {
            console.log("Saving user ...");
            done(null, user);
          }
        });
      }
    });
  }
))};
