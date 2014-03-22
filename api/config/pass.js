/*
    This is a wrapper for all code used for user authentication.
*/

// All Passport stategies being used
var LocalStrategy = require('passport-local').Strategy;

// bring in the schema for user
var User = require('mongoose').model('User');

module.exports = function(passport) {
    console.log("logged?");
    /*
        user ID is serialized to the session. When subsequent requests are 
        received, this ID is used to find the user, which will be restored 
        to req.user.
    */
    passport.serializeUser(function (user, done) {
        console.log('serializing: ' + user);
        done(null, user._id);
    });

    /*
        intended to return the user profile based on the id that was serialized 
        to the session.
    */
    passport.deserializeUser(function(id, done) {
        console.log('deserializing: ' + id);
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // logic for local username login
    passport.use(new LocalStrategy(function(username, done) {
            console.log('authenticating.. LocalStrategy: ' + username)

            User.findOne( {'username': username}, function(err, user) {
                if (err) return done(err);

                if (!user) {
                    // the user doesn't exist
                    done(null, false, { message: 'Invalid login credentials' });
                }

                done(null, user);
            });
        }
    ));

};
