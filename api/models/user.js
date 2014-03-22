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

module.exports = mongoose.model('User', userSchema);
