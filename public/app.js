$(function() {
	event.stopPropagation();

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
	$('#artist-name').remove();
	$('#venue-info').empty();
	event.stopPropagation();
	searchSubmit();
});




//==========================================================================
//=======================Render sign in form================================
//==========================================================================

var showSignInForm = function() {

	$('#signin-button').hide();
	$('#signup-button').hide();
	$('#signup-form').remove();

	var template = Handlebars.compile($('#signin-form-template').html());

	$('#form-container').append( template );

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

	$('#signup-button').hide();

	var template = Handlebars.compile($('#signup-form-template').html());

	$('#form-container').append( template );

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
	$("#new-review").show();
	$("#new-review").click(function() {
		showReviewForm();
	});
}


//==========================================================================
//===========================Create new review==============================
//==========================================================================


var showReviewForm = function() {

	$('#new-review').hide();

	var template = Handlebars.compile($('#review-form-template').html());

	$('#form-container').append( template );

	$('#review-submit').click(function() {
		console.log("testing submit");
		

		$('#review-form-template').hide();


		createReview();
	});

};

//==========================================================================
//=======================AJAX post request for adding review================
//==========================================================================


var createReview = function() {
	var starsInput = parseInt($('#stars').val());
	var contentInput = $('#content').val();
	var userIdInput = Cookies.get("loggedinId");
	event.preventDefault();
	var reviewData = {
		stars: starsInput,
		content: contentInput,
		user_id: userIdInput
	};
		$.ajax({
			url: "http://localhost:3000/users/" + userIdInput + "/reviews",
			type: "POST",
			dataType: 'json',
			data: reviewData
		}).done(console.log("created review!"));
}

//==========================================================================
//=======================AJAX get request for listing reviews===============
//==========================================================================

$.get('/reviews', function(data){


	for (i = 0; i < data.length; i++) {
		
		var source = $("#review-compile-template").html();
		var template = Handlebars.compile(source);
		var context = {stars: data[i]['stars'], username: data[i]['user_id'].username, content: data[i]['content'] }
		var html = template(context);
		$('body').append(html);
	}
	event.stopPropagation();
});


var checkCookies = function() {

	if (Cookies.get("loggedinId") != null) {
		$.ajax({
			url: "/users/" + Cookies.get("loggedinId"),
			method: "GET",
			dataTyp: "json"
		}).done(loggedIn);
		
	}

	event.stopPropagation();
}

checkCookies();




//==========================================================================
//=======================Katie's Work Space=================================
//==========================================================================














//==========================================================================
//==========================================================================
//==========================================================================





//==========================================================================
//=======================Zach's Work Space==================================
//==========================================================================














//==========================================================================
//==========================================================================
//==========================================================================







//==========================================================================
//=======================Robbies's Work Space===============================
//==========================================================================

var searchSubmit = function() {
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
	// console.log(data);
	event.stopPropagation();

	$('#artist-container').show();
	$('#artist-name').empty();
	$('#artist-name').html( data.name );

	$('#artist-button').click(function(){
		console.log('artist button is working');
		event.stopPropagation();
		showConcerts(data);

	});

	
};


var showConcerts = function(data) {
		event.stopPropagation();
		$.ajax({
			url: "http://api.bandsintown.com/artists/" + data.name + "/events?format=json&app_id=stannis&date=2009-01-01," + moment().format() + "/",
			type: "GET",
			dataType: 'jsonp'
		}).done(function(data) {
			
			 console.log('show concerts is working');

		});



}



var loadConcerts = function(data) {
	console.log(data);
	// $('#venue-info').show();
	// if(data.length < 10) {
	// 	$('#venue-info').empty();
	// 	for (i = 0; i < data.length; i++) {
	// 		$('#venue-name').text(data[i]['venue']['name']);
	// 		$('#venue-city').text(data[i]['venue']['city']);
	// 		$('#venue-region').text(data[i]['venue']['region']);
	// 		$('#venue-country').text(data[i]['venue']['country']);
	// 	}
	// }

	// else {
	// 	$('#venue-info').empty();
	// 	for (i = data.length - 1 ; i > data.length - 10; i--) {
	// 		$('#venue-info').append("<div id='venue-container'></div>")
	// 		$('#venue-container').append("<li>" + data[i]['venue']['name'] + "</li>");
	// 		$('#venue-container').append("<li>" + data[i]['venue']['city'] + "</li>");
	// 		$('#venue-container').append("<li>" + data[i]['venue']['region'] + "</li>");
	// 		$('#venue-container').append("<li>" + data[i]['venue']['country'] + "</li>" + "<br />");
	// 	}
	// }
}









//==========================================================================
//==========================================================================
//==========================================================================







});