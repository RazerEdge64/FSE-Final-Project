import axios from "axios";

const request = axios.create({
    withCredentials: true,
});

// Questions
export async function getAllQuestions() {
    try {
        const response = await axios.get('http://localhost:8000/questions');
        return response.data;
    } catch (error) {
        console.error('Error fetching questions: ', error);
        return [];
    }
}

export async function getQuestionById(qid) {
    try {
        const response = await axios.get(`http://localhost:8000/questions/${qid}`);
        const data = response.data;


        return data.question ? {
            ...data.question,
            answerCount: data.answerCount
        } : null;
    } catch (error) {
        console.error('Error fetching question by ID: ', error);
        return null;
    }
}

export async function addQuestion(question) {
    console.log("dataservices question - ",question);
    try {
        console.log(question);
        const response = await axios.post('http://localhost:8000/questions', question);
        return response.data;
    } catch (error) {
        console.error('Error adding question: ', error);
    }
}

export async function getQuestionsSortedByActive() {
    try {
        const response = await axios.get('http://localhost:8000/questions/sorted/active');
        return response.data;
    } catch (error) {
        console.error('Error fetching questions sorted by active:', error);
        return [];
    }
}

export async function incrementQuestionViews(qid) {
    try {
        await axios.post(`http://localhost:8000/questions/increment-views/${qid}`);
        console.log("Views incremented for question:", qid);
    } catch (error) {
        console.error('Error incrementing views:', error);
    }
}


// Tags
export async function getAllTags() {
    try {
        const response = await axios.get('http://localhost:8000/tags');
        return response.data;
    } catch (error) {
        console.error('Error fetching all tags: ', error);
        return [];
    }
}


export async function getTagById(id) {
    try {
        const response = await axios.get(`http://localhost:8000/tags/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tag by ID: ', error);
        return null;
    }
}

export async function mapTagsToIds(tags) {
    const tagIds = [];
    const baseURL = 'http://localhost:8000';

    for (const tagName of tags) {
        try {
            let tagResponse;

            try {
                tagResponse = await request.get(`${baseURL}/tags/name/${tagName}`);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    tagResponse = await request.post(`${baseURL}/tags`, { name: tagName });
                } else {
                    throw error;
                }
            }

            if (tagResponse.data && tagResponse.data.tid) {
                tagIds.push(tagResponse.data.tid);
            }
        } catch (error) {
            console.error('Error in mapTagsToIds:', error);
        }
    }

    console.log("maptags to ids - ",tagIds);

    return tagIds;
}


export async function getQuestionCountForTag(tagId) {
    try {
        const response = await axios.get(`http://localhost:8000/tags/${tagId}/questions/count`);
        return response.data.count;
    } catch (error) {
        console.error('Error fetching question count for tag: ', error);
        return 0;
    }
}


// Answers

/**
 * This method is used to add an answer to the respective question.
 * @param answer represents the new answer.
 * @param currentQuestion   represents the question to which the answer is being added to.
 */
export async function addAnswer(answer, currentQuestion) {

    console.log("from addanswer - ",currentQuestion);
    try {
        const response = await request.post(`http://localhost:8000/answers/add/${currentQuestion._id}`, answer);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error adding answer: ', error);
        return null;
    }
}

export async function updateAnswer(answer) {
    try {
        const response = await request.post(`http://localhost:8000/answers/update/${answer._id}`, {
            text: answer.text,

        });
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('Error updating answer: ', error);
        return null;
    }
}


export async function getAnswerById(aid) {
    try {
        const response = await axios.get(`http://localhost:8000/answers/${aid}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching answer by ID: ', error);
        return null;
    }
}


export async function addComment(type, id, commentData) {
    try {
        console.log("from addComment client",type, id, commentData);
        const endpoint = type === 'question' ? `comments/questions/${id}/comments` : `comments/answers/${id}/comments`;
        const response = await axios.post(`http://localhost:8000/${endpoint}`, commentData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error(`Error adding comment to ${type}: `, error);
        throw error;
    }
}


export async function upvoteComment(commentId, parentType) {
    try {
        const response = await request.post(`http://localhost:8000/comments/${commentId}/upvote`, { parentType });
        return response.data;
    } catch (error) {
        console.error('Error upvoting comment:', error);
        throw error;
    }
}


export async function getCommentsForQuestion(questionId) {
    try {
        const response = await request.get(`http://localhost:8000/comments/questions/${questionId}/comments`);

        console.log("from getCommentsForQuestion ",response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching comments for question:', error);

        throw error;
    }
}


// Function to upvote a question
export async function upvoteQuestion(questionId) {
    try {
        const response = await request.post(`http://localhost:8000/questions/${questionId}/upvote`);
        return response.data; // Return the updated question data
    } catch (error) {
        console.error('Error upvoting question:', error);
        throw error;
    }
}

// Function to downvote a question
export async function downvoteQuestion(questionId) {
    try {
        const response = await request.post(`http://localhost:8000/questions/${questionId}/downvote`);
        return response.data;
    } catch (error) {
        console.error('Error downvoting question:', error);
        throw error;
    }
}

// Function to upvote an answer
export async function upvoteAnswer(answerId) {
    try {
        const response = await request.post(`http://localhost:8000/answers/${answerId}/upvote`);
        return response.data;
    } catch (error) {
        console.error('Error upvoting answer:', error);
        throw error;
    }
}

// Function to downvote an answer
export async function downvoteAnswer(answerId) {
    try {
        const response = await request.post(`http://localhost:8000/answers/${answerId}/downvote`);
        return response.data;
    } catch (error) {
        console.error('Error downvoting answer:', error);
        throw error;
    }
}


export async function acceptAnswer(questionId, answerId) {
    try {
        const response = await request.post(`http://localhost:8000/questions/${questionId}/accept/${answerId}`);
        return response.data;
    } catch (error) {
        console.error('Error accepting answer:', error);
        throw error;
    }
}



export async function updateQuestion(questionData) {
    try {
        const response = await request.put(`http://localhost:8000/questions/${questionData._id}`, questionData);
        return response.data;
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
}

export async function updateUserTag(tagId, editedTagName) {
    try {
        const response = await request.put(`http://localhost:8000/tags/${tagId}`, { name: editedTagName });
        return response.data;
    } catch (error) {
        console.error('Error updating tag:', error);
        throw error;
    }
}

export async function deleteUserTag(tagId) {
    try {
        const response = await request.delete(`http://localhost:8000/tags/${tagId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting tag:', error);
        throw error;
    }
}


export const deleteUserAnswer = async (answerId) => {
    try {
        const response = await request.delete(`http://localhost:8000/answers/${answerId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting answer:', error);
        throw error;
    }
};

export const deleteUserQuestion = async (questionId) => {
    try {
        const url = `http://localhost:8000/questions/${questionId}`;
        await request.delete(url);
    } catch (error) {
        console.error('Error deleting question:', error);
        throw error;
    }
};


export async function getQuestionIdForAnswer(answerId) {
    try {
        const response = await request.get(`http://localhost:8000/answers/${answerId}/question`);
        return response.data.questionId;
    } catch (error) {
        console.error('Error getting question ID for answer:', error);
        return null;
    }
}

