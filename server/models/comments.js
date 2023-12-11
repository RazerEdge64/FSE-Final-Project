const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date_time: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Comment', commentSchema);
