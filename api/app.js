
/**
 * Module dependencies.
 */

var express = require('express'),       // the main ssjs framework
    db = require('./config/db'),        // database connection
    routes = require('./routes'),       // by default, brings in routes/index.js
    user = require('./routes/user'),  // all login for admin panel
    constants = require('./config/constants'),
    http = require('http'),
    path = require('path'),             // for path manipulation
    middleware = require('./config/middleware.js'),
    app = express();                    // create an express app
    //RedisStore = require('connect-redis')(express); // for persistent sessions

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
    app.use(express.session({ 
        secret: 'ecoSecret'
        // store: new RedisStore({
        //     host: 'localhost',
        //     port: 6379,
        //     db: 2
        // }),
    }));
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
app.post('/signin', user.signin);

// add a new score
app.post('/addscore', middleware.requiresLogin, user.addscore);

// add a message (or post) that is sent out to many people
app.post('/addmessage', middleware.requiresLogin, user.addmessage);

// get messages posted by logged in user
app.get('/mymessages', middleware.requiresLogin, user.getMyMessages);

// get all messages on the network except those by logged in user
app.get('/allmessages', middleware.requiresLogin, user.getAllMessages);

// Start the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
