
/**
 * Module dependencies.
 */

var express = require('express'),       // the main ssjs framework
    http = require('http'),
    routes = require('./routes'),       // by default, brings in routes/index.js
    user = require('./routes/user'),    // all login for admin panel
    path = require('path'),             // for pathn manipulation
    db = require('./config/db'),        // database connection
    passport = require('passport'),     // for user authentication
    auth = require('./config/middlewares/authorization'), // helper methods for authentication
    constants = require('./config/constants'),
    app = express();                     // create an express app


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session());
// initialize passport
app.use(passport.initialize());
// for persistent session logins otherwise each request would need credentials
app.use(passport.session());
// make variables available in all templates, provided that req.user is populated.
app.use(function(req, res, next) {
    res.locals.user = req.user;
    res.locals.appName = constants.APP_NAME;
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// serve the home
//app.get('/', routes.index);

// login the user
app.post('/signin', passport.authenticate('local'), function (req, res) {
    req.json(req.user);
});

// sign up a user
app.post('/signup', user.signup); // signup page send a POST request here

/*
    load helper methods for passport.js
    this is at the end to ensure everything has been loaded/required
*/
require('./config/pass.js')(passport);

// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
