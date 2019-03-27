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
		zoom: 4
	});
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
		for (var i = 0; i < 10; i++) {
			id = results[i].id;
			name = results[i].marketname;
      
      console.log(id + name);
      var listItem = $('<li>');
      listItem.addClass("market-list");
      listItem.text(name);

      $("#marketList").append(listItem)
    
    }
	});
}


// window.eqfeed_callback = function(results) {
//   for (var i = 0; i < results.features.length; i++) {
//     // actually where you pull in the coordinates both are in an object
//     var coords = results.features[i].geometry.coordinates;
//     console.log(results)
//     // var latLng = new google.maps.LatLng(coords[1],coords[0]);
//     var latLng = [37.5, 95.7];
//     var marker = new google.maps.Marker({
//       position: latLng,
//       map: map
//     });



var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(2.8,-187.3),
    mapTypeId: 'terrain'
  });

  // Create a <script> tag and set the USGS URL as the source.
  // var script = document.createElement('script');
  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  // aly commented next two lines
  // script.src = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp';
  // document.getElementsByTagName('head')[0].appendChild(script);

  var geocoder = new google.maps.Geocoder();

// document.getElementById('submit').addEventListener('click', function() {
geocodeAddress(geocoder, map);
// });

}


// $(document).ready(function(){
//   $('.sidenav').sidenav();
// });

//---------------------------------------------------------------------------

//THERE ARE TWO PARTS OF THE USDA API- ONE PULLS ID AND MARKET NAME AND THEN USING THE ID FROM THE FIRST AJAXCALL, WE'LL GET THE DETAILS- GOOGLE LINK, ADDRESS, SCHEDULE, PRODUCTS
//THE ORIGINAL API DOESN'T HAVE ANY PROMISE PART (.DONE), SO WE NEED TO MODIFY THE API
