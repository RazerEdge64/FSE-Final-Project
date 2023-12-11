// const mongoose = require('mongoose');
//
// const questionSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     text: { type: String, required: true },
//     tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
//     answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
//     asked_by: { type: String, required: true },
//     ask_date_time: { type: Date, required: true },
//     views: { type: Number, default: 0 }
// });
//
// module.exports = mongoose.model('Question', questionSchema);

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    asked_by: { type: String, required: true },
    ask_date_time: { type: Date, required: true },
    views: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // New field for comments
    votes: { type: Number, default: 0 },
    acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }, // Reference to the accepted answer
    last_activity: { type: Date, required: false },
});

module.exports = mongoose.model('Question', questionSchema);
