"use client"

import React, { useState, useEffect, useContext, useRef } from "react";
import {
    Upload,
    Briefcase,
    Loader2,
    X,
    Bookmark,
    Filter,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/Button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Clock, MapPin, Building2, DollarSign } from "lucide-react";

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import JobPageHeader from "./JobPageHeader";
import ResumeUpload from "./ResumeUpload";
import Cookies from "js-cookie";
import { useBookmarkJob } from "@/hooks/useBookmark"
import { ThemeContext } from "../Homepage/ThemeContext";
import AILoader from "../ui/ai-loader";
import { uploadFile } from "@/services/uploadService";
import { toast } from "sonner";
import { Progress } from "../ui/progress";
import axios from "axios";
import { FileText } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "../ui/dialog";
import MarkdownPreview from "@uiw/react-markdown-preview";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";

const ResumeUploadContent = () => (
    <div className="flex flex-col h-full">
        <ResumeUpload />

        <div className="mt-6 text-center">
            <Link href="/suggested-jobs">
                <Button
                    className="w-full mb-1 bg-gray-900 hover:bg-gray-950 duration-300 text-white"
                    variant="secondary"
                >
                    Show Suggested Jobs
                </Button>
            </Link>
            <p className="text-xs text-gray-500">This is based on submitted resume</p>
        </div>
    </div>
);

