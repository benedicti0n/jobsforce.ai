"use client";

import React from "react";
import Question from "./Question";
import AccentButton from "../ui/AccentButton";
import { faqs } from "./data";
import { motion } from "framer-motion";

const FAQ = () => {
    return (
        <div className="w-full bg-black py-20 relative -top-10 z-30">
            <div className="w-full flex flex-col items-center">
                <AccentButton>Frequently Asked Questions</AccentButton>
                <h1 className="text-4xl md:text-6xl 2xl:text-7xl text-main font-bold mt-3 md:mt-6 mb-6 md:mb-12 text-center flex md:flex-row flex-col md:gap-2">
                    <div>
                        Any{" "}
                        <span className="bg-gradient-to-r from-[#e4e4e4] via-[#efbf04] to-[#ff8c32] bg-clip-text text-transparent">
                            Questions?
                        </span>{" "}
                    </div>
                    <span>Look Here</span>
                </h1>
                <p className="font-regular text-secondary text-base  mb-16 md:w-1/2 px-4 md:px-0 text-center">
                    We’re here to help! Below are answers to some common questions about
                    how JobsForce.ai works and how it can assist you in streamlining your
                    job application process.
                </p>

                {/* FAQ Questions List with Animation */}
                <motion.div
                    className="md:w-2/3 w-full px-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }} // Trigger when 20% of it is visible
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.2 }, // Delay between each Question
                        },
                    }}
                >
                    {faqs.map((faq) => (
                        <motion.div
                            key={faq.key}
                            variants={{
                                hidden: { opacity: 0, y: -30 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                            }}
                        >
                            <Question question={faq.question} answer={faq.answer} />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
