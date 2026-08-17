import axios from "axios";

const API_URL = 'http://localhost:5000';

const authHeader = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const getTasks = async () => {
    const res = await axios.get(`${API_URL}/tasks`, authHeader());
    return res.data;
};

export const createTask = async (task) => {
    const res = await axios.post(`${API_URL}/tasks`, task, authHeader());
    return res.data;
};

export const updateTask = async (id, updates) => {
    const res = await axios.put(`${API_URL}/tasks/${id}`, updates, authHeader());
    return res.data;
};

export const deleteTask = async (id) => {
    const res = await axios.delete(`${API_URL}/tasks/${id}`, authHeader());
    return res.data;
};

export const toggleLecture = async (taskId, lectureIndex) => {
  const res = await axios.put(`${API_URL}/tasks/${taskId}/toggle-lecture`, { lectureIndex }, authHeader());
  return res.data;
};

export const enrollCourse = async (taskId) => {
  const res = await axios.put(`${API_URL}/tasks/${taskId}/enroll`, {}, authHeader());
  return res.data;
};