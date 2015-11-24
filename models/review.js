var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
  stars: Number,
  content: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  event_id: Number,
  datetime: Date,
  artist: String,
  venue: {
  	name: String,
  	city: String,
  	region: String,
  	country: String
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


var Review = mongoose.model('Review', reviewSchema);

module.exports = Review;