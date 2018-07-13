const express = require('express');
let posts = require('./posts');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');

const router = express.Router();

// Rooms index
router.get('/', (req, res) => {
  Room.find({}, 'topic', (err, rooms) => {
    if (err) {
      console.error(err);
    } else {
      res.render('rooms/index', { rooms });
    }
  });
});

// Rooms search
router.get('/search', (req, res) => {
  console.log(req.body);
  console.log(req.params);
  res.redirect('/rooms');
});


// Rooms new
router.get('/new', auth.requireLogin, (req, res) => {
  res.render('rooms/new');
});

// Rooms show
router.get('/:id', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }
    Post.find({ room }).sort({ points: -1 }).populate('comments').populate('author').exec((err, posts) => {
      if (err) { console.error(err); }
      res.render('rooms/show', {
        room,
        posts,
        helpers: {
          isEqual: (a, b, options) => { return a === b; },
        },
      });
    });
  });
});

// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }
    res.render('rooms/edit', { room });
  });
});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) { console.error(err); }
    res.redirect('/rooms/' + req.params.id);
  });
});

// Rooms create
router.post('/', auth.requireLogin, (req, res) => {
  const room = new Room(req.body);

  room.save((err) => {
    if (err) { console.error(err); }
    return res.redirect('/rooms');
  });
});

router.use('/:roomId/posts', posts);

module.exports = router;
