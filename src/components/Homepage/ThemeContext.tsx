"use client"

import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [pdfResume, setPdfResume] = useState(null);
    const [resumeDataContext, setResumeDataContext] = useState("");

    // Check if a resume is already uploaded
    const checkResumeData = async () => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get("https://api.jobsforce.ai/api/extension/resmedata", {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.status === 200;
        } catch (error) {
            console.error("Error checking resume data:", error);
            return false;
        }
    };

    useEffect(() => {
        checkResumeData();
    }, []);

    return (
        <ThemeContext.Provider value={{ pdfResume, setPdfResume, resumeDataContext, setResumeDataContext }}>
            {children}
        </ThemeContext.Provider>
    );
};
