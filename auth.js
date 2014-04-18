//load environment variables
var dotenv = require('dotenv');
dotenv.load();

var graph = require('fbgraph');

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

exports.graph = graph;
exports.fbAuthUrl = fbAuthUrl;
exports.fbAuthObj = fbAuthObj;
exports.T = T;