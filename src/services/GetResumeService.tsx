import axios from "axios";
import Cookies from "js-cookie";
// const API_URL = "https://api.jobsforce.ai";
const API_URL = "https://api.jobsforce.ai";
export const fetchResumes = async () => {
  try {
    const token = Cookies.get("token");

    if (!token) {
      throw new Error("No token found in local storage");
    }

    const response = await fetch(`${API_URL}/api/userdata/resumes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    });
    const res = await response.json();
    const resumeIds = res.resumes;

    const resumeDetailsPromises = resumeIds.map((id) =>
      fetch(`${API_URL}/api/userdata/resumes/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json())
    );

    const resumes = await Promise.all(resumeDetailsPromises);

    return resumes;
  } catch (error) {
    console.error("Error fetching resumes:", error);
    throw error;
  }
};

export const deleteResume = async (resumeId) => {
  try {
    const token = Cookies.get("token");
    const response = await axios.delete(
      `${API_URL}/api/files/resume/${resumeId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting resume:", error);
    throw error;
  }
};

export const decreaseCredits = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/userdata/decrease-credits`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.creditsLeft;
  } catch (error) {
    console.error("Failed to decrease credits:", error);
    throw error;
  }
};
export const decreaseAiCredits = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/userdata/decrease-aicredits`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.creditsLeft;
  } catch (error) {
    console.error("Failed to decrease credits:", error);
    throw error;
  }
};

export const fetchCredits = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/userdata/credits`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching credits:", error);
    throw error;
  }
};
