const { request, response } = require('express');
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var FileStore = require('session-file-store')(session)
var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret:'111111',
    resave: false,
    saveUninitialized: true,
    store : new FileStore()
}))

var authData = {
    email : 'sooyo12@naver.com',
    password : '111111',
    id : 'GLIB'
}

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/login', passport.authenticate('local',{
            failureRedirect: '/',
            failureFlash : true
}),function(req,res){
    req.session.save(function(){
        res.redirect('/');
    })
  }
);

passport.serializeUser(function(user,done){
    done(null,user);
})

passport.deserializeUser(function(id,done){
    console.log(id);
    done(null, id);
})


passport.use(new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'pwd'
    }, 
        function(username, password, done){
            console.log(username,password)
            if(username === authData.email){
                console.log(1)
                if(password === authData.password){
                    console.log(2)
                    done(null, authData.id);
                } else {
                    console.log(3)
                    return done(null, false, {message: "Incorrect Password."})
                }
            } else {
                console.log(4)
                return done(null, false, {message: "Incorrect Email"})
            }
        }
))

app.get('/', function(req,res){
    var fmsg = req.flash();
    var feedback = '';
    if (fmsg.error){
        feedback = fmg.error[0];
    }
    req.flash('id','string')
    res.send(`
    <div style="color:red;">${feedback}</div>
    <form action="/login" method="post">
    <p><input type="text" name="email" placeholder="email"></p>
    <p><input type="password" name="pwd" placehoder="password"></p>
    <p><input type="submit" value="login">
    </form>`)
})

/*
app.post('/login', function(req,res){
    var emails = req.body.email;
    var password = req.body.pwd;
    if (emails === authData.email && password === authData.password){
        req.session.nickname = authData.id;
        req.session.save(function(error){
            res.redirect('/')
        })
    }
})
*/
app.listen(3000);