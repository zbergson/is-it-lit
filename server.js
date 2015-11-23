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
});

app.post("/login", function(req, res) {
    var requestEmail = req.body.email;
    var requestPassword = req.body.password;
    User.findOne({"email": requestEmail}).exec(function(err, user) {
        var requestPasswordHash = md5(requestPassword);
        if (user != null && requestPasswordHash == user.password_hash) {
            res.cookie("loggedinId", user.id);
            res.send({
              id: user.id,
              username: user.username,
            });
        } else {
            res.status(400);
            res.send("didn't work :(");
        }
    })
});

app.post('/users/:id/reviews', function(req, res) {
	var review = new Review ({
		stars: req.body.stars,
		content: req.body.content,
		user_id: req.body.user_id
	});

	review.save(function(err) {
		if (err) {
			console.log(err);
			res.statusCode = 503;
		} else {
			console.log("created review");
			res.send({
				stars: review.stars,
				content: review.content
			});
			User.findOne(req.params.id).exec(function(err, user) {
				user.reviews.push(review);
				user.save();
			});
		};
	});

});

app.get('/users/:id', function(req, res) {
  User.findOne(req.params.id).exec(function(err, user) {
    if (err) {
      console.log(err);
      res.statusCode = 503;
    } else {
      res.send({
        id: user.id,
        username: user.username,
        reviews: user.reviews
      })
    };
  });
  
});







