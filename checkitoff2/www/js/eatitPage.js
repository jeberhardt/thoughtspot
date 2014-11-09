var eatitPage = {
	map: null,
    latlon: null,
    directionsDisplay: null,
    directionsService: null,
    focus: [],
    infowindow: null,
    markerImage: 'img/diet_icon.png',
    curLocMarkerImage: 'img/current_location.png',

	initialize: function() {
		navigator.geolocation.getCurrentPosition(eatitPage.onMapSuccess, eatitPage.onMapError);
	},
    destroy: function() {
        console.log("DESTROY THIS VIEW");
    },
    onMapSuccess: function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        eatitPage.latlon = new google.maps.LatLng(lat, lon);

        var opts = {
            center: eatitPage.latlon,
            zoom: 16,
            maxZoom: 19,
            minZoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            zoomControl: true,
        };

        eatitPage.map = new google.maps.Map(document.getElementById("eat-geolocation"), opts);

        eatitPage.initMaps(eatitPage.latlon);
        // eatitPage.getWeather();
    },
    onMapError: function(error) {
        alert("error : " + error.code + "\nmessage: " + error.message + "\n");
    },
	initMaps: function(pos) {

        dataModel.loadThoughtSpotData(eatitPage.onMapDataLoaded);
        
        var marker = new google.maps.Marker({
            position: pos,
            map: eatitPage.map,
            icon: eatitPage.curLocMarkerImage,
            title: "you are here"
        });

        eatitPage.attachMessage(marker, "you are here");

        // google.maps.event.addListener(marker, 'click', function() {
			// eatitPage.infowindow.open(eatitPage.map, marker);
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
		//   	url : "http://api.wunderground.com/api/ce47fb1f679fe7b3/geolookup/q/" + eatitPage.latlon.lat() + "," + eatitPage.latlon.lng() + ".json",
		//   	dataType : "jsonp",
		//   	success : function(parsed_json) {
		//   		// var location = parsed_json['location']['city'];
		//   		// var temp_f = parsed_json['current_observation']['temp_f'];
		//   		// alert("Current temperature in " + location + " is: " + temp_f);
		//   	}
		// });
    },
    onMapDataLoaded: function() {
        var localStuff = dataModel.getWithinDistance(dataModel.data, 2, eatitPage.latlon.lat(), eatitPage.latlon.lng());
        var localStuffCategorized = dataModel.getInCategory(localStuff, "Healthy Diet");
        eatitPage.showListWithMap(localStuffCategorized);

    },
    showListWithMap:function(locations) {

        $("#eat-mapListing").html('');
        var pts = [];

        for (var i in locations) {
            var lat = locations[i].LATITUDE;
            var lon = locations[i].LONGITUDE;
            var latlon = new google.maps.LatLng(lat, lon);

            var marker = new google.maps.Marker({
                position: latlon,
                map: eatitPage.map,
                icon: eatitPage.markerImage,
                title: locations[i]["INCIDENT TITLE"]
            });

            eatitPage.attachMessage(marker, locations[i]["INCIDENT TITLE"]);

            var div = "<div class='location-list-item'><p>" + locations[i]["INCIDENT TITLE"] + "<br>" + locations[i]["Address 1"] + "</p></div>";
            $("#eat-mapListing").append($(div));
            
        }
// console.log(locations);
        var loc1 = locations[Math.floor(Math.random() * (locations.length -1))];
        var loc2 = locations[Math.floor(Math.random() * (locations.length -1))];

        pts.push({ location: new google.maps.LatLng(loc1.LATITUDE, loc1.LONGITUDE), stopover: false });
        pts.push({ location: new google.maps.LatLng(loc2.LATITUDE, loc2.LONGITUDE), stopover: false });

        eatitPage.generateWalkRoute(eatitPage.latlon, pts);
    },

    generateWalkRoute: function(start, pts) {
        eatitPage.directionsService = new google.maps.DirectionsService();
        eatitPage.directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
		
        eatitPage.directionsDisplay.setMap(eatitPage.map);

        eatitPage.calcRoute(start, pts);
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

        eatitPage.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                eatitPage.directionsDisplay.setDirections(response);
            }
        });
    }
}