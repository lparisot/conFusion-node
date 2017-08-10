
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config');
var User = require('../models/user');

// see https://console.developers.google.com/apis/credentials

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile: " + profile);
    User.findOne({ OauthId: profile.id }, function(err, user) {
      if(err) {
        console.log(err);
        return done(err);
      }
      if(!err && user !=null) {
        done(null, user);
      }
      else {
        user = new User({ username: profile.displayName});
        user.OauthId = profile.id;
        user.OauthToken = accessToken;
        user.email = profile.emails[0].value;
        user.save(function(err) {
          if(err) {
            console.log(err);
            throw err;
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
