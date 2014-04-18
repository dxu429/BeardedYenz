//load environment variables
var dotenv = require('dotenv');
dotenv.load();

var graph = require('fbgraph');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook-canvas');

var Twit = require('twit');

var fbAuthUrl = graph.getOauthUrl({
    "client_id":     process.env.facebook_client_id
  , "redirect_uri":  process.env.redirect_uri
  , "scope": "user_friends, user_about_me, user_birthday, read_stream"
});

var fbAuthObj = function(req) {
	graph.setAppSecret(process.env.facebook_client_secret);
	return {
	  "client_id":     process.env.facebook_client_id
	, "redirect_uri":  process.env.redirect_uri
	, "client_secret": process.env.facebook_client_secret
	, "code": req.query.code
}};

var T = new Twit({
	consumer_key: 		 process.env.twitter_client_id,
	consumer_secret: 	 process.env.twitter_client_secret,
	access_token: 		 process.env.twitter_access_token,
	access_token_secret: process.env.twitter_access_token_secret
});

passport.use(new FacebookStrategy({
		clientID: process.env.facebook_client_id,
		clientSecret: process.env.facebook_client_secret,
		callbackURL: "http://localhost:3000/login"
	}, function(accessToken, refreshToken, profile, done) {

	}
));

exports.graph = graph;
exports.fbAuthUrl = fbAuthUrl;
exports.fbAuthObj = fbAuthObj;
exports.passport = passport;
exports.FacebookStrategy = FacebookStrategy;
exports.T = T;