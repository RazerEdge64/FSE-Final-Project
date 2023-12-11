// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const bodyParser = require('body-parser');
const session = require('express-session');


// Import routes
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');
const tagRoutes = require('./routes/tagRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fake_so', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Initialize Express app
const app = express();

// Use middleware
// app.use(cors());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000' // Replace with your client's URL
}));

// app.use(bodyParser.json());
app.use(express.json());

app.use(session({
    secret: 'your-secret-key', // This should be a long, random string to keep sessions secure
    resave: false, // This forces the session to be saved back to the session store
    saveUninitialized: false, // This forces a session that is "uninitialized" to be saved to the store
    cookie: {
        httpOnly: true,
        sameSite: true,
        secure: false
    },
}));


// Use routes
app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/tags', tagRoutes);
app.use('/users', authRoutes);
app.use('/comments', commentRoutes);



// Start the server
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
