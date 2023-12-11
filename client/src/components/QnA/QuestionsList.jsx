import React, {useState, useEffect, useContext} from 'react';
import {getAllQuestions, getTagById, getAnswerById, incrementQuestionViews, getAllTags, getQuestionsSortedByActive} from '../../services/dataServices.js';
import { formatDate } from '../../utils/utilities.js';
import logger from "../../logger/logger";
import SessionContext from "../../sessionContext";
function QuestionsList({ onQuestionClick, searchString, setActiveView }) {

    const [questions, setQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [sortType, setSortType] = useState('newest');

    const headerName = searchString ? "Search Results" : "All Questions";

    const { isGuest } = useContext(SessionContext);

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    const indexOfLastQuestion = currentPage * itemsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

    logger.log("searchString " + searchString);

    const renderPaginationControls = () => {
        const pageCount = Math.ceil(questions.length / itemsPerPage);
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

    useEffect(() => {
        async function fetchData() {
            const fetchedTags = await getAllTags();
            setTags(fetchedTags);
            await displayQuestions(sortType);
        }

        fetchData();
    }, [sortType]);


    useEffect(() => {
        logger.log("searchString changed: "+ searchString);

        if (searchString) {
            searchAndDisplayQuestions(searchString);
        } else {
            displayQuestions(sortType);
        }
    }, [searchString, tags]);

    async function handleQuestionClick(question) {
        logger.log("handle Question");

        await incrementQuestionViews(question.qid);

        const updatedQuestions = questions.map(q => {
            if (q.qid === question.qid) {
                return { ...question, views: question.views + 1 };
            }
            return q;
        });
        setQuestions(updatedQuestions);

        if (onQuestionClick) {
            onQuestionClick(question.qid);
        }
    }


    function createQuestionElement(question) {
        return (
            <div className="question" key={question.qid}>
                <div className="postStats">
                    <span>{question.votes} votes</span>
                    <span>{question.ansIds.length} answers</span>
                    <span>{question.views} views</span>
                </div>
                <div className="postTitleContainer">
                    <div className="postName">
                        <div className="postTitle">
                            <a href="#" data-qid={question.qid} onClick={() => handleQuestionClick(question)}>{question.title}</a>

                        </div>
                    </div>
                    <div className="postTags">
                    {question.tagIds.map(tagId => {
                            const tag = tags.find(t => t.tid === tagId);
                            return tag ? <span key={tagId}>{tag.name}</span> : null;
                        })}
                    </div>
                </div>
                <div className="lastActivity">
                    <span>{question.askedBy}</span>&nbsp;asked {formatDate(question.askDate)}
                </div>
            </div>
        );
    }

    
    function displayQuestions(sortType) {
        getAllQuestions().then(allQuestions => {
            if (sortType === 'active') {
                getQuestionsSortedByActive().then(activeSortedQuestions => {
                    logger.log("from active sorting", activeSortedQuestions);
                    setQuestions(activeSortedQuestions);
                }).catch(error => {
                    logger.log('Error fetching actively sorted questions:', error);
                });
            } else {
                let sortedQuestions = [...allQuestions];
                switch (sortType) {
                    case 'newest':
                        sortedQuestions.sort((a, b) => new Date(b.askDate) - new Date(a.askDate));
                        break;
                    case 'unanswered':
                        sortedQuestions = sortedQuestions.filter(q => q.ansIds.length === 0);
                        break;
                }
                logger.log("Questionslist ", sortedQuestions);
                setQuestions(sortedQuestions);
            }
        }).catch(error => {
            logger.log('Error in displayQuestions: ', error);
        });
    }

    async function searchAndDisplayQuestions(searchString) {
        const tags = searchString.match(/\[([^\]]+)\]/g) || [];
        const words = searchString.replace(/\[([^\]]+)\]/g, '').trim().split(/\s+/).filter(word => word);

        const allQuestions = await getAllQuestions();

        const questionPromises = allQuestions.map(async question => {
            const hasMatchingTag = await Promise.all(tags.map(async tag => {
                const tagName = tag.slice(1, -1).toLowerCase();
                return Promise.all(question.tagIds.map(async tagId => {
                    const tag = await getTagById(tagId);
                    return tag.name.toLowerCase() === tagName;
                })).then(results => results.some(result => result));
            })).then(results => results.some(result => result));

            const hasMatchingWord = words.some(word =>
                question.title.toLowerCase().includes(word.toLowerCase()) ||
                question.text.toLowerCase().includes(word.toLowerCase())
            );

            return hasMatchingTag || hasMatchingWord;
        });

        const filteredQuestions = (await Promise.all(questionPromises))
            .map((matches, index) => matches ? allQuestions[index] : null)
            .filter(question => question !== null);

        const sortedQuestions = filteredQuestions.sort((a, b) => new Date(b.askDate) - new Date(a.askDate));

        setQuestions(sortedQuestions);
    }

    return (
        <div>
            <div className="header">
                <div className="header-first-row">
                    <h2>{headerName}</h2>

                    <div>
                        {/*<button className="blue-button" id="askQuestionBtn">Ask a Question</button>*/}
                        <button
                            disabled={isGuest}
                            className="blue-button"
                            id="askQuestionBtn"
                            onClick={() => setActiveView('askQuestion')}>Ask a Question
                        </button>

                    </div>
                </div>

                <div className="header-second-row">
                    <p><span id="totalQuestions">{questions.length}</span> questions</p>
                    <div className="buttons">
                        <button onClick={() => setSortType('newest')}>Newest</button>
                        <button onClick={() => setSortType('active')}>Active</button>
                        <button onClick={() => setSortType('unanswered')}>Unanswered</button>
                    </div>
                </div>
            </div>

            <div className="questions">
                {currentQuestions.length > 0 ? (
                    currentQuestions.map(question => createQuestionElement(question))
                     ) : (
                         <div className="no-questions-found">No Questions Found.</div>
                             )}
                            {renderPaginationControls()}
            </div>
        </div>
    );

}

export default QuestionsList;
