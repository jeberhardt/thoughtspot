/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    map: null,
    latlon: null,
    directionsDisplay: null,
    directionsService: null,
    // Application Constructor
    
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        $("#map-link").on("tap", function(e){
            e.preventDefault();
            $.mobile.changePage("#maps"), { transition: "slidefade", reverse: false, changeHash: true};
            console.log("SHOW THE MAP BITCHES");
            navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
        });

        $("#eatit-link").on("tap", function(e){
            e.preventDefault();
            $.mobile.changePage("#eatit"), { transition: "slidefade", reverse: false, changeHash: true};
        });

        $("#readit-link").on("tap", function(e){
            e.preventDefault();
            $.mobile.changePage("#readit"), { transition: "slidefade", reverse: false, changeHash: true};
        });

        $("#tossit-link").on("tap", function(e){
            e.preventDefault();
            $.mobile.changePage("#tossit"), { transition: "slidefade", reverse: false, changeHash: true};
        });        

        $("#talkit-link").on("tap", function(e){
            e.preventDefault();
            $.mobile.changePage("#talkit"), { transition: "slidefade", reverse: false, changeHash: true};
        });        
        
    },
    onSuccess: function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        app.latlon = new google.maps.LatLng(lat, lon);

        var opts = {
            center: app.latlon,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        };

        app.map = new google.maps.Map(document.getElementById("geolocation"), opts);

        app.initMaps(app.latlon);

    },
    onError: function(error) {
        alert("error bitches: " + error.code + "\nmessage: " + error.message + "\n");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        // var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },


    //*********************************** MARC ******************************//

    initMaps: function(pos) {

        dataModel.loadThoughtSpotData();
        
        var marker = new google.maps.Marker({
            position: pos,
            map: app.map,
            title:"you be here!"
        });
    },

    onDataLoaded: function() {
        var localStuff = dataModel.getWithinDistance(dataModel.data, 1, app.latlon.lat(), app.latlon.lng());
        app.showListWithMap(localStuff);
    },

    showListWithMap:function(locations) {

        $("#map-listing").html('');
        
        for (var i in locations) {
            var lat = locations[i].LATITUDE;
            var lon = locations[i].LONGITUDE;
            var latlon = new google.maps.LatLng(lat, lon);

            var marker = new google.maps.Marker({
                position: latlon,
                map: app.map
                // title:"you be here!"
            });

            var div = "<div class='location-list-item'>" + locations[i]["INCIDENT TITLE"] + "</div>";
            $("#mapListing").append($(div));

        }

        app.generateWalkRoute(app.latlon, new google.maps.LatLng( locations[0].LATITUDE, locations[0].LONGITUDE));
    },

    generateWalkRoute: function(start, end) {
        app.directionsService = new google.maps.DirectionsService();
        app.directionsDisplay = new google.maps.DirectionsRenderer();
        // var chicago = new google.maps.LatLng(41.850033, -87.6500523);
        // var mapOptions = {
            // zoom:7,
            // center: chicago
        // };
        // map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        app.directionsDisplay.setMap(app.map);
        calcRoute(start, end);
    },

    calcRoute: function(start, end) {
        // var start = document.getElementById('start').value;
        // var end = document.getElementById('end').value;
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.WALKING
        };

        app.directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                app.directionsDisplay.setDirections(response);
            }
        });
    }
};
