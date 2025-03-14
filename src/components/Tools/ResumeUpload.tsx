import React, { useContext, useEffect, useRef, useState } from "react";
import { uploadFile } from "../../services/uploadService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../Loading";
import Cookies from "js-cookie";
import pdfToText from "react-pdftotext";
import { ThemeContext } from "../Homepage/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/Button";
import { Progress } from "../ui/progress";
import { Upload, FileText } from "lucide-react";

const ResumeUpload = ({ setResumeData }) => {
  const API_URL = "https://api.jobsforce.ai";
  const inputRef = useRef();
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const { pdfResume, setPdfResume } = useContext(ThemeContext);

  const extractTextFromPdf = async (file) => {
    try {
      const text = await pdfToText(file);
      setResumeData(text);
    } catch (error) {
      console.error("Failed to extract text from PDF", error);
    }
  };

  // Automatically start upload when file is selected
  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
  }, [selectedFile]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const maxSize = 1024 * 1024;
    if (file.size > maxSize) {
      toast.warning("File size exceeds 1MB. Please upload a smaller file.");
      event.target.value = null;
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      setUploadStatus("uploading");
      const token = Cookies.get("token");
      if (!token) {
        router.push("/signup");
        return;
      }

      const response = await uploadFile(selectedFile, token, setProgress);
      if (response.limit) {
        toast.warning("Maximum limit reached. Delete a resume to upload a new one.");
        setUploadStatus("fail");
        return;
      }

      setPdfResume(selectedFile);
      await extractTextFromPdf(selectedFile);
      setUploadStatus("done");
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("fail");
      toast.error("Upload failed. Please try again.");
    }
  };

  const clearFileInput = () => {
    inputRef.current.value = null;
    setSelectedFile(null);
    setProgress(0);
    setUploadStatus("select");
    setPdfResume(null);
    setResumeData("");
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Upload Your Resume</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {uploadStatus === "uploading" && <Loading work="uploading" />}

        {uploadStatus === "done" ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-4 border rounded-lg bg-secondary">
              <FileText className="h-5 w-5" />
              <span className="font-medium">{pdfResume.name}</span>
            </div>
            <Button
              className="w-full"
              onClick={() => router.push("/job-apply")}
            >
              Show Suggested Jobs
            </Button>
            <Button
              variant="outline"
              onClick={clearFileInput}
              className="w-full"
            >
              Upload Different Resume
            </Button>
          </div>
        ) : (
          <>
            <div
              onClick={() => inputRef.current.click()}
              className="bg-[#fefff5] border-[#FCFFA3] border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">PDF (max. 1MB)</p>
            </div>

            {selectedFile && uploadStatus !== "done" && (
              <div className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
            )}
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf"
        />
      </CardContent>
    </Card>
  );
};

export default ResumeUpload;