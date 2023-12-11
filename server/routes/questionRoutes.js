const Question = require('../models/questions.js');
const User = require('../models/user.js'); // Assuming this is your User model

const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().populate('tags').populate('answers');
        const transformedQuestions = questions.map(question => {
            return {
                qid: question._id.toString(), // Convert ObjectId to string
                title: question.title,
                text: question.text,
                tagIds: question.tags.map(tag => tag._id.toString()),
                askedBy: question.asked_by,
                askDate: question.ask_date_time,
                views: question.views,
                ansIds: question.answers.map(answer => answer._id.toString()),
                votes: question.votes,
                last_activity : question.last_activity
            };
        });
        res.json(transformedQuestions);
    } catch (error) {
        console.log("Error in fetching questions data.", error);
        res.status(500).send(error);
    }
});

// Fetch a question by ID
// router.get('/:qid', async (req, res) => {
//     try {
//         const question = await Question.findById(req.params.qid).populate('tags').populate('answers');
//         if (!question) {
//             return res.status(404).send('Question not found');
//         }
//         // Transform the question object as needed
//         const answerCount = question.answers ? question.answers.length : 0;
//
//         // Include answer count in the response
//         res.json({
//             question: question,
//             answerCount: answerCount
//         });
//     } catch (error) {
//         console.log("Error in fetching question by ID.", error);
//         res.status(500).send(error);
//     }
// });
router.get('/:qid', async (req, res) => {
    try {
        // Populate answers and within each answer, populate comments
        const question = await Question.findById(req.params.qid)
            .populate({
                path: 'answers',
                populate: { path: 'comments' } // Assuming 'comments' is the field name in the Answer model
            })
            .populate('tags');
        if (!question) {
            return res.status(404).send('Question not found');
        }

        // console.log(question);

        // Transform the question object as needed
        const answerCount = question.answers ? question.answers.length : 0;

        // Return question details along with answer count
        res.json({
            question: question,
            answerCount: answerCount
        });
    } catch (error) {
        console.log("Error in fetching question by ID.", error);
        res.status(500).send(error);
    }
});


// Add a new question
router.post('/', async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body
        const newQuestion = new Question(req.body);
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        console.log("Error in adding new question:", error);
        res.status(500).send(error);
    }
});

// Update a question
router.put('/:qid', async (req, res) => {
    const questionId = req.params.qid;
    const updatedData = req.body;

    try {
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).send('Question not found');
        }

        // Update fields of the question
        question.title = updatedData.title;
        question.text = updatedData.text;
        question.tags = updatedData.tags; // Assuming tags are passed as an array of tag IDs
        question.last_activity = new Date(); // Update the last activity date

        await question.save();
        res.status(200).json(question);
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).send(error);
    }
});


// Increment views of a question
router.post('/increment-views/:qid', async (req, res) => {
    try {
        const questionId = req.params.qid;
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).send('Question not found');
        }

        question.views += 1; // Increment the views
        await question.save(); // Save the updated question

        res.status(200).send({message: 'Views incremented successfully'});
    } catch (error) {
        console.log("Error in incrementing question views:", error);
        res.status(500).send(error);
    }
});

// Get a question by ID with the count of answers
router.get('/:questionId/with-answers-count', async (req, res) => {
    try {
        const questionId = req.params.questionId;
        const question = await Question.findById(questionId).populate('answers');
        const answerCount = question.answers ? question.answers.length : 0;

        res.json({
            question: question,
            answerCount: answerCount
        });
    } catch (error) {
        console.log("Error in getting question with answer count:", error);
        res.status(500).send(error);
    }
});


// // Endpoint to get questions sorted by most recent answer activity
// router.get('/sorted/active', async (req, res) => {
//     try {
//         let questions = await Question.find({}).populate('answers');
//
//         questions.sort((a, b) => {
//
//             console.log(`Question A Answers: ${a.answers.length}, Question B Answers: ${b.answers.length}`);
//
//             const hasAnswersA = a.answers.length > 0;
//             const hasAnswersB = b.answers.length > 0;
//
//             if (hasAnswersA && !hasAnswersB) return -1;
//             if (!hasAnswersA && hasAnswersB) return 1;
//
//             const latestAnswerDateA = hasAnswersA
//                 ? new Date(Math.max(...a.answers.map(ans => new Date(ans.ans_date_time).getTime())))
//                 : new Date(a.ask_date_time);
//
//             const latestAnswerDateB = hasAnswersB
//                 ? new Date(Math.max(...b.answers.map(ans => new Date(ans.ans_date_time).getTime())))
//                 : new Date(b.ask_date_time);
//
//             return latestAnswerDateB - latestAnswerDateA;
//         });
//         res.json(questions);
//     } catch (error) {
//         console.error("Error fetching actively sorted questions:", error);
//         res.status(500).send(error);
//     }
// });
// Endpoint to get questions sorted by most recent activity
// router.get('/sorted/active', async (req, res) => {
//     try {
//         // Find and sort questions based on last_activity in descending order
//         const questions = await Question.find({}).sort({ last_activity: -1 }).populate('answers');
//         res.json(questions);
//     } catch (error) {
//         console.error("Error fetching actively sorted questions:", error);
//         res.status(500).send(error);
//     }
// });
router.get('/sorted/active', async (req, res) => {
    try {
        // Find and sort questions based on last_activity in descending order
        const questions = await Question.find({}).sort({ last_activity: -1 }).populate('tags').populate('answers');

        // Transform the questions into the desired format
        const transformedQuestions = questions.map(question => {
            return {
                qid: question._id.toString(), // Convert ObjectId to string
                title: question.title,
                text: question.text,
                tagIds: question.tags.map(tag => tag._id.toString()),
                askedBy: question.asked_by,
                askDate: question.ask_date_time,
                views: question.views,
                ansIds: question.answers.map(answer => answer._id.toString()),
                votes: question.votes,
                last_activity: question.last_activity
            };
        });

        res.json(transformedQuestions);
    } catch (error) {
        console.error("Error fetching actively sorted questions:", error);
        res.status(500).send(error);
    }
});


