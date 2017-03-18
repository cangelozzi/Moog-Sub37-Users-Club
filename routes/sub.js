var express = require('express');
var router = express.Router();



// go to ALL events path
router.get('/sub', function (req, res) {
  var info = '';

  // grab appData info created in app.js
  var dataFile = req.app.get('appData');

  res.render('sub', {
    pageID: 'sub',
    events: dataFile.events
  });
});


module.exports = router;
