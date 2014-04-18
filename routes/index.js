var auth = require('../auth');
var url = require('url');

exports.view = function(req, res) {
	auth.T.get('statuses/home_timeline', function(err, reply) {
		console.log(reply);
		res.render('index', {timeline: reply});
	});
}

exports.login = function(req, res) {
	if (!req.query.code) {
	    if (!req.query.error) { //checks whether a user denied the app facebook login/permissions
	    	res.redirect(auth.fbAuthUrl);
	    } else {  //req.query.error == 'access_denied'
	    	res.send('access denied');
	    }
	    return;
  	}

  	auth.graph.authorize(
  	  auth.fbAuthObj(req)
  	, function(err, facebookRes) {
  		res.redirect('/loggedin');
  	});
}

exports.canvas = function(req, res) {
	console.log("within canvas post");
	auth.passport.authenticate('facebook-canvas',  { successRedirect: '/loggedin',
                                             failureRedirect: '/auth/facebook/canvas/autologin' });
}

exports.loggedin = function(req, res) {
	console.log("within loggedIn");
	var me, timeline;
	auth.graph.get("/me", {access_token: auth.graph.getAccessToken()}, function(err, facebookRes) {
		me = facebookRes;
		auth.T.get('statuses/home_timeline', function(err, reply) {	
			res.render("index", {loggedIn:1, me: me, timeline: reply});	
		});	
	});
}

exports.getFriendLinks = function(req, res) {
	auth.graph.get("/me/friends", function(err, facebookRes) {
		console.log(err);
		console.log(facebookRes);
		if(typeof facebookRes.data === "undefined" || err) {
			res.redirect('/login');
			return;
		}
		var friends = facebookRes.data;
		var i, j, chunkOfIds, chunkSize = 10;
		var urls = {};
		var numChunks = friends.length/chunkSize;
		var chunkNo = 0;

		for(i=0; i<friends.length; i+= chunkSize) {
			var ids = [], idstr;

			for(j=i; j<friends.length && j<i+chunkSize; ++j) {
				ids.push(friends[i].id);
			}
			idstr = ids.join(",");
			
			auth.graph.fql("select url from link where owner in ("+idstr+")", function(fberr, fbRes) {
				if(typeof facebookRes.data === "undefined" || err) {
					res.json({error: err, msg: "Could not get your friend's posted links."});
					return;
				}
				var chunk = ++chunkNo;

				for (var k = fbRes.data.length - 1; k >= 0; k--) {
					if(!fbRes.data[k].url) {
						continue;
					}
					var url_hn = url.parse(fbRes.data[k].url).hostname;
					
					// when no host name, default to facebook
					if(!url_hn) 
						url_hn = "www.facebook.com";
					if(typeof urls[url_hn] === "undefined") {
						urls[url_hn] = 1;
					} else {
						urls[url_hn]++;
					}
				};

				if(chunk > numChunks) {
					var arr = [];
					for (var i = Object.keys(urls).length - 1; i >= 0; i--) {
						var key = Object.keys(urls)[i];
						arr.push([key, Math.log(urls[key]) + 1]);
					}
					res.json({data: arr});
				}
			});
		}
	});
}