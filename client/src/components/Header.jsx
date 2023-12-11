import React from 'react';
import '../stylesheets/userHeader.css';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';

function Header({searchString, setSearchString, onSearchEnter, username, onLogout, isGuest, setActiveView, setIsGuest}) {
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSearchEnter();
        }
    }

    const handleLoginClick = () => {
        setActiveView('login'); // Set the active view to 'login'
        setIsGuest(false);
    };

    const handleProfileClick = () => {
        setActiveView('profile'); // Set the active view to 'profile'
    };

    return (
        <div className="header" id="header">
            <div className="headerName">
                <h1>Fake Stack Overflow</h1>
            </div>
            {(username || isGuest) && (
                <div className="searchContainer">
                    <input
                        type="text"
                        id="searchBar"
                        placeholder="Search..."
                        value={searchString}
                        onChange={e => setSearchString(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                </div>
            )}
            {username && !isGuest && (
                <div className="userControls">
                    <span id="userDisplay" className="username" onClick={handleProfileClick}>
                        Hi {username},
                    </span>
                    <FaSignOutAlt id="logoutButton" className="logout" onClick={onLogout} title="Logout" />
                </div>
            )}
            {!username && isGuest && (
                <div className="userControls">
                    <span className="username">Hi Guest,</span>
                    <span className="login" onClick={handleLoginClick}>Login</span>
                    {/*<FaSignInAlt className="logout" onClick={onLogout} title="Logout" />*/}
                </div>
            )}
        </div>
    );

}
export default Header;
