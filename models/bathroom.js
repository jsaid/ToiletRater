const mongoose = require('mongoose');
const config = require('../config/database');
var Schema = mongoose.Schema;

// User Schema
const BathroomSchema = mongoose.Schema({
  venue: {
    type: String,
    required: true
  },
  rating: {
    type: Number
  },
  reviews: [{
      type: Schema.ObjectId,
      ref: 'Review'
  }],
  lat: {
    type: Number
  },
  lng: {
    type: Number
  },
  handicap: {
    type: Boolean
  },
  towel: {
    type: Boolean
  },
  dryer: {
    type: Boolean
  },
  single: {
    type: Boolean
  },
  multiple: {
    type: Boolean
  },
  reviewLength: {
    type: Number
  }
  
});

const Bathroom = module.exports = mongoose.model('Bathroom', BathroomSchema);

module.exports.getBathroomById = function(id, callback){
  Bathroom.findById(id, callback);
}


module.exports.addBathroom = function(newBath, callback){
    newBath.save(callback);
}

