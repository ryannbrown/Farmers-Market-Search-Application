$(document).ready(function() {
	//--------------------------------------------------DISPLAYS INITIAL MAP------------------------------------------------------------------
    var map;

    var img = $('<img id="dynamic" class="col s7 m9 map-container teal lighten-4">'); 
    var imgurl = "placeholder.jpg"

    img.attr('src', imgurl);
    img.appendTo('#map');
    img.css("width","100%")

	var geocoder;
	function initMap() {
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 4,
			center: new google.maps.LatLng(39.82, -98.57),
			mapTypeId: 'terrain'
		});
		// geocoder = new google.maps.Geocoder();
	}

	// PUTS A MARKER IN RELATION TO EACH NAME OF EACH MARKET
	function geocodeAddress(geocoder, resultsMap, address) {
		geocoder.geocode({ address: address }, function(results, status) {
			if (status === 'OK') {
				resultsMap.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: resultsMap,
					position: results[0].geometry.location
				});
				map.setZoom(10); //ZOOMS IN ON RESULTS
			} else {
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});
	}

	//---------------------------------------------------------CREATING SOME GLOBAL VARIABLES-------------------------------------------------
	var zipCode = '';
	var marketId = '';
	// var marketDetails = {}; //new object to store google link, address, shcedule and products

	$('.collapsible').collapsible();

	//-----------------------------------------------CLICKING ON THE SUBMIT BUTTON------------------------------------------------------------
	$(document).on('click', '#submit', function(event) {
		event.preventDefault();
		zipCode = $('#autocomplete-input').val().trim();
		$('#autocomplete-input').html('').val(''); //EMPTY THE ZIP CODE FIELD
		// $('#ajaxResults').empty(); //emptying out all previous records
		$('#marketList').empty();
		initMap(); //every time map gets refreshed when the submit button is clicked
		getMarketIdFromZipCode(zipCode);
	});

	//MAKING THE FIRST AJAX CALL WITH ZIP CODE
	function getMarketIdFromZipCode(zip) {
		var id = '';
		var name = '';
		$('#ajaxResults').html('');
		$.ajax({
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=' + zip,
			dataType: 'jsonp',
			jsonpCallback: 'searchResultsHandler'
		}).done(function(response) {
			var results = response.results;
			// builds beginning of collapsible list
			var popoutList = $("<ul class='collapsible popout' data-collapsible='accordion'>");
			popoutList.collapsible();

			for (var i = 0; i < 10; i++) {
				id = results[i].id;
				name = results[i].marketname;

				var popoutHeader =
					"<div id='" +
					id +
					"' class='collapsible-header'><i class='material-icons'>location_on</i>" +
					name +
					'</div>';
				var popoutBody = "<div class='collapsible-body'><span>Lorem Ipsum</span></div>";
				var listItem = '<li>';

				// append each returned result as a list item to the DOM
				popoutList.append(listItem + popoutHeader + popoutBody);
				$('#ajaxResults').append(popoutList);
				//getMarketDetails(id);
			} //end for loop for dynamic collapse elements
		}); //END OF FUNCTION searchResultsHandler
	} //END OF FIRST AJAX CALL

	//---------------------------------------------------------//CLICKING THE MARKET NAME-----------------------------------------------------
	$(document).on('click', '.collapsible-header', function(event) {
		event.preventDefault();
		marketId = $(this).attr('id');
		getMarketDetails(marketId);
		// detailsMarket(marketId);
	});

	//MAKING THE SECOND AJAX CALL WITH MARKET ID
	function getMarketDetails(argID) {
		$.ajax({
			type: 'GET',
			contentType: 'application/json; charset=utf-8',
			url: 'https://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=' + argID,
			dataType: 'jsonp',
			jsonpCallback: 'detailResultHandler'
		}).done(function(detailresults) {
			/*variables to hold results of second usda API call.  Results printed to HTML in onclick event*/
			var address = detailresults.marketdetails.Address;
			var gLink = detailresults.marketdetails.GoogleLink;
			var schedule = detailresults.marketdetails.Schedule;
			var products = detailresults.marketdetails.Products;

			$('.collapsible-body').html(
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
			geocodeAddress(new google.maps.Geocoder(), map, address);
		});
	}
});
