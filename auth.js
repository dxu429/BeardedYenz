//load environment variables
var dotenv = require('dotenv');
dotenv.load();

var graph = require('fbgraph');

var fbAuthUrl = graph.getOauthUrl({
    "client_id":     process.env.facebook_client_id
  , "redirect_uri":  process.env.redirect_uri
  , "scope": "user_friends, user_about_me, user_birthday, read_stream"
});

var fbAuthObj = function(req) {
	return {
	  "client_id":     process.env.facebook_client_id
	, "redirect_uri":  process.env.redirect_uri
	, "client_secret": process.env.facebook_client_secret
	, "code": req.query.code
}};

exports.graph = graph;
exports.fbAuthUrl = fbAuthUrl;
exports.fbAuthObj = fbAuthObj;