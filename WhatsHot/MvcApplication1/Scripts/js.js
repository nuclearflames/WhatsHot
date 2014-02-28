$( document ).ready(function() {

//Map size

$('#map-canvas').width($(window).width());
$('#map-canvas').height($(window).height());

//Smart resize
	(function($,sr){

	  var debounce = function (func, threshold, execAsap) {
	      var timeout;

	      return function debounced () {
	          var obj = this, args = arguments;
	          function delayed () {
	              if (!execAsap)
	                  func.apply(obj, args);
	              timeout = null;
	          };

	          if (timeout)
	              clearTimeout(timeout);
	          else if (execAsap)
	              func.apply(obj, args);

	          timeout = setTimeout(delayed, threshold || 100);
	      };
	  }
	  
	  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

	})(jQuery,'smartresize');


if ($(window).width() < 768) {

	$('#leaderboard ul').hide();

	$('#leaderboard-handle').click(function(){
		
		$('#leaderboard ul').slideToggle();

	});

}


$('#location').val('Bonhill St, London')



	$(window).smartresize(function(){

	if($(window).width() <= 768){	

		$('#leaderboard ul').hide();
	}

		else {$('#leaderboard ul').show()}	

	});




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
				content: "<h3>" + results[0].name + "</h3><a id='location-save' href='#dragMarker'>Save location...</a>"
			});
			infowindow.open(map, dragMarker);
		}
    },
    attachEvent = function () {
        $(window).on('hashchange', function () {
            if (window.location.hash == "#dragMarker") {
                $.ajax({
                    type: "POST",
                    data: JSON.stringify({
                        'lat': dragMarker.position.d,
                        'lng': dragMarker.position.e
                    }),
                    dataType: "json",
                    contentType: 'application/json',
                    url: "home/PostData",
                    success: function (e) {
                        redrawHeatMapData(function () {
                            redrawHeatMap();
                        });
                    },
                    failure: function (e) {
                        console.log(e);
                    }
                });
            }
        });
    },
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
                attachEvent();
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