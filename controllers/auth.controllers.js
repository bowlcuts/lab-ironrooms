const User = require("../models/User.model");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const signupGetController =  (req, res, next) => {
    res.render('signup.hbs');
  };

  const signupPostController = (req, res, next) => {
    console.log(req.body);
    if(!req.body.email || !req.body.password || !req.body.fullName){
        res.render('signup', { errorMessage: 'sorry you forgot something' });
      return;
  }
  User.findOne({ email: req.body.email })
    .then(foundUser => {
      if(foundUser){
        res.render('signup', { errorMessage: 'user already exists' });
        return;
      }
      const salt = bcryptjs.genSaltSync(saltRounds)
      const myHashedPassword = bcryptjs.hashSync(req.body.password, salt);
  
      return User.create({
        email: req.body.email,
        password: myHashedPassword,
        fullName: req.body.fullName
      })
    })
  
    .then(createdUser => {
      res.redirect('/login')
    })
    .catch(err => {
      res.send(err);
    });
  };

  const loginGetController = (req, res, next) => {
    console.log(req.body)
    res.render('login.hbs');
  };

  const loginPostController = (req, res, next) => {
    console.log(req.body);

    const { email, password } = req.body

    if(!email || !password ){
        res.render('login.hbs', { errorMessage: 'Forgot email or password'});
        return;
    }

    User.findOne({ email })
        .then(foundUser => {
           

            if(!foundUser){
                // res.send('Sorry user does not exist');
                res.render('login.hbs', { errorMessage: 'Sorry user does not exist' });
                return;
            }

            const isValidPassword = bcryptjs.compareSync(password, foundUser.password)

            if(!isValidPassword){
                // res.send('Sorry wrong password');
                res.render('login.hbs', { errorMessage: 'Sorry wrong password'});
                return;
            }

            req.session.user = foundUser;

            res.redirect('/');

        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })

  };

  const profileGetController = (req, res, next) => {
    console.log(req.session);
    res.render('index.hbs', req.session.user);
}

  module.exports = {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    profileGetController
  };