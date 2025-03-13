import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "https://api.jobsforce.ai";

const register = async (userName: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      userName,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const registerWithGoogle = async (email: string, name: string, picture: string, googleId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/register-with-google`,
      {
        name,
        email,
        googleId,
        picture,
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const login = async (email: string, password: string, googleId: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
      googleId,
    });
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const verifyOtp = async (otp: string) => {
  const token = Cookies.get("token");
  const email = Cookies.get("email");
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/verify`,
      { otp, email },
      { headers: { Authorization: `${token}` } }
    );
    return response.data;
  } catch (error: any) {
    throw error.response.data;
  }
};

const loginWithOtp = async (otp: string) => {
  const email = Cookies.get("email"); // Assuming email is stored in local storage
  try {
    const response = await axios.post(`${API_URL}/api/auth/login-with-otp`, {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const resendOtp = async () => {
  const token = Cookies.get("token");
  const email = Cookies.get("email");

  try {
    await axios.post(
      `${API_URL}/api/auth/resendotp`,
      { email },
      { headers: { Authorization: `${token}` } }
    );
  } catch (error) {
    throw error.response.data;
  }
};

// Forgot Password Service
const forgotPassword = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, {
      email,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const AuthService = {
  register,
  login,
  registerWithGoogle,
  verifyOtp,
  resendOtp,
  loginWithOtp,
  forgotPassword, // Added the forgot password service
};

export default AuthService;
