// const mongoose = require('mongoose');
//
// const answerSchema = new mongoose.Schema({
//     text: { type: String, required: true },
//     ans_by: { type: String, required: true },
//     ans_date_time: { type: Date, required: true }
// });
//
// module.exports = mongoose.model('Answer', answerSchema);
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    ans_by: { type: String, required: true },
    ans_date_time: { type: Date, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // New field for comments
    votes: { type: Number, default: 0 },
    isAccepted: { type: Boolean, default: false } // Field to mark an answer as accepted

});

module.exports = mongoose.model('Answer', answerSchema);
