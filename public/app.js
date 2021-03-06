$(function() {


//==========================================================================
//======================start sign up process================================
//==========================================================================

$('#signup-button').click(function() {
	console.log("testing signup button");

	showSignUpForm();

});

//==========================================================================
//=======================start sign in process==============================
//==========================================================================

$('#signin-button').click(function(){

	console.log('testing sign in button');
	showSignInForm();

});

//==========================================================================
//=======================go to profile page=================================
//==========================================================================

$('#profile-link').click(function(){
	console.log('test profile link');
	showProfilePage();
});

//==========================================================================
//=======================logout=============================================
//==========================================================================


$('#signout').click(function(){
	Cookies.remove('loggedinId');
	location.reload();
});

//==========================================================================
//=======================search submit click event==========================
//==========================================================================

$('#search-submit').click(function() {
	console.log("Testing search submit")
	$('#artist-name').empty();
	searchSubmit();
});

//==========================================================================
//=======================edit profile click event===========================
//==========================================================================

$(document).on("click", "#edit-profile", function() {
	console.log("Testing edit profile button")
	//calls function to show edit form
	getOldInfo();
});

//==========================================================================
//=======================delete user click event============================
//==========================================================================

$(document).on("click", "#delete-user", function() {
	console.log("Testing delete");
	if (confirm("Are you sure?")) {
		deleteUser();
	}
})


//==========================================================================
//=======================Render sign in form================================
//==========================================================================

var showSignInForm = function() {
	$("#signinModal").show();
	$('#form-container').empty();
	$('#signin-button').hide();
	$('#signup-button').hide();
	$('#signup-form').remove();

	var template = Handlebars.compile($('#signin-form-template').html());

	$('#signin-container').append( template );

	$(".close-signin").click(function() {
		$("#signin-form").remove();
		$("#signinModal").hide();
	});

	$('#signin-submit').click(function() {
		console.log("testing submit");
		$("#signinModal").hide();

		$('#signin-form-template').hide();

		signinSubmit();
	});

}


//==========================================================================
//=======================Render sign up form================================
//==========================================================================

var showSignUpForm = function() {
	$("#signupModal").show();
	$('#signup-container').empty();
	$('#signup-button').hide();

	var template = Handlebars.compile($('#signup-form-template').html());

	$('#signup-container').append( template );

	$(".close-signup").click(function() {
		$("#signup-form").remove();
		$("#signupModal").hide();
	})

	$('#signup-submit').click(function() {
		console.log("testing submit");
		
		$("#signupModal").hide();

		$('#signup-form-template').hide();


		signupSubmit();
	});

};

//==========================================================================
//=======================AJAX post request for sign up======================
//==========================================================================

	var signupSubmit = function() {

		var emailInput = $("input[id='email']").val()

	  var usernameInput = $("input[id='username']").val()

	  var passwordInput = $("input[id='password']").val()

	  var imageInput = $("input[id='profilePicture']").val()

	  var user = {
	    email: emailInput,
	    username: usernameInput,
	    password: passwordInput,
	    image: imageInput
	  };
	  event.preventDefault();

	  $.ajax({
			url: '/users',
			method: 'POST',
			dataType: 'json',
			data: user
		}).done(loggedIn);

	};

//==========================================================================
//=======================AJAX post request for sign in======================
//==========================================================================

var signinSubmit = function() {
		var emailInput = $('#email').val();
		var passwordInput = $('#password').val();
		console.log('here at signinsubmit');
		event.preventDefault();

		var userLogin = {
			email: emailInput,
			password: passwordInput
		};

    $.ajax({
			url: '/login',
			type: 'POST',
			dataType: 'json',
			data: userLogin
		}).done(loggedIn).fail(function(){
			alert('wrong password or email!');
		});
};

//==========================================================================
//=======================Render logged in page==============================
//==========================================================================

var loggedIn = function(data) {
	$("#signin-form").remove();
	$("#signup-form").remove();
	homeReset();
	$('#username-container').empty();
	$('#username-container').append('<h1 id="welcome-username">Welcome, ' + data.username + "!</h1>");
	$('#signup-button').hide();
	$('#signin-button').hide();
	$('#signin-form').remove();
	$('#signup-form').remove();
	$('#signout').show();
	$('#profile-link').show();
	$("#search-results-container").show();
	$("#new-review").show();
	$("#new-review").click(function() {
		showReviewForm();
	});
}


//==========================================================================
//=======================AJAX post request for adding review================
//==========================================================================


var createReview = function() {
	var starsInput = parseInt($('#stars').attr("value"));
	var contentInput = $('#content').val();
	var userIdInput = Cookies.get("loggedinId");
	var eventIdInput = $("#createReviewModal").attr("data-id");
	var datetimeInput = $("#createReviewModal").attr("datetime");
	var artistInput = $("#createReviewModal").attr("artist");
	var venueNameInput = $("#createReviewModal").attr("venue-name");
	var venueCityInput = $("#createReviewModal").attr("venue-city");
	var venueRegionInput = $("#createReviewModal").attr("venue-region");
	var venueCountryInput = $("#createReviewModal").attr("venue-country");

	console.log(eventIdInput, datetimeInput, artistInput, venueNameInput, venueCityInput, venueRegionInput, venueCountryInput);
	event.preventDefault();

	var reviewData = {
		stars: starsInput,
		content: contentInput,
		user_id: userIdInput,
		event_id: eventIdInput,
		datetime: datetimeInput,
		artist: artistInput,
		venueName: venueNameInput,
		venueCity: venueCityInput,
		venueRegion: venueRegionInput,
		venueCountry: venueCountryInput
	};
		$.ajax({
			url: "/users/" + userIdInput + "/reviews",
			type: "POST",
			dataType: 'json',
			data: reviewData
		}).done(function() {
			homeReset();
			$("#artist-content").remove();
			$("#review-form").remove();
			$("#createReviewModal").hide();
			$('#review-form-template').hide();
			console.log(reviewData, "created review!");
			$('#search-results-container').empty();
			$('#reviews-container').empty();
		});
}

//==========================================================================
//===========================Create new review==============================
//==========================================================================


var showReviewForm = function() {
	// $('#form-container').show();
	$('#new-review').hide();
	$("#createReviewModal").show();
	$(".close-create-review").click(function() {
		$("#review-form").remove();
		$("#createReviewModal").hide();
	})

	$("#createReviewModal").attr({
	  "data-id": $(this).parent().attr("data-id"),
	  "datetime": $(this).parent().attr("datetime"),
	  "artist": $(this).parent().attr("artist"),
	  "venue-name": $(this).parent().attr("venue-name"),
	  "venue-city": $(this).parent().attr("venue-city"),
	  "venue-region": $(this).parent().attr("venue-region"),
	  "venue-country": $(this).parent().attr("venue-country"),
	});

	var template = Handlebars.compile($('#review-form-template').html());

	$("#create-review-container").append( template );

	$(".1").click(function() {
		$("#stars").attr("value", "1");
		$(".1").html("★");
		$(".2").html("☆");
		$(".3").html("☆");
		$(".4").html("☆");
		$(".5").html("☆");
	});

	$(".2").click(function() {
		$("#stars").attr("value", "2");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("☆");
		$(".4").html("☆");
		$(".5").html("☆");
	});

	$(".3").click(function() {
		$("#stars").attr("value", "3");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("☆");
		$(".5").html("☆");
	});

	$(".4").click(function() {
		$("#stars").attr("value", "4");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("★");
		$(".5").html("☆");
	});

	$(".5").click(function() {
		$("#stars").attr("value", "5");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("★");
		$(".5").html("★");
	});
	

	$('#review-submit').click(createReview);

};


//==========================================================================
//==============================Edit review=================================
//==========================================================================

var getReviewInfo = function() {
	console.log("getting info");
	var userId = $(this).parent().attr("user-id");
	var reviewId = $(this).parent().attr("data-id");

	$.ajax({
		url: "/reviews/" + reviewId,
		type: "GET",
		dataType: "json"
	}).done(editReviewForm);
};

var editReview = function() {
	event.preventDefault();
	$('#review-form-template').hide();
	var starsInput = parseInt($('#edit-stars').attr("value"));
	var contentInput = $('#edit-content').val();
	var reviewId = $(this).parent().attr("data-id");
	var userId = $(this).parent().attr("user-id");

	var reviewData = {
		stars: starsInput,
		content: contentInput
	};
	

		$.ajax({
			url: "/users/" + userId + "/reviews/" + reviewId,
			type: "PUT",
			dataType: 'json',
			data: reviewData
		}).done(function() {
			$("#edit-review").remove();
			$("#editReviewModal").hide();
			$('#edit-review-template').hide();
			console.log("edited review!");
			$('#reviews-container').empty();

			if ($('body').hasClass('background-img')) {
				showProfilePage();
			}
			else {
				getAllReviews();
			}
		});
};


var editReviewForm = function(data) {
	console.log('hi');
	$("#editReviewModal").show();
	$(".close-edit-review").click(function() {
		$("#edit-review").remove();
		$("#editReviewModal").hide();
	});
	var source = $("#edit-review-template").html();
	var template = Handlebars.compile(source);
	var context = {stars: data['stars'], content: data['content'], _id: data['_id'], user_id: data['user_id']};
	var html = template(context);

	$('#form-container').show();

	// var template = Handlebars.compile($('#edit-review-template').html());
	$("#edit-review-container").empty();
	$("#edit-review-container").append( html );


	if (data['stars'] == 1) {
		$(".1").html("★");
	};

	if (data['stars'] == 2) {
		$(".1").html("★");
		$(".2").html("★");
	};

	if (data['stars'] == 3) {
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
	};

	if (data['stars'] == 4) {
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("★");
	};

	if (data['stars'] == 5) {
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("★");
		$(".5").html("★");
	};
	
	$("#edit-stars").attr("value", data['stars'])

	$(".1").click(function() {
		$("#edit-stars").attr("value", "1");
		$(".1").html("★");
		$(".2").html("☆");
		$(".3").html("☆");
		$(".4").html("☆");
		$(".5").html("☆");
	});

	$(".2").click(function() {
		$("#edit-stars").attr("value", "2");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("☆");
		$(".4").html("☆");
		$(".5").html("☆");
	});

	$(".3").click(function() {
		$("#edit-stars").attr("value", "3");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("☆");
		$(".5").html("☆");
	});

	$(".4").click(function() {
		$("#edit-stars").attr("value", "4");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("★");
		$(".5").html("☆");
	});

	$(".5").click(function() {
		$("#edit-stars").attr("value", "5");
		$(".1").html("★");
		$(".2").html("★");
		$(".3").html("★");
		$(".4").html("★");
		$(".5").html("★");
	});
	$('#edit-review-submit').click(editReview);

};


//==========================================================================
//=======================AJAX get request for listing reviews===============
//==========================================================================

var getAllReviews = function() {
	$(".ten-reviews").remove();
	$.get('/reviews', function(data){


		for (i = 0; i < data.length; i++) {
			var reviewsContainer = $("#reviews-container")
			var source = $("#review-compile-template").html();
			var template = Handlebars.compile(source);
			var stars = "";
			for (var j = 0; j < data[i]['stars']; j++) {
				stars = stars + "★";
			};
			if (stars.length == 5) {
				stars = stars + "🔥";
			};
			if (stars.length == 1 || stars.length == 0) {
				while (stars.length < 5) {
					for (var k = 0; k <= 5 - stars.length; k++) {
						stars = stars + "☆";
					}
				};
				stars = stars + "💩";
			};
			while (stars.length < 5) {
				for (var k = 0; k <= 5 - stars.length; k++) {
					stars = stars + "☆";
				}
			};
			var context = {stars: stars, 
										 username: data[i]['user_id'].username, 
										 content: data[i]['content'], 
										 _id: data[i]['_id'], 
										 user_id: data[i]['user_id']._id, 
										 artist: data[i]['artist'],
										 venue: data[i]['venue'],
										 datetime: moment(data[i]['datetime']).format('l')};
			var html = template(context);
			reviewsContainer.append(html);
		}

		var editReviews = $(".edit-review");
		for (var i = 0; i < editReviews.length; i++) {
			$(editReviews[i]).click(getReviewInfo);
		};
		var deleteReviews = $(".delete-review");
		for (var i = 0; i < deleteReviews.length; i++) {
			$(deleteReviews[i]).click(deleteReview);
		};

		var tenReviews = $(".ten-reviews");
		for (var i = 0; i < tenReviews.length; i++) {
			if ($(tenReviews[i]).attr("user-id")!= Cookies.get("loggedinId")) {
				$(tenReviews[i]).children(".edit-review").hide();
				$(tenReviews[i]).children(".delete-review").hide();
			};
		};
	});
};




var checkCookies = function() {

	if (Cookies.get("loggedinId") != null) {
		$.ajax({
			url: "/users/" + Cookies.get("loggedinId"),
			method: "GET",
			dataType: "json"
		}).done(loggedIn);
		
	} else {
		$("#profile-container").hide();
		$("#edit-profile").hide();
		$("#artist-container").hide();
		getAllReviews();
	};

}

checkCookies();




//==========================================================================
//=======================Katie's Work Space=================================
//==========================================================================

$("#home-button").click(function() {
	homeReset();
});

//==========================================================================
//===========================home reset function============================
//==========================================================================

var homeReset = function() {
	$(".ten-reviews").remove();
	$("#artist-content").remove();
	$("#search-bar").val("");
	$('#username-container').show();
	$("#artist-container").hide();
	$("body").removeClass("background-img");
	getAllReviews();
	$("#search-results-container").show();
	$(".jumbotron").show();
	$(".jumbotron").siblings().hide();
	$("#menu").show();
	$(".reviews-wrapper").show();
	$(".user-container").show();
};















//==========================================================================
//==========================================================================
//==========================================================================





//==========================================================================
//=======================Zach's Work Space==================================
//==========================================================================

//==========================================================================
//=======================Render profile page================================
//==========================================================================

var showProfilePage = function() {
	$(".profile-view").remove();
	$('#edit-user-form').remove();
	console.log('show profile is working');
	$.get('/users/' + Cookies.get("loggedinId"), function(data){
			console.log(data);
			var source = $("#profile-compile-template").html();
			var template = Handlebars.compile(source);
			data.reviews.forEach(function(n) {
				n.datetime = moment(n.datetime).format('l');
				var stars = "";
				for (var j = 0; j < n['stars']; j++) {
					stars = stars + "★";
				};
				if (stars.length == 5) {
					stars = stars + "🔥";
				};
				if (stars.length == 1 || stars.length == 0) {
					while (stars.length < 5) {
						for (var k = 0; k <= 5 - stars.length; k++) {
							stars = stars + "☆";
						}
					};
					stars = stars + "💩";
				};
				while (stars.length < 5) {
					for (var k = 0; k <= 5 - stars.length; k++) {
						stars = stars + "☆";
					}
				};
				n.stars = stars;
			});
			var context = {username: data.username, image: data.image, reviews: data.reviews};
			var html = template(context);
			$('#profile-container').prepend(html);
			$('#profile-container').show();
			$('#profile-container').siblings().hide();
			$("#edit-profile").show();
			$("#delete-user").show();
			$("#menu").show();
			$(".edit-review-profile").click(getReviewInfo)

	});
	$("body").addClass("background-img");
};

var deleteReview = function() {
	var reviewId = $(this).parent('.ten-reviews').attr('data-id');
	
		$.ajax({
			url: "/users/" + Cookies.get("loggedinId")  + "/reviews/" + reviewId,
			type: "DELETE",
			dataType: 'json',
		}).done(function() {
			$('#reviews-container').empty();
			getAllReviews();
		});
}










//==========================================================================
//==========================================================================
//==========================================================================







//==========================================================================
//=======================Robbies's Work Space===============================
//==========================================================================

var searchSubmit = function() {
	$('#venue-info').empty();
	console.log("testing searchSubmit function");
	event.preventDefault();

	var searchInput = $('#search-bar').val();

	var searchVals = {
		artist: searchInput
	}

	$.ajax({
		url: "/search",
		type: "POST",
		dataType: 'json',
		data: searchVals
	}).done( showSearchResults );

}

var showSearchResults = function(data) {
	console.log("testing show result function");
	console.log(data);
	$(".concert-template").remove();
	$("#concert-info").empty();
	$("#search-results-container").show();
	$(".ten-reviews").remove();
	$(".jumbotron").hide();
	$('#username-container').hide();
	$('#artist-container').show();

	var source = $("#artist-template").html();
	var template = Handlebars.compile(source);
	
	var context = {name: data.name, image_url: data.image_url};
	var artist = template(context);
	$('#artist-container').prepend(artist);
	$("#artist-name").html(data.name);

	// $("#artist-container").append("<img class='artist-img' src='" + data.image_url + "'>");

	// $('#artist-name').click()

	// function(){

		$.ajax({
			url: "https://api.bandsintown.com/artists/" + data.name + "/events?format=json&app_id=stannis&date=2009-01-01," + moment().format(),
			type: "GET",
			dataType: 'jsonp'
		}).done(loadConcerts);
		
	// };
	$("body").addClass("background-img");
};

// var showArtistPage = function(data) {
// 	$("#artist-container").append()
// };

var loadConcerts = function(data) {
	var resultDiv = $("#concerts-container");
	
	resultDiv.show();

	var concertTemplate = Handlebars.compile($("#concert-template").html());
	if(data.length < 10) {
		$('#concerts-container').empty();
		for (i = 0; i < data.length; i++) {
			data[i].datetime = moment(data[i].datetime).format('l');
			resultDiv.append(concertTemplate(data[i]));
		}
	}

	else {
		$('#concerts-container').empty();
		for (i = data.length - 1 ; i > data.length - 20; i--) {
			data[i].datetime = moment(data[i].datetime).format('l');
			resultDiv.append(concertTemplate(data[i]));
		}


	}

	var createReview = $(".create-review")
	for (var i = 0; i < createReview.length; i++) {
		$(createReview[i]).click(showReviewForm);
	};

	if (Cookies.get("loggedinId") == null) {
		createReview.hide();
	}
}

var getOldInfo = function() {
	var id = Cookies.get("loggedinId");

	$.ajax({
		url: "/users/" + id,
		method: "GET",
		dataType: 'json',
	}).done( updateForm );


}

var updateForm = function(data) {
	// $('#edit-profile').hide();
	$("#editUserModal").show();
	$(".close-edit-user").click(function() {
		$("#edit-user-form").remove();
		$("#editUserModal").hide();
	})

	var template = Handlebars.compile($('#edit-user-template').html());

	$('#edit-user-container').append( template(data) );

	$('#edit-user-submit').click(function() {
		console.log("testing edit-user-submit");
		$('#edit-container').hide();
		editUser();
	});

}

var editUser = function(data) {

	var id = Cookies.get("loggedinId");
	console.log(id);

	var editedPasswordHash = $("input[id='edited-password']").val()
	var editedUsername = $("input[id='edited-username']").val()
	var editedEmail = $("input[id='edited-email']").val()
	var editedImage = $("input[id='edited-profilePicture']").val()

	var editedUser = {
		id: id,
		edited_password_hash: editedPasswordHash,
	  edited_username: editedUsername,
	  edited_email: editedEmail,
	  edited_image: editedImage
	}

	console.log(editedUser);

	$.ajax({
		url: "/users/" + id,
		method: "PUT",
		data: editedUser,
	}).done( showProfilePage );
}

var deleteUser = function() {

	var id = Cookies.get("loggedinId");
	console.log(id);

	var userToDelete = {
		id: id
	}

	$.ajax({
		url: "/users/" + id,
		method: "DELETE",
		data: userToDelete,
	}).done( function(){
		Cookies.remove('loggedinId');
		location.reload()
	});

}










//==========================================================================
//==========================================================================
//==========================================================================







});