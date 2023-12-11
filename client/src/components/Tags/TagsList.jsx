import React, {useState, useEffect, useContext} from 'react';
import {getAllTags, getQuestionCountForTag} from '../../services/dataServices.js';
import SessionContext from "../../sessionContext";

function TagsList({onTagClick, setActiveView}) {
    const [tags, setTags] = useState([]);

    const [tagQuestionsCount, setTagQuestionsCount] = useState({});

    const { isGuest } = useContext(SessionContext);


    useEffect(() => {
        async function fetchData() {
            const fetchedTags = await getAllTags();
            setTags(fetchedTags);

            const counts = {};
            for (const tag of fetchedTags) {
                console.log("tags list",tag);
                counts[tag.name] = await getQuestionCountForTag(tag.tid);
            }

            setTagQuestionsCount(counts);
        }

        fetchData();
    }, []);

    return (
        <div>
            <div className="header" style={{flexDirection: 'row'}}>
                <div>
                    <h2>{tags.length} Tags</h2>
                </div>
                <div>
                    <h3>All Tags</h3>
                </div>
                <div>
                    <button
                        className="blue-button"
                        id="askQuestionBtn"
                        onClick={() => setActiveView('askQuestion')}
                        disabled={isGuest}
                    >Ask
                        a Question
                    </button>
                </div>
            </div>
            <div className="tags-grid">
                {tags.map(tag => (
                    <div className="tagNode tag-card" key={tag.tid}>
                        <a href="#" onClick={() => onTagClick(tag.name)}>{tag.name}</a>
                        <div className="tag-question-count">{tagQuestionsCount[tag.name]} questions</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TagsList;