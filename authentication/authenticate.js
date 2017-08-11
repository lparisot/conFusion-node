var passport = require('passport');
var local = require('./local');
var facebook = require('./facebook');
var google = require('./google');
var twitter = require('./twitter');

local(passport);
facebook(passport);
google(passport);
twitter(passport);

module.exports = passport;
