//dependencies for each module used
var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars');
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook-canvas');

//route files to load
var index = require('./routes/index');

//database setup - uncomment to set up your database
//var mongoose = require('mongoose');
//mongoose.connect(process.env.MONGOHQ_URL || 'mongodb://localhost/DATABASE1);

//Configures the Template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(passport.initialize());

passport.use(new FacebookStrategy({
		clientID: '282251501941507',
		clientSecret: '8f82eef4074c806f061fbe24a27e0620',
		callbackURL: "https://beardedyenz.herokuapp.com/loggedin"
	}, function(accessToken, refreshToken, profile, done) {
	}
));

//routes
app.get('/', index.view);
app.post('/', passport.authenticate('facebook-canvas',  { successRedirect: '/loggedin',
                                             failureRedirect: '/auth/facebook/canvas/autologin' }));
app.get('/login', index.login);
app.get('/loggedin', index.loggedin);
app.get('/getFriendLinks', index.getFriendLinks);
app.get('/auth/facebook/canvas/autologin', function( req, res ){
  res.send( '<!DOCTYPE html>' +
              '<body>' +
                '<script type="text/javascript">' +
                  'top.location.href = "/login";' +
                '</script>' +
              '</body>' +
            '</html>' );
});


//set environment ports and start application
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});