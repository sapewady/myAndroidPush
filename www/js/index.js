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
        // app.receivedEvent('deviceready');
        // app.handleLogin();
        // $.mobile.changePage("login.html");
        $("#loginForm").on("submit",app.handleLogin);
        var u = window.localStorage["username"];
        var p = window.localStorage["password"];
        if(u != '' && p!= '') {
            $("#username").val(u);
            $("#password").val(p);
            app.handleLogin();
        }
    },

    handleLogin : function() {
        var form = $("#loginForm");
        //disable the button so we can't resubmit while we wait
        $('[type="submit"]').button('disable'); 
        $('[type="submit"]').button('refresh');
        var u = $("#username").val();
        var p = $("#password").val();

        if(u != '' && p!= '') {
            $.get("http://sysparking.tafsir.my/site/wslogin?terus=0&username="+u+"&password="+p+"", function(res) {
                if(res.status == true) {
                    //store
                    window.localStorage["username"] = u;
                    window.localStorage["password"] = p;
                    
                    navigator.notification.alert("login success", function() {});
                    var pushNotification = window.plugins.pushNotification;
                    pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"450207798539","ecb":"app.onNotificationGCM"});

                    //window.location = 'http://sysparking.tafsir.my';
                    //$.mobile.changePage("some.html");
                } else {
                    navigator.notification.alert("Invalid username/password", function() {});
                }
            },"json");
        }
        $('[type="submit"]').button('enable'); 
        $('[type="submit"]').button('refresh'); 
        return false;
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //navigator.notification.alert("Your login failed", function() {});
        //$.mobile.changePage("login.html");
        // alert('Received Event: ' + id);
/*        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/

        //var pushNotification = window.plugins.pushNotification;
        //pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"450207798539","ecb":"app.onNotificationGCM"});

    },

    // result contains any message sent from the plugin call
    successHandler: function(result) {
        // navigator.notification.alert('Callback Success! Result = '+result, function() {});
    },

    errorHandler:function(error) {
        navigator.notification.alert(error, function() {});
    },

    onNotificationGCM: function(e) {
        switch( e.event )
        {
            case 'registered':
                if ( e.regid.length > 0 )
                {
                    // console.log("Regid " + e.regid);
                    window.localStorage["deviceid"] = e.regid;
                    // navigator.notification.alert(e.regid, function() {});
                    u = window.localStorage["username"];
                    $.get("http://sysparking.tafsir.my/user/wsaddphone?terus=1&username="+u+"&deviceid="+e.regid+"", function(res) {
                        console.log(res)
                        navigator.notification.alert("GCM updated", function() {});
                        //window.location = 'http://sysparking.tafsir.my';
                    });    
                    //alert('registration id = '+e.regid);
                }
            break;
 
            case 'message':
              // this is the actual push notification. its format depends on the data model from the push server
                // console.log('message = '+e.message+' msgcnt = '+e.msgcnt);
                navigator.notification.alert(e.message, function() {});

            break;
 
            case 'error':
                navigator.notification.alert('GCM error = '+e.msg, function() {});
            break;
 
            default:
                navigator.notification.alert('An unknown GCM event has occurred', function() {});
              break;
        }
    }

};
