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
var map;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: { lat: 35.7796, lng: -78.6382 },
		zoom: 9
	});
}

// document.addEventListener('DOMContentLoaded', function() {
//   var elems = document.querySelectorAll('.sidenav');
//   var instances = M.Sidenav.init(elems, options);
// });

//-----------------------------------------------------------------------------------
//CREATING SOME GLOBAL VARIABLES
var zipCode = '';
var marketId = '';

//  // jQuery functions so certain classes work on dynamic created elements
//  $('.collapsible').collapsible();
//  $('.scrollspy').scrollSpy();
//  $(".button-collapse").sideNav();
//  $("#modal1").modal();

//CLICKING ON THE SUBMIT BUTTON AND PASSING ARGUMENTS IN FUNCTIONS
$(document).on('click', '#submit', function(event) {
	event.preventDefault();
	zipCode = $('#autocomplete-input').val().trim();
	getMarketIdFromZipCode(zipCode);
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

		//LOOPING THROUGH EVERY RESULT AND GETTING THE ID AND MARKET NAME
		for (var i = 0; i < results.length; i++) {
			id = results[i].id;
			name = results[i].marketname;
      
      console.log(id + name);
      // var listItem = $('<li>');
     
			// append each returned result as a list item to the DOM
      // $("#marketList").html("<li>" + id + name + "</li>")
      $("#marketList").append(name)
      // $("#marketList").text(id)
      
			// $('#ajaxResults').append(marketList);
    }
    
  // listItem.append(popoutHeader);
	// 		$('#ajaxResults').append(marketList, );
    // }

	});
}

//iterate through the JSON result object.
// function searchResultsHandler(searchResults) {
//     for (var key in searchresults) {
//         alert(key);
//         var results = searchresults[key];
//         for (var i = 0; i < results.length; i++) {
//             var result = results[i];
//             for (var key in result) {
//                 //only do an alert on the first search result
//                 if (i == 0) {
//                     alert(result[key]);
//                 }
//             }
//         }
//     }
// }
//-------------------------------------------------------------------------

// Initialize collapsible (uncomment the lines below if you use the dropdown variation)
// var collapsibleElem = document.querySelector('.collapsible');
// var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

// Or with jQuery

// $(document).ready(function(){
//   $('.sidenav').sidenav();
// });

//---------------------------------------------------------------------------

//THERE ARE TWO PARTS OF THE USDA API- ONE PULLS ID AND MARKET NAME AND THEN USING THE ID FROM THE FIRST AJAXCALL, WE'LL GET THE DETAILS- GOOGLE LINK, ADDRESS, SCHEDULE, PRODUCTS
//THE ORIGINAL API DOESN'T HAVE ANY PROMISE PART (.DONE), SO WE NEED TO MODIFY THE API
