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
var talkitPage = {
    initialize: function() {
        $("#contact-link").on("tap", function(e){
            e.preventDefault();
            console.log("Whatever");
            $("body").addClass('ui-disabled').css("background", "#000");
            $.mobile.loading("show");
            var options = new ContactFindOptions();
            options.filter = "";
            options.multiple = true;
            var filter = ["displayName", "phoneNumbers"];
            navigator.contacts.find(filter, onSuccess, onError, options);
        });
    }
};

function onSuccess(contacts) {
    console.log("onSuccess");
    var html = "";
    for (var i = 0; i < contacts.length; i++) {
        console.log(contacts[i]);
        if ($.trim(contacts[i].displayName).length != 0 || $.trim(contacts[i].nickName).length != 0 || $.trim(contacts[i].name.formatted).length !=0) {
            html += '<li>';
            html += '<h2>' + contacts[i].displayName ? contacts[i].displayName : contacts[i].name.formatted + '</h2>';
            if (contacts[i].phoneNumbers) {
                html += '<ul class="innerlsv" data-role="listview" data-inset="true">';
                html += '<li><h3>Phone Numbers</h3></li>';
                for (var j = 0; j < contacts[i].phoneNumbers.length; j++) {
                    html += "<li>Type: " + contacts[i].phoneNumbers[j].type + "<br/>" +
                        "Value: " + contacts[i].phoneNumbers[j].value + "<br/>" +
                        "Preferred: " + contacts[i].phoneNumbers[j].pref + "</li>";
                }
                html += "</ul>";
            }
            html += '</li>';
        }
    }
    console.log(html);
    if (contacts.length === 0) {
        html = '<li>';
        html += '<h2>No Contacts</h2>';
        html += '</li>';
    }
    $("#contactsList").html(html);
    $("#contactsList").listview().listview('refresh');
    $(".innerlsv").listview().listview('refresh');
    $("body").removeClass('ui-disabled');
}

function onError(contactError) {
    alert('Oops Something went wrong!');
    $.mobile.loading("hide");
    $("body").removeClass('ui-disabled');
}
