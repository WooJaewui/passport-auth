module.exports = function(app){

    var authData = {
        email: 'egoing777@gmail.com',
        password: '111111',
        nickname: 'egoing'
      }
      
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        FacebookStrategy = require('passport-facebook').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user,done){
    done(null, user);
    })

    passport.deserializeUser(function(id,done){
    done(null, id);
    })

    passport.use(new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'pwd'
    },
    function(username, password, done) {
        console.log('LocalStrategy', username, password);
        if (username === authData.email){
            if (password === authData.password){
                return done(null, authData.nickname,{message:"welcome."});
            } else {
                return done(null, false, {
                message : 'Incorrect password.'
                })
        }
        } else {
        return done(null, false,{
            message : 'Incorrect username.'
            
        })
        }
    }
    ));
    var facebookCredentials = require('../config/facebook.json')
    facebookCredentials.profileFields = ['id', 'emails', 'name'];
    passport.use(new FacebookStrategy(facebookCredentials,
      function(accessToken, refreshToken, profile, done) {
          console.log('FacebookStrategy', accessToken, refreshToken, profile);
        //User.findOrCreate(..., function(err, user) {
        //  if (err) { return done(err); }
        //  done(null, user);
        //});
      }
    ));

    app.get('/auth/facebook', passport.authenticate('facebook',{
        scope:'email'
    }));
    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { 
        successRedirect: '/',
        failureRedirect: '/auth/login' 
    }));
    return passport
}