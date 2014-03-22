if(typeof window.device == 'undefined') {
    window.device = {
        'uuid' : window.navigator.userAgent
    };
}

var app = {
    viewModel : null,
    server : 'http://spa-api.herokuapp.com',
    uuid : window.device.uuid,
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
        //$(document).ready(app.onDeviceReady);
    },

    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.uuid = window.device.uuid;
        $.post(app.server + '/signup', {'username' : app.uuid}, function(signupData) {
            $.post(app.server + '/signin', {'username' : app.uuid}, function(signinData) {
                app.viewModel = new ViewModel(signinData);
                ko.applyBindings(app.viewModel);
            }, "json");
        }, "json");

        //app.viewModel = new ViewModel({'user' : {'username' : 'test'}});
        //ko.applyBindings(app.viewModel);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};
