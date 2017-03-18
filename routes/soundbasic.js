var express = require('express');
var router = express.Router();



// go to ALL events path
router.get('/soundbasic', function (req, res) {
  var info = '';

  // grab appData info created in app.js
  var dataFile = req.app.get('appData');

  res.render('soundbasic', {
    pageID: 'soundbasic',
    events: dataFile.events
  });
});


module.exports = router;
