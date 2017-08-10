module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'mongoUrl' : 'mongodb://localhost:27017/conFusion',
  'facebook' : {
    clientID      : 'YOUR FACEBOOK APP ID',
    clientSecret  : 'YOUR FACEBOOK SECRET',
    callbackURL   : '/users/login/facebook/callback'
  },
  'google'   : {
    clientID      : 'YOUR GOOGLE APP ID',
    clientSecret  : 'YOUR GOOGLE SECRET',
    callbackURL   : '/users/login/google/callback'
  }
}
