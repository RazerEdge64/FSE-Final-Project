import QuestionsList from './QnA/QuestionsList';
import TagsList from './Tags/TagsList';
import AnswersPage from './QnA/AnswersPage';
import AskQuestionForm from './QnA/AskQuestionForm';
import AnswerQuestionForm from './QnA/AnswerQuestionForm';
import {getQuestionById} from '../services/dataServices';
import RegisterForm from "./auth/RegisterForm";
import {useContext} from "react";
import LoginForm from "./auth/LoginForm";
import SessionContext from "../sessionContext";
import UserProfile from './User/UserProfile';

/**
 * This is the method which is responsible for loading all the main content on the screen.
 * @param activeView    This state is used to update the active class in the sidebar.
 * @param setActiveView This method is used to set the current active state.
 * @param searchString  This state is used to check if there is a search text in the search bar.
 * @param setSearchString   This method is used to set the searchString value.
 * @returns {JSX.Element}   Returns the main content based on the constraints.
 * @constructor
 */
function Content({
                     activeView,
                     setActiveView,
                     setActiveTab,
                     searchString,
                     handleTagClick,
                     handleQuestionClick,
                     // handleNewAnswer,
                     selectedQuestionId,
                     setSelectedQuestionId,
                     answers,
                     currentQuestion,
                     setCurrentQuestion,
                     userId,

                     handleRegisterClick,
                     editQuestion,
                     setEditQuestion,
                     editAnswer,
                     setEditAnswer
                 }) {

    console.log("Current Active View:", activeView); // Debugging

    const { user, isGuest } = useContext(SessionContext); // Corrected line

    if (!user && !isGuest) {
        // Depending on activeView, show either the LoginForm or the RegisterForm
        if (activeView === 'login') {
            return (
                <div className="login-container">
                    <LoginForm setActiveView={setActiveView} handleRegisterClick={handleRegisterClick} />
                </div>
            );
        } else if (activeView === 'register') {
            return <RegisterForm setActiveView={setActiveView} />;
        }
    }

    return (
        <div className="content">
            {activeView === 'questions' &&
                <QuestionsList
                    searchString={searchString}
                    onQuestionClick={handleQuestionClick}
                    setActiveView={setActiveView}
                />
            }
            {activeView === 'tags' &&
                <TagsList
                    onTagClick={handleTagClick}
                    searchString = {searchString}
                    setActiveView={setActiveView}
                />
            }
            {activeView === 'askQuestion' &&
                <AskQuestionForm
                    setActiveView={setActiveView}
                    setActiveTab={setActiveTab}
                    editQuestionData={editQuestion}
                    setEditQuestion = {setEditQuestion}
                />}
            {activeView === 'answers' && (
                <AnswersPage
                    questionId={selectedQuestionId}
                    answers={answers}
                    setActiveView={async (view) => {
                        if (view === 'answerForm') {
                            try {
                                const question = await getQuestionById(selectedQuestionId);
                                setCurrentQuestion(question);
                            } catch (error) {
                                console.error('Error fetching question:', error);
                            }
                        }
                        setActiveView(view);
                    }}
                />
            )}

            {activeView === 'answerForm' && (
                <AnswerQuestionForm
                    currentQuestion={currentQuestion}
                    // onAnswerSubmit={handleNewAnswer}
                    editAnswer = {editAnswer}
                    setEditAnswer = {setEditAnswer}
                    setActiveView={setActiveView}
                    setActiveTab={setActiveTab}

                />
            )}

            {activeView === 'register' && <RegisterForm setActiveView={setActiveView} />}

            {activeView === 'login' && <LoginForm setActiveView={setActiveView} />}

            {activeView === 'profile' &&
                <UserProfile
                    userId={userId}
                    setActiveView={setActiveView}

                    editQuestion={editQuestion}
                    setEditQuestion = {setEditQuestion}

                    editAnswer = {editAnswer}
                    setEditAnswer = {setEditAnswer}
                    setSelectedQuestionId = {setSelectedQuestionId}
                />
            }
        </div>
    );
}

export default Content;
