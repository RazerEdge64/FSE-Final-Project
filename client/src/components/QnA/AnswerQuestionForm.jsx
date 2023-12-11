import React, {useContext, useEffect, useState} from 'react';
import logger from "../../logger/logger";
import SessionContext from "../../sessionContext";
import {addAnswer, updateAnswer} from "../../services/dataServices";

function AnswerQuestionForm({ currentQuestion, editAnswer, setEditAnswer, setActiveView, setActiveTab }) {

    console.log(currentQuestion);

    const [username, setUsername] = useState(editAnswer ? editAnswer.ans_by : '');
    const [answerText, setAnswerText] = useState(editAnswer ? editAnswer.text : '');

    const [usernameError, setUsernameError] = useState('');
    const [textError, setTextError] = useState('');

    const { user } = useContext(SessionContext);

    useEffect(() => {
        setUsername(user.username);
        return () => {
            setEditAnswer(null);
        };
    }, [user, setEditAnswer]);

    useEffect(() => {
        // Assuming you want to set the answer text when an answer is being edited
        if (editAnswer) {
            setAnswerText(editAnswer.text);
        }

        // Cleanup when the component unmounts or editAnswer changes
        return () => {
            setEditAnswer(null);
        };
    }, [editAnswer, setEditAnswer]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        logger.log('Answer question submit button clicked');

        let valid = true;
        setTextError('');

        // Validate answer text
        if (!answerText.trim()) {
            valid = false;
            setTextError('Answer text cannot be empty');
        }

        if (!answerText.trim()) {
            valid = false;
            setTextError('Answer text cannot be empty');
        } else {
            const hyperlinkRegex = /\[([^\]]+)\]\((https:\/\/[^)]+)\)/g;
            let match;
            let invalidLinkFound = false;

            while ((match = hyperlinkRegex.exec(answerText)) !== null) {
                if (match[1].trim() === '' || match[2].trim() === '') {
                    invalidLinkFound = true;
                    break;
                }
            }

            if (invalidLinkFound || (answerText.includes('[') && !hyperlinkRegex.test(answerText))) {
                valid = false;
                setTextError('Invalid hyperlink');
            } else {
                setTextError('');
            }
        }


        if (valid) {
            try {
                const answerData = {
                    text: answerText,
                    ans_by: user.username, // Use the username from the context
                    ans_date_time: new Date() // The server will typically handle setting the date
                };

                if (editAnswer && editAnswer._id) {
                    console.log("update Answer", answerData);
                    // Editing an existing answer
                    answerData._id = editAnswer._id; // Ensure the ID is included
                    const updatedAnswer = await updateAnswer(answerData); // Update the answer
                    // Handle the post-update logic, e.g., updating state or navigating
                } else {
                    console.log("add Answer", answerData);
                    const newAnswer = await addAnswer(answerData, currentQuestion);
                    // Handle the post-addition logic, e.g., updating state or navigating
                }

                // Clear the form fields and state
                setAnswerText('');
                setEditAnswer(null);

                // Your logic here after posting or updating the answer
                // Example: Navigate to the updated answers list
                setActiveView('answers');

            } catch (error) {
                logger.log('Error submitting answer:', error);
                // Handle error, e.g., show error message to user
            }
        }
    };



    return (
        <div className="ask-question-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <h3>Username*</h3>
                    <input 
                        type="text" 
                        id="answerUsernameInput" 
                        value={username} 
                        // onChange={(e) => setUsername(e.target.value)}
                        disabled={true}
                    />
                    <div className="error-message">{usernameError}</div>
                </div>
                <div className="form-group">
                    <h3>Answer Text*</h3>
                    <input 
                        type="text" 
                        id="answerTextInput" 
                        value={answerText} 
                        onChange={(e) => setAnswerText(e.target.value)} 
                    />
                    <div className="error-message">{textError}</div>
                </div>
                <button type="submit" className="blue-button">Post Answer</button>
            </form>
        </div>
    );
}

export default AnswerQuestionForm;