// // Upvote a question
// router.post('/:qid/upvote', async (req, res) => {
//     try {
//         const questionId = req.params.qid;
//         const question = await Question.findById(questionId);
//
//         if (!question) {
//             return res.status(404).send('Question not found');
//         }
//
//         question.votes += 1;
//         await question.save();
//
//         res.status(200).json(question);
//     } catch (error) {
//         console.error('Error upvoting question:', error);
//         res.status(500).send(error);
//     }
// });
//
//
//
// // Downvote a question
// router.post('/:qid/downvote', async (req, res) => {
//     try {
//         const questionId = req.params.qid;
//         const question = await Question.findById(questionId);
//
//         if (!question) {
//             return res.status(404).send('Question not found');
//         }
//
//         question.votes -= 1; // Decrement the vote count
//         await question.save(); // Save the updated question
//
//         res.status(200).json(question);
//     } catch (error) {
//         console.error('Error downvoting question:', error);
//         res.status(500).send(error);
//     }
// });

// Upvote a question
router.post('/:qid/upvote', async (req, res) => {
    try {
        const questionId = req.params.qid;
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).send('Question not found');
        }

        console.log(question.asked_by);
        // Find the User who asked the question
        const user = await User.findOne({ username: question.asked_by });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check User's reputation
        if (user.reputation < 50) {
            return res.status(403).send('Insufficient reputation to vote');
        }

        console.log(user);

        question.votes += 1;
        question.last_activity = new Date();
        user.reputation += 5;

        await question.save();
        await user.save();

        res.status(200).json(question);
    } catch (error) {
        console.error('Error upvoting question:', error);
        res.status(500).send(error);
    }
});

// Downvote a question
router.post('/:qid/downvote', async (req, res) => {
    try {
        const questionId = req.params.qid;
        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).send('Question not found');
        }

        // Find the User who asked the question
        const user = await User.findOne({ username: question.asked_by });
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Check User's reputation
        if (user.reputation < 50) {
            return res.status(403).send('Insufficient reputation to vote');
        }

        // Update question votes and User reputation
        question.votes -= 1;
        question.last_activity = new Date();

        user.reputation -= 10; // Decrease reputation by 10 for downvote

        await question.save();
        await user.save();

        res.status(200).json(question);
    } catch (error) {
        console.error('Error downvoting question:', error);
        res.status(500).send(error);
    }
});


// Endpoint to accept an answer
router.post('/:questionId/accept/:answerId', async (req, res) => {
    try {
        const { questionId, answerId } = req.params;
        console.log(questionId, answerId);
        const question = await Question.findById(questionId);

        // Check if the question exists
        if (!question) {
            return res.status(404).send('Question not found');
        }
        console.log(req.session);
        // Check if the User is the author of the question
        if (req.session.user.username !== question.asked_by.toString()) {
            return res.status(403).send('Unauthorized action');
        }

        // Check if the question already has an accepted answer
        if (question.acceptedAnswer) {
            return res.status(400).send('This question already has an accepted answer');
        }

        // Mark the answer as accepted
        question.acceptedAnswer = answerId;
        // await question.save();

        question.last_activity = new Date();
        await question.save();


        res.status(200).send('Answer accepted successfully');
    } catch (error) {
        console.error('Error accepting answer:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a question by ID
router.delete('/:qid', async (req, res) => {
    try {
        const questionId = req.params.qid;

        // First, find the question to ensure it exists
        const question = await Question.findById(questionId);
        if (!question) {
            return res.status(404).send('Question not found');
        }

        // Optional: Handle any additional logic, like removing references from other collections

        // Delete the question
        await Question.findByIdAndDelete(questionId);

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).send(error);
    }
});


module.exports = router;