const express = require('express');
const User = require('../models/user');

const router = express.Router();

// set layout variables
router.use((req, res, next) => {
  res.locals.title = 'MakeReddit';
  res.locals.currentUserId = req.session.userId;
  res.locals.currentUsername = req.session.username;
  res.locals.currentUser = req.session.currentUser;
  next();
});

// Home Page
router.get('/', (req, res) => {
  res.render('index');
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

// POST Login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const nextError = new Error('Username or password incorrect');
      nextError.status = 401;
      return next(nextError);
    }
    req.session.currentUser = user
    req.session.userId = user._id;
    req.session.username = req.body.username;
    return res.redirect('/rooms');
  });
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) { return next(err); }
    });
  }
  return res.redirect('/login');
});

module.exports = router;


/*  - Cannot delete rooms, posts, or comments
    - No sign up button
    - Posts and comments don't have an author
    - Main page doesn't redirect to anywhere
    - Title on header doesn't redirect to the main page
    - No 'Create room' button
    - No back button to get back to room index once you've entered one
    - One user has unlimited votes for posts
*/
