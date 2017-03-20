var express = require('express');
var router = express.Router();

// go to main root path
router.get('/chat', ensureAuthenticated, function (req, res) {

  // reference to index.ejs which is the view point
  res.render('chat');

});

// to make sure the Dashboard page is shown just when logged in
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;
