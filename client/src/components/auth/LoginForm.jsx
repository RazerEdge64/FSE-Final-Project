import React, { useState, useContext } from 'react';
import logger from "../../logger/logger";
import SessionContext from '../../sessionContext'; // Ensure you have this context set up
import '../../stylesheets/login.css';

function LoginForm({ setActiveView, handleRegisterClick }) {
    console.log("in login view");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { login, setIsGuest } = useContext(SessionContext);

    const continueAsGuest = () => {
        setIsGuest(true);
        setActiveView('questions');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;

        // Reset errors
        setUsernameError('');
        setPasswordError('');

        // Validate username
        if (!username.trim()) {
            setUsernameError('Username is required');
            isValid = false;
        }

        // Validate password
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await login({ username, password });
                if(response) {
                    // setActiveView('questions');
                    logger.log('Login successful:', response);
                } else {
                    setPasswordError('Invalid username or password');
                }

            } catch (error) {
                console.log('Error logging in User:', error);
                setPasswordError('Invalid username or password');
            }
        }
    };

    return (
        <div>
            <div className="login-form">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username:</label>
                        <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        {usernameError && <div className="error-message">{usernameError}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        {passwordError && <div className="error-message">{passwordError}</div>}
                    </div>
                    <button id="loginButton" type="submit" className="blue-button">Login</button>
                </form>
            </div>

            <div className="login-actions">
                <button className="action-button-register" onClick={handleRegisterClick}>Register?</button>
                <button className="action-button-guest" onClick={continueAsGuest}>Continue as Guest →</button>
            </div>
        </div>

    );
}

export default LoginForm;
