import { Newspaper, Search, UserCheck, Briefcase, CreditCard, Info, Mail, ClipboardType, DollarSign } from "lucide-react";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface Logo {
    src: string;
    url: string;
    alt: string;
}

export const logo: Logo = {
    src: "/logo.png",
    url: "/",
    alt: "logo",
};

export const menu: MenuItem[] = [
    {
        title: "Tools",
        url: "#",
        items: [
            {
                title: "Resume Builder",
                description: "Create a professional resume with our easy-to-use tools.",
                icon: <Newspaper className="size-5 shrink-0" />,
                url: "/resume-edit",
            },
            {
                title: "Resume Matcher",
                description: "Find the best job matches based on your resume.",
                icon: <Search className="size-5 shrink-0" />,
                url: "/match-resume",
            },
            {
                title: "Mock Interview",
                description: "Prepare for interviews with AI-driven mock sessions.",
                icon: <UserCheck className="size-5 shrink-0" />,
                url: "/ai-interview",
            },
            {
                title: "Job Listings",
                description: "Explore job opportunities and apply directly.",
                icon: <Briefcase className="size-5 shrink-0" />,
                url: "/job-apply",
            },
        ],
    },
    {
        title: "Resources",
        url: "#",
        items: [
            {
                title: "Resume Templates",
                description: "Explore a variety of professionally designed resume templates.",
                icon: <Newspaper className="size-5 shrink-0" />,
                url: "/templates",
            },
            {
                title: "Job Matcher",
                description: "Find job opportunities that match your skills and preferences.",
                icon: <Search className="size-5 shrink-0" />,
                url: "/suggested-jobs",
            },
            {
                title: "Purchase Credits",
                description: "Buy credits to access premium features and services.",
                icon: <CreditCard className="size-5 shrink-0" />,
                url: "/buycredits",
            },
        ],
    },
    {
        title: "Company",
        url: "#",
        items: [
            {
                title: "About Us",
                description: "Learn more about our mission and values.",
                icon: <Info className="size-5 shrink-0" />,
                url: "/about-us",
            },
            {
                title: "Contact Us",
                description: "Get in touch with our support team for assistance.",
                icon: <Mail className="size-5 shrink-0" />,
                url: "/contactus",
            },
            {
                title: "Query Form",
                description: "Share your thoughts and suggestions with us.",
                icon: <ClipboardType className="size-5 shrink-0" />,
                url: "/query-form",
            },
            {
                title: "Earn Money",
                description: "Discover ways to earn money through our platform.",
                icon: <DollarSign className="size-5 shrink-0" />,
                url: "/earn-money",
            },
        ],
    },
]; 