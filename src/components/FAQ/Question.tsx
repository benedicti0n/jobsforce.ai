"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface QuestionProps {
    question: string;
    answer: string;
}

const Question = ({ question, answer }: QuestionProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <div className="w-full mb-6">
            {/* Question Header */}
            <button
                className="w-full flex justify-between items-center py-4 text-left text-main font-bold text-lg gap-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown size={20} />
                </motion.div>
            </button>
            {/* Answer Section with Framer Motion */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    mass: 1,
                    duration: 1
                }}
                className="overflow-hidden text-secondary font-regular text-base"
            >
                <p className="pb-4">{answer}</p>
            </motion.div>
            <span className="h-[1px] w-full rounded-full bg-gradient-to-r from-[#ff8c32] via-[#efbf04] to-transparent block"></span>
        </div>
    );
};

export default Question;