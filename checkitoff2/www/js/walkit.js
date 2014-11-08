var walk = {
	map: null,
    latlon: null,
    directionsDisplay: null,
    directionsService: null,

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
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        };

        walk.map = new google.maps.Map(document.getElementById("geolocation"), opts);

        walk.initMaps(walk.latlon);

    },
    onMapError: function(error) {
        alert("error : " + error.code + "\nmessage: " + error.message + "\n");
    },
	initMaps: function(pos) {

        dataModel.loadThoughtSpotData();
        
        var marker = new google.maps.Marker({
            position: pos,
            map: walk.map,
            title:"you be here!"
        });
    },
    onMapDataLoaded: function() {
        var localStuff = dataModel.getWithinDistance(dataModel.data, 1, walk.latlon.lat(), walk.latlon.lng());
        var localStuffCategorized = dataModel.getInCategory(localStuff, "Recreation and Culture");
        walk.showListWithMap(localStuffCategorized);
    },
    showListWithMap:function(locations) {

        $("#map-listing").html('');
        var pts = [];

        for (var i in locations) {
            var lat = locations[i].LATITUDE;
            var lon = locations[i].LONGITUDE;
            var latlon = new google.maps.LatLng(lat, lon);

            var marker = new google.maps.Marker({
                position: latlon,
                map: walk.map
                // title:"you be here!"
            });

            var div = "<div class='location-list-item'>" + locations[i]["INCIDENT TITLE"] + "</div>";
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
        walk.directionsDisplay = new google.maps.DirectionsRenderer();
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
                walk.directionsDisplay.setDirections(response);
            }
        });
    }
}