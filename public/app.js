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
//=======================search submit click event==========================
//==========================================================================

$('#edit-profile').click(function() {
	console.log("Testing edit profile button")
	//calls function to show edit form
	getOldInfo();
})

//==========================================================================
//=======================search submit click event==========================
//==========================================================================

$('#delete-user').click(function() {
	console.log("Testing delete")
	//calls function to show edit form
	deleteUser();
})


//==========================================================================
//=======================Render sign in form================================
//==========================================================================

var showSignInForm = function() {
	$('#form-container').empty();
	$('#signin-button').hide();
	$('#signup-button').hide();
	$('#signup-form').remove();

	var template = Handlebars.compile($('#signin-form-template').html());

	$('#form-container').append( template );
	$('#form-container').show();

	$('#signin-submit').click(function() {
		console.log("testing submit");

		$('#signin-form-template').hide();

		signinSubmit();
	});

}


//==========================================================================
//=======================Render sign up form================================
//==========================================================================

var showSignUpForm = function() {
	$('#form-container').empty();
	$('#signup-button').hide();

	var template = Handlebars.compile($('#signup-form-template').html());

	$('#form-container').append( template );
	$('#form-container').show();

	$('#signup-submit').click(function() {
		console.log("testing submit");
		

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
			url: 'http://localhost:3000/users',
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
			url: 'http://localhost:3000/login',
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
	$('#username-container').html('Welcome, ' + data.username);
	$('#signup-button').hide();
	$('#signin-button').hide();
	$('#signin-form').remove();
	$('#signup-form').remove();
	$('#signout').show();
	$('#profile-link').show();
	$("#new-review").show();
	$("#new-review").click(function() {
		showReviewForm();
	});
}


//==========================================================================
//=======================AJAX post request for adding review================
//==========================================================================


var createReview = function() {
	$('#review-form-template').hide();
	var starsInput = parseInt($('#stars').val());
	var contentInput = $('#content').val();
	var userIdInput = Cookies.get("loggedinId");
	var eventIdInput = $(this).parent().parent().attr("data-id");
	var datetimeInput = $(this).parent().parent().attr("datetime");
	var artistInput = $(this).parent().parent().attr("artist");
	var venueNameInput = $(this).parent().parent().attr("venue-name");
	var venueCityInput = $(this).parent().parent().attr("venue-city");
	var venueRegionInput = $(this).parent().parent().attr("venue-region");
	var venueCountryInput = $(this).parent().parent().attr("venue-country");

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
			url: "http://localhost:3000/users/" + userIdInput + "/reviews",
			type: "POST",
			dataType: 'json',
			data: reviewData
		}).done(console.log("created review!"));
}

//==========================================================================
//===========================Create new review==============================
//==========================================================================


var showReviewForm = function() {
	// $('#form-container').show();
	$('#new-review').hide();

	var template = Handlebars.compile($('#review-form-template').html());

	$(this).parent().append( template );

	$('#review-submit').click(createReview);

};

var editReview = function() {
	event.preventDefault();
	$('#review-form-template').hide();
	var starsInput = parseInt($('#edit-stars').val());
	var contentInput = $('#edit-content').val();
	var reviewId = $(this).parent().parent().attr("data-id");
	var userId = $(this).parent().parent().attr("user-id");

	var reviewData = {
		stars: starsInput,
		content: contentInput
	};
	

		$.ajax({
			url: "http://localhost:3000/users/" + userId + "/reviews/" + reviewId,
			type: "PUT",
			dataType: 'json',
			data: reviewData
		}).done(console.log("edited review"));
};


var editReviewForm = function() {
	// event.stopPropagation();
	$('#form-container').show();
	var template = Handlebars.compile($('#edit-review-template').html());

	$(this).parent().append( template );

	$('#edit-review-submit').click(editReview);

};


//==========================================================================
//=======================AJAX get request for listing reviews===============
//==========================================================================

$.get('/reviews', function(data){


	for (i = 0; i < data.length; i++) {
		var reviewsContainer = $("#reviews-container")
		console.log(data.length);
		var source = $("#review-compile-template").html();
		var template = Handlebars.compile(source);
		var context = {stars: data[i]['stars'], username: data[i]['user_id'].username, content: data[i]['content'], _id: data[i]['_id'], user_id: data[i]['user_id']._id }
		var html = template(context);
		reviewsContainer.append(html);
	}

	var editReviews = $(".edit-review");
	for (var i = 0; i < editReviews.length; i ++) {
		$(editReviews[i]).click(editReviewForm);
	};
});


var checkCookies = function() {

	if (Cookies.get("loggedinId") !== null) {
		$.ajax({
			url: "/users/" + Cookies.get("loggedinId"),
			method: "GET",
			dataType: "json"
		}).done(loggedIn);
		
	}

}

checkCookies();




//==========================================================================
//=======================Katie's Work Space=================================
//==========================================================================

$("#home-button").click(function() {
	homeReset();
});

var homeReset = function() {
	$(".jumbotron").siblings().hide();
	$("#menu").show();
	$("#reviews-container").show();
	$("#username-container").show();
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
	console.log('show profile is working');
	$.get('/users/' + Cookies.get("loggedinId"), function(data){
			console.log(data);
			var source = $("#profile-compile-template").html();
			var template = Handlebars.compile(source);
			var context = {username: data.username, image: data.image, reviews: data.reviews };
			var html = template(context);
			$('body').append(html);


	});

};












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
		url: "http://localhost:3000/search",
		type: "POST",
		dataType: 'json',
		data: searchVals
	}).done( showSearchResults );

}

var showSearchResults = function(data) {
	console.log("testing show result function");
	console.log(data);

	$('#artist-container').show();
	$("#artist-name").remove();

	$('#artist-container').append("<li id='artist-name'></li>");
	$('#artist-name').html( data.name );

	$('#artist-name').click(function(){

		$.ajax({
			url: "http://api.bandsintown.com/artists/" + data.name + "/events?format=json&app_id=stannis&date=2009-01-01," + moment().format(),
			type: "GET",
			dataType: 'jsonp'
		}).done(loadConcerts);
		
	});
	
};

var loadConcerts = function(data) {
	var resultDiv = $("#concert-info");
	
	resultDiv.empty();
	resultDiv.show();

	var concertTemplate = Handlebars.compile($("#concert-template").html());
	if(data.length < 10) {
		$('#concert-info').empty();
		for (i = 0; i < data.length; i++) {
			resultDiv.append(concertTemplate(data[i]));
		}
	}

	else {
		$('#concert-info').empty();
		for (i = data.length - 1 ; i > data.length - 10; i--) {
			resultDiv.append(concertTemplate(data[i]));
		}
	}

	var createReview = $(".create-review")
	for (var i = 0; i < createReview.length; i++) {
		$(createReview[i]).click(showReviewForm);
	};
}

var getOldInfo = function() {
	var id = Cookies.get("loggedinId");

	$.ajax({
		url: "http://localhost:3000/users/" + id,
		method: "GET",
		dataType: 'json',
	}).done( updateForm );


}

var updateForm = function(data) {
	$('#edit-profile').hide();

	var template = Handlebars.compile($('#edit-user-template').html());

	$('#edit-container').append( template(data) );

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
		url: "http://localhost:3000/users/" + id,
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
		url: "http://localhost:3000/users/" + id,
		method: "DELETE",
		data: userToDelete,
	}).done( function() {
		console.log(id + " deleted");
	})

}










//==========================================================================
//==========================================================================
//==========================================================================







});