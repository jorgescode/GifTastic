$(document).ready(function()
{
	// global variables
	var apiKey = 'dc6zaTOxFJmzC';
	var queryUrl = 'https://api.giphy.com/v1/gifs/search?q=%query%&api_key='+apiKey;
	var animalsArray = ['dog', 'cat', 'rabbit', 'hamster', 'skunk', 'goldfish', 'bird', 'ferret', 'turtle', 'sugar glider', 'chinchilla', 'hedgehog', 'hermit crab', 'gerbil', 'pygmy goat', 'chicken', 'capybara', 'teacup pig', 'serval', 'salamander', 'frog'];
	var numGifs = 12;
	var gifsArray = [];

	// dynamically adds buttons and appends to the animalButtons div
	for(var i = 0; i < animalsArray.length; i++)
	{
		$('<a>').addClass('btn btn-primary').text(animalsArray[i]).appendTo($('#animalButtons'));
	}

	// assigns action to animal-form submit event
	$('#animal-form').submit(function(event)
	{
		var animalInput = $('#animal-input');

		// adds a button with the text that was entered in the animalInput input element by accessing it's val attribute
		$('#animalButtons').append($('<a>').addClass('btn btn-primary').text(animalInput.val()));

		// javascript method to reset fields in a form
		this.reset();

		// returns false to prevent submit from reloading or refreshing the page
		return false;
	});

	// assigns click even action for all 'a' elements in the animalButtons div
	$('#animalButtons').on('click', 'a', function()
	{
		// emtpies the animals div of any elements inside
		$('#animals').empty();

		// gets the text of the specific 'a' element that was clicked
		var animal = $(this).text();

		// ajax call to giphy; replaces %query% with the string stored in animal variable
		$.ajax({url: queryUrl.replace('%query%', animal), method:'GET'})
		.done(function(response)
		{
			// returns a shuffled copy of the array contained in the response data property
			var gifs = knuthShuffle(response.data);

			// loops for the number of gifs that we want, relegating incremeting i to another for loop inside
			for(var i = 0; i < numGifs;)
			{
				//creates a row for every 3 gifs for nicer display
				var row = $('<div>').addClass('row');

				// for every row we add 3 columns, incrementing j and i respectively
				for(var j = 0; j < 3; j++, i++)
				{
					// break out of the loop as we no longer need to add anymore gifs
					if(i == numGifs)
						break;

					// create column divs and append it to the row which is append to the animals div
					var column = $('<div>').addClass('col-md-3');
					$('#animals').append(row.append(column));

					// obtain info from gifs array that contains information from the response data attribute
					// set rating to 'E' if none is found
					var rating = gifs[i].rating === '' ? 'E' : gifs[i].rating;

					// create panels for nicer display of rating above the gif/img
					var panel = $('<div>').addClass('panel panel-info');
					var panelHeading = $('<div>').addClass('panel-heading').text('rating: ' + rating);
					var panelBody = $('<div>').addClass('panel-body');

					// store the gif and the gif still urls
					var gifUrl = gifs[i].images.original.url;
					var gifStill = gifs[i].images.original_still.url;

					// initialize the img with the gif still url, add it as a data attribute as well as the regular gif url
					var gif = $('<img>').attr('src', gifStill).attr('data-still', gifStill).attr('data-gif', gifUrl);

					// append the img to the panel body; panel heading and panel body are then appended to the panel div; panel div is appended to the column
					column.append(panel.append(panelHeading).append(panelBody.append(gif)));
				}
			}
		});
	});

	// sets behavior for click events for any imgs clicked within the animals div
	$('#animals').on('click', 'img', function()
	{
		// checks if the img src attribute is the still img and sets it to the gif url
		if($(this).attr('src') === $(this).attr('data-still'))
			$(this).attr('src', $(this).attr('data-gif'));
		// otherwise it must be the gif url so set it back to the gif still url
		else
			$(this).attr('src', $(this).attr('data-still'));
	})
});