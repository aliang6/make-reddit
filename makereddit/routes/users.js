const express = require('express');
const User = require('../models/user');
const auth = require('./helpers/auth');

const router = express.Router();

// Users index
router.get('/', auth.requireLogin, (req, res) => {
  User.find({}, 'username', (err, users) => {
    if (err) {
      console.error(err);
    } else {
      res.render('users/index', { users });
    }
  });
});

// Users new
router.get('/new', (req, res) => {
  res.render('users/new');
});

// Users create
router.post('/', (req, res) => {
  console.log(req.body);
  User.find({username: req.body.username}, (err, docs) => {
    console.log(docs);
    if(docs === undefined || docs.length === 0) {
      console.log("New user");
      const user = new User(req.body);
      user.save((err) => {
        if (err) {
          console.log(err);
        }
        return res.redirect('login');
      });
    } else {
      console.log("Existing user");
      return res.redirect('users/new');
    }
  });
});

module.exports = router;
