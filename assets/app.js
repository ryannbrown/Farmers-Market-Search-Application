//---------------------------------------------------------------------------------
// DISPLAYS INITIAL MAP
var map;
// var geocoder;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 4,
		center: new google.maps.LatLng(39.82, -98.57),
		mapTypeId: 'terrain'
	});
	// geocoder = new google.maps.Geocoder();
}
   // Each marker is labeled with a single alphabetical character.
   var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
   var labelIndex = 0;

// PUTS A MARKER IN RELATION TO EACH NAME OF EACH MARKET
function geocodeAddress(geocoder, resultsMap, address) {
	geocoder.geocode({ address: address }, function (results, status) {
		if (status === 'OK') {
			resultsMap.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
				map: resultsMap,
				position: results[0].geometry.location,
				label: labels[labelIndex++ % labels.length]
				
			});
			map.setZoom(10) //ZOOMS IN ON RESULTS
		} else {
			console.log('Geocode was not successful for the following reason: ' + status);
		}
	});
}


//-----------------------------------------------------------------------------------
//CREATING SOME GLOBAL VARIABLES
var zipCode = '';
var marketId = '';
var marketDetails = {}; //new object to store google link, address, shcedule and products 

// $('.collapsible').collapsible();


//------------------------------------------------------------------------------------------------
//CLICKING ON THE SUBMIT BUTTON
$(document).on('click', '#submit', function (event) {
	event.preventDefault();
	zipCode = $('#autocomplete-input').val().trim();
	$('#autocomplete-input').html('').val(''); //EMPTY THE ZIP CODE FIELD
	getMarketIdFromZipCode(zipCode);
	$('#marketList').empty(); //emptying out all previous records
	initMap(); //every time map gets refreshed when the submit button is clicked
});

//MAKING THE FIRST AJAX CALL WITH ZIP CODE
function getMarketIdFromZipCode(zip) {
	var id = '';
	var name = '';
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zip,
		dataType: 'jsonp',
		success: searchResultsHandler
	}); //END OF AJAX CALL
}

//GETTING RESPONSE FROM FUNCTION
function searchResultsHandler(response) {
	//RESULTS OBJECT FROM THE AJAX RESPONSE IS BEING DEFINED IN RESULTS VARIABLE
	var results = response.results;
	var popoutList = $("<ul class='collapsible popout' id ='marketList' data-collapsible = 'accordion'>");
	// popoutList.collapsible();

	$('#marketList').html("<h5>Markets Near you:</h5>")
	//LOOPING THROUGH EVERY RESULT AND GETTING THE ID AND MARKET NAME
	for (var i = 0; i < 10; i++) {
		id = results[i].id;
		name = results[i].marketname;

		//PRINTING 10 NAMES ON HTML
		var listItem = $('<li>');
		listItem.attr('id', id);
		listItem.addClass('market-list');
		listItem.text(name);
		
		$('#marketList').append(listItem);
		// listItem.[labelIndex++ % labels.length];
		getMarketDetails(id);
	} //END OF FOR LOOP
} //END OF FUNCTION searchResultsHandler
//END OF FIRST AJAX CALL 

//--------------------------------------------------------------------------------------------------------------------------
//CLICKING THE MARKET NAME
$(document).on('click', '.market-list', function (event) {
	event.preventDefault();
	marketId = $(this).attr('id');
	getMarketDetails(marketId);
	detailsMarket(marketId);
	
});

// $(document).on('click', '#back-btn', function (event) {
// 	event.preventDefault();
// 	marketId = $(this).attr('id');
// 	getMarketDetails(marketId);
// 	detailsMarket(marketId);
// });

//MAKING THE SECOND AJAX CALL WITH MARKET ID
function getMarketDetails(argID) {
	//$('#marketList').html('');
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		// submit a get request to the restful service mktDetail.
		url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + argID,
		dataType: 'jsonp',
		success: detailResultHandler.bind(null, argID)
	}); //end of ajax call
} //end of getSecondResults function

////GETTING RESPONSE FROM FUNCTION
function detailResultHandler(argID, detailResults) {
	console.log('argID', argID);
	var address = detailResults.marketdetails.Address;
	var gLink = detailResults.marketdetails.GoogleLink;
	var schedule = detailResults.marketdetails.Schedule;
	var products = detailResults.marketdetails.Products;
	console.log('address', address);

	marketDetails[argID] = {
		address: address,
		gLink: gLink,
		schedule: schedule,
		products: products
	};

	geocodeAddress(new google.maps.Geocoder(), map, address);
}

//SEPARATE FUNCTION FOR PRINTING MARKET DETAILS BY PASSING MARKET ID
function detailsMarket(marketId) {
	var detailResults = marketDetails[marketId];
	$('#marketList').html(
		"<button id='back-btn'>Go Back</button>" +
		"<h5> Market Details </h5> " +
		"<a target='_blank' href= " +
		detailResults.gLink +
		'>Google Link</a>' +
		'<p> Address: ' +
		detailResults.address +
		'</p>' +
		'<p> Schedule: ' +
		detailResults.schedule +
		'</p>' +
		'<p> Products: ' +
		detailResults.products +
		'</p>'
	);




}
//END OF CLICK EVENT, SUBSEQUENT AJAX CALL AND GETTING RESPONSE BACK

