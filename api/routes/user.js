var mongoose = require('mongoose');
var User = require('./../models/user');
var Message = require('../models/message.js');

/*
 * Sign up a user.
 */
exports.signup = function(req, res){
    // get the form values from "name" attribute of the form
    var user = new User({
        'username': req.body.username
    });

    console.log('signing up ' + user.username);

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
            // successful registration
            res.json({
                'response': 'OK',
                'user': user
            });
        }
    });
};

/*
 * Sign in a user
 */
exports.signin = function(req, res) {
    var username = req.body.username;

    console.log('signing in ' + username);

    User.findOne( {username: username}, function(err, user) {
        if (!user) {
            res.json({
                    'response': 'FAIL',
                    'errors': ['User not found']
                });
        } else {
            console.log(user);
            // save the user in sessions to be retrieved later
            req.session.user = user;   
            // successful registration
            res.json({
                'response': 'OK',
                'user': user
            });
        }
    });
};

/*
 * Add a new score for the logged in user.
 */
exports.addscore = function(req, res) {
    User.update(
        {'username': req.session.user.username},
        { $push: { 
            scores: {'score': +req.body.score} 
        } }, 
        function(err) {
        if (err) console.log(err);

        User.findOne({'username': req.session.user.username}, function(err, user) {
            res.json({
                'response': 'OK',
                'user': user
            });
        });
    });
};

/*
 * Add a new message for the logged in user.
 */
exports.addmessage = function(req, res) {

    var message = new Message({
        message: req.body.message,
        username: req.session.user.username
    });

    message.save(function(err) {
        if (err) {
            console.log(err);
            var fail_msgs = [];
            for (var field in err.errors) {
                fail_msgs.push(err.errors[field].message);
            }
            res.json({
                'response': 'FAIL',
                'errors': fail_msgs
            });
        } else {
            // successful registration
            res.json({
                'response': 'OK',
                'message': message
            });
        }
    });
}
