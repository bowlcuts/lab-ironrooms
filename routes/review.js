var express = require('express');
var router = express.Router();

const Review = require('../models/review.model');

const { isLoggedIn, isNotOwner  }= require('../middleware/auth.middlewares');

const Rooms = require('../models/room.model');

router.get('/:id/add-reviews', isLoggedIn, isNotOwner,  (req, res, next) => {
    res.render('add-review.hbs', {_id: req.params.id})
});

router.post('/:id/add-reviews', isLoggedIn, isNotOwner, (req, res, next) => {
    Review.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        Rooms.findByIdAndUpdate(
            req.params.id,
            {$addToSet: { reviews: newReview }},
            {new: true} 
            )
            .then((updatedRoom) => {
                console.log('WTIH NEW REVIEW', updatedRoom)
                res.redirect('/rooms')
            })
            .catch((err) => {
                console.log(err)
            })
    })
    .catch((err) => console.log(err));
});


module.exports = router;