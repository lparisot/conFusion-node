var passport = require('passport');
var local = require('./local');
var facebook = require('./facebook');
var google = require('./google');

local(passport);
facebook(passport);
google(passport);

module.exports = passport;
