var auth = require('../auth');
var url = require('url');

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
				var chunk = ++chunkNo;
				for (var k = fbRes.data.length - 1; k >= 0; k--) {
					if(!fbRes.data[k].url) {
						console.log(fbRes.data[k].url);
						continue;
					}
					var url_hn = url.parse(fbRes.data[k].url).hostname;
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
						arr.push({url: key, hits: urls[key]});
					}
					res.render('index', {loggedIn: 1, data: arr});
				}
			});
		}
	});


}