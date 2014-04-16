var auth = require('../auth');

exports.view = function(req, res) {
	res.render('index');
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

exports.loggedin = function(req, res) {
	var query = {
		links: "SELECT url FROM link WHERE owner IN (SELECT uid2 FROM friend where uid1=me())"
	};
	auth.graph.get("/me/friends", {access_token: auth.graph.getAccessToken()}, function(err, facebookRes) {
		var friends = facebookRes.data;
		var ids = [];
		for (var i = friends.length - 1; i >= 0; i--) {
			//console.log(friends[i].id);
			ids.push(friends[i].id);
		};
		ids = ids.join(",");
		console.log(ids);
		auth.graph.fql("select url from link where owner in ("+ids+") limit 100", function(fberr, fbRes) {
			console.log(fbRes);
			res.render('index', {loggedIn: 1, data: fbRes.data});
		});
	});

}
