const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the User model
});

module.exports = mongoose.model('Tag', tagSchema);
