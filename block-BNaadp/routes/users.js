var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  res.cookie('username', 'Arti');
  res.redirect('/');
});

module.exports = router;
