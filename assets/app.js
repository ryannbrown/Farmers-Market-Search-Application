//SEARCH FARMERS MARKETS BY ZIPCODE 
//API

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAJQVW0Y5UfYDyiF4udSmi8OlWvb_x2tas",
    authDomain: "farmer-s-market-dd1bd.firebaseapp.com",
    databaseURL: "https://farmer-s-market-dd1bd.firebaseio.com",
    projectId: "farmer-s-market-dd1bd",
    storageBucket: "farmer-s-market-dd1bd.appspot.com",
    messagingSenderId: "1044283229575"
  };
  firebase.initializeApp(config);

function getResults(zip) {
    // or
    // function getResults(lat, lng) {
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        // submit a get request to the restful service zipSearch or locSearch.
        url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
        // or
        // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
        dataType: 'jsonp',
        jsonpCallback: 'searchResultsHandler'
    });
}
//iterate through the JSON result object.
function searchResultsHandler(searchResults) {
    for (var key in searchresults) {
        alert(key);
        var results = searchresults[key];
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            for (var key in result) {
                //only do an alert on the first search result
                if (i == 0) {
                    alert(result[key]);
                }
            }
        }
    }
}