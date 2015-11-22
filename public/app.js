$(function() {

$('#signup-button').click(function() {
	console.log("testing signup button");

	showSignUpForm();

})


	var showSignUpForm = function() {

		$('#signup-button').hide();

		var template = Handlebars.compile($('#signup-form-template').html());

		$('#form-container').append( template );

		$('#signup-submit').click(function() {
			console.log("testing submit");

			$('#signup-form-template').hide();

			signupSubmit();
		})

	}

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

	    $.ajax({
			url: 'http://localhost:3000/users',
			method: 'POST',
			dataType: 'json',
			data: user
		}).done( console.log(user.username, " was created!!!!! good job") );


	}



});