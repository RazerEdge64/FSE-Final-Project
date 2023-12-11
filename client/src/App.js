import React, {useContext, useEffect, useState} from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Content from './components/Content.jsx';
import './stylesheets/index.css';
import './stylesheets/custom-buttons.css';
import './stylesheets/questions.css';
import './stylesheets/askQuestion.css';
import './stylesheets/cards.css';
import './stylesheets/answers.css';
import logger from "./logger/logger";
import SessionContext from "./sessionContext";

function App() {
    const [activeView, setActiveView] = useState('questions');
    const [activeTab, setActiveTab] = useState('questions');
    const [searchString, setSearchString] = useState('');
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    const [answers] = useState([]);

    const [editQuestion, setEditQuestion] = useState(null);
    const [editAnswer, setEditAnswer] = useState(null);



    const { user, isGuest, logout, setIsGuest } = useContext(SessionContext);

    const userId = user ? user._id : null;

    useEffect(() => {
        console.log("useEffect triggered in APP: ", { user, isGuest });

        // Check if the User is logged in and not a guest
        if (user && !isGuest) {
            setActiveView('questions'); // Redirect to home page or any other preferred view
        } else {
            if(isGuest) {
                setActiveView('questions'); // Redirect to home page or any other preferred view
            }
             else {
                setActiveView('login'); // or 'register' if you have a registration view
            }

        }

    }, [user, isGuest, setActiveView]);


    const handleRegisterClick = () => {
        console.log("clicked register");
        setActiveView('register');

    };



    const handleLogout = () => {
        console.log("clicked logout");
        logout();
        setActiveView('login');

    };

    const username = user ? user.username : '';

    const showSidebar = activeView !== 'login' && activeView !== 'register';



    const handleTagClick = (tagName) => {
        logger.log("clicked the tag - " + tagName);
        setSearchString(`[${tagName}]`);
        setActiveView('questions');
        setActiveTab('questions');
    };

    const handleQuestionClick = (questionId) => {
        logger.log("Question clicked - " + questionId);
        setSelectedQuestionId(questionId);
        setActiveView('answers');
    };

    // const handleNewAnswer = async (newAnswer) => {
    //     try {
    //         logger.log('Handling new answer:'+ newAnswer);
    //         console.log("from app",currentQuestion);
    //         await addAnswer(newAnswer, currentQuestion);
    //         setAnswers([...answers, newAnswer]);
    //         setActiveView('answers');
    //     } catch (error) {
    //         logger.log(error);
    //     }
    // };

    const handleSidebarClick = (view) => {
        logger.log("Handling the sidebar click " + view);
        setActiveView(view);
        setActiveTab(view);
    };

    const handleSearchEnter = () => {
        setActiveView('questions');
        setActiveTab('questions');
    };

    return (
        <div className="main">
            <Header
                searchString={searchString}
                setSearchString={setSearchString}
                onSearchEnter={handleSearchEnter}

                username={username}
                onLogout={handleLogout}
                isGuest={isGuest}
                setActiveView={setActiveView}
                setIsGuest={setIsGuest}


            />
            <div className="contentWrapper">
                {/*<Sidebar activeTab={activeTab} onSidebarClick={handleSidebarClick} />*/}
                {showSidebar && (
                    <Sidebar
                        activeTab={activeTab}
                        onSidebarClick={handleSidebarClick}
                    />
                )}

                <Content
                    activeView={activeView}
                    setActiveView={setActiveView}
                    setActiveTab={setActiveTab}
                    searchString={searchString}
                    handleTagClick={handleTagClick}
                    handleQuestionClick={handleQuestionClick}
                    // handleNewAnswer={handleNewAnswer}
                    selectedQuestionId={selectedQuestionId}
                    setSelectedQuestionId={setSelectedQuestionId}
                    answers={answers}
                    currentQuestion={currentQuestion}
                    setCurrentQuestion = {setCurrentQuestion}

                    handleRegisterClick={handleRegisterClick}
                    userId={userId}

                    editQuestion={editQuestion}
                    setEditQuestion = {setEditQuestion}
                    editAnswer={editAnswer}
                    setEditAnswer = {setEditAnswer}
                />
            </div>
        </div>
    );
}

export default App;
