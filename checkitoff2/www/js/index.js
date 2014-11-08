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

        $("#eait-link").on("tap", function(e){
            e.preventDefault();
            $.mobile.changePage("#eait"), { transition: "slidefade", reverse: false, changeHash: true};
        });

        $("#readit-link").on("tap", function(e){
            e.preventDefault();
            $.mobile.changePage("#readit"), { transition: "slidefade", reverse: false, changeHash: true};
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
        // console.log("GET OUT OF MY HOUSE");
        dataModel.loadThoughtSpotData();
        var marker = new google.maps.Marker({
            position: pos,
            map: app.map,
            title:"you be here!"
        });
    },

    onDataLoaded: function() {
        var localStuff = dataModel.getWithinDistance(dataModel.data, 10, app.latlon.lat(), app.latlon.lng());
        console.log(localStuff);
    }
};
