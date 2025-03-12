"use client"

import React from 'react';
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Check } from 'lucide-react';
import { steps } from '../ProcessPage/data';

const ScrollSteps = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInView, setIsInView] = useState(false);
    const [isScrollLocked, setIsScrollLocked] = useState(false);
    const scrollAccumulator = useRef(0);
    const lastScrollTime = useRef(Date.now());
    const controls = useAnimation();
    const indicatorControls = useAnimation();
    const SCROLL_THRESHOLD = 10;
    const SCROLL_COOLDOWN = 300; // ms between scroll events

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                const isFullyVisible = entry.intersectionRatio >= 0.5;
                setIsInView(isFullyVisible);

                if (isFullyVisible) {
                    setIsScrollLocked(true);
                    document.body.style.overflow = "hidden";
                    controls.start({ opacity: 1, y: 0 });
                } else {
                    setIsScrollLocked(false);
                    document.body.style.overflow = "";
                    scrollAccumulator.current = 0;
                }
            },
            { threshold: 1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
            document.body.style.overflow = "";
        };
    }, [controls]);

    const handleStepChange = (direction: "up" | "down") => {
        const now = Date.now();
        if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

        lastScrollTime.current = now;
        setScrollDirection(direction);

        if (direction === "down" && activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
            indicatorControls.start({ scale: [1, 1.2, 1], transition: { duration: 0.2 } });
        } else if (direction === "up" && activeStep > 0) {
            setActiveStep(prev => prev - 1);
            indicatorControls.start({ scale: [1, 1.2, 1], transition: { duration: 0.2 } });
        }

        setTimeout(() => {
            setScrollDirection(null);
        }, 500);
    };

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (!isInView || !isScrollLocked) return;

            e.preventDefault(); // Prevent default scrolling behavior

            // If at the first step and scrolling up, unlock page scroll
            if (activeStep === 0 && e.deltaY < 0) {
                setIsScrollLocked(false);
                document.body.style.overflow = "";
                return;
            }

            // If at the last step and scrolling down, unlock page scroll
            if (activeStep === steps.length - 1 && e.deltaY > 0) {
                setIsScrollLocked(false);
                document.body.style.overflow = "";
                return;
            }

            // Accumulate scroll movement
            scrollAccumulator.current += e.deltaY;

            if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
                const direction = scrollAccumulator.current > 0 ? "down" : "up";
                handleStepChange(direction);
                scrollAccumulator.current = 0; // Reset accumulator after a valid transition
            }
        };

        let touchStartY = 0;
        let touchAccumulator = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (!isInView || !isScrollLocked) return;
            touchStartY = e.touches[0].clientY;
            touchAccumulator = 0;
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isInView || !isScrollLocked) return;

            const touchY = e.touches[0].clientY;
            const diff = touchStartY - touchY;

            // If at the first step and swiping down, unlock page scroll
            if (activeStep === 0 && diff < 0) {
                setIsScrollLocked(false);
                document.body.style.overflow = "";
                return;
            }

            // If at the last step and swiping up, unlock page scroll
            if (activeStep === steps.length - 1 && diff > 0) {
                setIsScrollLocked(false);
                document.body.style.overflow = "";
                return;
            }

            e.preventDefault();
            touchAccumulator += diff;

            if (Math.abs(touchAccumulator) >= SCROLL_THRESHOLD) {
                const direction = touchAccumulator > 0 ? "down" : "up";
                handleStepChange(direction);
                touchAccumulator = 0;
                touchStartY = touchY; // Reset touch start position
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        window.addEventListener("touchstart", handleTouchStart, { passive: false });
        window.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
            document.body.style.overflow = "";
        };
    }, [isInView, isScrollLocked, activeStep]);


    return (
        <motion.div
            ref={containerRef}
            className="w-full md:w-2/3 px-6 md:px-0 flex flex-col items-center relative overflow-hidden bg-black"
            initial={{ opacity: 0, y: 50 }}
            animate={controls}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="w-full bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/30 to-transparent rounded-xl p-0.5">
                <div className='px-6 py-10 md:px-10 md:py-16 h-full bg-black rounded-xl'>
                    {/* Progress indicator */}
                    <motion.div
                        className="flex justify-center mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex md:flex-row flex-col gap-4">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center"
                                    animate={index === activeStep ? indicatorControls : {}}
                                >
                                    <div className={`flex items-center ${index < activeStep ? 'text-[#efbf04]' :
                                        index === activeStep ? 'text-main' : 'text-secondary'
                                        }`}>
                                        {index < activeStep ? (
                                            <Check className="w-6 h-6 mr-2" />
                                        ) : (
                                            <span className="font-regular mr-2">{index + 1}.</span>
                                        )}
                                        <span className={`text-sm font-medium ${index <= activeStep ? 'opacity-100' : 'opacity-50'
                                            }`}>
                                            {step.title}
                                        </span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`hidden md:flex w-8 h-px mx-2 ${index < activeStep ? 'bg-[#efbf04]' : 'bg-gray-300'
                                            }`} />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Main content */}
                    <div className="relative h-136 md:h-116">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, y: scrollDirection === "up" ? -50 : 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: scrollDirection === "up" ? 50 : -50 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                                    <motion.div
                                        className="flex flex-col justify-center"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.3 }}
                                    >
                                        <motion.div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center text-white mb-6 ${steps[activeStep].color}`}
                                            initial={{ scale: 0.8, rotate: -10 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        >
                                            {steps[activeStep].icon}
                                        </motion.div>
                                        <motion.h2
                                            className="text-2xl md:text-4xl text-main font-bold mb-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.3 }}
                                        >
                                            Step {activeStep + 1}: {steps[activeStep].title}
                                        </motion.h2>
                                        <motion.p
                                            className="text-base md:text-xl text-secondary font-regular"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: 0.3 }}
                                        >
                                            {steps[activeStep].description}
                                        </motion.p>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center justify-center"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                                    >
                                        <motion.div
                                            className={`w-full max-w-md aspect-square rounded-lg flex items-center justify-center text-white text-6xl font-bold ${steps[activeStep].color}`}
                                            initial={{ rotate: -5, scale: 0.9 }}
                                            animate={{ rotate: 0, scale: 1 }}
                                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                            whileHover={{ scale: 1.05, rotate: 2, transition: { duration: 0.3 } }}
                                        >
                                            {activeStep + 1}
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ScrollSteps