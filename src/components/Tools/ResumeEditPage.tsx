"use client"
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Cookies from "js-cookie";
import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

import {
    ChevronDown,
    ChevronUp,
    Trash2,
    Plus,
    FileText,
    Settings,
    GripVertical,
} from "lucide-react";

import { Button } from "../ui/Button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "../ui/card";
import { Input } from "../ui/input";

import DraggableSection from "@/utils/DraggableSection";
import FieldEditor from "@/utils/FieldEditor.jsx";
import TemplateManager from "@/components/ResumeTemplates/TemplateManager";
import { toast } from "sonner";

// Define styles for the PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 30,
    },
    section: {
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    header: {
        fontSize: 14,
        marginBottom: 10,
        fontWeight: 'bold',
    },
});

// Create a PDF Document component
const ResumePDF = ({ sections }) => {
    const personalInfo = sections.find(s => s.id === "personal-info") || { fields: [] };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Section */}
                <View style={styles.section}>
                    <Text style={styles.title}>
                        {personalInfo.fields.find(f => f.id === "name")?.value || "Your Name"}
                    </Text>
                    <Text style={styles.text}>
                        {personalInfo.fields.find(f => f.id === "email")?.value || ""}
                    </Text>
                    <Text style={styles.text}>
                        {personalInfo.fields.find(f => f.id === "phone")?.value || ""}
                    </Text>
                    <Text style={styles.text}>
                        {personalInfo.fields.find(f => f.id === "location")?.value || ""}
                    </Text>
                </View>

                {/* Summary Section */}
                {sections.find(s => s.id === "summary") && (
                    <View style={styles.section}>
                        <Text style={styles.header}>Professional Summary</Text>
                        <Text style={styles.text}>
                            {sections.find(s => s.id === "summary").fields[0]?.value || ""}
                        </Text>
                    </View>
                )}

                {/* Experience Section */}
                {sections.find(s => s.id === "experience") && (
                    <View style={styles.section}>
                        <Text style={styles.header}>Experience</Text>
                        {sections.find(s => s.id === "experience").entries.map((entry, index) => (
                            <View key={index} style={styles.section}>
                                <Text style={styles.subtitle}>
                                    {entry.fields.find(f => f.id === "title")?.value || ""}
                                </Text>
                                <Text style={styles.text}>
                                    {entry.fields.find(f => f.id === "company")?.value || ""} •
                                    {entry.fields.find(f => f.id === "location")?.value || ""}
                                </Text>
                                <Text style={styles.text}>
                                    {entry.fields.find(f => f.id === "duration")?.value || ""}
                                </Text>
                                <Text style={styles.text}>
                                    {entry.fields.find(f => f.id === "responsibilities")?.value || ""}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Education Section */}
                {sections.find(s => s.id === "education") && (
                    <View style={styles.section}>
                        <Text style={styles.header}>Education</Text>
                        <Text style={styles.subtitle}>
                            {sections.find(s => s.id === "education").fields.find(f => f.id === "university")?.value || ""}
                        </Text>
                        <Text style={styles.text}>
                            {sections.find(s => s.id === "education").fields.find(f => f.id === "degree")?.value || ""}
                        </Text>
                        <Text style={styles.text}>
                            {sections.find(s => s.id === "education").fields.find(f => f.id === "Start-Month/Year-End-Month/Year")?.value || ""}
                        </Text>
                    </View>
                )}

                {/* Skills Section */}
                {sections.find(s => s.id === "skills") && (
                    <View style={styles.section}>
                        <Text style={styles.header}>Skills</Text>
                        {sections.find(s => s.id === "skills").fields.map((field, index) => (
                            <View key={index}>
                                <Text style={styles.subtitle}>{field.label}</Text>
                                <Text style={styles.text}>{field.value}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
};

export const ResumeEditpage = () => {
    const [sections, setSections] = useState([
        {
            id: "personal-info",
            title: "Personal Information",
            icon: "👤",
            fields: [
                { id: "name", label: "Full Name", value: "Alex Morgan", type: "text" },
                {
                    id: "email",
                    label: "Email",
                    value: "alex.morgan@example.com",
                    type: "email",
                },
                { id: "phone", label: "Phone", value: "(555) 123-4567", type: "tel" },
                {
                    id: "location",
                    label: "Location",
                    value: "San Francisco, CA",
                    type: "text",
                },
                {
                    id: "portfolio",
                    label: "Portfolio",
                    value: "https://portfolio.example.com",
                    type: "url",
                },
                {
                    id: "linkedin",
                    label: "LinkedIn",
                    value: "https://linkedin.com/in/alexmorgan",
                    type: "url",
                },
                {
                    id: "github",
                    label: "GitHub",
                    value: "https://github.com/alexmorgan",
                    type: "url",
                },
            ],
        },
        {
            id: "summary",
            title: "Professional Summary",
            icon: "📝",
            fields: [
                {
                    id: "summary",
                    label: "Summary",
                    value:
                        "Full-stack software engineer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about creating efficient, user-friendly solutions and mentoring junior developers.",
                    type: "markdown",
                },
            ],
        },
        {
            id: "experience",
            title: "Experience",
            icon: "💼",
            isMulti: true,
            entries: [
                {
                    fields: [
                        {
                            id: "title",
                            label: "Title",
                            value: "Senior Software Engineer",
                            type: "text",
                        },
                        {
                            id: "company",
                            label: "Company",
                            value: "TechCorp Solutions",
                            type: "text",
                        },
                        {
                            id: "location",
                            label: "Location",
                            value: "San Francisco, CA",
                            type: "text",
                        },
                        {
                            id: "duration",
                            label: "Duration",
                            value: "Jan 2021 - Present",
                            type: "text",
                        },
                        {
                            id: "responsibilities",
                            label: "Key Achievements",
                            value:
                                " Led development of microservices architecture serving 1M+ users\n Reduced API response time by 40% through optimization\n Mentored 5 junior developers and led technical interviews\n Implemented CI/CD pipeline reducing deployment time by 60%",
                            type: "bullets",
                        },
                        {
                            id: "technologies",
                            label: "Technologies",
                            value: "React, Node.js, TypeScript, AWS, Docker, MongoDB",
                            type: "text",
                        },
                    ],
                },
                {
                    fields: [
                        {
                            id: "title",
                            label: "Title",
                            value: "Software Engineer",
                            type: "text",
                        },
                        {
                            id: "company",
                            label: "Company",
                            value: "InnovateTech",
                            type: "text",
                        },
                        {
                            id: "location",
                            label: "Location",
                            value: "Boston, MA",
                            type: "text",
                        },
                        {
                            id: "duration",
                            label: "Duration",
                            value: "Jun 2018 - Dec 2020",
                            type: "text",
                        },
                        {
                            id: "responsibilities",
                            label: "Key Achievements",
                            value:
                                " Developed and maintained customer-facing web applications\n Implemented responsive design improving mobile usage by 35%\n Collaborated with UX team to improve user satisfaction by 25%\n Built automated testing suite with 90% coverage",
                            type: "bullets",
                        },
                        {
                            id: "technologies",
                            label: "Technologies",
                            value: "JavaScript, React, Express.js, PostgreSQL, Jest",
                            type: "text",
                        },
                    ],
                },
            ],
            fields: [],
        },
        {
            id: "education",
            title: "Education",
            icon: "🎓",
            fields: [
                {
                    id: "degree",
                    label: "Degree",
                    value: "B.S. Computer Science",
                    type: "text",
                },
                {
                    id: "university",
                    label: "University",
                    value: "University of Technology",
                    type: "text",
                },
                {
                    id: "Start-Month/Year-End-Month/Year",
                    label: "Duration",
                    value: "Sep 2014 - May 2018",
                    type: "text",
                },
                {
                    id: "location",
                    label: "Location",
                    value: "Cambridge, MA",
                    type: "text",
                },
                {
                    id: "graduation",
                    label: "Graduation",
                    value: "May 2018",
                    type: "text",
                },
                { id: "cgpa-or-percentage", label: "CGPA", value: "3.8", type: "text" },
                {
                    id: "achievements",
                    label: "Achievements",
                    value:
                        " Dean's List all semesters\n Computer Science Honor Society\n Undergraduate Research Assistant",
                    type: "bullets",
                },
            ],
        },
        {
            id: "skills",
            title: "Skills",
            icon: "🛠️",
            fields: [
                {
                    id: "technical",
                    label: "Technical Skills",
                    value:
                        " Languages: JavaScript, TypeScript, Python, Java\n Frontend: React, Vue.js, HTML5, CSS3, Tailwind\n Backend: Node.js, Express, Django\n Database: MongoDB, PostgreSQL\n Cloud: AWS, Docker, Kubernetes",
                    type: "bullets",
                },
                {
                    id: "soft",
                    label: "Soft Skills",
                    value:
                        " Technical Leadership\n Project Management\n Team Collaboration\n Problem Solving\n Communication",
                    type: "bullets",
                },
            ],
        },
        {
            id: "projects",
            title: "Projects",
            icon: "🚀",
            isMulti: true,
            entries: [
                {
                    fields: [
                        {
                            id: "name",
                            label: "Project Name",
                            value: "E-commerce Platform",
                            type: "text",
                        },
                        {
                            id: "description",
                            label: "Description",
                            value:
                                "Built a full-stack e-commerce platform with inventory management, payment processing, and user authentication.",
                            type: "markdown",
                        },
                        {
                            id: "technologies",
                            label: "Technologies",
                            value: "React, Node.js, Express, MongoDB, Stripe API",
                            type: "text",
                        },
                        {
                            id: "duration",
                            label: "Duration",
                            value: "Mar 2022 - Aug 2022",
                            type: "text",
                        },
                        {
                            id: "link",
                            label: "Project Link",
                            value: "https://github.com/alexmorgan/ecommerce-platform",
                            type: "url",
                        },
                    ],
                },
                {
                    fields: [
                        {
                            id: "name",
                            label: "Project Name",
                            value: "Task Management App",
                            type: "text",
                        },
                        {
                            id: "description",
                            label: "Description",
                            value:
                                "Developed a collaborative task management application with real-time updates and team workspaces.",
                            type: "markdown",
                        },
                        {
                            id: "technologies",
                            label: "Technologies",
                            value: "Vue.js, Firebase, Tailwind CSS",
                            type: "text",
                        },
                        {
                            id: "duration",
                            label: "Duration",
                            value: "Oct 2021 - Jan 2022",
                            type: "text",
                        },
                        {
                            id: "link",
                            label: "Project Link",
                            value: "https://github.com/alexmorgan/task-manager",
                            type: "url",
                        },
                    ],
                },
            ],
            fields: [],
        },
    ]);
    const [resumeData, setResumeData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(null);
    const resumeRef = useRef(null);

    const transformResumeResponse = (data) => {
        if (!data || !data.sections) return [];

        // The sections are already in the correct format, just return them
        return data.sections.map(section => {
            // Ensure all fields have the required properties
            if (section.fields) {
                section.fields = section.fields.map(field => ({
                    ...field,
                    label: field.label || field.id.charAt(0).toUpperCase() + field.id.slice(1),
                    type: field.type || "text"
                }));
            }

            // Handle multi-entry sections (like experience and projects)
            if (section.entries) {
                section.entries = section.entries.map(entry => ({
                    ...entry,
                    fields: entry.fields.map(field => ({
                        ...field,
                        label: field.label || field.id.charAt(0).toUpperCase() + field.id.slice(1),
                        type: field.type || "text"
                    }))
                }));
            }

            return section;
        });
    };

    useEffect(() => {
        const token = Cookies.get("token");
        const queryParams = new URLSearchParams(location.search);
        const jobId = queryParams.get("job");
        const isBookmarked = queryParams.get("type") === "bookmarked";
        const encodedDescription = queryParams.get("description");


        const fetchData = async () => {
            try {
                setIsLoading(true);
                const token = Cookies.get("token");

                let url = "https://api.jobsforce.ai/api/generateresume";
                let requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `${token}`, // Make sure to use Bearer format
                    }
                };

                // If it's a bookmarked job with description
                if (isBookmarked && encodedDescription) {
                    const decodedDescription = decodeURIComponent(encodedDescription);
                    requestOptions.body = JSON.stringify({
                        job_description: decodedDescription
                    });
                }
                // If it's a regular job with job ID
                else if (jobId) {
                    url = `${url}?job=${jobId}`;
                }
                // Default: fetch primary resume if no job ID or description
                else {
                    url = "https://api.jobsforce.ai/api/getprimaryresume";
                    requestOptions.method = "GET";
                }

                const response = await fetch(url, requestOptions);

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Failed to fetch data");
                }

                const data = await response.json();
                console.log("API Response:", data);

                const formattedSections = transformResumeResponse(data);
                setSections(formattedSections);
                setResumeData(data);

            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error(error.message || "Failed to generate resume");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const addNewSection = () => {
        const newSection = {
            id: `section-${Date.now()}`,
            title: "New Section",
            icon: "📝",
            fields: [
                {
                    id: `field-${Date.now()}`,
                    label: "New Field",
                    value: "",
                    type: "text",
                },
            ],
        };
        setSections([...sections, newSection]);
    };

    const addField = (sectionId, entryIndex = null) => {
        const newField = {
            id: `field-${Date.now()}`,
            label: "New Field",
            value: "",
            type: "text",
            isCustomLabel: true,
        };

        setSections((prevSections) => {
            const newSections = [...prevSections];
            const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

            if (sectionIndex !== -1) {
                if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                    newSections[sectionIndex].entries[entryIndex].fields.push(newField);
                } else {
                    newSections[sectionIndex].fields.push(newField);
                }
            }

            return newSections;
        });
    };

    const updateSectionTitle = (sectionId, newTitle) => {
        setSections((prevSections) =>
            prevSections.map((section) =>
                section.id === sectionId ? { ...section, title: newTitle } : section
            )
        );
    };

    const addNewEntry = (sectionId) => {
        setSections((prevSections) => {
            const newSections = [...prevSections];
            const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

            if (sectionIndex !== -1 && newSections[sectionIndex].isMulti) {
                const timestamp = Date.now();
                const newEntry = {
                    fields: newSections[sectionIndex].entries[0].fields.map((field) => ({
                        ...field,
                        id: `field-${timestamp}-${field.id}`,
                        value: getDefaultValue(field.id),
                    })),
                };
                newSections[sectionIndex].entries.push(newEntry);
            }

            return newSections;
        });
    };

    const getDefaultValue = (fieldId) => {
        switch (fieldId) {
            case "title":
                return "New Position";
            case "company":
                return "Company Name";
            case "location":
                return "Location";
            case "duration":
                return "Start - End Date";
            default:
                return "";
        }
    };

    const deleteSection = (sectionId) => {
        setSections((prevSections) =>
            prevSections.filter((section) => section.id !== sectionId)
        );
    };

    const deleteEntry = (sectionId, entryIndex) => {
        setSections((prevSections) => {
            const newSections = [...prevSections];
            const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

            if (sectionIndex !== -1 && newSections[sectionIndex].entries.length > 1) {
                newSections[sectionIndex].entries.splice(entryIndex, 1);
            }

            return newSections;
        });
    };

    const updateFieldValue = (sectionId, fieldId, value, entryIndex = null) => {
        setSections((prevSections) => {
            const newSections = [...prevSections];
            const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

            if (sectionIndex !== -1) {
                if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                    const fieldIndex = newSections[sectionIndex].entries[entryIndex].fields.findIndex(
                        (f) => f.id === fieldId
                    );
                    if (fieldIndex !== -1) {
                        newSections[sectionIndex].entries[entryIndex].fields[fieldIndex].value = value;
                    }
                } else {
                    const fieldIndex = newSections[sectionIndex].fields.findIndex(
                        (f) => f.id === fieldId
                    );
                    if (fieldIndex !== -1) {
                        newSections[sectionIndex].fields[fieldIndex].value = value;
                    }
                }
            }

            return newSections;
        });
    };

    const updateFieldLabel = (
        sectionId,
        fieldId,
        newLabel,
        entryIndex = null
    ) => {
        setSections((prevSections) => {
            const newSections = [...prevSections];
            const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

            if (sectionIndex !== -1) {
                if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                    const fieldIndex = newSections[sectionIndex].entries[
                        entryIndex
                    ].fields.findIndex((f) => f.id === fieldId);
                    if (fieldIndex !== -1) {
                        newSections[sectionIndex].entries[entryIndex].fields[
                            fieldIndex
                        ].label = newLabel;
                    }
                } else {
                    const fieldIndex = newSections[sectionIndex].fields.findIndex(
                        (f) => f.id === fieldId
                    );
                    if (fieldIndex !== -1) {
                        newSections[sectionIndex].fields[fieldIndex].label = newLabel;
                    }
                }
            }

            return newSections;
        });
    };

    const updateFieldType = (sectionId, fieldId, newType, entryIndex = null) => {
        setSections((prevSections) => {
            const newSections = [...prevSections];
            const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

            if (sectionIndex !== -1) {
                if (entryIndex !== null && newSections[sectionIndex].isMulti) {
                    const fieldIndex = newSections[sectionIndex].entries[
                        entryIndex
                    ].fields.findIndex((f) => f.id === fieldId);
                    if (fieldIndex !== -1) {
                        newSections[sectionIndex].entries[entryIndex].fields[
                            fieldIndex
                        ].type = newType;
                    }
                } else {
                    const fieldIndex = newSections[sectionIndex].fields.findIndex(
                        (f) => f.id === fieldId
                    );
                    if (fieldIndex !== -1) {
                        newSections[sectionIndex].fields[fieldIndex].type = newType;
                    }
                }
            }

            return newSections;
        });
    };

    const moveSection = (dragIndex, hoverIndex) => {
        setSections((prevSections) => {
            const newSections = [...prevSections];
            const [draggedSection] = newSections.splice(dragIndex, 1);
            newSections.splice(hoverIndex, 0, draggedSection);
            return newSections;
        });
    };

    const downloadPDF = async () => {
        try {
            const blob = await pdf(<ResumePDF sections={sections} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    const renderFormattedText = (text) => {
        if (!text) return null;
        return text.split("\n").map((line, index) => (
            <p key={index} style={{ marginBottom: "5px" }}>
                {line}
            </p>
        ));
    };
    return (
        <DndProvider backend={HTML5Backend}>
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white pt-24">
                <header className="bg-yellow-400 shadow-md py-6">
                    <div className="container mx-auto px-1">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                                <FileText className="inline-block" />
                                Professional Resume Builder
                            </h1>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-1 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                        {/* Editor Panel */}
                        <div className="lg:col-span-3 space-y-6 top-4 h-screen overflow-y-auto">
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-xl font-semibold text-gray-400 flex items-center gap-2">
                                            <Settings className="inline-block" />
                                            Editor
                                        </CardTitle>
                                        <Button
                                            onClick={addNewSection}
                                            className="bg-yellow-400 hover:bg-yellow-300 text-white"
                                        >
                                            <Plus size={16} className="mr-2" />
                                            Add Section
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="space-y-4">
                                        {sections.map((section, index) => (
                                            section.id === "personal-info" ? (
                                                <div key={section.id} className="group">
                                                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-2 bg-yellow-50 cursor-pointer group-hover:bg-yellow-100 transition-colors rounded-md"
                                                        onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}>
                                                        {/* Left: Only icon, no drag handle */}
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{section.icon}</span>
                                                        </div>

                                                        {/* Center: Section title */}
                                                        <div className="flex justify-center px-2">
                                                            <Input
                                                                type="text"
                                                                value={section.title}
                                                                onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                                                className="h-7 text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-2 focus:ring-yellow-400 text-center max-w-[200px]"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        </div>

                                                        {/* Right: Expand/collapse only, no delete */}
                                                        <div className="flex items-center gap-1">
                                                            {activeSection === section.id ? (
                                                                <ChevronUp size={16} className="text-gray-500" />
                                                            ) : (
                                                                <ChevronDown size={16} className="text-gray-500" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {activeSection === section.id && (
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: "auto" }}
                                                                exit={{ height: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="p-4 space-y-4 bg-white">
                                                                    {section.isMulti ? (
                                                                        <div className="space-y-6">
                                                                            {section.entries.map(
                                                                                (entry, entryIndex) => (
                                                                                    <Card
                                                                                        key={entryIndex}
                                                                                        className="border rounded-lg p-4"
                                                                                    >
                                                                                        <div className="flex justify-between items-center mb-4">
                                                                                            <h4 className="font-medium text-gray-700">
                                                                                                {section.title} #
                                                                                                {entryIndex + 1}
                                                                                            </h4>
                                                                                            {section.entries.length > 1 && (
                                                                                                <Button
                                                                                                    variant="ghost"
                                                                                                    size="icon"
                                                                                                    onClick={() =>
                                                                                                        deleteEntry(
                                                                                                            section.id,
                                                                                                            entryIndex
                                                                                                        )
                                                                                                    }
                                                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                                                                                >
                                                                                                    <Trash2 size={16} />
                                                                                                </Button>
                                                                                            )}
                                                                                        </div>
                                                                                        {entry.fields.map((field) => (
                                                                                            <div
                                                                                                key={field.id}
                                                                                                className="mb-4"
                                                                                            >
                                                                                                <FieldEditor
                                                                                                    field={field}
                                                                                                    onChange={(value) =>
                                                                                                        updateFieldValue(
                                                                                                            section.id,
                                                                                                            field.id,
                                                                                                            value,
                                                                                                            entryIndex
                                                                                                        )
                                                                                                    }
                                                                                                    onLabelChange={(label) =>
                                                                                                        updateFieldLabel(
                                                                                                            section.id,
                                                                                                            field.id,
                                                                                                            label,
                                                                                                            entryIndex
                                                                                                        )
                                                                                                    }
                                                                                                    onTypeChange={(type) =>
                                                                                                        updateFieldType(
                                                                                                            section.id,
                                                                                                            field.id,
                                                                                                            type,
                                                                                                            entryIndex
                                                                                                        )
                                                                                                    }
                                                                                                />
                                                                                            </div>
                                                                                        ))}
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            onClick={() =>
                                                                                                addField(section.id, entryIndex)
                                                                                            }
                                                                                            className="w-full py-2 border-2 border-dashed border-yellow-300 text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 transition-colors mt-4"
                                                                                        >
                                                                                            + Add Field
                                                                                        </Button>
                                                                                    </Card>
                                                                                )
                                                                            )}
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => addNewEntry(section.id)}
                                                                                className="w-full py-2 border-2 border-dashed border-yellow-300 text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 transition-colors"
                                                                            >
                                                                                + Add Another {section.title}
                                                                            </Button>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="space-y-4">
                                                                            {section.fields.map((field) => (
                                                                                <FieldEditor
                                                                                    key={field.id}
                                                                                    field={field}
                                                                                    onChange={(value) =>
                                                                                        updateFieldValue(
                                                                                            section.id,
                                                                                            field.id,
                                                                                            value
                                                                                        )
                                                                                    }
                                                                                    onLabelChange={(label) =>
                                                                                        updateFieldLabel(
                                                                                            section.id,
                                                                                            field.id,
                                                                                            label
                                                                                        )
                                                                                    }
                                                                                    onTypeChange={(type) =>
                                                                                        updateFieldType(
                                                                                            section.id,
                                                                                            field.id,
                                                                                            type
                                                                                        )
                                                                                    }
                                                                                />
                                                                            ))}
                                                                            <Button
                                                                                variant="outline"
                                                                                onClick={() => addField(section.id)}
                                                                                className="w-full py-2 border-2 border-dashed border-yellow-300 text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 transition-colors"
                                                                            >
                                                                                + Add Field
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ) : (
                                                <DraggableSection
                                                    key={section.id}
                                                    id={section.id}
                                                    index={index}
                                                    moveSection={moveSection}
                                                >
                                                    <div className="group">
                                                        <div
                                                            className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-2 bg-yellow-50 cursor-pointer group-hover:bg-yellow-100 transition-colors rounded-md"
                                                            onClick={() =>
                                                                setActiveSection(
                                                                    activeSection === section.id ? null : section.id
                                                                )
                                                            }
                                                        >
                                                            {/* Left: Drag handle and icon */}
                                                            <div className="flex items-center gap-2">
                                                                <GripVertical
                                                                    className="text-yellow-400"
                                                                    size={16}
                                                                />
                                                                <span className="text-xl">{section.icon}</span>
                                                            </div>

                                                            {/* Center: Section title */}
                                                            <div className="flex justify-center px-2">
                                                                <Input
                                                                    type="text"
                                                                    value={section.title}
                                                                    onChange={(e) =>
                                                                        updateSectionTitle(section.id, e.target.value)
                                                                    }
                                                                    className="h-7 text-sm font-medium text-gray-700 bg-transparent border-none focus:ring-2 focus:ring-yellow-400 text-center max-w-[200px]"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                />
                                                            </div>

                                                            {/* Right: Action buttons */}
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        deleteSection(section.id);
                                                                    }}
                                                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 h-7 w-7"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </Button>
                                                                {activeSection === section.id ? (
                                                                    <ChevronUp
                                                                        size={16}
                                                                        className="text-gray-500"
                                                                    />
                                                                ) : (
                                                                    <ChevronDown
                                                                        size={16}
                                                                        className="text-gray-500"
                                                                    />
                                                                )}
                                                            </div>
                                                        </div>

                                                        <AnimatePresence>
                                                            {activeSection === section.id && (
                                                                <motion.div
                                                                    initial={{ height: 0 }}
                                                                    animate={{ height: "auto" }}
                                                                    exit={{ height: 0 }}
                                                                    className="overflow-hidden"
                                                                >
                                                                    <div className="p-4 space-y-4 bg-white">
                                                                        {section.isMulti ? (
                                                                            <div className="space-y-6">
                                                                                {section.entries.map(
                                                                                    (entry, entryIndex) => (
                                                                                        <Card
                                                                                            key={entryIndex}
                                                                                            className="border rounded-lg p-4"
                                                                                        >
                                                                                            <div className="flex justify-between items-center mb-4">
                                                                                                <h4 className="font-medium text-gray-700">
                                                                                                    {section.title} #
                                                                                                    {entryIndex + 1}
                                                                                                </h4>
                                                                                                {section.entries.length > 1 && (
                                                                                                    <Button
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        onClick={() =>
                                                                                                            deleteEntry(
                                                                                                                section.id,
                                                                                                                entryIndex
                                                                                                            )
                                                                                                        }
                                                                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                                                                                                    >
                                                                                                        <Trash2 size={16} />
                                                                                                    </Button>
                                                                                                )}
                                                                                            </div>
                                                                                            {entry.fields.map((field) => (
                                                                                                <div
                                                                                                    key={field.id}
                                                                                                    className="mb-4"
                                                                                                >
                                                                                                    <FieldEditor
                                                                                                        field={field}
                                                                                                        onChange={(value) =>
                                                                                                            updateFieldValue(
                                                                                                                section.id,
                                                                                                                field.id,
                                                                                                                value,
                                                                                                                entryIndex
                                                                                                            )
                                                                                                        }
                                                                                                        onLabelChange={(label) =>
                                                                                                            updateFieldLabel(
                                                                                                                section.id,
                                                                                                                field.id,
                                                                                                                label,
                                                                                                                entryIndex
                                                                                                            )
                                                                                                        }
                                                                                                        onTypeChange={(type) =>
                                                                                                            updateFieldType(
                                                                                                                section.id,
                                                                                                                field.id,
                                                                                                                type,
                                                                                                                entryIndex
                                                                                                            )
                                                                                                        }
                                                                                                    />
                                                                                                </div>
                                                                                            ))}
                                                                                            <Button
                                                                                                variant="outline"
                                                                                                onClick={() =>
                                                                                                    addField(section.id, entryIndex)
                                                                                                }
                                                                                                className="w-full py-2 border-2 border-dashed border-yellow-300 text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 transition-colors mt-4"
                                                                                            >
                                                                                                + Add Field
                                                                                            </Button>
                                                                                        </Card>
                                                                                    )
                                                                                )}
                                                                                <Button
                                                                                    variant="outline"
                                                                                    onClick={() => addNewEntry(section.id)}
                                                                                    className="w-full py-2 border-2 border-dashed border-yellow-300 text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 transition-colors"
                                                                                >
                                                                                    + Add Another {section.title}
                                                                                </Button>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="space-y-4">
                                                                                {section.fields.map((field) => (
                                                                                    <FieldEditor
                                                                                        key={field.id}
                                                                                        field={field}
                                                                                        onChange={(value) =>
                                                                                            updateFieldValue(
                                                                                                section.id,
                                                                                                field.id,
                                                                                                value
                                                                                            )
                                                                                        }
                                                                                        onLabelChange={(label) =>
                                                                                            updateFieldLabel(
                                                                                                section.id,
                                                                                                field.id,
                                                                                                label
                                                                                            )
                                                                                        }
                                                                                        onTypeChange={(type) =>
                                                                                            updateFieldType(
                                                                                                section.id,
                                                                                                field.id,
                                                                                                type
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                ))}
                                                                                <Button
                                                                                    variant="outline"
                                                                                    onClick={() => addField(section.id)}
                                                                                    className="w-full py-2 border-2 border-dashed border-yellow-300 text-yellow-600 hover:border-yellow-400 hover:text-yellow-700 transition-colors"
                                                                                >
                                                                                    + Add Field
                                                                                </Button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                </DraggableSection>
                                            )
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Preview Panel */}
                        <div className="lg:col-span-7 no-print">
                            <Card className="shadow-lg">
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle>Resume Preview</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <TemplateManager
                                        resumeData={resumeData}
                                        sections={sections}
                                        isLoading={isLoading}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                        {/* Hidden print-only version */}
                        <div className="hidden resume-for-print">
                            <TemplateManager
                                resumeData={resumeData}
                                sections={sections}
                                isLoading={false}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </DndProvider>
    );
};

export default ResumeEditpage;
