
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../config');
var User = require('../models/user');

// see https://console.developers.google.com/apis/credentials

module.exports = function(passport) {
  passport.use(new TwitterStrategy({
    consumerKey: config.twitter.clientID,
    consumerSecret: config.twitter.clientSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile: " + JSON.stringify(profile));
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
