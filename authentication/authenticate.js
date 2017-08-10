var passport = require('passport');
var local = require('./local');
var facebook = require('./facebook');

local(passport);
facebook(passport);

module.exports = passport;
