import React, {useContext, useState} from 'react';
import '../../stylesheets/comments.css';
import SessionContext from "../../sessionContext";

function CommentSection({ comments, onAddComment, onUpvoteComment, isGuest, parentId, parentType }) {
    const [newCommentText, setNewCommentText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState('');
    const itemsPerPage = 3;

    const indexOfLastComment = currentPage * itemsPerPage;
    const indexOfFirstComment = indexOfLastComment - itemsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const { user } = useContext(SessionContext);


    const handleCommentChange = (e) => {
        setNewCommentText(e.target.value);
        setErrorMessage('');
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newCommentText.length > 140) {
            setErrorMessage('Comment must be less than 140 characters.');
            return;
        }
        if (user.reputation < 50) {
            setErrorMessage('You need at least 50 reputation points to add a comment.');
            return;
        }

        await onAddComment(parentId, newCommentText, parentType);
        setNewCommentText('');
    };

    const handleCommentUpvote = (commentId) => {
        if (isGuest) {
            return;
        }
        onUpvoteComment(commentId, parentType);
    };


    const renderPaginationControls = () => {
        const pageCount = Math.ceil(comments.length / itemsPerPage);
        return (
            <div className="pagination">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Prev
                </button>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))} disabled={currentPage === pageCount}>
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="comment-section">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {currentComments && currentComments.map((comment) => (
                <div key={comment._id} className="comment">
                    <div className="comment-actions">
                        <div>
                            <span>Votes: {comment.votes}</span>
                        </div>
                        <div>
                            {!isGuest && (
                                <button className="upvote-comment-button" onClick={() => handleCommentUpvote(comment._id)}>Upvote</button>
                            )}
                        </div>
                    </div>
                    <div className="comment-text">
                        <p>{comment.text}</p>
                    </div>

                </div>
            ))}

            <div className="add-comment">
                {!isGuest && (
                    <form onSubmit={handleCommentSubmit}>
                        <div>
                            <input
                                type="text"
                                value={newCommentText}
                                onChange={handleCommentChange}
                                placeholder="Add a comment..."
                            />
                        </div>
                        <div>
                            <button type="submit">Add Comment</button>
                        </div>


                    </form>
                )}
            </div>

            {renderPaginationControls()}
        </div>
    );
}

export default CommentSection;
