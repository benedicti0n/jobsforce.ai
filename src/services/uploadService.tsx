import axios from "axios";

const API_URL = "https://api.jobsforce.ai";

const uploadFile = async (file: File, token: string) => {
    try {
        if (!token) {
            throw new Error("Token is missing. Please log in.");
        }

        const formData = new FormData();
        formData.append("resume", file);

        const response = await axios.post(`${API_URL}/api/uploadpdf`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, // Add "Bearer" before token
            },
        });

        console.log(response, "resume uploaded");
        return response.data;
    } catch (error: any) {
        console.error("Upload error:", error);
        throw new Error(error.response?.data?.message || "Failed to upload file.");
    }
};


export { uploadFile };
