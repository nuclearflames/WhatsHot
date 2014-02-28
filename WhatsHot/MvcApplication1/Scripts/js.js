$( document ).ready(function() {

if ($(window).width() < 768) {

    $('#leaderboard ul').hide();

    $('#leaderboard-handle').click(function(){
        
        $('#leaderboard ul').slideToggle();

    });

}

$.get("http://ipinfo.io", function(response) {

  $('#location').val('Bonhill St, London')
  
}, "jsonp");

$('.form-signin button').click(function(){
alert('');


})


});



var
	map,
	markers = [],
    mapCenter = new google.maps.LatLng(51.62, -0.3),
    mapOptions = {
        center: mapCenter,
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    },
    heatMap,
    heatMapData = [],
    service,
    dragMarker,
    infowindow,
    searchMarker,
    styles = [ { "featureType": "poi.park", "stylers": [ { "color": "#999999" }, { "visibility": "off" } ] },{ "featureType": "road.highway", "stylers": [ { "visibility": "simplified" }, { "invert_lightness": true }, { "color": "#aaaaaa" } ] },{ "featureType": "road.local", "stylers": [ { "visibility": "simplified" }, { "color": "#bbbbbb" } ] },{ "featureType": "road.arterial", "stylers": [ { "visibility": "simplified" }, { "color": "#cccccc" } ] },{ "featureType": "poi", "stylers": [ { "visibility": "off" } ] },{ "featureType": "transit", "stylers": [ { "visibility": "off" } ] },{ "featureType": "water", "stylers": [ { "color": "#ffffff" } ] },{ } ],

    initialiseMarkers = function (callback) {
    	$.ajax({
            type: "POST",
            url: "home/GetData",
            async: false,
            success: function (e) {
                $.each(JSON.parse(e).Locations, function (i, v) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(v.Latitude, v.Longitude),
                        map: null
                    });
                    markers.push(marker);
                })
            },
            failure: function (e) {
                console.log(e);
            }
        });
        callback();
    },

    addMarker = function (latlng, title) {
    	dragMarker = new google.maps.Marker({
		    position: latlng,
		    title: title,
		    map: map,
            draggable: true,
            icon: "../img/star-med.png"
		});
        if (infowindow != null) {
            infowindow.close();
        }
        google.maps.event.addListener(dragMarker, 'mouseup', function(e) {
            addInfoWindowPullData(e.latLng);
        });
        infowindow = new google.maps.InfoWindow({
            content: "<h3>" + title + "</h3>"
        });
        infowindow.open(map, dragMarker);
    },

    addInfoWindowPullData = function (latlng) {
		var request = {
			location: latlng,
			radius: 10
		};
		service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, infoWindowService);
    },
    infoWindowService = function (results, status) {
    	if (status == google.maps.places.PlacesServiceStatus.OK) {
    		if (infowindow != null) {
    			infowindow.close();
    		}
			infowindow = new google.maps.InfoWindow({
				content: "<h3>" + results[0].name + "</h3><a id='location-save'>Save location...</a>"
			});
			infowindow.open(map, dragMarker);
		}
    },
    // attachEvent = function () {
    //     $("#location-save").click(function() {
    //         console.log(dragMarker);
    //         $.ajax({
    //             url: "PostDestination/123/",
    //             success: function (e) {
    //                 console.log(e);
    //             },
    //             failure: function (e) {
    //                 console.log(e);
    //             }
    //         });
    //     });
    // },
    redrawHeatMapData = function (callback) {
    	for (var i = 0; i < markers.length; i++) {
	    	heatMapData.push({
	    		location: markers[i].position, weight: 1000
		 	});
		}
		callback();
    },

    redrawHeatMap = function () {
    	if (heatMap != null) {
    		heatMap.setMap(null);    		
    	}
    	heatMap = new google.maps.visualization.HeatmapLayer({
  			data: heatMapData
		});
		heatMap.setMap(map);
    },

    initialiseEvents = function () {
        $("#heart-button").click(function () {
            if (window.location.hash == "#select") {
                window.location.hash = "";
                if (dragMarker != null) {
                    dragMarker.setMap(null);
                }
            } else {
                window.location.hash = "select";
                if (dragMarker == null) {
                    dragMarker = new google.maps.Marker({
                        position: map.getCenter(),
                        map: map,
                        draggable: true,
                        title: "Where I am Going",
                        icon: "img/hearts.png"
                    });
                    addInfoWindowPullData(map.getCenter());
                    google.maps.event.addListener(dragMarker, 'mouseup', function(e) {
                        addInfoWindowPullData(map.getCenter());
                    });
                    markers.push(dragMarker);

                }
            }
        });
    },

    doStuff = function () {
        initialiseEvents();
  //       fillRandomMarkers(function () {
		// 	redrawHeatMapData(function () {
		// 		redrawHeatMap();
		// 	})
		// });
        initialiseMarkers(function () {
            redrawHeatMapData(function () {
                redrawHeatMap();
            })
        });
        searchMap();
    },

    initialiseMap = function () {

        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
        map.setOptions({styles: styles});
        doStuff();

    },
    searchMap = function () {
    	var sub = $("#submit-box");
    	sub.click(function (e) {
    		var text = $("#search-box").val();
    		var request = {
    			query: text
    		};
			service = new google.maps.places.PlacesService(map);
			service.textSearch(request, searchData);
    	});
    },
    searchData = function (results, status) {
    	if (status == google.maps.places.PlacesServiceStatus.OK) {
    		addMarker(results[0].geometry.location, results[0].formatted_address);
    		map.setCenter(results[0].geometry.location);
    	}
    },
	init = function() {
        google.maps.event.addDomListener(window, 'load', initialiseMap);
	}

init: init();