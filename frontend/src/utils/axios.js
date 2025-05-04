import axios from 'axios';

const apiInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',

    // Set a timeout for requests made using this instance. If a request takes longer than 5 seconds to complete, it will be canceled.
    timeout: 50000, // timeout after 5 seconds

    headers: {
        'Content-Type': 'application/json', 
        Accept: 'application/json', 
    },
});

export default apiInstance;
