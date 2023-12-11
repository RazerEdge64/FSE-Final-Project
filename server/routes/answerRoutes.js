const express = require('express');
const router = express.Router();
const Answer = require('../models/answers');
const Question = require('../models/questions');
const User = require('../models/user.js');


// Get all answers with transformed response
router.get('/', async (req, res) => {
    try {
        const answers = await Answer.find({});
        const transformedAnswers = answers.map(answer => {
            return {
                aid: answer._id.toString(), // Convert ObjectId to string
                text: answer.text,
                ansBy: answer.ans_by,
                ansDate: answer.ans_date_time
            };
        });
        res.json(transformedAnswers);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get an answer by ID
router.get('/:aid', async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.aid);
        if (!answer) {
            return res.status(404).send('Answer not found');
        }

        const transformedAnswer = {
            aid: answer._id.toString(), // Convert ObjectId to string
            text: answer.text,
            ansBy: answer.ans_by,
            ansDate: answer.ans_date_time
        };

        res.json(transformedAnswer);
    } catch (error) {
        res.status(500).send(error);
    }
});


// Add an answer to a question
router.post('/add/:questionId', async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            return res.status(404).send('Question not found');
        }

        const newAnswer = new Answer(req.body);
        await newAnswer.save();

        question.answers.push(newAnswer._id);
        question.last_activity = new Date();
        await question.save();

        res.status(201).json(newAnswer);
    } catch (error) {
        console.log("Error in adding answer: ", error);
        res.status(500).send(error);
    }
});

// Update an existing answer
router.post('/update/:answerId', async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.answerId);
        if (!answer) {
            return res.status(404).send('Answer not found');
        }

        // Update the fields of the answer
        answer.text = req.body.text;
        // answer.ans_date_time = req.body.ans_date_time; // Make sure to handle date updates appropriately

        await answer.save();

        // Find the question that contains this answer
        const question = await Question.findOne({ answers: answer._id });
        if (!question) {
            return res.status(404).send('Associated question not found');
        }

        // Update the last_activity field of the question
        question.last_activity = new Date();
        await question.save();


        res.status(200).json(answer);
    } catch (error) {
        console.log("Error in updating answer: ", error);
        res.status(500).send(error);
    }
});



// Upvote an answer
router.post('/:answerId/upvote', async (req, res) => {
    try {
        const answerId = req.params.answerId;
        const answer = await Answer.findById(answerId);

        if (!answer) {
            return res.status(404).send('Answer not found');
        }

        // Find the User who posted the answer
        const user = await User.findOne({ username: answer.ans_by });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update answer votes and User reputation
        answer.votes += 1;
        user.reputation += 5; // Increase reputation by 5 for upvote

        // Check the voter's reputation before allowing the vote
        const voter = await User.findById(req.session.user._id);
        if (voter.reputation < 50) {
            return res.status(403).send('Insufficient reputation to vote');
        }

        await answer.save();
        await user.save();

        // Find the question that contains this answer
        const question = await Question.findOne({ answers: answer._id });
        if (!question) {
            return res.status(404).send('Associated question not found');
        }

        // Update the last_activity field of the question
        question.last_activity = new Date();
        await question.save();


        res.status(200).json(answer);
    } catch (error) {
        console.error('Error upvoting answer:', error);
        res.status(500).send(error);
    }
});

// Downvote an answer
router.post('/:answerId/downvote', async (req, res) => {
    try {
        console.log(req.params)
        const answerId = req.params.answerId;
        const answer = await Answer.findById(answerId);
        console.log(answer);

        if (!answer) {
            return res.status(404).send('Answer not found');
        }

        // Find the User who posted the answer
        const user = await User.findOne({ username: answer.ans_by });
        console.log(user);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update answer votes and User reputation
        answer.votes -= 1;
        user.reputation -= 10; // Decrease reputation by 10 for downvote

        // Check the voter's reputation before allowing the vote
        console.log(req.session);
        const voter = await User.findById(req.session.user._id);
        if (voter.reputation < 50) {
            return res.status(403).send('Insufficient reputation to vote');
        }

        await answer.save();
        await user.save();

        // Find the question that contains this answer
        const question = await Question.findOne({ answers: answer._id });
        if (!question) {
            return res.status(404).send('Associated question not found');
        }

        // Update the last_activity field of the question
        question.last_activity = new Date();
        await question.save();


        res.status(200).json(answer);
    } catch (error) {
        console.error('Error downvoting answer:', error);
        res.status(500).send(error);
    }
});

// Delete an answer by ID
router.delete('/:aid', async (req, res) => {
    try {
        const answerId = req.params.aid;

        // Check if the answer exists
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.status(404).send('Answer not found');
        }

        await Question.updateOne(
            { answers: answerId },
            { $pull: { answers: answerId } }
        );

        // Delete the answer
        await Answer.findByIdAndDelete(answerId);

        res.status(204).send(); // 204 No Content
    } catch (error) {
        console.error('Error deleting answer:', error);
        res.status(500).send(error);
    }
});

router.get('/:answerId/question', async (req, res) => {
    try {
        const answerId = req.params.answerId;
        const question = await Question.findOne({ answers: answerId });
        if (!question) {
            return res.status(404).send('Question not found for the given answer');
        }

        res.status(200).json({ questionId: question._id });
    } catch (error) {
        console.error('Error finding question for answer:', error);
        res.status(500).send('Internal server error');
    }
});


module.exports = router;