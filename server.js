// ============================================
// Requirements
// ============================================
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// ============================================
// Middleware
// ============================================
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// ============================================
// DB
// ============================================
mongoose.connect('mongodb://localhost/is_it_lit');

// ============================================
// Models
// ============================================
var User = require('./models/user');
var Review = require('./models/review');
var Concert = require('./models/concert');

// LISTENER
app.listen(port);