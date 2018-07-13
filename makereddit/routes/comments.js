const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');

const router = express.Router({ mergeParams: true });

function checkError(err) {
  if (err) { console.error(err); }
}

// Comment new
router.get('/new', auth.requireLogin, (req, res) => {
  console.log(req.params);
  Room.findById(req.params.roomId, (err, room) => {
    checkError(err);
    console.log(room);
    Post.findById(req.params.postId, (err, post) => {
      checkError(err);
      console.log(post);
      const username = res.locals.currentUsername;
      res.render('comments/new', { room, post, username });
    });
  });
});

// Comment create
router.post('/', auth.requireLogin, (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    checkError(err);
    Post.findById(req.params.postId, (err, post) => {
      checkError(err);
      const comment = new Comment(req.body);
      console.log(comment);
      post.comments.push(comment);

      post.save(() => {
        checkError(err);

        comment.save(() => {
          checkError(err);
          return res.redirect(`/rooms/${room._id}`);
        });
      });
    });
  });
});

// Comment edit
router.get('/:id/edit', auth.requireLogin, (req, res) => {
  console.log(req.params);
  Room.findById(req.params.roomId, (err, room) => {
    checkError(err);
    console.log(room);
    Post.findById(req.params.postId, (err, post) => {
      checkError(err);
      console.log(post);
      Comment.findById(req.params.id, (err, comment) => {
        checkError(err);
        console.log(comment);
        res.render('comments/edit', { room, post, comment });
      });
    });
  });
});

// Comment delete
router.post('/:id/delete', auth.requireLogin, (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    Post.findById(req.params.postId, (err, post) => {
      Comment.findByIdAndRemove(req.params.id, (err, response) => {
        const index = post.comments.indexOf(req.params.id);
        post.comments.splice(index, 1);
        post.save(() => {
          checkError(err);
        });
        res.redirect(`/rooms/${room._id}`);
      });
    });
  });
});

// Comment update
router.post('/:id', auth.requireLogin, (req, res) => {
  Room.findById(req.params.roomId, (err, room) => {
    Comment.findByIdAndUpdate(req.params.id, req.body, (err) => {
      checkError(err);
      res.redirect(`/rooms/${room._id}`);
    });
  });
});

module.exports = router;
