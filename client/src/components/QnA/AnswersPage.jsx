import React, {useState, useEffect, useContext} from 'react';
import {
    getQuestionById,
    addComment,
    upvoteComment,
    getCommentsForQuestion,
    upvoteQuestion, downvoteQuestion, upvoteAnswer, downvoteAnswer, acceptAnswer
} from '../../services/dataServices.js';
import { formatDate } from '../../utils/utilities.js';
import logger from "../../logger/logger";
import SessionContext from "../../sessionContext";
import CommentSection from "./CommentSection";

function AnswersPage({ questionId, setActiveView }) {
    logger.log("questionID - ",questionId);
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    const [questionComments, setQuestionComments] = useState([]);

    const { user, isGuest } = useContext(SessionContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const indexOfLastAnswer = currentPage * itemsPerPage;
    const indexOfFirstAnswer = indexOfLastAnswer - itemsPerPage;
    const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);

    const [acceptedAnswerId, setAcceptedAnswerId] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');


    const isQuestionAuthor = () => {
        console.log(user, question);
        return question && user && question.asked_by === user.username;
    };


    const handleAcceptAnswer = async (answerId) => {
        try {
            await acceptAnswer(questionId, answerId);
            console.log('Answer accepted successfully');

            // Find the accepted answer and move it to the top of the list
            const acceptedAnswer = answers.find(answer => answer._id === answerId);
            const otherAnswers = answers.filter(answer => answer._id !== answerId);

            // Update state to reflect the new order of answers
            setAnswers([acceptedAnswer, ...otherAnswers]);
            setAcceptedAnswerId(answerId); // Update the state to reflect the accepted answer
        } catch (error) {
            console.error('Error in accepting the answer:', error);
        }
    };




    useEffect(() => {
        console.log(answers);
    }, [answers]);

    const renderPaginationControls = () => {
        const pageCount = Math.ceil(answers.length / itemsPerPage);
        return (
            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Prev
                </button>
                {[...Array(pageCount).keys()].map(number => (
                    <button key={number + 1} onClick={() => setCurrentPage(number + 1)}>
                        {number + 1}
                    </button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))} disabled={currentPage === pageCount}>
                    Next
                </button>
            </div>
        );
    };

    // Function to handle adding a comment to a question
    const handleAddQuestionComment = async (questionId, commentText) => {
        console.log("handleAddQuestionComment ",questionId, commentText);
        if (commentText.length > 140) {
            console.error('Comment must be less than 140 characters.');
            return;
        }

        try {
            const newComment = await addComment('question', questionId, { text: commentText });
            setQuestionComments(prevComments => {
                // Ensure prevComments is an array
                const existingComments = Array.isArray(prevComments) ? prevComments : [];
                return [newComment, ...existingComments];
            });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };


    const handleAddAnswerComment = async (answerId, commentText) => {
        console.log("handleAddAnswerComment ",answerId, commentText);
        if (commentText.length > 140) {
            console.error('Comment must be less than 140 characters.');
            return;
        }

        try {
            const newComment = await addComment('answer', answerId, { text: commentText });
            setAnswers(prevAnswers => prevAnswers.map(answer => {
                if (answer._id === answerId) {
                    // Update comments for the specific answer
                    const updatedComments = [newComment, ...(answer.comments || [])];
                    return { ...answer, comments: updatedComments };
                }
                return answer;
            }));
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };


    const handleUpvoteComment = async (commentId, parentType) => {

        if (user && user.reputation < 50) {
            setErrorMessage('You need a reputation of at least 50 to vote on comments.');
            return;
        }

        try {
            await upvoteComment(commentId, parentType);

            if (parentType === 'question') {
                // Update question comments
                setQuestionComments(prevComments => prevComments.map(comment => {
                    if (comment._id === commentId) {
                        return { ...comment, votes: comment.votes + 1 };
                    }
                    return comment;
                }));
            } else if (parentType === 'answer') {
                // Update answer comments
                setAnswers(prevAnswers => prevAnswers.map(answer => {
                    if (answer.comments.some(comment => comment._id === commentId)) {
                        const updatedComments = answer.comments.map(comment => {
                            if (comment._id === commentId) {
                                return { ...comment, votes: comment.votes + 1 };
                            }
                            return comment;
                        });
                        return { ...answer, comments: updatedComments };
                    }
                    return answer;
                }));
            }
        } catch (error) {
            console.error('Error upvoting comment:', error);
        }
    };


    // Fetch comments for the question
    useEffect(() => {
        const fetchQuestionComments = async () => {
            // TODO: Implement getCommentsForQuestion in your data service
            const fetchedComments = await getCommentsForQuestion(questionId);
            setQuestionComments(fetchedComments);
        };

        fetchQuestionComments();
    }, [questionId]);


    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedQuestion = await getQuestionById(questionId);
                if (fetchedQuestion) {
                    setQuestion(fetchedQuestion);
                    setAcceptedAnswerId(fetchedQuestion.acceptedAnswer);

                    let sortedAnswers = [];
                    if (fetchedQuestion.acceptedAnswer) {

                        const acceptedAnswer = fetchedQuestion.answers.find(answer => answer._id === fetchedQuestion.acceptedAnswer);
                        const otherAnswers = fetchedQuestion.answers.filter(answer => answer._id !== fetchedQuestion.acceptedAnswer);


                        sortedAnswers = otherAnswers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
                        if (acceptedAnswer) {
                            sortedAnswers.unshift(acceptedAnswer);
                        }
                    } else {

                        sortedAnswers = fetchedQuestion.answers.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
                    }
                    console.log(sortedAnswers);
                    setAnswers(sortedAnswers);
                }
            } catch (error) {
                logger.log('Error fetching question or answers:', error);
            }
        }

        fetchData();
    }, [questionId]);


    const handleAnswerClick = () => {
        setActiveView('answerForm');
    };

    const processHyperlinks = (text) => {
        const regex = /\[([^\]]+)\]\((https:\/\/[^)]+)\)/g;
        return text.replace(regex, '<a href="$2" target="_blank">$1</a>');
    };

    const handleUpvoteClick = async (id) => {
        // Check user reputation before allowing upvote
        if (user && user.reputation < 50) {
            setErrorMessage('You need a reputation of at least 50 to vote.');
            return;
        }

        try {
            const updatedQuestion = await upvoteQuestion(id);
            setQuestion({ ...question, votes: updatedQuestion.votes });
            setErrorMessage(''); // Clear any error messages
        } catch (error) {
            console.error('Error upvoting question:', error);
        }
    };

    const handleDownvoteClick = async (id) => {

        if (user && user.reputation < 50) {
            setErrorMessage('You need a reputation of at least 50 to vote.');
            return;
        }

        try {
            const updatedQuestion = await downvoteQuestion(id);
            setQuestion({ ...question, votes: updatedQuestion.votes });
            setErrorMessage('');
        } catch (error) {
            console.error('Error downvoting question:', error);
        }
    };

    const handleUpvoteAnswer = async (answerId) => {

        if (user && user.reputation < 50) {
            setErrorMessage('You need a reputation of at least 50 to vote.');
            return;
        }

        try {
            const updatedAnswer = await upvoteAnswer(answerId);
            setAnswers(answers.map(answer => answer._id === answerId ? { ...answer, votes: updatedAnswer.votes } : answer));
            setErrorMessage('');
        } catch (error) {
            console.error('Error upvoting answer:', error);
        }
    };

    const handleDownvoteAnswer = async (answerId) => {

        if (user && user.reputation < 50) {
            setErrorMessage('You need a reputation of at least 50 to vote.');
            return;
        }

        try {
            const updatedAnswer = await downvoteAnswer(answerId);
            setAnswers(answers.map(answer => answer._id === answerId ? { ...answer, votes: updatedAnswer.votes } : answer));
            setErrorMessage('');
        } catch (error) {
            console.error('Error downvoting answer:', error);
        }
    };


    return (
        <div className="answers-page">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {question && (
                <div id="answersHeader" className="header">
                    <div>
                        <h2>{question.answerCount} answers</h2>
                    </div>
                    <div>
                        <h3>{question.title}</h3>
                    </div>
                    <div>
                        <button
                            className="blue-button"
                            id="askQuestionBtn"
                            onClick={() => setActiveView('askQuestion')}
                            disabled={isGuest}
                        >Ask a Question</button>
                    </div>
                </div>
            )}

            {question && (
                <div>
                    <div id="questionContainer">
                        <div id="questionBody">
                            <div id="questionVotings">
                                <button className="upvote-button-question" onClick={() => handleUpvoteClick(questionId)}>Upvote</button>
                                <div className="votes-display">
                                    <span>{question.votes} votes</span>
                                </div>
                                <button className="downvote-button-question" onClick={() => handleDownvoteClick(questionId)}>Downvote</button>

                                <div>
                                    <p>{question.views} views</p>
                                </div>
                            </div>

                            <div>
                                <p dangerouslySetInnerHTML={{ __html: processHyperlinks(question.text) }} />
                            </div>
                            <div className="lastActivity">
                                <p>
                                    <span>{question.askedBy}</span><br />
                                    asked {formatDate(new Date(question.ask_date_time))}
                                </p>
                            </div>
                        </div>
                        <div id="tagsContainer">
                            {question.tags.map((tag, index) => (
                                <span key={index}>{tag.name}</span>
                            ))}
                        </div>
                    </div>


                    <CommentSection
                        comments={questionComments}
                        onAddComment={handleAddQuestionComment}
                        onUpvoteComment={handleUpvoteComment}
                        isGuest={isGuest}
                        parentId={questionId}
                        parentType="question"
                    />
                </div>
    )}

            <div id="answersContainer" className="answer-container">
                {currentAnswers && currentAnswers.map(answer => (
                    <div>
                        {/*<div className="answer" key={answer._id}>*/}
                        <div key={answer._id} className={`answer ${acceptedAnswerId === answer._id ? 'accepted-answer' : ''}`}>

                            <div className="answer-voting">
                                <button className="upvote-button-answer" onClick={() => handleUpvoteAnswer(answer._id)}>Upvote</button>
                                <div className="votes-display">
                                    <span className="answerVotes">{answer.votes} votes</span>
                                </div>
                                <button className="downvote-button-answer" onClick={() => handleDownvoteAnswer(answer._id)}>Downvote</button>
                            </div>
                            {isQuestionAuthor(question.asked_by) && (
                                <button
                                    className="accept-answer-button"
                                    onClick={() => handleAcceptAnswer(answer._id)}
                                >
                                    Accept Answer
                                </button>
                            )}


                            <div className="answerText">

                                <div dangerouslySetInnerHTML={{ __html: processHyperlinks(answer.text) }} />
                            </div>
                            <div className="answerAuthor">
                                {answer.ans_by} <br /> answered on {formatDate(answer.ans_date_time)}
                            </div>
                        </div>
                        <CommentSection
                            comments={answer.comments}
                            onAddComment={handleAddAnswerComment}


                            onUpvoteComment={handleUpvoteComment}
                            isGuest={isGuest}
                            parentId={answer._id}
                            parentType="answer"
                        />

                    </div>

                ))}
                {currentAnswers && currentAnswers.length === 0 && <p>No answers available.</p>}
                {renderPaginationControls()}
                <button
                    className="blue-button"
                    id="answerQuestionBtn"
                    style={{ marginTop: '20px' }}
                    onClick={handleAnswerClick}
                    disabled={isGuest}
                >
                    Answer Question
                </button>

            </div>
        </div>
    );
}

export default AnswersPage;
