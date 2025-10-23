// chatAxios.js
import axios from 'axios';

const chatAxios = axios.create({
  baseURL: process.env.REACT_APP_CHAT_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default chatAxios;
