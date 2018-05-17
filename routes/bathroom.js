const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Bathroom = require('../models/bathroom');

const requireAuth = passport.authenticate('jwt', {session: false});



// Create Bathroom 
router.post("/bathroom/create", requireAuth, (req, res, next) => {
    let newBath = new Bathroom({
        venue: req.body.venue,
        rating: 0,
        lat: req.body.lat,
        lng: req.body.lng
    });
    Bathroom.addBathroom(newBath, function (err) {
        if(err) {
            res.json({success: false, msg:'Failed to add bathroom'});
        } else {
            res.json({success: true, msg:'Bathroom created'});
        };
    })
})

// router.get("/bathroom", requireAuth, (req, res, next) => {
        
//     })

module.exports = router;