var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  stars: Number,
  content: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;