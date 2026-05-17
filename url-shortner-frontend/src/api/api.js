import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/",
  headers: {
    "Content-Type": "application/json",
  },
});


// SHORTEN URL
export const shortenUrl = async (originalUrl) => {
  try {

    const response = await API.post("/api/url/shorten", {
      originalUrl,
    });

    return response.data;

  } catch (error) {

    console.error(
      "Error shortening URL:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// OPTIONAL ANALYTICS FETCH (future)
export const getOriginalUrl = async (shortCode) => {
  try {

    const response = await API.get(`/${shortCode}`);

    return response.data;

  } catch (error) {

    console.error(
      "Error fetching URL:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getAnalytics = async (shortCode) => {

  try {

    const response = await API.get(
      `/api/url/${shortCode}/analytics`
    );

    return response.data;

  } catch (error) {

    console.error(
      "Error fetching analytics:",
      error.response?.data || error.message
    );

    throw error;
  }
};