
/**
 * Module dependencies.
 */

var express = require('express'),       // the main ssjs framework
    db = require('./config/db'),        // database connection
    passport = require('passport'),     // for user authentication
    routes = require('./routes'),       // by default, brings in routes/index.js
    user = require('./routes/user'),  // all login for admin panel
    constants = require('./config/constants'),
    http = require('http'),
    path = require('path'),             // for pathn manipulation
    app = express();                    // create an express app

var app = express();

// all environments
app.configure(function(){
    // read port from .env file
    app.set('port', 3000);
    // locate the views folder
    app.set('views', __dirname + '/views');
    // we are using jade templating engine
    app.set('view engine', 'jade');
    // the favicon to use for our app
    app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));
    // watch network requests to express in realtime
    app.use(express.logger('dev'));
    // sign the cookies, so we know if they have been changed
    app.use(express.cookieParser('keyboard cat'));
    // allows to read values in a submitted form
    app.use(express.bodyParser());
    // faux HTTP requests - PUT or DELETE
    app.use(express.methodOverride());
    app.use(express.session({ secret: 'ecoSecret' }));
    // initialize passport
    app.use(passport.initialize());
    // for persistent session logins otherwise each request would need credentials
    app.use(passport.session());
    // invokes the routes' callbacks
    app.use(app.router);
    // every file <file> in /public is served at example.com/<file>
    app.use(express.static(path.join(__dirname, 'public')));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// serve the home
app.get('/', routes.index);

// sign up a user
app.post('/signup', user.signup); // signup page send a POST request here

// login the user
app.post('/signin', function(req, res, next) {
    console.log(req.body);
    passport.authenticate('local', function(err, user, info) {
        console.log("after auth");
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.send({ success : false, message : 'authentication failed' });
        }
        return res.send({ success : true, message : 'authentication succeeded' });
    })(req, res, next);
});

require('./config/pass')(passport);

// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
