import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const request = axios.create({
    withCredentials: true,
});

export async function registerUser(userData) {
    try {
        const response = await request.post(`${BASE_URL}/users/register`, userData);
        return response.data;
    } catch (error) {
        console.error('Error registering User:', error);
        throw error;
    }
}


export async function loginUser(credentials) {
    try {
        const response = await axios.post(`${BASE_URL}/users/login`, credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export async function logoutUser() {
    try {
        const response = await axios.post(`${BASE_URL}/users/logout`);
        return response.data;
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}


// Fetch User-Specific Questions
export async function getUserQuestions(userId) {
    try {
        const response = await request.get(`${BASE_URL}/users/${userId}/questions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching User questions:', error);
        throw error;
    }
}

// Fetch User-Specific Tags
export async function getUserTags(userId) {
    try {
        const response = await request.get(`${BASE_URL}/users/${userId}/tags`);
        return response.data;
    } catch (error) {
        console.error('Error fetching User tags:', error);
        throw error;
    }
}

// Fetch User-Specific Answers
export async function getUserAnswers(userId) {
    try {
        const response = await request.get(`${BASE_URL}/users/${userId}/answers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching User answers:', error);
        throw error;
    }
}

export async function getUserProfile(userId) {
    try {
        const response = await request.get(`${BASE_URL}/users/${userId}/profile`);
        return response.data;
    } catch (error) {
        console.error('Error fetching User profile:', error);
        throw error;
    }
}


export async function emailExists (email) {
    try {
        const response = await request.post(`${BASE_URL}/users/check-email`, { email });
        return response.data.exists;
    } catch (error) {
        console.log('Error checking email:', error);
        return false;
    }
}

export async function userExists (username) {
    try {
        const response = await request.post(`${BASE_URL}/users/check-username`, { username });
        return response.data.exists;
    } catch (error) {
        console.log('Error checking username:', error);
        return false;
    }
}




