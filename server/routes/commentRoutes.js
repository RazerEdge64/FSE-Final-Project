const express = require('express');
const router = express.Router();
const Comment = require('../models/comments');
const Question = require('../models/questions');
const Answer = require('../models/answers');

// Add a comment to a question
router.post('/questions/:questionId/comments', async (req, res) => {
    try {
        const { text } = req.body;
        const { questionId } = req.params;

        // Create and save the new comment
        const newComment = new Comment({ text, user: req.session.user._id });
        await newComment.save();

        // Find the question, attach the comment, and update last_activity
        const question = await Question.findByIdAndUpdate(
            questionId,
            {
                $push: { comments: newComment._id },
                $set: { last_activity: new Date() } // Update last_activity to current date and time
            },
            { new: true }
        );

        if (!question) {
            return res.status(404).send('Question not found');
        }

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).send('Error adding comment to question');
    }
});


// Add a comment to an answer
router.post('/answers/:answerId/comments', async (req, res) => {
    try {
        const { text } = req.body;
        const { answerId } = req.params;


        // Create and save the new comment
        const newComment = new Comment({ text, user: req.session.user._id });
        await newComment.save();

        // Find the answer and attach the comment
        const answer = await Answer.findByIdAndUpdate(
            answerId,
            { $push: { comments: newComment._id } },
            { new: true }
        );

        const question = await Question.findOne({ answers: answer._id });
        if (!question) {
            return res.status(404).send('Associated question not found');
        }

        // Update the last_activity field of the question
        question.last_activity = new Date();
        await question.save();

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).send('Error adding comment to answer');
    }
});

// Upvote a comment
// router.post('/:commentId/upvote', async (req, res) => {
//     try {
//         logger.log("here in comments server");
//
//         const { commentId } = req.params;
//
//         // Find the comment and increment votes
//         const comment = await Comment.findByIdAndUpdate(
//             commentId,
//             { $inc: { votes: 1 } },
//             { new: true }
//         );
//
//         res.status(200).json({ message: 'Comment upvoted successfully', votes: comment.votes });
//     } catch (error) {
//         res.status(500).send('Error upvoting comment');
//     }
// });
router.post('/:commentId/upvote', async (req, res) => {
    try {
        const { commentId } = req.params;
        const { parentType } = req.body;

        // Find the comment and increment votes
        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { $inc: { votes: 1 } },
            { new: true }
        );

        if (!comment) {
            return res.status(404).send('Comment not found');
        }

        let questionId;

        if (parentType === 'question') {
            // Find the question that contains this comment
            const question = await Question.findOne({ comments: commentId });
            if (question) {
                questionId = question._id;
            }
        } else if (parentType === 'answer') {

            const answer = await Answer.findOne({ comments: commentId });
            const q = await Question.findOne({answers: answer._id});
            if (q) {
                questionId = q._id;
            }
        }

        if (questionId) {
            await Question.findByIdAndUpdate(questionId, { last_activity: new Date() });
        }

        res.status(200).json({ message: 'Comment upvoted successfully', votes: comment.votes });
    } catch (error) {
        res.status(500).send('Error upvoting comment');
    }
});


// Get comments for a question
router.get('/questions/:questionId/comments', async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId).populate('comments');

        res.status(200).json(question.comments);
    } catch (error) {
        res.status(500).send('Error fetching comments for question');
    }
});

module.exports = router;
