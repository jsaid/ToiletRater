const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/users');
const Bathroom = require('../models/bathroom');
const Review = require('../models/review');

const requireAuth = passport.authenticate('jwt', {session: false});


// register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err) {
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'User registered'});
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: "User not found"});
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                const token = jwt.sign({data:user}, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success:true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong password'});
            }
        });
    })
});

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

/// 



// Create Bathroom 
router.post("/create", requireAuth, (req, res, next) => {
    let newBath = new Bathroom({
        venue: req.body.venue,
        rating: 0,
        lat: req.body.lat,
        lng: req.body.lng,
        handicap: req.body.handicap,
        towel: req.body.towel,
        dryer: req.body.dryer,
        single: req.body.single,
        multiple: req.body.multiple,
        reviewLength: 0
    });
    Bathroom.addBathroom(newBath, function (err) {
        if(err) {
            res.json({success: false, msg:'Failed to add bathroom'});
        } else {
            res.json({success: true, msg:'Bathroom created'});
        };
    })
})

router.delete('/deleteBath/:id', requireAuth, (req, res, next)=>{
    Bathroom.remove({_id: req.params.id}, function(err) {
        if(err) 
        {
            res.json({success: false, msg:'Failed to delete bathroom'});
        }
        else {
            res.json({success: true, msg:'Bathroom deleted'});
        }
    });
});



router.post('/reviews', requireAuth, (req, res, next) => {
    let newReview = new Review({
        rating: req.body.rating,
        description: req.body.description
    });
    Review.addReview(newReview, function (err) {
        if(err) {
            res.json({success: false, msg:'Failed to add bathroom'});
        } else {
            res.json({success: true, msg:'Review created'});
        };
    });
})

router.post('/addReview/:id/', (req, res, next) => {
    let newReview = new Review({
        user: req.body.user,
        name: req.body.name,
        username: req.body.username,
        rating: req.body.rating,
        description: req.body.description
    });
    Review.addReview(newReview, function (err) {
        if(err) {
            res.json({success: false, msg:'Failed to add bathroom'});
        } else {
            res.json({success: true, msg:'Review created'});
            
            Bathroom.findByIdAndUpdate(req.params.id, {$push: {"reviews": newReview}}, {new: true}, function(err, model) {
            });
            Bathroom.findByIdAndUpdate(req.params.id, {$inc: {"rating": newReview.rating}}, {new: true}, function(err, model) {

            });
            Bathroom.findByIdAndUpdate(req.params.id, {$inc: {"reviewLength": 1}}, {new: true}, function(err, model) {
                
            });
        };
    });
})

// get bathrooms
router.get('/bathrooms', requireAuth, (req, res, next)=>{
    Bathroom.find(function(err, bathrooms){
        res.json(bathrooms);
    })
});


// // get a bathroom
router.get('/bathrooms/:id', requireAuth, (req, res, next)=>{
    Bathroom.findById(req.params.id, function (err, bathrooms) {
        res.json(bathrooms);
    } );

});


// get a review from a bathroom
router.get('/bathrooms/:bid/reviews/', requireAuth, (req, res, next) => {
    Bathroom.findOne({ _id:req.params.bid }).populate('reviews').exec(function (err, review){
        if (err) {
            res.json({success: false, msg: 'Failed'});
        }
        else {
            res.json(review);
        }
    });
});


module.exports = router;