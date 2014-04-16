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
	auth.graph.get("/me", function(err, res) {
		console.log(res);
	});
	res.render('index', {loggedIn: 1});
}