const JobDetailsDialog = ({ job, isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[90vh]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{job.title}</DialogTitle>
                    <DialogDescription>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company}</span>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-full pr-4">
                    <div className="space-y-6">
                        {/* Job Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">

                            {job.min_amount && job.max_amount && (
                                <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-slate-500" />
                                    <span>
                                        ${Math.floor(job.min_amount).toLocaleString()} - ${Math.floor(job.max_amount).toLocaleString()}/{job.interval || 'year'}
                                    </span>
                                </div>
                            )}
                            {job.job_level && (
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-slate-500" />
                                    <span>{job.job_level}</span>
                                </div>
                            )}
                        </div>

                        {/* Job Description */}
                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">Job Description</h3>
                            <div className="prose prose-sm max-w-none">
                                <MarkdownPreview
                                    source={job.description}
                                    style={{
                                        padding: 16,
                                        borderRadius: 8,
                                        backgroundColor: "#f3f4f6",
                                        color: "#333",
                                        fontSize: 14,
                                        lineHeight: 1.6,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Posted Date */}
                        <div className="text-sm text-muted-foreground">
                            Posted on: {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="mt-6">
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const JobCard = ({ job, jobId, jobType }) => {
    const { isResumePresent } = useContext(ThemeContext);
    const router = useRouter();
    const { bookmarkJob, bookmarking } = useBookmarkJob();
    const [isBookmarked, setIsBookmarked] = useState(job._id?.startsWith("67b") || false);

    // Add a computed property to determine if score should be blurred
    const shouldBlurScore = !isResumePresent || jobType !== "recommended";

    // Add this state for dialog
    const [showDetails, setShowDetails] = useState(false);

    const handleCardClick = (e) => {
        if (
            e.target.closest(".aiResumeBtn") ||
            e.target.closest("a") ||
            e.target.closest(".interactive-element") ||
            e.target.closest("[data-state='open']")
        ) {
            return;
        }

        // Handle the click based on job type
        if (jobType === "bookmarked") {
            setShowDetails(true);
        } else if (jobType === "applied") {
            window.open(job.job_url, "_blank");
        } else {
            router.push(`/job/${jobId}`);
        }
    };

    const handleBookmarkClick = async (e) => {
        e.stopPropagation(); // Prevent card click event
        if (bookmarking) return;

        try {
            await bookmarkJob(job);
            setIsBookmarked(true);
        } catch (error) {
            // Error is already handled in the custom hook
        }
    };

    const generateResumeHandler = () => {
        const token = Cookies.get("token");
        if (jobType === "bookmarked") {
            // For bookmarked jobs, send the job description in the request body
            const encodedDescription = encodeURIComponent(job.description);
            window.open(`/resume-edit?type=bookmarked&description=${encodedDescription}`, "_blank");
        } else {
            // For other job types, continue with the existing behavior
            window.open(`/resume-edit?job=${jobId}`, "_blank");
        }
    };

    const handleViewJobClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (jobType === "bookmarked") {
            setShowDetails(true);
        } else if (jobType === "applied" && job.job_url) {
            window.open(job.job_url, "_blank");
        } else {
            router.push(`/job/${jobId}`);
        }
    };

    const companyName = job.company || "Company name not available";
    const jobTitle = job.title || "Job title not available";
    const jobLocation = job.location || "Location not specified";
    const isRemote = job.is_remote || false;
    const employmentType = job.job_type || "Not specified";
    const jobLevel = job.job_level || null;
    const companyIndustry = job.company_industry || "";
    const datePosted =
        job.date_posted || job.createdAt || new Date().toISOString();
    const matchScore = job.match_score || 0;
    const minAmount = job.min_amount || null;
    const maxAmount = job.max_amount || null;
    const payInterval = job.interval || "year";

    return (
        <>
            <div
                onClick={handleCardClick}
                className="w-full cursor-pointer bg-[#fefff5] tracking-normal border border-[#FCFFA3] p-2 sm:p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4"
            >
                <div className="flex-1 space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="h-16 w-16 rounded bg-sky-500 flex items-center justify-center shrink-0">
                            {job.company_logo ? (
                                <img
                                    src={job.company_logo}
                                    alt={`${companyName} logo`}
                                    className="w-full h-full object-cover rounded "
                                />
                            ) : (
                                <div className="grid grid-cols-2 gap-0.5">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="w-3 h-3 bg-white rounded-full" />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                <span className="rounded-xl bg-[#EDFBFF] text-black px-2 font-semibold py-1 text-[10px] whitespace-nowrap">
                                    {new Date(datePosted).toLocaleDateString()}
                                </span>
                                <span className="rounded-xl bg-[#EDFBFF] text-black px-2 font-semibold py-1 text-[10px] whitespace-nowrap">
                                    Be an early applicant
                                </span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <h3 className="text-lg font-semibold break-words pr-2">
                                    {jobTitle}
                                </h3>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className={`flex-shrink-0 transition-all duration-300 ${isBookmarked ? "bg-yellow-100" : ""
                                        }`}
                                    onClick={handleBookmarkClick}
                                    disabled={bookmarking}
                                >
                                    <Bookmark
                                        className={`${isBookmarked
                                            ? "text-yellow-500 fill-yellow-500"
                                            : "text-yellow-800"
                                            } transition-colors duration-300`}
                                    />
                                </Button>
                            </div>
                            <div className="text-[12px] text-muted-foreground">
                                <span className="font-bold">{companyName}</span>
                                {companyIndustry && ` / ${companyIndustry}`}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="flex items-center gap-1 text-[12px] font-bold text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate">{jobLocation}</span>
                            <span className="text-xs">·</span>
                            <span>{isRemote ? "Remote" : "Onsite"}</span>
                        </div>
                        {employmentType && (
                            <div className="flex items-center gap-1 text-[12px] font-bold text-muted-foreground">
                                <Clock className="h-4 w-4 shrink-0" />
                                <span>{employmentType}</span>
                            </div>
                        )}
                        {jobLevel && (
                            <div className="flex items-center gap-1 text-[12px] font-bold text-muted-foreground">
                                <Building2 className="h-4 w-4 shrink-0" />
                                <span>{jobLevel}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center w-full justify-between gap-3">
                        <div className="text-[12px] font-bold text-muted-foreground">
                            {minAmount && maxAmount ? (
                                `$${Math.floor(minAmount).toLocaleString()} - $${Math.floor(
                                    maxAmount
                                ).toLocaleString()}/${payInterval}`
                            ) : (
                                <span className="invisible">Placeholder</span>
                            )}
                        </div>
                        <div className="flex gap-3 justify-center items-center w-full sm:w-auto">
                            {/* Only show Generate AI resume button if not an applied job */}
                            {jobType !== "applied" && (
                                <Button
                                    disabled={!isResumePresent}
                                    className="aiResumeBtn"
                                    onClick={generateResumeHandler}
                                >
                                    Generate AI resume
                                </Button>
                            )}
                            <Button
                                onClick={handleViewJobClick}
                                className="interactive-element bg-[#00ffff] hover:bg-sky-400 text-black text-sm"
                            >
                                {jobType === "applied" ? "View Original Job" : "View Job"}
                            </Button>
                        </div>
                    </div>
                </div>

                {isResumePresent ? (
                    <div className="relative w-full bg-sky-50 border border-sky-100 text-sky-800 tracking-normal sm:w-32 rounded-xl py-4 px-2 flex flex-col items-center justify-center">
                        {shouldBlurScore && (
                            <div className="absolute inset-0 backdrop-blur-none bg-slate-900/70 rounded-xl flex flex-col items-center justify-center z-10">
                                <p className="text-white text-center text-sm font-medium px-2">
                                    Switch to recommended jobs to see match score
                                </p>
                            </div>
                        )}
                        <div className={`w-16 h-16 ${shouldBlurScore ? 'filter blur-sm' : ''}`}>
                            <CircularProgressbar
                                value={matchScore}
                                text={`${Math.round(matchScore)}%`}
                                styles={buildStyles({
                                    textSize: "32px",
                                    pathColor: "#38BDF8",
                                    textColor: "#38BDF8",
                                    trailColor: "#D1F7FF",
                                })}
                            />
                        </div>
                        <span className={`text-xs mt-1 ${shouldBlurScore ? 'filter blur-sm' : ''}`}>
                            {matchScore >= 80 ? 'EXCELLENT MATCH' :
                                matchScore >= 60 ? 'GOOD MATCH' :
                                    matchScore >= 40 ? 'FAIR MATCH' : 'BASIC MATCH'}
                        </span>
                        <span className={`w-full px-4 border-t border-zinc-700 mt-6 ${shouldBlurScore ? 'filter blur-sm' : ''}`}></span>
                        <span className={`text-[10px] mt-1 text-center text-sky-800 font-semibold ${shouldBlurScore ? 'filter blur-sm' : ''}`}>
                            {job.site && `✓ Posted on ${job.site}`}
                        </span>
                    </div>
                ) : (
                    <div className="relative w-full sm:w-32 bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl py-4 px-2 flex flex-col items-center justify-center text-white">
                        {/* Blurred content */}
                        <div className="absolute inset-0 backdrop-blur-none bg-slate-900/50 rounded-xl flex flex-col items-center justify-center z-10">
                            <p className="text-white text-center text-sm font-medium px-2">
                                Upload your resume to see exact score
                            </p>
                        </div>

                        {/* Original content (now blurred) */}
                        <div className="w-16 h-16 filter blur-sm">
                            <CircularProgressbar
                                value={75.24156}
                                text={`${Math.round(75.24156)}%`}
                                styles={buildStyles({
                                    textSize: "32px",
                                    pathColor: "#38BDF8", // Themed Light Blue
                                    textColor: "#38BDF8", // Themed Text Color
                                    trailColor: "#D1F7FF", // Lighter version for contrast
                                })}
                            />
                        </div>
                        <span className="text-xs mt-1 filter blur-sm">FAIR MATCH</span>
                        <span className="w-full px-4 border-t border-zinc-700 mt-6 filter blur-sm"></span>
                        <span className="text-[10px] mt-1 text-center text-zinc-100 font-semibold filter blur-sm">
                            {job.site && `✓ Posted on ${job.site}`}
                        </span>
                    </div>
                )}
            </div>

            {/* Add JobDetailsDialog */}
            {jobType === "bookmarked" && (
                <JobDetailsDialog
                    job={job}
                    isOpen={showDetails}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
};

// Add this new component for the resume management dialog
const ResumeManagementDialog = ({ onPrimaryResumeChange }) => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadStatus, setUploadStatus] = useState("idle");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [updatingPrimary, setUpdatingPrimary] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const token = Cookies.get("token");
            const response = await axios.get(
                "https://api.jobsforce.ai/api/list-resume",
                {
                    headers: {
                        authorization: token,
                    },
                }
            );
            setResumes(response.data.resumes);
        } catch (error) {
            console.error("Error fetching resumes:", error);
            toast.error("Failed to load resumes");
        } finally {
            setLoading(false);
        }
    };

    const setPrimaryResume = async (resumeId) => {
        try {
            setUpdatingPrimary(true);
            const token = Cookies.get("token");

            await axios.post(
                "https://api.jobsforce.ai/api/set-primary",
                { resumeId },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: token,
                    },
                }
            );

            await fetchResumes();
            onPrimaryResumeChange();
            toast.success("Primary resume updated successfully");
        } catch (error) {
            console.error("Error setting primary resume:", error);
            toast.error("Failed to update primary resume");
        } finally {
            setUpdatingPrimary(false);
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const maxSize = 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            toast.error("File size exceeds 1MB. Please upload a smaller file.");
            event.target.value = null;
            return;
        }

        setSelectedFile(file);
        handleUpload(file);
    };

    const handleUpload = async (file) => {
        try {
            setUploadStatus("uploading");
            const token = Cookies.get("token");

            const response = await uploadFile(file, token, setUploadProgress);
            if (response.limit) {
                toast.error(
                    "Maximum limit reached. Delete a resume to upload a new one."
                );
                setUploadStatus("idle");
                return;
            }

            await fetchResumes();
            onPrimaryResumeChange();
            toast.success("Resume uploaded successfully!");
            setUploadStatus("idle");
            setSelectedFile(null);
            if (inputRef.current) {
                inputRef.current.value = null;
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Upload failed. Please try again.");
            setUploadStatus("idle");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Manage Resumes
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Resume Management</DialogTitle>
                    <DialogDescription>
                        Upload and manage your resumes. Set a primary resume to get
                        personalized job matches.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Upload Section */}
                    <div className="flex items-center gap-4">
                        <input
                            ref={inputRef}
                            type="file"
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf"
                        />
                        <Button
                            onClick={() => inputRef.current?.click()}
                            disabled={uploadStatus === "uploading"}
                            className="flex-1"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload New Resume
                        </Button>
                    </div>

                    {uploadStatus === "uploading" && (
                        <div className="space-y-2 bg-slate-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{selectedFile?.name}</span>
                                <span className="text-slate-500">{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} className="h-2" />
                        </div>
                    )}

                    {/* Resumes List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                            </div>
                        ) : resumes.length > 0 ? (
                            <div className="space-y-3">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume._id}
                                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <FileText className="w-5 h-5 text-slate-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {resume.originalName}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    Uploaded on{" "}
                                                    {new Date(resume.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {resume.isPrimary ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-green-100 text-green-800"
                                                >
                                                    Primary
                                                </Badge>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={updatingPrimary}
                                                    onClick={() => setPrimaryResume(resume._id)}
                                                    className="text-slate-600 hover:text-slate-900"
                                                >
                                                    Set as Primary
                                                </Button>
                                            )}
                                            <a
                                                href={resume.s3Url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-slate-500 py-8">
                                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                                <p className="font-medium">No resumes uploaded yet</p>
                                <p className="text-sm">
                                    Upload a resume to get personalized job matches
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// Replace POPULAR_COUNTRIES and ALL_COUNTRIES with US_STATES
const US_STATES = [
    { code: "CA", name: "California", shortForm: "CA" },
    { code: "NY", name: "New York", shortForm: "NY" },
    { code: "TX", name: "Texas", shortForm: "TX" },
    { code: "FL", name: "Florida", shortForm: "FL" },
    { code: "IL", name: "Illinois", shortForm: "IL" },
    { code: "PA", name: "Pennsylvania", shortForm: "PA" },
    { code: "OH", name: "Ohio", shortForm: "OH" },
    { code: "GA", name: "Georgia", shortForm: "GA" },
    { code: "NC", name: "North Carolina", shortForm: "NC" },
    { code: "MI", name: "Michigan", shortForm: "MI" },
    { code: "NJ", name: "New Jersey", shortForm: "NJ" },
    { code: "VA", name: "Virginia", shortForm: "VA" },
    { code: "WA", name: "Washington", shortForm: "WA" },
    { code: "AZ", name: "Arizona", shortForm: "AZ" },
    { code: "MA", name: "Massachusetts", shortForm: "MA" },
    { code: "TN", name: "Tennessee", shortForm: "TN" },
    { code: "IN", name: "Indiana", shortForm: "IN" },
    { code: "MD", name: "Maryland", shortForm: "MD" },
    { code: "MO", name: "Missouri", shortForm: "MO" },
    { code: "WI", name: "Wisconsin", shortForm: "WI" },
    // Add more states as needed
];

const FilterSidebar = (
    searchTerm,
    setSearchTerm,
    searchTerms,
    handleAddSearchTerm,
    handleRemoveSearchTerm,
    handleSearch,
    filters,
    setFilters,
    jobLevels,
    applyFilters,
    resetFilters,
    activeWorkMode,
    handleWorkModeClick,
    onPrimaryResumeChange,
    totalJobs,
    filteredCount,
) => {
    // Initialize salary range based on the highest max_amount in jobs
    const maxPossibleSalary = 500000; // You can adjust this based on your data
    const [salaryRange, setSalaryRange] = useState([0, maxPossibleSalary]);

    const handleSalaryChange = (values) => {
        setSalaryRange(values);
        setFilters(prev => ({
            ...prev,
            salary: { min: values[0], max: values[1] }
        }));
        // Trigger filter application
        applyFilters({
            ...filters,
            salary: { min: values[0], max: values[1] }
        });
    };

    const handleCountrySelect = (countryCode) => {
        const newSelectedCountries = [...filters.selectedCountries, countryCode];
        setFilters(prev => ({
            ...prev,
            selectedCountries: newSelectedCountries
        }));
        // Trigger filter application
        applyFilters({
            ...filters,
            selectedCountries: newSelectedCountries
        });
    };

    const handleCountryBadgeClick = (countryCode) => {
        const newSelectedCountries = filters.selectedCountries.includes(countryCode)
            ? filters.selectedCountries.filter(code => code !== countryCode)
            : [...filters.selectedCountries, countryCode];

        setFilters(prev => ({
            ...prev,
            selectedCountries: newSelectedCountries
        }));
        // Trigger filter application
        applyFilters({
            ...filters,
            selectedCountries: newSelectedCountries
        });
    };

    return (
        <ScrollArea className="w-full h-[calc(100vh-64px)] space-y-6 px-4 py-2 pb-6 rounded-xl border border-gray-200">
            {/* Search Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Search Jobs</h3>
                <div className="space-y-2">
                    <Input
                        className="w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Add search terms..."
                    />
                    <Button onClick={handleAddSearchTerm} className="w-full">
                        Add Term
                    </Button>
                </div>

                {searchTerms.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {searchTerms.map((term, index) => (
                            <Badge
                                key={index}
                                variant="secondary"
                                className="px-2 py-1 gap-1"
                            >
                                {term}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-4 w-4 p-0"
                                    onClick={() => handleRemoveSearchTerm(index)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>
                )}

                <Button
                    className="w-full"
                    onClick={handleSearch}
                    disabled={searchTerms.length === 0}
                >
                    Search
                </Button>
            </div>

            <div className="border-t border-gray-200" />

            {/* Updated Location Filter Section */}
            <div className="space-y-4 pt-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">US States</h3>
                    {filters.selectedCountries.length > 0 && (
                        <span className="text-sm text-gray-500">
                            {filteredCount} jobs found
                        </span>
                    )}
                </div>

                <div className="flex flex-wrap gap-2">
                    {US_STATES.slice(0, 8).map((state) => (
                        <Badge
                            key={state.code}
                            variant={filters.selectedCountries.includes(state.code) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => handleCountryBadgeClick(state.code)}
                        >
                            {state.name} ({state.shortForm})
                        </Badge>
                    ))}
                </div>

                <Select onValueChange={handleCountrySelect}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select more states" />
                    </SelectTrigger>
                    <SelectContent>
                        {US_STATES.map((state) => (
                            <SelectItem
                                key={state.code}
                                value={state.code}
                                disabled={filters.selectedCountries.includes(state.code)}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{state.name}</span>
                                    <span className="text-gray-500">({state.shortForm})</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Salary Filter Section */}
            <div className="space-y-4 pt-6">
                <h3 className="text-lg font-semibold">Salary Range (Annual)</h3>
                <div className="px-2">
                    <Slider
                        defaultValue={[0, maxPossibleSalary]}
                        max={maxPossibleSalary}
                        step={5000}
                        value={salaryRange}
                        onValueChange={handleSalaryChange}
                        className="my-6"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>${salaryRange[0].toLocaleString()}</span>
                        <span>${salaryRange[1].toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Work Mode Filters */}
            <div className="space-y-4 pt-6">
                <h3 className="text-lg font-semibold">Work Mode</h3>
                <div className="flex flex-col gap-2">
                    {["remote", "onsite"].map((mode) => (
                        <Button
                            key={mode}
                            variant="outline"
                            className={`justify-start ${activeWorkMode === mode ? "bg-blue-50 border-blue-200" : ""
                                }`}
                            onClick={() => handleWorkModeClick(mode)}
                        >
                            {mode === "remote" ? "Remote" : "Onsite"}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200" />

            {/* Resume Management Button */}
            <div className="space-y-4 pt-6">
                <h3 className="text-lg font-semibold">Resume</h3>
                <ResumeManagementDialog onPrimaryResumeChange={onPrimaryResumeChange} />
            </div>

            <div className="py-6">
                <Button
                    onClick={resetFilters}
                    variant="ghost"
                    className="w-full text-red-500 hover:text-red-600"
                >
                    Reset All Filters
                </Button>
            </div>

            {/* No Jobs Message */}
            {filteredCount === 0 && filters.selectedCountries.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                        No jobs found for the selected {filters.selectedCountries.length > 1 ? 'states' : 'state'}.
                        Try selecting different states or clearing filters.
                    </p>
                    <Button
                        variant="link"
                        className="text-yellow-600 p-0 h-auto text-sm"
                        onClick={() => {
                            setFilters(prev => ({ ...prev, selectedCountries: [] }));
                            applyFilters({ ...filters, selectedCountries: [] });
                        }}
                    >
                        Clear state filters
                    </Button>
                </div>
            )}
        </ScrollArea>
    );
};

// Active Filters display
const ActiveFilters = ({ filters, clearFilter }) => {
    const { workMode, jobLevels, salary } = filters;
    const hasActiveFilters =
        workMode !== "all" ||
        jobLevels.length > 0 ||
        salary.min > 0 ||
        salary.max < 300000;

    if (!hasActiveFilters) return null;

    return (
        <div className="flex flex-wrap gap-2 mt-3">
            {/* {workMode !== "all" && (
        <Badge variant="outline" className="bg-blue-50 gap-1 px-2 py-1">
          {workMode === "remote" ? "Remote" : "Onsite"}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-1"
            onClick={() => clearFilter("workMode")}
          >
            <X size={12} />
          </Button>
        </Badge>
      )} */}

            {jobLevels.length > 0 &&
                jobLevels.map((level) => (
                    <Badge
                        key={level}
                        variant="outline"
                        className="bg-green-50 gap-1 px-2 py-1"
                    >
                        {level}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => clearFilter("jobLevel", level)}
                        >
                            <X size={12} />
                        </Button>
                    </Badge>
                ))}

            {(salary.min > 0 || salary.max < 300000) && (
                <Badge variant="outline" className="bg-yellow-50 gap-1 px-2 py-1">
                    ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => clearFilter("salary")}
                    >
                        <X size={12} />
                    </Button>
                </Badge>
            )}
        </div>
    );
};

// Add this loading component
const JobsLoadingState = () => (
    <div className="w-full space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
            <div
                key={i}
                className="w-full bg-white/50 p-4 rounded-xl flex flex-col sm:flex-row gap-4"
            >
                <div className="flex-1 space-y-4">
                    <div className="flex gap-3">
                        <div className="h-16 w-16 bg-gray-300 rounded"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                        <div className="flex gap-2">
                            <div className="h-8 w-24 bg-gray-300 rounded"></div>
                            <div className="h-8 w-24 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-32 bg-gray-300 rounded-xl"></div>
            </div>
        ))}
    </div>
);

// Add this component for the loading message
const LoadingMessage = () => (
    <div className="w-full flex justify-center items-center mb-4">
        <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading jobs, please wait...</span>
        </div>
    </div>
);

const ApplyJobs = () => {
    // 1. First, group all useState declarations together at the top
    const { isResumePresent, setIsResumePresent } = useContext(ThemeContext);
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);
    const [allJobs, setAllJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [visibleJobs, setVisibleJobs] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [jobType, setJobType] = useState(isResumePresent ? "recommended" : "all");
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTerms, setSearchTerms] = useState([]);
    const [totalJobs, setTotalJobs] = useState(0);
    const [filteredCount, setFilteredCount] = useState(0);

    // 2. Group all filter-related state
    const [filters, setFilters] = useState({
        searchTerm: "",
        workMode: "all",
        jobLevels: [],
        salary: { min: 0, max: 300000 },
        selectedCountries: [],
    });
    const [activeWorkMode, setActiveWorkMode] = useState("all");
    const [jobLevels, setJobLevels] = useState([]);

    // 3. Refs
    const { ref: bottomRef, inView } = useInView({
        threshold: 0.5,
    });

    // 4. Constants
    const jobsPerLoad = 5;
    const page = parseInt(searchParams.get("page")) || 1;

    const fetchJobs = async () => {
        setLoading(true);
        setError("");

        // Check if user is logged in when trying to access bookmarked or applied jobs
        if ((jobType === "bookmarked" || jobType === "applied") && !Cookies.get("userName")) {
            setAllJobs([]);
            setFilteredJobs([]);
            setVisibleJobs([]);
            setLoading(false);
            return;
        }

        // Determine which endpoint to use based on jobType
        let url = "https://api.jobsforce.ai/api/getalljobs"; // Default URL
        let method = "GET"; // Default method

        // Select the appropriate endpoint based on job type
        if (jobType === "recommended" && isResumePresent) {
            url = "https://api.jobsforce.ai/api/getmatchedjob";
            method = "POST";
        } else if (jobType === "bookmarked") {
            url = "https://api.jobsforce.ai/api/getallbookmarkjobs";
            method = "GET";
        } else if (jobType === "applied") {
            url = "https://api.jobsforce.ai/api/getappliedjobs";
            method = "GET";
        }

        console.log("Current job type:", jobType);
        console.log("Resume present:", isResumePresent);
        console.log("Using endpoint:", url);

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    authorization: Cookies.get("token"),
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch jobs from ${url}`);
            }

            const data = await response.json();
            let jobs = [];

            // Handle different response structures
            if (jobType === "bookmarked" && data.bookmarkedjobs) {
                // Transform bookmarked jobs to match the universal job card structure
                jobs = data.bookmarkedjobs.map((job) => ({
                    ...job,
                    // Add default values for fields that might be missing but required by JobCard          company_logo: job.company_logo || null,
                    date_posted: job.createdAt || new Date().toISOString(),
                    location: job.location || "Location not specified",
                    is_remote: job.is_remote || false,
                    job_type: job.job_type || "Not specified",
                    job_level: job.job_level || null,
                    min_amount: job.min_amount || null,
                    max_amount: job.max_amount || null,
                    interval: job.interval || "year",
                    match_score: job.match_score || 0,
                    site: job.site || null,
                }));
            } else if (jobType === "applied" && data.appliedjobs) {
                // Transform applied jobs to match the universal job card structure
                jobs = data.appliedjobs.map((job) => ({
                    ...job,
                    // Add default values for fields that might be missing but required by JobCard
                    company_logo: job.company_logo || null,
                    date_posted: job.createdAt || new Date().toISOString(),
                    location: job.location || "Location not specified",
                    is_remote: job.is_remote || false,
                    job_type: job.job_type || "Not specified",
                    job_level: job.job_level || null,
                    min_amount: job.min_amount || null,
                    max_amount: job.max_amount || null,
                    interval: job.interval || "year",
                    match_score: job.match_score || 0,
                    site: job.site || null,
                }));
            } else {
                // Standard job structure for "all" and "recommended"
                jobs = data.jobs || [];
            }

            // Extract available job levels from the jobs
            const uniqueLevels = [
                ...new Set(
                    jobs.filter((job) => job.job_level).map((job) => job.job_level)
                ),
            ];
            setJobLevels(uniqueLevels);

            setAllJobs(jobs);
            setFilteredJobs(jobs);
            // Initially show first batch of jobs
            setVisibleJobs(jobs.slice(0, jobsPerLoad));
            setHasMore(jobs.length > jobsPerLoad);
        } catch (err) {
            setError(`Error fetching jobs: ${err.message}`);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        const currentLength = visibleJobs.length;
        const nextBatch = filteredJobs.slice(
            currentLength,
            currentLength + jobsPerLoad
        );

        if (nextBatch.length > 0) {
            setVisibleJobs((prev) => [...prev, ...nextBatch]);
            setHasMore(currentLength + jobsPerLoad < filteredJobs.length);
        } else {
            setHasMore(false);
        }
    };

    const applyFilters = (filterOptions) => {
        let filteredResults = [...allJobs];

        // State filter
        if (filterOptions.selectedCountries && filterOptions.selectedCountries.length > 0) {
            filteredResults = filteredResults.filter((job) => {
                if (!job.location) return false;

                const jobLocation = job.location.toLowerCase();
                const locationParts = jobLocation.split(',').map(part => part.trim());

                return filterOptions.selectedCountries.some(stateCode => {
                    const state = US_STATES.find(s => s.code === stateCode);
                    if (!state) return false;

                    // Check for state name or abbreviation in the location
                    return locationParts.some(part =>
                        part.toLowerCase() === state.name.toLowerCase() ||
                        part.toUpperCase() === state.shortForm
                    );
                });
            });
        }

        // Salary filter
        if (filterOptions.salary) {
            filteredResults = filteredResults.filter((job) => {
                const min = filterOptions.salary.min || 0;
                const max = filterOptions.salary.max || maxPossibleSalary;
                if (job.min_amount && job.max_amount) {
                    return job.min_amount <= max && job.max_amount >= min;
                }
                return true;
            });
        }

        // Search terms filter (multi-search)
        if (filterOptions.searchTerms && filterOptions.searchTerms.length > 0) {
            filteredResults = filteredResults.filter((job) =>
                filterOptions.searchTerms.some((term) => {
                    if (!term) return false;

                    // Safely check if properties exist before calling toLowerCase()
                    const titleMatch =
                        job.title && job.title.toLowerCase().includes(term.toLowerCase());
                    const companyMatch =
                        job.company &&
                        job.company.toLowerCase().includes(term.toLowerCase());
                    const descriptionMatch =
                        job.description &&
                        job.description.toLowerCase().includes(term.toLowerCase());
                    const locationMatch =
                        job.location &&
                        job.location.toLowerCase().includes(term.toLowerCase());

                    // Return true if any field matches
                    return (
                        titleMatch || companyMatch || descriptionMatch || locationMatch
                    );
                })
            );
        }

        // Work mode filter
        if (filterOptions.workMode && filterOptions.workMode !== "all") {
            filteredResults = filteredResults.filter((job) => {
                if (filterOptions.workMode === "remote") {
                    return job.is_remote === true;
                } else if (filterOptions.workMode === "onsite") {
                    return job.is_remote === false;
                }
                return true;
            });
        }

        // Job level filter
        if (filterOptions.jobLevels && filterOptions.jobLevels.length > 0) {
            filteredResults = filteredResults.filter((job) =>
                filterOptions.jobLevels.includes(job.job_level)
            );
        }

        setFilteredJobs(filteredResults);
        setVisibleJobs(filteredResults.slice(0, jobsPerLoad));
        setHasMore(filteredResults.length > jobsPerLoad);
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            searchTerm: "",
            workMode: "all",
            jobLevels: [],
            salary: { min: 0, max: 300000 },
            selectedCountries: [], // Reset selected countries
        });
        setSalaryRange([0, 500000]); // Reset salary range
        setSearchTerm("");
        setActiveWorkMode("all");
        setFilteredJobs(allJobs);
        setVisibleJobs(allJobs.slice(0, jobsPerLoad));
        setHasMore(allJobs.length > jobsPerLoad);
    };

    // Add these handler functions
    const handleAddSearchTerm = () => {
        if (searchTerm.trim()) {
            // Split by commas and add all non-empty terms
            const newTerms = searchTerm
                .split(",")
                .map((term) => term.trim())
                .filter((term) => term.length > 0);

            if (newTerms.length > 0) {
                setSearchTerms((prev) => [...prev, ...newTerms]);
                setSearchTerm("");
            }
        }
    };

    const handleRemoveSearchTerm = (index) => {
        setSearchTerms((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSearch = () => {
        setFilters((prev) => ({
            ...prev,
            searchTerms: searchTerms,
        }));

        applyFilters({
            ...filters,
            searchTerms: searchTerms,
        });
    };

    // Handle work mode badge click (quick filter)
    const handleWorkModeClick = (mode) => {
        const newMode = activeWorkMode === mode ? "all" : mode;
        setActiveWorkMode(newMode);

        const newFilters = {
            ...filters,
            workMode: newMode,
        };

        setFilters(newFilters);
        applyFilters(newFilters);
    };

    // Clear a specific filter
    const clearFilter = (filterType, value) => {
        if (filterType === "workMode") {
            setFilters((prev) => ({
                ...prev,
                workMode: "all",
            }));
            setActiveWorkMode("all");
        } else if (filterType === "jobLevel") {
            setFilters((prev) => ({
                ...prev,
                jobLevels: prev.jobLevels.filter((level) => level !== value),
            }));
        } else if (filterType === "salary") {
            setFilters((prev) => ({
                ...prev,
                salary: { min: 0, max: 300000 },
            }));
        } else if (filterType === "selectedCountries") {
            setFilters((prev) => ({
                ...prev,
                selectedCountries: prev.selectedCountries.filter((code) => code !== value),
            }));
        }

        // Apply the updated filters
        setTimeout(() => {
            applyFilters({
                ...filters,
                [filterType]:
                    filterType === "workMode"
                        ? "all"
                        : filterType === "jobLevel"
                            ? filters.jobLevels.filter((level) => level !== value)
                            : filterType === "selectedCountries"
                                ? filters.selectedCountries.filter((code) => code !== value)
                                : { min: 0, max: 300000 },
            });
        }, 0);
    };

    // 5. Group all useEffects together
    useEffect(() => {
        setJobType(isResumePresent ? "recommended" : "all");
    }, []);

    useEffect(() => {
        if (jobType) {
            fetchJobs();
        }
    }, [jobType]);

    useEffect(() => {
        if (inView && hasMore && !loading) {
            loadMore();
        }
    }, [inView, hasMore, loading]);

    useEffect(() => {
        if (allJobs) {
            setTotalJobs(allJobs.length);
        }
    }, [allJobs]);

    useEffect(() => {
        if (filteredJobs) {
            setFilteredCount(filteredJobs.length);
        }
    }, [filteredJobs]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    if (allJobs.length == 0 && isResumePresent && jobType === "recommended") {
        return <AILoader />;
    }

    const closeDrawer = () => setOpen(false);

    const handlePrimaryResumeChange = () => {
        // Refetch jobs when primary resume changes
        fetchJobs();
    };

    // In the main content area, add this component
    const NoJobsMessage = ({ selectedCountries, clearFilters }) => {
        const getStateNames = () => {
            return selectedCountries.map(code =>
                US_STATES.find(s => s.code === code)?.name
            ).filter(Boolean).join(", ");
        };

        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
                    <FileText className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                        No Jobs Found
                    </h3>
                    <p className="text-yellow-700 mb-4">
                        We couldn't find any jobs in {getStateNames()}.
                        Try selecting different states or clearing filters.
                    </p>
                    <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                    >
                        Clear State Filters
                    </Button>
                </div>
            </div>
        );
    };

    // Update the selected states display in the main content area
    const getStateNames = (selectedStates) => {
        return selectedStates
            .map(code => US_STATES.find(s => s.code === code)?.name)
            .filter(Boolean)
            .join(", ");
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50">
            <JobPageHeader
                setJobType={setJobType}
                currentJobType={jobType}
                isResumePresent={isResumePresent}
                isLoading={isLoading}
            />

            {/* Show loading message when jobs are being fetched */}
            {loading && <LoadingMessage />}

            {/* Show login required message for bookmarked/applied jobs */}
            {(jobType === "bookmarked" || jobType === "applied") && !Cookies.get("userName") ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-8 max-w-md mx-auto">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                                Login Required
                            </h3>
                            <p className="text-yellow-700 mb-4">
                                Please log in to view your {jobType === "bookmarked" ? "bookmarked" : "applied"} jobs.
                            </p>
                            <Link href="/login">
                                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                                    Log In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-1">
                    {/* Mobile Filter Sheet */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                className="fixed bottom-4 right-4 z-50 lg:hidden"
                            >
                                <Filter className="mr-2" />
                                Filters
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle>Filters & Search</SheetTitle>
                            </SheetHeader>
                            <FilterSidebar
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                searchTerms={searchTerms}
                                handleAddSearchTerm={handleAddSearchTerm}
                                handleRemoveSearchTerm={handleRemoveSearchTerm}
                                handleSearch={handleSearch}
                                filters={filters}
                                setFilters={setFilters}
                                jobLevels={jobLevels}
                                applyFilters={applyFilters}
                                resetFilters={resetFilters}
                                activeWorkMode={activeWorkMode}
                                handleWorkModeClick={handleWorkModeClick}
                                onPrimaryResumeChange={handlePrimaryResumeChange}
                                totalJobs={totalJobs}
                                filteredCount={filteredCount}
                            />
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block w-[300px] bg-transparent mr-1">
                        <FilterSidebar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            searchTerms={searchTerms}
                            handleAddSearchTerm={handleAddSearchTerm}
                            handleRemoveSearchTerm={handleRemoveSearchTerm}
                            handleSearch={handleSearch}
                            filters={filters}
                            setFilters={setFilters}
                            jobLevels={jobLevels}
                            applyFilters={applyFilters}
                            resetFilters={resetFilters}
                            activeWorkMode={activeWorkMode}
                            handleWorkModeClick={handleWorkModeClick}
                            onPrimaryResumeChange={handlePrimaryResumeChange}
                            totalJobs={totalJobs}
                            filteredCount={filteredCount}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-xl border border-gray-200">
                        <ScrollArea className="h-[calc(100vh-64px)]">
                            <main className="p-6">
                                {/* Active filters display */}
                                <ActiveFilters filters={filters} clearFilter={clearFilter} />

                                {/* Show selected states info */}
                                {filters.selectedCountries.length > 0 && (
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Showing jobs in: {getStateNames(filters.selectedCountries)}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {filteredCount} jobs found
                                        </div>
                                    </div>
                                )}

                                {jobType === 'applied' && filteredCount === 0 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-gray-500 mt-4"
                                    >
                                        You didn't apply for any jobs
                                    </motion.p>
                                )}

                                {jobType === 'bookmarked' && filteredCount === 0 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-gray-500 mt-4"
                                    >
                                        You didn't bookmark any jobs
                                    </motion.p>
                                )}

                                {/* Jobs list or No Jobs Message */}
                                {loading ? (
                                    <JobsLoadingState />
                                ) : filteredCount === 0 && filters.selectedCountries.length > 0 ? (
                                    <NoJobsMessage
                                        selectedCountries={filters.selectedCountries}
                                        clearFilters={() => {
                                            setFilters(prev => ({ ...prev, selectedCountries: [] }));
                                            applyFilters({ ...filters, selectedCountries: [] });
                                        }}
                                    />
                                ) : (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                        className="space-y-4"
                                    >
                                        {visibleJobs.map((job, index) => (
                                            <motion.div
                                                key={`${job._id || job.id || job.mongo_id}-${index}`}
                                                variants={itemVariants}
                                                layout
                                            >
                                                <JobCard
                                                    jobId={job._id || job.id || job.mongo_id}
                                                    job={job}
                                                    jobType={jobType}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {/* Loading indicator */}
                                {hasMore && filteredCount > 0 && (
                                    <div
                                        ref={bottomRef}
                                        className="w-full flex justify-center items-center p-4"
                                    >
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                                    </div>
                                )}

                                {/* No more jobs message */}
                                {!hasMore && filteredCount > 0 && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center text-gray-500 mt-4"
                                    >
                                        No more jobs to load
                                    </motion.p>
                                )}
                            </main>
                        </ScrollArea>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplyJobs;

