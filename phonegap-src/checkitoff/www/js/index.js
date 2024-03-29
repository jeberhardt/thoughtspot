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
    data: [],
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
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);
    },
    onSuccess: function(pos) {
        var lat = pos.coords.latitude;
        var lon = pos.coords.longitude;
        var latlon = new google.maps.LatLng(lat, lon);

        var opts = {
            center: latlon,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        };

        var map = new google.maps.Map(document.getElementById("geolocation"), opts);
        app.initMaps();

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

    initMaps: function() {
        console.log("GET OUT OF MY HOUSE");
        app.loadThoughtSpotData();
    },

    loadThoughtSpotData: function() {
         $.ajax({
            url: "data/tsdata.csv",
            dataType: 'text',
            cache: false
         }).done(function(csvAsString){
                csvArray = csvAsString.csvToArray({ rSep:'\n', quot:"\"" });
                for (var i in csvArray) {
                    if (i > 0) {
                        var obj = {};
                        for (var j in csvArray[0]) {
                            
                            obj[csvArray[0][j]] = csvArray[i][j];
                        }
                        app.data.push(obj);
                    }
                    
                }
                app.onDataLoaded();
         });
    },

    onDataLoaded: function() {
        
    }

    
};
