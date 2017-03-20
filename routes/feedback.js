var express = require('express');
var router = express.Router();

// go to main root path
router.get('/feedback', ensureAuthenticated, function (req, res) {
  res.render('feedback');
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
