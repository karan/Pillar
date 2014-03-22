var mongoose = require('mongoose');
var User = require('./../models/user');

/*
 * Sign up a user.
 */
exports.signup = function(req, res){
    // get the form values from "name" attribute of the form
    var user = new User({
        'username': req.body.usernameField
    });

    console.log(user.username);

    user.save(function(err) {
        if (err) {
            console.log('got into error');
            if (err.code == 11000) {
                console.log('\n----' + err + '---');
                res.json({
                    'response': 'FAIL',
                    'errors': ["User already exists"]
                });
            } else {
                console.log(err);
                var fail_msgs = [];
                for (var field in err.errors) {
                    fail_msgs.push(err.errors[field].message);
                }
                res.json({
                    'response': 'FAIL',
                    'errors': fail_msgs
                });
            }
        } else {
            req.logIn(user, function(err) {
                // successful registration
                res.json({
                    'response': 'OK',
                    'user': user
                });
            });
        }
    });
};
