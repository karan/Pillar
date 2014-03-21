/*
    Schema for a user.
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Message = require('./message.js'); // Each schema maps to a MongoDB collection

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
    },
    scores: [{ 
        score: Number,
        timestamp: { type: Date, default: Date.now },
    }]
});

module.exports = mongoose.model('User', userSchema);
