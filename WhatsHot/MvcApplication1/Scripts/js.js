$( document ).ready(function() {

$('.hidden-out').hide();
$('.hidden-in').show().click(function(){

    $('.signinwrap').show();

    $('#signinbutton').click(function(){

        $('.hidden-in').hide();
        $('.hidden-out').show();
        $('.signinwrap').hide();
    });


    $('#leaderboard-handle').click(function(){
        
        $('#leaderboard ul').stop().slideToggle();

    });


    //Map size

    $('.signinwrap').show();

});

$('#signinbutton').click(function(){

    $('.hidden-in').hide();
    $('.hidden-out').show();
    $('.signinwrap').hide();
});

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


        $('#map-canvas').width($(window).width());
        $('#map-canvas').height($(window).height());

	$(window).smartresize(function(){
        $('#map-canvas').width($(window).width());
        $('#map-canvas').height($(window).height());

	if($(window).width() <= 768){	

		$('#leaderboard ul').hide();
	}

		else {$('#leaderboard ul').show()}	

	});




});



var
	map,
	markers = [],
    mapCenter = new google.maps.LatLng(51.50, -0.13),
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
    starMap = [],

    initialiseMarkers = function (callback) {
    	$.ajax({
            type: "POST",
            url: "home/GetData",
            async: false,
            success: function (e) {
                $.each(JSON.parse(e).Locations, function (i, v) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(v.Latitude, v.Longitude),
                        map: null,
                        weight: v.Weight
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
    dataShowTemplate = [
        "<li>",
            "<span class='star'>",
                "<img src='img/star.png'>",
            "</span>",
            "<%= data.address %>",
            "<span>",
                "<%= data.going %> going",
            "</span>",
        "</li>"
    ].join("\n"),

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
            content: "<h4>" + title + "</h4>"
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
				content: "<h4>" + results[0].name + "</h4><a id='location-save' href='#dragMarker'>Save location...</a>"
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
    sortByProperty = function(property) {
        return function (a, b) {
            var sortStatus = 0;
            if (a[property] > b[property]) {
                sortStatus = -1;
            } else if (a[property] < b[property]) {
                sortStatus = 1;
            }
            return sortStatus;
        };
    },
    redrawHeatMapData = function (callback) {
    	for (var i = 0; i < markers.length; i++) {
	    	heatMapData.push({
	    		location: markers[i].position, weight: markers[i].weight
		 	});
		}
		callback();
    },

    redrawHeatMap = function () {
    	if (heatMap != null) {
    		heatMap.setMap(null);    		
    	}
        heatMapData.sort(sortByProperty("weight"));
        
        putStarsOnScreen(heatMapData);

    	heatMap = new google.maps.visualization.HeatmapLayer({
  			data: heatMapData
		});
        heatMap.set('radius', heatMap.get('radius') ? null : 30);
		heatMap.setMap(map);
    },

    putStarsOnScreen = function(data) {
        for (var i = 0; i < 3; i++) {
            var starMarker = new google.maps.Marker({
                position: data[i].location,
                title: "Leader",
                map: map,
                draggable: false,
                icon: "../img/star-med.png"
            });
            var request = {
                location: data[i].location,
                radius: 10
            };
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, service1);
        }
    },

    service1 = function (results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var data1 = {
                'address': results[0].name,
                'going': Math.ceil(Math.random() * 300)
            };
            $("#leaderboard ul").append(_.template(dataShowTemplate, data1, { variable: "data" }));
        }
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
                if (dragMarker != null) {
                    dragMarker.setMap(null);
                }
                dragMarker = new google.maps.Marker({
                    position: map.getCenter(),
                    map: map,
                    draggable: true,
                    title: "Where I am Going",
                    icon: "img/hearts.png"
                });
                markers.push(dragMarker);
                addInfoWindowPullData(map.getCenter());
                google.maps.event.addListener(dragMarker, 'mouseup', function(e) {
                    addInfoWindowPullData(map.getCenter());
                });
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
            var data = {
                'address': results[0].name,
                'going': results[0].rating * 10
            };
            //$("#leaderboard ul").prepend(_.template(dataShowTemplate, data, { variable: "data" }));
    	}
    },
	init = function() {
        google.maps.event.addDomListener(window, 'load', initialiseMap);
	}

init: init();