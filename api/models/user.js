/*
    Schema for a user.
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema, // Each schema maps to a MongoDB collection
    Constants = require('../config/constants');
/*
    Field validators
*/

// For any user
var userSchema = new Schema({
    created_at: {
        // auto added user registration timestamp
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        unique: true
    }
});

// Always hash a password before saving it to db
// Mongoose middleware is not invoked on update() operations, 
// so you must use a save()if you want to update user passwords.
userSchema.pre('save', function(next) {
    var user = this;
    // only hash this password if it has been modified, or is new
    if (!user.isModified('username')) return next();
    next();
});

module.exports = mongoose.model('User', userSchema);
