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

    fillRandomMarkers = function (callback) {
    	var finishedLoop;
    	for (var i = 0; i < 100; i++) {
	    	var marker = new google.maps.Marker({
			    position: new google.maps.LatLng(51.62 + (Math.random()/10), -0.3 + (Math.random()/10)),
			    map: null
			});
			markers.push(marker);
	    }
		callback();
    }

    initialiseMarkers = function () {
    	var marker = new google.maps.Marker({
		    position: mapCenter,
		    map: map
		});
		markers.push(marker);
    },

    addMarker = function (latlng, title) {
    	dragMarker = new google.maps.Marker({
		    position: latlng,
		    title: title,
		    map: map,
            draggable: true,
            icon: "admin/images/star.png"
		});
        if (infowindow != null) {
            infowindow.close();
        }
        google.maps.event.addListener(dragMarker, 'mouseup', function(e) {
            addInfoWindowPullData(e.latLng);
        });
        infowindow = new google.maps.InfoWindow({
            content: "<h3>" + title + "</h3><a id='location-save'></a>"
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
				content: "<h3>" + results[0].name + "</h3>"
			});
			infowindow.open(map, dragMarker);
		}
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
		google.maps.event.addListener(map, 'click', function(e) {
			if (dragMarker == null) {
		    	dragMarker = new google.maps.Marker({
				    position: e.latLng,
				    map: map,
				    draggable: true,
				    title: "Where I am Going",
				    icon: "admin/images/hearts.png"
				});
				addInfoWindowPullData(e.latLng);
				google.maps.event.addListener(dragMarker, 'mouseup', function(e) {
					addInfoWindowPullData(e.latLng);
				});
				markers.push(dragMarker);
			}
		});
    },

    doStuff = function () {
        initialiseEvents();
        fillRandomMarkers(function () {
			redrawHeatMapData(function () {
				redrawHeatMap();
			})
		});
        //initialiseMarkers();
        searchMap();
    },

    initialiseMap = function () {

        map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
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