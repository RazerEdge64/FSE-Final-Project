// // SessionProvider.jsx
// import React, { useState } from 'react';
// import SessionContext from './sessionContext';
//
// const SessionProvider = ({ children }) => {
//     const [User, setUser] = useState(null);
//     const [isGuest, setIsGuest] = useState(false);
//
//     const login = (userData) => {
//         // perform login logic
//         setUser(userData);
//         setIsGuest(false);
//     };
//
//     const logout = () => {
//         // perform logout logic
//         setUser(null);
//         setIsGuest(true);
//     };
//
//     const register = (userData) => {
//         // perform registration logic
//         setUser(userData);
//         setIsGuest(false);
//     };
//
//     return (
//         <SessionContext.Provider value={{ User, isGuest, login, logout, register, setIsGuest }}>
//             {children}
//         </SessionContext.Provider>
//     );
// };
//
// export default SessionProvider;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SessionContext from './sessionContext';

const request = axios.create({
    withCredentials: true,
});

const SessionProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);
    const [loading, setLoading] = useState(true);

    const BASE_URL = 'http://localhost:8000';

    useEffect(() => {
        // Check session status when the component mounts
        const checkSession = async () => {
            try {
                const response = await request.get(`${BASE_URL}/users/session`);
                if (response.data.user) {
                    setUser(response.data.user);
                    setIsGuest(false);
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (userData) => {
        try {
            const response = await request.post(`${BASE_URL}/users/login`, userData);
            setUser(response.data.user);
            setIsGuest(false);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const logout = async () => {
        // perform logout logic
        // This should now be an API call to your server
        try {
            await request.post(`${BASE_URL}/users/logout`);
            setUser(null);
            setIsGuest(false);
        } catch (error) {
            console.error('Error logging out:', error);
            // Handle logout error
        }
    };

    const register = async (userData) => {
        // perform registration logic
        // This should now be an API call to your server
        try {
            const response = await request.post(`${BASE_URL}/users/register`, userData);
            setUser(response.data.user);
            setIsGuest(false);
        } catch (error) {
            console.error('Error registering:', error);
            // Handle registration error
        }
    };

    // Render a loading indicator while checking the session
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <SessionContext.Provider value={{ user, isGuest, login, logout, register, setIsGuest }}>
            {children}
        </SessionContext.Provider>
    );
};

export default SessionProvider;
