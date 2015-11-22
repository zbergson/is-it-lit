// ============================================
// Requirements
// ============================================
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var bandsintown = require('bandsintown')("stannis");
var moment = require('moment');
var md5 = require('md5');
var cookieParser = require('cookie-parser');

// ============================================
// Middleware
// ============================================
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(cookieParser());

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

app.get('/', function(req, res) {

});

// app.get('/test', function(req, res) {
// 	bandsintown
//   		.getArtist('Drake')
//   		.then(function(events) {
//   			console.log(moment().format());
//    			res.send(events);
//   	});
// });

app.post('/users', function(req, res) {

  password_hash = md5(req.body.password);

  var user = new User({
  	email: req.body.email,
    username: req.body.username,
    password_hash: password_hash,
    image: req.body.image
  });

  user.save(function(err) {
    if (err){
      console.log(err);
      res.statusCode = 503;
    }else{

      console.log(user.username + ' created!');

      res.cookie("loggedinId", user.id);

      res.send({
        id: user.id,
        username: user.username,
        created_at : user.created_at
      });
    }
  });
})