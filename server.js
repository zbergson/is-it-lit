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

// ============================================
// Get ten most recent reviews
// ============================================

app.get('/reviews', function(req, res) {
  Review.find({}).populate('user_id').sort({ created_at : -1 }).exec(function(err, reviews) {
      res.send(reviews);
  });
});


// app.get('/test', function(req, res) {
// 	bandsintown
//   		.getArtist('Drake')
//   		.then(function(events) {
//   			console.log(moment().format());
//    			res.send(events);
//   	});
// });

// ============================================
// Add new user
// ============================================

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

// ============================================
// Login
// ============================================

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

// ============================================
// Add review
// ============================================

app.post('/users/:id/reviews', function(req, res) {
	var review = new Review ({
		stars: req.body.stars,
		content: req.body.content,
		user_id: req.body.user_id,
    event_id: req.body.event_id,
    datetime: req.body.datetime,
    artist: req.body.artist,
    venue: {
      name: req.body.venueName,
      city: req.body.venueCity,
      region: req.body.venueRegion,
      country: req.body.venueCountry
    }
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
			User.findById(req.params.id).exec(function(err, user) {
				user.reviews.push(review);
				user.save();
			});
		};
	});

});

app.get('/users/:id', function(req, res) {
  User.findById(req.params.id).exec(function(err, user) {
    if (err) {
      console.log(err);
      res.statusCode = 503;
    } else {
      
      res.send({
        id: user.id,
        email: user.email,
        password: user.password_hash,
        username: user.username,
        reviews: user.reviews,
        image: user.image
      })
    };
  });
});



// ============================================
// Search route
// ============================================

app.post('/search', function(req, res) {

  var searchText = {
    artist: req.body.artist
  }

  bandsintown
    .getArtist(searchText.artist)
    .then(function(artists) {
      console.log(artists);
      res.send(artists);
    });
});

// ============================================
// Edit user
// ============================================

app.put('/users/:id', function(req, res) {

  password_hash = md5(req.body.edited_password_hash);

  var userEdit = {
    email: req.body.edited_email,
    username: req.body.edited_username,
    password_hash: password_hash,
    image: req.body.edited_image
  }

  User.findOneAndUpdate( {_id: req.params.id}, userEdit, function(err, user) {
    console.log(req.params.id);
    console.log(req.body);
    console.log( user );
    res.send( user );
  });
})


// ============================================
// Edit review
// ============================================

app.get('/reviews/:review_id', function(req, res) {
  Review.findById(req.params.review_id).then(function(result) {
    res.send(result);
  });
});


app.put('/users/:id/reviews/:review_id', function(req, res) {

        Review.findOneAndUpdate({_id: req.params.review_id}, req.body, function(err, review) {

            if (err) {

                console.log(err);

            }
        });

          Review.findById(req.params.review_id, function(err, review) {
              console.log(review);
              User.findById(req.params.id).then(function(user) {

                user.reviews.forEach(function(user_review) {


                  if (user_review._id == req.params.review_id) {
                      
                      var index = user.reviews.indexOf(user_review);
                      user.reviews.splice(index, 1);

                      user.reviews.push(review);

                      user.save();

                      res.send(user);
                      

                  }

                });

              });

          });

});


// ============================================
// Delete review
// ============================================
app.delete('/users/:id/reviews/:review_id', function(req, res) {

        Review.findById(req.params.review_id).remove(function(review, err) {

            if (err) {

                console.log(err);

            }


        });

        User.findById(req.params.id).then(function(user) {

            user.reviews.forEach(function(review) {
                console.log(review._id);
                if (review._id == req.params.review_id) {

                    var index = user.reviews.indexOf(review);
                    user.reviews.splice(index, 1);
                    user.save();

                    res.send(user);

                }


            });

        });

    });


// ============================================
// Delete user
// ============================================

app.delete('/users/:id', function(req, res) {
  User.findOneAndRemove({_id: req.params.id}, function(err) {
    //maybe some kind of alert that says "are you sure?"
    res.send("...");
  })
})

