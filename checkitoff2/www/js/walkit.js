var walk = {
	map: null,
    latlon: null,
    directionsDisplay: null,
    directionsService: null,
    focus: [],
    infowindow: null,
    markerImage: 'img/recreational_icon.png',
    curLocMarkerImage: 'img/current_location.png',
	initialize: function() {
		navigator.geolocation.getCurrentPosition(walk.onMapSuccess, walk.onMapError);
	},
	
    onMapSuccess: function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        walk.latlon = new google.maps.LatLng(lat, lon);

        var opts = {
            center: walk.latlon,
            zoom: 16,
            maxZoom: 19,
            minZoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            zoomControl: true,
        };

        walk.map = new google.maps.Map(document.getElementById("geolocation"), opts);

        walk.initMaps(walk.latlon);
        // walk.getWeather();
    },
    onMapError: function(error) {
        alert("error : " + error.code + "\nmessage: " + error.message + "\n");
    },
	initMaps: function(pos) {

        dataModel.loadThoughtSpotData(walk.onMapDataLoaded);
        
        var marker = new google.maps.Marker({
            position: pos,
            map: walk.map,
            icon: walk.curLocMarkerImage,
            title: "you are here"
        });

        walk.attachMessage(marker, "you are here");

        // google.maps.event.addListener(marker, 'click', function() {
			// walk.infowindow.open(walk.map, marker);
		// });

    },
    attachMessage: function(marker, message) {
		
		var infowindow = new google.maps.InfoWindow({
			content: message
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(marker.get('map'), marker);
		});
	},

    getWeather: function() {
  //   	$.ajax({
		//   	url : "http://api.wunderground.com/api/ce47fb1f679fe7b3/geolookup/q/" + walk.latlon.lat() + "," + walk.latlon.lng() + ".json",
		//   	dataType : "jsonp",
		//   	success : function(parsed_json) {
		//   		// var location = parsed_json['location']['city'];
		//   		// var temp_f = parsed_json['current_observation']['temp_f'];
		//   		// alert("Current temperature in " + location + " is: " + temp_f);
		//   	}
		// });
    },
    onMapDataLoaded: function() {
        var localStuff = dataModel.getWithinDistance(dataModel.data, 0.6, walk.latlon.lat(), walk.latlon.lng());
        var localStuffCategorized = dataModel.getInCategory(localStuff, "Recreation and Culture");
        walk.showListWithMap(localStuffCategorized);

    },
    showListWithMap:function(locations) {

        $("#mapListing").html('');
        var pts = [];

        for (var i in locations) {
            var lat = locations[i].LATITUDE;
            var lon = locations[i].LONGITUDE;
            var latlon = new google.maps.LatLng(lat, lon);

            var marker = new google.maps.Marker({
                position: latlon,
                map: walk.map,
                icon: walk.markerImage,
                title: locations[i]["INCIDENT TITLE"]
            });

            walk.attachMessage(marker, locations[i]["INCIDENT TITLE"]);

            var div = "<div class='location-list-item'><p>" + locations[i]["INCIDENT TITLE"] + "<br>" + locations[i]["Address 1"] + "</p></div>";
            $("#mapListing").append($(div));
    
        }

        var loc1 = locations[Math.floor(Math.random() * (locations.length -1))];
        var loc2 = locations[Math.floor(Math.random() * (locations.length -1))];

        pts.push({ location: new google.maps.LatLng(loc1.LATITUDE, loc1.LONGITUDE), stopover: false });
        pts.push({ location: new google.maps.LatLng(loc2.LATITUDE, loc2.LONGITUDE), stopover: false });

        walk.generateWalkRoute(walk.latlon, pts);
    },

    generateWalkRoute: function(start, pts) {
        walk.directionsService = new google.maps.DirectionsService();
        walk.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
		
        walk.directionsDisplay.setMap(walk.map);

        walk.calcRoute(start, pts);
    },

    calcRoute: function(start, pts) {
        // var start = document.getElementById('start').value;
        // var end = document.getElementById('end').value;
        
        var request = {
            origin: start,
            destination: start,
            waypoints: pts,
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING
        };

        walk.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                console.log(response);
                walk.directionsDisplay.setDirections(response);
            }
        });
    }
}