/*
    Schema for a score (number metric).
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema // Each schema maps to a MongoDB collection
/*
    Field validators
*/

// For any user
var scoreSchema = new Schema({
    created_at: {
        // auto added user registration timestamp
        type: Date,
        default: Date.now
    },
    score: {
        type: Number
    }
});

module.exports = mongoose.model('Score', scoreSchema);
