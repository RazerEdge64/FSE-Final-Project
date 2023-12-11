import React from 'react';

function Sidebar({ activeTab, onSidebarClick }) {
    return (
        <div className="menu" id="sideBarNav">
            <a
                href="#"
                className={`questions-link ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => onSidebarClick('questions')}
            >
                Questions
            </a>
            <a
                href="#"
                className={`tags-link ${activeTab === 'tags' ? 'active' : ''}`}
                onClick={() => onSidebarClick('tags')}
            >
                Tags
            </a>
        </div>
    );
}


export default Sidebar;
