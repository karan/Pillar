/*
    This is a wrapper for all code used for user authentication.
*/

// All Passport stategies being used
var LocalStrategy = require('passport-local').Strategy;

// bring in the schema for user
var User = require('mongoose').model('User'),
    Constants = require('./constants');

module.exports = function (passport) {

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
            if (err) done(err);
            done(null, user);
        });
    });
    
    // logic for local username/password login
    passport.use(new LocalStrategy({
        usernameField: 'username'
    }, function(username, callback) {
            console.log('authenticating.. LocalStrategy: ' + username)

            // user can also login using email/password
            var conditions = {}
            conditions.username = username;
            
            User.findOne(conditions, function(err, user) {
                if (err) return callback(err);

                if (!user) {
                    // the user doesn't exist
                    return callback(null, false, {message: 'Username not found'});
                }

                // user exists, check for password match
                user.comparePassword(username, function(err, isMatch) {
                    if (err) return callback(err);
                    console.log(isMatch + ' ' + username);
                    if (isMatch) {
                        // correct password
                        return callback(null, user);
                    }

                    // password incorrect
                    return callback(null, false, {message: 'User not found'});
                });
            });
        }
    ));

}