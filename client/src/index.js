// ********************* DO NOT CHANGE THIS FILE *********************
import React from 'react';
import ReactDOM from 'react-dom/client';
// import ReactDom from 'react-dom/';
import './stylesheets/index.css';
import App from './App';
import SessionProvider from "./SessionProvider";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <SessionProvider>
        <App />
    </SessionProvider>
);
