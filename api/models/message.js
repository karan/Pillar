/*
    Schema for a message.
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema; // Each schema maps to a MongoDB collection

// For any user
var messageSchema = new Schema({
    created_at: {
        // auto added user registration timestamp
        type: Date,
        default: Date.now
    },
    message: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

messageSchema.path('message').validate(function(value) {
    if (value.length < 10 || value.length > 2000)
        return next(new Error('length'));
});

module.exports = mongoose.model('Message', messageSchema);
