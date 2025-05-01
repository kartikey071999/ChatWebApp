import axios from "axios";

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL, // This will use the base URL from .env
});

// API function to send a message
export const sendMessage = async (senderId, receiverId, content) => {
  try {
    const response = await api.post("/messages/", {
      sender_id: senderId,
      receiver_id: receiverId,
      content: content,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// API function to get messages between two users
export const getMessages = async (senderId, receiverId) => {
  try {
    const response = await api.get(`/messages/${senderId}/${receiverId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const getMessagesBetweenUsers = async (userId, toId) => {
    try {const res = await fetch(`/messages/all/${userId}/${toId}`);
    return res.data;
    } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
    }
  };

// API function to create a user
export const createUser = async (username, email, password) => {
  try {
    const response = await api.post("/users/", { username, email, password });
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// API function to get a user by ID
export const getUser = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// API function to log in a user
export const loginUser = async (username, password) => {
    try {
      const response = await api.post("/login", { username, password });
      return response.data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };


// api.js
export const getAllUsers = async (userId) => {
    try {
        const response = await api.get(`/users/all/${userId}`);
        return response.data;
      } catch (error) {
        console.error("Error fetcting all in:", error);
        throw error;
      }
  };
  
  
