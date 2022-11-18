var express = require('express');
var router = express.Router();

const { signupGetController,
  signupPostController,
  loginGetController,
  loginPostController,
  profileGetController
} = require('../controllers/auth.controllers');

const {isLoggedIn, isAnon} = require('../middleware/auth.middlewares');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', isAnon, signupGetController);

router.post('/signup', isAnon, signupPostController);

router.get('/login', isAnon, loginGetController);

router.post('/login', isAnon, loginPostController);

router.get('/', isLoggedIn, profileGetController); 

router.get('/logout', (req, res, next) => {
  req.session.destroy(() => {
      res.redirect('/')
  });
})

module.exports = router;
