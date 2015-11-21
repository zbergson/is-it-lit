var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  password_hash: String,
  username: String,
  email: String,
  concerts: Array,
  reviews: Array,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});


var User = mongoose.model('User', userSchema);

module.exports = User;