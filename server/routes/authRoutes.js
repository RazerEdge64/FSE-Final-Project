const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Assuming you have a User model
const Question = require('../models/questions');
const Tag = require('../models/tags');
const Answer = require('../models/answers');

// Register a new User
router.post('/register', async (req, res) => {
    try {
        // Create User with req.body data
        const newUser = new User(req.body);
        // Save the User to the database
        await newUser.save();
        // Return the created User (or just a success message)
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error in User registration:', error);
        res.status(500).send('Error in User registration');
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Find User by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await user.comparePassword(password);
        if (isMatch) {
            req.session.user = user;
            console.log("in login server", req.session.user);
            res.json({ message: 'Login successful', user });

        } else {
            return res.status(401).send('Invalid credentials');
        }

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Error logging in');
    }
});

// User logout
router.post('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error logging out:', err);
            return res.status(500).send('Error logging out');
        }
        res.json({ message: 'Logout successful' });
    });

});

router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        // If there's a User in the session, return some User details
        res.json({ user: req.session.user });
    } else {
        // If no User in session, return a response indicating no current session
        res.json({ user: null });
    }
});


router.get('/:userId/profile', async (req, res) => {
    try {
        const userId = req.params.userId;
        const userDetails = await User.findById(userId);

        // Aggregation pipeline to get user questions with tags populated
        const userQuestions = await Question.aggregate([
            { $match: { asked_by: userDetails.username } },
            { $lookup: {
                    from: 'tags', // The name of the collection to join
                    localField: 'tags', // The field from the questions collection
                    foreignField: '_id', // The field from the tags collection
                    as: 'tags' // The name for the result array
                }},
        ]);

        console.log(userQuestions);

        const userTags = await Tag.find({ created_by: userId });
        const userAnswers = await Answer.find({ ans_by: userDetails.username });

        res.json({
            userDetails,
            userQuestions,
            userTags,
            userAnswers
        });
    } catch (error) {
        console.error('Error fetching User profile:', error);
        res.status(500).send('Error fetching User profile');
    }
});

// Check if Email Exists
router.post('/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            // If a user with this email exists, return true
            res.json({ exists: true });
        } else {
            // If no user with this email exists, return false
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).send('Error checking email');
    }
});

router.post('/check-username', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).send('Error checking email');
    }
});


router.post('/check-username-email', async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).send('Error checking email');
    }
});

module.exports = router;
