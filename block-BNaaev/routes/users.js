var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register');
});


router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) next(err);
    console.log(user);
  });
});

module.exports = router;
