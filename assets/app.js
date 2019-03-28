// Initialize Firebase
var config = {
	apiKey: 'AIzaSyAJQVW0Y5UfYDyiF4udSmi8OlWvb_x2tas',
	authDomain: 'farmer-s-market-dd1bd.firebaseapp.com',
	databaseURL: 'https://farmer-s-market-dd1bd.firebaseio.com',
	projectId: 'farmer-s-market-dd1bd',
	storageBucket: 'farmer-s-market-dd1bd.appspot.com',
	messagingSenderId: '1044283229575'
};
firebase.initializeApp(config);
var database = firebase.database();
//---------------------------------------------------------------------------------
// This makes our map work
// var map;
// function initMap() {
// 	map = new google.maps.Map(document.getElementById('map'), {
// 		center: { lat: 35.7796, lng: -78.6382 },
// 		zoom: 4
// 	});
// }

var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 2,
		center: new google.maps.LatLng(2.8, -187.3),
		mapTypeId: 'terrain'
	});

	// var geocoder = new google.maps.Geocoder();

	// // document.getElementById('submit').addEventListener('click', function() {
	// geocodeAddress(geocoder, map);
	// // });
}

//-----------------------------------------------------------------------------------
//CREATING SOME GLOBAL VARIABLES
var zipCode = '';
var marketId = '';

//  // jQuery functions so certain classes work on dynamic created elements
//  $('.collapsible').collapsible();
//  $('.scrollspy').scrollSpy();
//  $(".button-collapse").sideNav();
//  $("#modal1").modal();

//CLICKING ON THE SUBMIT BUTTON AND PASSING ZIP ARGUMENT IN THE GETMARKETIDFROMZIPCODE FUNCTION
$(document).on('click', '#submit', function(event) {
	event.preventDefault();
	zipCode = $('#autocomplete-input').val().trim();
	getMarketIdFromZipCode(zipCode);
});

//CLICKING THE MARKET NAME AND GETTING DETAILS BY CALLING GETMARKETDETAILS FUNCTION BY PASSING THE ID OBTAINED FROM THE GETMARKETIDFROMZIPCODE FUNCTION
$(document).on('click', '.market-list', function(event) {
	event.preventDefault();
	marketId = $(this).attr('id');
	getMarketDetails(marketId);
});

//SEARCH FARMERS MARKETS BY ZIPCODE API AND GET ID AND MARKETNAME
function getMarketIdFromZipCode(zip) {
	var id = '';
	var name = '';
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zip,
		dataType: 'jsonp',
		jsonpCallback: 'searchResultsHandler'
	}).done(function(response) {
		//OBJECT RESULTS FROM THE AJAX RESPONSE IS BEING DEFINED IN RESULTS VARIABLE
		var results = response.results;
		//BUILDS BEGINNING OF A COLLAPSIBLE LIST
		//var marketList = $("<ul class='collapsible popout' data-collapsible='accordion'>");

		var listingNumber = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
		//LOOPING THROUGH EVERY RESULT AND GETTING THE ID AND MARKET NAME
		for (var i = 0; i < 10; i++) {
			id = results[i].id;
			name = results[i].marketname;

			console.log(id + name);

			//PRINTING 10 NAMES ON HTML
			var listItem = $('<li>');
			listItem.attr('id', id);
			listItem.addClass('market-list');
			listItem.attr('listing-number', listingNumber[i]);
			listItem.text(name);

			$('#marketList').append(listItem);
		}
	});
}

//---------------------------------------------------------------------------

//THERE ARE TWO PARTS OF THE USDA API- ONE PULLS ID AND MARKET NAME AND THEN USING THE ID FROM THE FIRST AJAXCALL, WE'LL GET THE DETAILS- GOOGLE LINK, ADDRESS, SCHEDULE, PRODUCTS
//THE ORIGINAL API DOESN'T HAVE ANY PROMISE PART (.DONE), SO WE NEED TO MODIFY THE API

/*
    getSecondResults takes one parameter, makes a second call to the USDA api
    and pulls back the marketdetails associated with the ID that we pass into
    the parameter.*/
function getMarketDetails(argID) {
	$('#marketList').html('');
	$.ajax({
		type: 'GET',
		contentType: 'application/json; charset=utf-8',
		// submit a get request to the restful service mktDetail.
		url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + argID,
		dataType: 'jsonp',
		jsonpCallback: 'detailResultHandler'
	}).done(function(detailResults) {
		for (var key in detailResults) {
			//variables to hold results of second usda API call.  Results printed to HTML in onclick event
			var address = detailResults.marketdetails.Address;
			var gLink = detailResults.marketdetails.GoogleLink;
			var schedule = detailResults.marketdetails.Schedule;
			var products = detailResults.marketdetails.Products;

			// var thisID = ($(this).id());
			$('#marketList').html(
				"<a target='_blank' href= " +
					gLink +
					'>Google Link</a>' +
					'<p> Address: ' +
					address +
					'</p>' +
					'<p> Schedule: ' +
					schedule +
					'</p>' +
					'<p> Products: ' +
					products +
					'</p>'
			);
		} //end for loop
	}); //end ajax call
} //end getSecondResults function
