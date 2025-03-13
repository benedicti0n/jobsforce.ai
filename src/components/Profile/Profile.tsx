"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

import MarkdownPreview from "@uiw/react-markdown-preview";
import axios from "axios";
import Cookies from "js-cookie";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "../ui/Button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, } from "@/components/ui/dialog";
import EditProfileModal from "./EditProfileModal";

import { Bookmark, Briefcase, Calendar, Github, Linkedin, Mail, MapPin, PhoneCall, SquareArrowOutUpRight, SquarePen } from "lucide-react";

import { generateAvatarData, generateCompanyAvatar } from "./Helper Functions/generateAvatar";
import { formatDate, getRelativeTime } from "./Helper Functions/date";
import { useModalStore, useLoadingStore } from "@/store";

// Helper function for status badge styling
const getStatusBadgeClass = (status) => {
    switch (status) {
        case "Applied":
            return "bg-blue-50 text-blue-600 border-blue-200";
        case "Interviewing":
            return "bg-purple-50 text-purple-600 border-purple-200";
        case "Rejected":
            return "bg-red-50 text-red-600 border-red-200";
        case "Offer":
            return "bg-green-50 text-green-600 border-green-200";
        default:
            return "bg-slate-50 text-slate-600 border-slate-200";
    }
};

const formatDescription = (description) => {
    if (!description) return "No description available";

    // Clean up the description and take the first 150 characters
    const cleanDesc = description
        .replace(/\\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return cleanDesc.length > 150
        ? cleanDesc.substring(0, 150) + "..."
        : cleanDesc;
};

const getDefaultLink = (type) => {
    switch (type) {
        case "github":
            return "https://github.com";
        case "linkedin":
            return "https://linkedin.com";
        case "portfolio":
            return "https://github.com";
        default:
            return "#";
    }
};

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
    const [activeJob, setActiveJob] = useState(null);
    const [error, setError] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [activeBookmarkUrl, setActiveBookmarkUrl] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const { isEditOpen, openModal, closeModal } = useModalStore();
    const { isLoading, startLoading, finishLoading } = useLoadingStore()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = Cookies.get("token");
                startLoading();
                const response = await axios.get(
                    "https://api.jobsforce.ai/api/details",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            authorization: `${token}`,
                        },
                    }
                );
                const data = response.data;
                setUserDetails(data.userDetails);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                finishLoading();
            }
        };
        const fetchAppliedJobs = async () => {
            try {
                const token = Cookies.get("token");
                startLoading();

                const response = await axios.get(
                    "https://api.jobsforce.ai/api/getappliedjobs",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            // Most JWT authentication expects "Bearer " prefix before the token
                            authorization: `${token}`,
                        },
                    }
                );

                // Process and format the job data from the response
                const formattedJobs = response.data.appliedjobs.map((job) => {
                    const avatarInfo = generateCompanyAvatar(job.company);

                    return {
                        id: job._id,
                        company: job.company,
                        title: job.title,
                        appliedDate: formatDate(job.createdAt),
                        status: "Applied", // Default status since not provided in backend
                        description: job.description,
                        logo: avatarInfo.logo,
                        logoColor: avatarInfo.logoColor,
                        job_url: job.job_url,
                    };
                });

                setAppliedJobs(formattedJobs);
                if (formattedJobs.length > 0) {
                    setActiveJob(formattedJobs[0]);
                }
            } catch (err) {
                console.error("Error fetching applied jobs:", err);
                setError("Failed to load applied jobs. Please try again later.");
            } finally {
                finishLoading();
            }
        };

        const fetchBookmarkedJobs = async () => {
            try {
                const token = Cookies.get("token");
                console.log(token);
                startLoading();
                const response = await axios.get(
                    "https://api.jobsforce.ai/api/getallbookmarkjobs",
                    {
                        headers: {
                            "Content-Type": "application/json",
                            // Most JWT authentication expects "Bearer " prefix before the token
                            authorization: `${token}`,
                        }, // Include cookies for authentication
                    }
                );
                setBookmarkedJobs(response.data.bookmarkedjobs);
                setError(null);
            } catch (err) {
                console.error("Error fetching bookmarked jobs:", err);
                setError("Failed to load bookmarked jobs. Please try again.");
                toast.error("Failed to load bookmarked jobs");
            } finally {
                finishLoading();
            }
        };

        fetchUserData();
        fetchAppliedJobs();
        fetchBookmarkedJobs();
    }, []);

    useEffect(() => {
        localStorage.removeItem("appliedJob");

        const handleFocus = () => {
            const appliedJobUrl = localStorage.getItem("appliedJob");
            if (appliedJobUrl) {
                setActiveBookmarkUrl(appliedJobUrl);
                setShowDialog(true);
            }
        };

        window.addEventListener("focus", handleFocus);

        handleFocus();

        return () => {
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    const viewFullApplication = (url) => {
        if (url) window.open(url, "_blank");
    };

    if (isLoading) {
        return <div className="p-6 text-center">Loading applied jobs...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "Rejected":
                return "bg-red-100 text-red-800 border-red-200";
            case "In Review":
                return "bg-amber-100 text-amber-800 border-amber-200";
            case "Screening":
                return "bg-emerald-100 text-emerald-800 border-emerald-200";
            default:
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
        }
    };

    const handleApplyClick = (job_url) => {
        localStorage.setItem("appliedJob", job_url);
        window.open(job_url, "_blank");
    };

    const handleResponse = async (response) => {
        if (response === "Yes" && activeBookmarkUrl) {
            // Find the job details from bookmarkedJobs array
            const appliedJob = bookmarkedJobs.find(
                (job) => job.job_url === activeBookmarkUrl
            );

            if (appliedJob) {
                const success = await submitAppliedJob(appliedJob);
                if (success) {
                    setToastMessage(`${appliedJob.title} added to Applied Jobs`);
                } else {
                    setToastMessage("Failed to add to Applied Jobs. Please try again.");
                }
                setShowToast(true);
            }
        }

        localStorage.removeItem("appliedJob");
        setShowDialog(false);
        setActiveBookmarkUrl(null);
    };

    const submitAppliedJob = async (jobData) => {
        try {
            const token = Cookies.get("token");

            const response = await axios.post(
                "https://api.jobsforce.ai/api/appliedjobs",
                {
                    company: jobData.company,
                    description: jobData.description,
                    job_url: jobData.job_url,
                    title: jobData.title,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `${token}`,
                    },
                }
            );

            return true;
        } catch (error) {
            console.error("Error adding job to applied jobs:", error);
            return false;
        }
    };

    return (
        <div className="min-h-screen p-4 md:pt-32">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    <div className="relative">
                        <div className="h-48 bg-yellow-100">
                            <div className=""></div>
                        </div>

                        <div className="absolute top-4 right-4 z-20">
                            <Button onClick={openModal}>
                                <SquarePen className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </div>

                        <div className="flex flex-col md:flex-row p-6 relative -mt-20">
                            <div className="md:w-1/4 flex flex-col items-center md:items-start">
                                <Avatar className="h-32 w-32 ring-4 ring-white shadow-xl">
                                    <AvatarImage
                                        src="/pfp.jpeg"
                                        alt={userDetails?.userId.userName}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white text-3xl">
                                        {userDetails?.userId.userName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-bold mt-4 text-gray-900">
                                    {userDetails?.userId.userName}
                                </h2>
                                <p className="text-gray-600 flex items-center gap-2 mb-3">
                                    <Mail className="h-4 w-4" />
                                    {userDetails?.userId.email}
                                </p>
                                <div className="flex items-center gap-4">
                                    <Link
                                        href={userDetails?.linkdin || getDefaultLink("linkedin")}
                                        target="_blank"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                        title="LinkedIn Profile"
                                    >
                                        <Linkedin size={18} />
                                    </Link>
                                    <Link
                                        href={userDetails?.github || getDefaultLink("github")}
                                        target="_blank"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                        title="GitHub Profile"
                                    >
                                        <Github size={18} />
                                    </Link>
                                    <Link
                                        href={userDetails?.portfolio || getDefaultLink("portfolio")}
                                        target="_blank"
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                        title="Portfolio Website"
                                    >
                                        <SquareArrowOutUpRight size={18} />
                                    </Link>
                                </div>
                            </div>

                            <div className="md:w-3/4 mt-6 md:mt-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="text-yellow-700" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">
                                            LOCATION
                                        </p>
                                        <p className="text-slate-700">
                                            {userDetails?.currentLocation}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                        <PhoneCall className="text-yellow-700" size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">
                                            CONTACT
                                        </p>
                                        <p className="text-slate-700">+91-{userDetails?.contact}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <Tabs defaultValue="applied" className="w-full">
                        <div className="px-6 pt-6">
                            <TabsList className="w-full grid grid-cols-2 max-w-md">
                                <TabsTrigger
                                    value="applied"
                                    className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white rounded-md"
                                >
                                    <Briefcase className="mr-2" />
                                    Applied Jobs
                                </TabsTrigger>
                                <TabsTrigger
                                    value="bookmarked"
                                    className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white rounded-md"
                                >
                                    <Bookmark className="mr-2" />
                                    Bookmarked Jobs
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="applied" className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                        Application History
                                    </h3>
                                    <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                        {appliedJobs.length > 0 ? (
                                            <Table>
                                                <TableHeader className="bg-slate-100">
                                                    <TableRow>
                                                        <TableHead className="w-12">Company</TableHead>
                                                        <TableHead>Position</TableHead>
                                                        <TableHead className="hidden md:table-cell">
                                                            Applied On
                                                        </TableHead>
                                                        <TableHead>Status</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {appliedJobs.map((job) => (
                                                        <TableRow
                                                            key={job.id}
                                                            className={`hover:bg-yellow-50 cursor-pointer ${activeJob?.id === job.id ? "bg-yellow-50" : ""
                                                                }`}
                                                            onClick={() => setActiveJob(job)}
                                                        >
                                                            <TableCell>
                                                                <Avatar className="h-10 w-10 border border-slate-200">
                                                                    <AvatarFallback
                                                                        style={{
                                                                            backgroundColor: job.logoColor,
                                                                            color: "white",
                                                                        }}
                                                                    >
                                                                        {job.logo}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="font-medium text-slate-800">
                                                                    {job.title}
                                                                </div>
                                                                <div className="text-sm text-slate-500">
                                                                    {job.company}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                <div className="flex items-center">
                                                                    <Calendar
                                                                        className="text-slate-400 mr-2"
                                                                        size={14}
                                                                    />
                                                                    {job.appliedDate}
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    variant="outline"
                                                                    className={`${getStatusBadgeClass(
                                                                        job.status
                                                                    )}`}
                                                                >
                                                                    {job.status}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="p-6 text-center text-slate-500">
                                                No applications found. Start applying to jobs to see
                                                them here.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-1">
                                    <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                        Application Details
                                    </h3>
                                    <Card className="h-full border-slate-200 shadow-sm">
                                        {activeJob ? (
                                            <CardContent className="p-6">
                                                <div className="flex items-center mb-6">
                                                    <Avatar className="h-12 w-12 mr-4">
                                                        <AvatarFallback
                                                            style={{
                                                                backgroundColor: activeJob.logoColor,
                                                                color: "white",
                                                            }}
                                                        >
                                                            {activeJob.logo}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-slate-800">
                                                            {activeJob.title}
                                                        </h4>
                                                        <p className="text-slate-500">
                                                            {activeJob.company}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-500 mb-1">
                                                            Status
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className={`${getStatusBadgeClass(
                                                                activeJob.status
                                                            )}`}
                                                        >
                                                            {activeJob.status}
                                                        </Badge>
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-medium text-slate-500 mb-1">
                                                            Applied On
                                                        </p>
                                                        <p className="text-slate-700">
                                                            {activeJob.appliedDate}
                                                        </p>
                                                    </div>

                                                    <div className="overflow-y-auto h-64">
                                                        <p className="text-sm font-medium text-slate-500 mb-1">
                                                            Job Description
                                                        </p>
                                                        <MarkdownPreview
                                                            source={activeJob.description}
                                                            style={{
                                                                padding: 6,
                                                                borderRadius: 8,
                                                                backgroundColor: "#f3f4f6",
                                                                color: "#333",
                                                                fontSize: 16,
                                                                lineHeight: 1.5,
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-6 pt-6 border-t border-slate-200">
                                                    <Button
                                                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                                                        onClick={() =>
                                                            viewFullApplication(activeJob.job_url)
                                                        }
                                                    >
                                                        View Full Application
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        ) : (
                                            <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                    <Briefcase className="text-slate-400" size={24} />
                                                </div>
                                                <h4 className="text-lg font-medium text-slate-800 mb-2">
                                                    No Application Selected
                                                </h4>
                                                <p className="text-slate-500">
                                                    Click on any application to view details
                                                </p>
                                            </CardContent>
                                        )}
                                    </Card>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="bookmarked" className="p-6">
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                Saved Opportunities ({bookmarkedJobs.length})
                            </h3>

                            {bookmarkedJobs.length === 0 ? (
                                <div className="text-center py-10 bg-slate-50 rounded-lg">
                                    <div className="text-slate-400 text-5xl mb-4">📑</div>
                                    <h4 className="text-lg font-medium text-slate-700 mb-2">
                                        No bookmarked jobs yet
                                    </h4>
                                    <p className="text-slate-500 mb-4">
                                        Start browsing and save jobs that interest you
                                    </p>
                                    <Button
                                        onClick={() => (window.location.href = "/job-apply")}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                                    >
                                        Browse Jobs
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {bookmarkedJobs.map((job) => {
                                        const { logoColor, initials } = generateAvatarData(
                                            job.company
                                        );
                                        const formattedDescription = formatDescription(
                                            job.description
                                        );
                                        const relativeTime = getRelativeTime(job.createdAt);

                                        return (
                                            <Card
                                                key={job._id}
                                                className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow"
                                            >
                                                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <Avatar className="h-10 w-10 mr-3">
                                                            <AvatarFallback
                                                                style={{
                                                                    backgroundColor: logoColor,
                                                                    color: "white",
                                                                }}
                                                            >
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <h4 className="font-medium text-slate-800 truncate max-w-[150px]">
                                                                {job.company}
                                                            </h4>
                                                            <p className="text-xs text-slate-500">
                                                                Saved: {relativeTime}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                                    >
                                                        Saved
                                                    </Badge>
                                                </div>

                                                <CardContent className="p-4">
                                                    <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-1">
                                                        {job.title}
                                                    </h3>

                                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                                        <div className="flex items-center text-sm">
                                                            <MapPin className="text-slate-400 mr-1" />
                                                            <span className="text-slate-600 truncate">
                                                                Remote/Hybrid
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center text-sm">
                                                            <Briefcase className="text-slate-400 mr-1" />
                                                            <span className="text-slate-600 truncate">
                                                                Full Time
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="w-full px-2">
                                                        <Link
                                                            href={job.job_url}
                                                            target="_blank"
                                                            onClick={() => handleApplyClick(job.job_url)}
                                                        >
                                                            <Button className="w-full border-slate-200 hover:bg-slate-50 text-slate-700">
                                                                Apply
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader className="flex flex-col items-center">
                        <img
                            src="/hero/8.png"
                            alt="Jobsforce Logo"
                            className="w-16 h-16 mb-2"
                        />
                        <DialogTitle>Job Application Confirmation</DialogTitle>
                        <DialogDescription className="text-center text-gray-600">
                            Please confirm whether you have submitted an application for this
                            job. Your response will help us track your application status
                            effectively.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center gap-4 p-4">
                        <Button onClick={() => handleResponse("Yes")}>Applied</Button>
                        <Button variant="outline" onClick={() => handleResponse("No")}>
                            Not Applied
                        </Button>
                    </div>
                    <p className="text-center mt-2 text-sm font-medium">
                        Powered by <span className="text-[#40E2FF]">Jobs</span>
                        <span className="text-[#ECD049]">force</span>
                    </p>
                </DialogContent>
            </Dialog>
            {showToast && (
                <div className="fixed top-4 right-4 z-50 bg-green-200 border-l-4 border-green-500 text-green-950 p-4 rounded-md shadow-md">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 text-green-700">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{toastMessage}</p>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setShowToast(false)}
                                className="focus:outline-none"
                            >
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isEditOpen && (
                <EditProfileModal userDetails={userDetails} />
            )}
        </div>
    );
};

export default Profile;