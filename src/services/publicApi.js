import axios from 'axios';

// Using the deployed backend URL
const API_URL = 'https://student-management-backend-mr.onrender.com';

const publicApi = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public API endpoints
export const publicAPI = {
  getStudentAndCourseCounts: () => publicApi.get('/students/counts')
};

export default publicAPI;
