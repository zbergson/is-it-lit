var mongoose = require('mongoose');

var concertSchema = new mongoose.Schema({
  reviews: Array,
  event_id: Number,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


var Concert = mongoose.model('Concert', concertSchema);

module.exports = Concert;