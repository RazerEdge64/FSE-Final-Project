import React from 'react';

const SessionContext = React.createContext({
    user: null,
    login: () => {},
    logout: () => {},
    register: () => {},
    isGuest: true,
});

export default SessionContext;
