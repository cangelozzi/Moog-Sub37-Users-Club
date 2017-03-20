var express = require('express');
var router = express.Router();



// go to ALL events path
router.get('/sub', ensureAuthenticated, function (req, res) {
  var info = '';

  // grab appData info created in app.js
  var dataFile = req.app.get('appData');

  res.render('sub', {
    pageID: 'sub',
    events: dataFile.events
  });
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
