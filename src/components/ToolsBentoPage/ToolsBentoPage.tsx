"use client";

import React from "react";
import AccentButton from "../ui/AccentButton";
import ToolInBento from "../ui/ToolInBento";
import { Newspaper } from "lucide-react";
import { motion } from "framer-motion";

// Animation Variant for Drop-in Effect
const dropIn = {
    hidden: { opacity: 0, y: -50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            delay: i * 0.2, // Stagger delay for sequential effect
            ease: "easeOut",
        },
    }),
};

const ToolsBentoPage = () => {
    return (
        <div className="w-full bg-black rounded-t-4xl border-t-1 border-[#EFBF04] py-10 md:py-16 2xl:py-20 relative -top-10 md:-top-10 z-30">
            <div className="w-full flex flex-col items-center px-6 md:px-0">
                <AccentButton>All Tools at Your Fingertips</AccentButton>
                <h1 className="text-4xl md:text-6xl 2xl:text-7xl text-main font-bold mt-3 md:mt-6 mb-16 md:mb-16 text-center">
                    Explore Our{" "}
                    <span className="bg-gradient-to-r from-[#e4e4e4] via-[#efbf04] to-[#ff8c32] bg-clip-text text-transparent">
                        Tools
                    </span>
                </h1>

                {/* 🟢 GRID LAYOUT - Custom Row Structure with responsive changes */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 2xl:gap-8 w-full md:w-4/5 2xl:w-2/3">
                    {/* First Row */}
                    <motion.div
                        className="col-span-1 md:col-span-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={dropIn}
                        custom={0}
                    >
                        <ToolInBento
                            heading="AI Resume Builder"
                            description="AI generates resumes for each job application, based on your skills and experience."
                            demoVideoLink="/demo.mp4"
                            icon={<Newspaper className="text-main mb-2" />}
                        />
                    </motion.div>
                    <motion.div
                        className="col-span-1 md:col-span-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={dropIn}
                        custom={1}
                    >
                        <ToolInBento
                            heading="Job Application Tracker"
                            description="Track the progress of your job applications with automated updates."
                            demoVideoLink="/demo.mp4"
                            icon={<Newspaper className="text-main mb-2" />}
                        />
                    </motion.div>

                    {/* Second Row */}
                    <motion.div
                        className="col-span-1 md:col-span-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={dropIn}
                        custom={2}
                    >
                        <ToolInBento
                            heading="Interview Prep Assistant"
                            description="Prepare for interviews with personalized tips and mock interview simulations."
                            demoVideoLink="/demo.mp4"
                            icon={<Newspaper className="text-main mb-2" />}
                        />
                    </motion.div>
                    <motion.div
                        className="col-span-1 md:col-span-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={dropIn}
                        custom={3}
                    >
                        <ToolInBento
                            heading="Cover Letter Generator"
                            description="Generate tailored cover letters based on job descriptions and your experience."
                            demoVideoLink="/demo.mp4"
                            icon={<Newspaper className="text-main mb-2" />}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ToolsBentoPage;