import React, {useState} from 'react';
import { registerUser } from '../../services/authServices';
import '../../stylesheets/login.css';

import {emailExists, userExists} from "../../services/authServices";

import logger from "../../logger/logger";

function RegisterForm({ setActiveView }) {
    console.log("Rendering RegisterForm"); // For debugging

    // ... existing state variables ...
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateEmail = (email) => {
        // Simple email validation regex
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        let isValid = true;
        setUsernameError('');
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        // Validate username
        if (!username) {
            setUsernameError('Username is required');
            isValid = false;
        }

        const doesUserExists = await userExists(username);
        if (doesUserExists) {
            setUsernameError('Username already in use');
            isValid = false;
        }

        // Validate email
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!validateEmail(email)) {
            setEmailError('Invalid email format');
            isValid = false;
        }

        const exists = await emailExists(email);
        if (exists) {
            setEmailError('Email already in use');
            isValid = false;
        }

        if(password.includes(username) || password.includes(email)) {
            setPasswordError('Password should not contain username or email');
            isValid = false;
        }

        // Validate password
        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) { // Example rule: min 6 characters
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        }

        // Validate confirm password
        if (password !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        }

        if (isValid) {
            try {
                const response = await registerUser({ username, email, password });
                logger.log('Registration successful:', response);

                // Optionally log the User in immediately after registration
                // setUser(response.User); // Adapt based on actual response structure

                // Redirect to the login page to prompt User to log in
                setActiveView('login');
            } catch (error) {
                logger.log('Error registering User:', error);
                // Handle errors, such as displaying a message to the User
            }
        }

    };

    return (
        <div className="login-container">
            <h3>Register</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input id="usernameInput" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    {usernameError && <div className="error-message">{usernameError}</div>}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input id="emailInput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <div className="error-message">{emailError}</div>}
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input id="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {passwordError && <div className="error-message">{passwordError}</div>}
                </div>
                <div className="form-group">
                    <label>Confirm Password:</label>
                    <input id="confirmPasswordInput" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
                </div>
                <button id="registerButton" type="submit" className="blue-button">Register</button>
            </form>
        </div>
    );
}

export default RegisterForm;
