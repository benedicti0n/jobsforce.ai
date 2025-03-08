import React from 'react'
import { useEffect } from "react";
import { animate } from "motion";
import { useMotionTemplate, useMotionValue } from "motion/react";
import * as motion from "motion/react-client";
import Navbar from "@/components/Navbar/Navbar";
import { useAtom } from "jotai";
import { darkModeAtom } from "@/store";

const COLORS = ["#e2a51e", "#c88117", "#a65e17"];

const Homepage = () => {
    const color = useMotionValue(COLORS[0]);
    const [isDark] = useAtom(darkModeAtom);

    const backgroundImage = useMotionTemplate`
    radial-gradient(120% 100% at 50% 20%, ${isDark ? "#000" : "#fff"} 50%, ${color} 100%)
  `;

    useEffect(() => {
        animate(color, COLORS, {
            ease: "easeInOut",
            duration: 20,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    return (
        <motion.div
            className="h-screen w-full flex justify-center items-center"
            style={{
                backgroundImage,
            }}
        >
            <Navbar />

            <div className='flex flex-col items-center justify-center'>
                <h1 className='text-5xl font-bold'>We will c🍳🧑‍🍳k up the</h1>
                <h1 className='text-7xl font-bold'>Perfect recipe for you</h1>
            </div>
        </motion.div>
    )
}

export default Homepage