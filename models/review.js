const mongoose = require('mongoose');
const config = require('../config/database');
var Schema = mongoose.Schema;

// Review Schema
const ReviewSchema = mongoose.Schema({
  user: {
    type: Schema.ObjectId,
    ref: "User"
  },
  username: {
    type: String
  },
  name: {
    type: String
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
},
{
    timestamps: true
});

const Review = module.exports = mongoose.model('Review', ReviewSchema);

module.exports.getReviewById = function(id, callback){
  Review.findById(id, callback);
}


module.exports.addReview = function(newRev, callback){
    newRev.save(callback);
}

