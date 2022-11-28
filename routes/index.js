var express = require('express');
var router = express.Router();

const { signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  rooms,
  roomsCreateGet,
  roomsCreatePost,
  roomsDeletePost,
  roomsEditGet,
  roomsEditPost
} = require('../controllers/auth.controllers');

const {isLoggedIn, isAnon, isPublic, isOwner} = require('../middleware/auth.middlewares');

/* GET home page. */
router.get('/', isPublic, function(req, res, next) {
  res.render('index');
});

router.get('/signup', isAnon, signupGetController);

router.post('/signup', isAnon, signupPostController);

router.get('/login', isAnon, loginGetController);

router.post('/login', isAnon, loginPostController);

router.get('/rooms', isLoggedIn, rooms);

router.get('/create-rooms', isLoggedIn, roomsCreateGet);

router.post('/create-rooms', isLoggedIn, roomsCreatePost);

router.post('/rooms/:id/delete', isOwner, roomsDeletePost);

router.get('/rooms/:id/edit-room', isOwner, roomsEditGet);

router.post('/rooms/:id/edit-room', isOwner, roomsEditPost);

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.session.destroy(() => {
      res.redirect('/')
  });
})


module.exports = router;
