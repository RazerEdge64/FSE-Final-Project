import React, { useState, useEffect } from 'react';
import {getUserProfile} from '../../services/authServices.js';
import "../../stylesheets/userProfile.css"
import {
    deleteUserAnswer,
    deleteUserQuestion,
    deleteUserTag,
    getQuestionIdForAnswer,
    updateUserTag
} from "../../services/dataServices";
const UserProfile = ({ userId, setActiveView, setEditQuestion, setEditAnswer, setSelectedQuestionId }) => {
    const [userData, setUserData] = useState(null);
    const [userQuestions, setUserQuestions] = useState([]);
    const [userTags, setUserTags] = useState([]);
    const [userAnswers, setUserAnswers] = useState([]);
    const [activeSection, setActiveSection] = useState('info');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const [editingTagId, setEditingTagId] = useState(null);
    const [editedTagName, setEditedTagName] = useState("");

    const itemsPerPage = 5;

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            setError(null);

            try {
                const userProfile = await getUserProfile(userId);
                setUserData(userProfile.userDetails);
                setUserQuestions(userProfile.userQuestions);
                setUserTags(userProfile.userTags);
                setUserAnswers(userProfile.userAnswers);

                console.log(userProfile);
            } catch (error) {
                console.error('Error fetching User profile:', error);
                setError('Error fetching User profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);


    const calculateDaysSinceJoining = (joinDate) => {
        const today = new Date();
        const joiningDate = new Date(joinDate);
        const diffTime = Math.abs(today - joiningDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        setCurrentPage(1);
    };

    const renderQuestions = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentQuestions = userQuestions.slice(startIndex, endIndex);

        console.log("user profile",userQuestions);

        return (
            <div className="user-questions-container">
                {currentQuestions.map(question => (
                    <div key={question._id} className="user-question">
                        <div className="user-question-title" onClick={() => handleEditQuestion(question)}>
                            {question.title}
                        </div>
                        <div className="user-question-delete">
                             <button className="deleteQuestionButton" onClick={() => handleDeleteQuestion(question._id)}>Delete</button>
                        </div>
                    </div>
                ))}
                <div className="pagination-controls">
                    <button id="prevQuestionsPagination" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
                    <button id="nextQuestionsPagination" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(userQuestions.length / itemsPerPage)))} disabled={currentPage * itemsPerPage >= userQuestions.length}>Next</button>
                </div>
            </div>
        );
    };

    const handleEditQuestion = (question) => {
        setEditQuestion(question);
        setActiveView('askQuestion');
    };

    const handleDeleteQuestion = async (questionId) => {
        try {
            await deleteUserQuestion(questionId);
            const updatedQuestions = userQuestions.filter(question => question._id !== questionId);
            setUserQuestions(updatedQuestions);
        } catch (error) {
            console.error('Error deleting question:', error);
        }
    };


    const handleEditTag = (tag) => {
        setEditingTagId(tag._id);
        setEditedTagName(tag.name);
    };

    const handleUpdateTag = async (tagId) => {
        try {
            await updateUserTag(tagId, editedTagName);
            const updatedTags = userTags.map(tag =>
                tag._id === tagId ? { ...tag, name: editedTagName } : tag
            );
            setUserTags(updatedTags);
            setEditingTagId(null);
        } catch (error) {
            console.error('Error updating tag:', error);
        }
    };


    const handleDeleteTag = async (tagId) => {
        try {
            // Presuming deleteUserTag is an API call to delete the tag
            await deleteUserTag(tagId);
            // Update the user tags state to remove the deleted tag
            const updatedTags = userTags.filter(tag => tag._id !== tagId);
            setUserTags(updatedTags);
        } catch (error) {
            // Handle any errors, e.g., show an error message
            console.error('Error deleting tag:', error);
        }
    };




    const renderTags = () => {
        return (
            <div className="tags-grid">
                {userTags.map(tag => (
                    <div key={tag._id} className="tagNode tag-card">
                        {editingTagId === tag._id ? (
                            <input
                                value={editedTagName}
                                required
                                onChange={(e) => setEditedTagName(e.target.value)}
                            />
                        ) : (
                            tag.name
                        )}

                        <div>
                            {editingTagId === tag._id ? (
                                <button className="updateTagButton" onClick={() => handleUpdateTag(tag._id)}>Update</button>
                            ) : (
                                <button className="editTagButton" onClick={() => handleEditTag(tag)}>Edit</button>
                            )}
                            <button className="deleteTagButton" onClick={() => handleDeleteTag(tag._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // const handleEditAnswer = (answer) => {
    //     console.log(answer);
    //     setEditAnswer(answer); // Store the answer data for editing
    //     setActiveView('answerForm'); // Change the view to AnswerQuestionForm
    // };
    const handleEditAnswer = async (answer) => {
        console.log(answer);
        const questionId = await getQuestionIdForAnswer(answer._id);

        if (questionId) {
            setEditAnswer(answer); // Store the answer data for editing
            setSelectedQuestionId(questionId); // Set the selected question ID
            setActiveView('answerForm'); // Change the view to AnswerQuestionForm
        } else {
            // Handle error: Question ID not found
        }
    };


    const handleDeleteAnswer = async (answerId) => {
        try {
            await deleteUserAnswer(answerId);
            const updatedAnswers = userAnswers.filter(answer => answer._id !== answerId);
            setUserAnswers(updatedAnswers);
        } catch (error) {
            console.error('Error deleting answer:', error);
        }
    };


    const renderAnswers = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentAnswers = userAnswers.slice(startIndex, endIndex);

        return (
            <div className="user-answers-container">
                {currentAnswers.length > 0 ? (
                    currentAnswers.map(answer => (
                        <div key={answer._id} className="user-answer">
                            <div className="user-answer-link">
                                <a href="#" onClick={() => handleEditAnswer(answer)}>{truncateText(answer.text, 50)}</a>
                            </div>
                            <div className="user-answer-delete">
                                <button className="deleteAnswerButton" onClick={() => handleDeleteAnswer(answer._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No answers</div>
                )}
                <div className="pagination-controls">
                    <button id="prevAnswersPagination" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
                    <button id="nextAnswersPagination" onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(userAnswers.length / itemsPerPage)))} disabled={currentPage * itemsPerPage >= userAnswers.length}>Next</button>
                </div>
            </div>
        );
    };


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            {userData ? (

                <div>
                    <div className="user-details-container">
                        <div className="user-name">
                            <h2>{userData.username}</h2>
                        </div>

                        {/*{activeSection === 'info' && (*/}
                            <div className="user-details">
                                <p>Days as a Member: {calculateDaysSinceJoining(userData.joinDate)}</p>
                                <p>User Reputation: {userData.reputation}</p>
                            </div>
                        {/*)}*/}
                        <div className="user-functions">
                            <div>
                                <button id="user-questions-button" onClick={() => handleSectionChange('questions')}>View My Questions</button>
                            </div>
                            <div>
                                <button id="user-tags-button" onClick={() => handleSectionChange('tags')}>View My Tags</button>
                            </div>
                            <div>
                                <button id="user-answers-button" onClick={() => handleSectionChange('answers')}>View My Answers</button>
                            </div>

                        </div>

                    </div>
                    <div className="user-views">
                        {activeSection === 'questions' && renderQuestions()}
                        {activeSection === 'tags' && renderTags()}
                        {activeSection === 'answers' && renderAnswers()}
                    </div>
                </div>

            ) : (
                <div>No user data found</div>
            )}
        </div>
    );
};

export default UserProfile;
