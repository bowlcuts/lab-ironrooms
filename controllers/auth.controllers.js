const User = require("../models/User.model");
const Rooms = require('../models/room.model.js');
const bcryptjs = require('bcryptjs');
const { router } = require("../app");
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

const rooms = (req, res, next) => {
    Rooms.find()
    .populate({path: 'owner'})
    .populate({
        path: 'reviews',
        populate: {
        path: 'user'
    }
    })
    .then((roomsArray) => {
        console.log(roomsArray)
        res.render('rooms.hbs', { roomsArray })
    })
    .catch(err => console.log(err));
};


const roomsCreateGet = (req, res, next) => {
    res.render('create-rooms.hbs')
};

const roomsCreatePost = (req, res, next) => {
    Rooms.create({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        owner: req.session.user,
        reviews: req.body.reviews
      })   
    .then((createdRoom) => {
      
      res.redirect('/rooms');
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
};

const roomsDeletePost = (req, res, next) => {
    console.log('id of room', req.params.id)
    Rooms.findById(req.params.id)
    .then((foundRoom) => {
        foundRoom.delete()
        console.log('room was deleted', foundRoom);
        res.redirect('/rooms');
    })
    .catch(err => console.log('error while deleting: ', err));

}

const roomsEditGet = (req, res, next) => {
    Rooms.findById(req.params.id)
    .then((foundRoom) => {
        res.render('edit-room.hbs', foundRoom)
    })
    .catch((err) => {
        console.log(err)
    });
};

const roomsEditPost = (req, res, next) => {
    Rooms.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl
    },
    {new: true}
    )
    .then((updatedRoom) => {
        console.log("Changed room:", updatedRoom)
        res.redirect('/rooms')
    })
    .catch((err) => console.log(err))
}

  module.exports = {
    signupGetController,
    signupPostController,
    loginGetController,
    loginPostController,
    profileGetController,
    rooms,
    roomsCreateGet,
    roomsCreatePost,
    roomsDeletePost,
    roomsEditGet,
    roomsEditPost
  };