var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get("/",(req,res,next)=>{
  res.render("home")
})

router.get('/register', (req, res, next) => {
  var error = req.flash('error');
  res.render('register', { error });
});
router.get('/', (req, res, next) => {
  console.log(req.session);
  res.render('users');
});

router.get('/login', (req, res, next) => {
  var error = req.flash('error');
  res.render('login', { error });
});
router.post('/register', (req, res, next) => {
  console.log(req.body, '*************');
  var { email, password } = req.body;
  if (password.length <= 4) {
    req.flash('error', 'minimum password length should be 5');
    return res.redirect('/users/register');
  }
  User.create(req.body, (err, user) => {
    if (err) next(err);

    res.redirect('/users/login');
  });
});

router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Email/password required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'password is incorrect');
        return res.redirect('/users/login');
      }

      req.session.userId = user.id;
      res.redirect('/users');
    });
  });
});
module.exports = router;