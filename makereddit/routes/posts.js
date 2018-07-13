const express = require('express');
const auth = require('./helpers/auth');
const comments = require('./comments');
const Room = require('../models/room');
const Post = require('../models/post');

const router = express.Router({ mergeParams: true });

// Posts new
router.get('/new', auth.requireLogin, (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    checkError(err);

    res.render('posts/new', { room, username: res.locals.currentUsername });
  });
});

// Posts create
router.post('/', auth.requireLogin, (req, res) => {
  console.log(req.params);
  console.log(req.body);
  Room.findById(req.params.roomId, (err, room) => {
    checkError(err);
    const post = new Post(req.body);
    post.room = room;
    post.author = res.locals.currentUser;

    post.save((err, post) => {
      checkError(err);
      return res.redirect(`/rooms/${room._id}`);
    });
  });
});

// Posts update points
router.post('/:id', auth.requireLogin, (req, res) => {
  console.log(req.params);
  Post.findById(req.params.id, (err, post) => {
    console.log(post);
    post.points += parseInt(req.body.points);

    post.save((err, post) => {
      checkError(err);

      return res.redirect(`/rooms/${post.room}`);
    });
  });
});

// Posts Edit
router.get('/:id/edit', auth.requireLogin, (req, res) => {
  console.log(req.params);
  Room.findById(req.params.roomId, (err, room) => {
    Post.findById(req.params.id, (err, post) => {
      res.render('posts/edit', { room, post });
    });
  });
});

// Posts Update
router.post('/:id/update', auth.requireLogin, (req, res) => {
  console.log(req.params);
  console.log(req.body);
  Room.findById(req.params.roomId, (err, room) => {
    Post.findByIdAndUpdate(req.params.id, req.body, (err) => {
      checkError(err);
      res.redirect(`/rooms/${room._id}`);
    });
  });
});

// Posts Delete
router.post('/:id/delete', auth.requireLogin, (req, res) => {
  console.log(req.params);
  console.log(req.body);
  Room.findById(req.params.roomId, (err, room) => {
    Post.findByIdAndRemove(req.params.id, (err, response) => {
      checkError(err);
      res.redirect(`/rooms/${room._id}`);
    });
  });
});

router.use('/:postId/comments', comments);

module.exports = router;

function checkError(err) {
  if (err) {
    console.error(err);
  }
}
