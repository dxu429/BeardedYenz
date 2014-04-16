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
	// this is gonna take a long time, maybe put into another function for ajax req.
	auth.graph.get("/me/friends", {access_token: auth.graph.getAccessToken()}, function(err, facebookRes) {
		var friends = facebookRes.data;
		var i, j, chunkOfIds, chunkSize = 10;
		for(i=0; i<friends.length; i+= chunkSize) {
			var ids;
			
			console.log(ids);
		}
		//console.log(ids);
		/*
		auth.graph.fql("select url from link where owner in ("+ids+") limit 100 ", function(fberr, fbRes) {
			console.log(fbRes);
			res.render('index', {loggedIn: 1, data: fbRes.data});
		});
		*/
	});

}
