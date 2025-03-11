"use client";

import React, { useState } from "react";
import { Menu, X, Newspaper, Wallet } from "lucide-react";
import FlipText from "../ui/FlipText";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="relative z-60">
            <motion.div
                className="w-2/3 h-16 fixed z-60 top-5 flex justify-between items-center rounded-2xl p-[2px] bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/50 to-transparent"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-full h-full flex justify-between items-center rounded-2xl bg-black px-6 py-4 text-main">
                    {/* Logo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={"/logo.png"} alt="logo" className="h-full" />

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6">
                        <NavItem title="Tools">
                            <DropdownMenu>
                                <DropdownItem icon={<Newspaper className="w-5" />} title="AI Resume Builder" />
                                <DropdownItem icon={<Newspaper className="w-5" />} title="Job Tracker" />
                                <DropdownItem icon={<Newspaper className="w-5" />} title="Cover Letter Generator" />
                            </DropdownMenu>
                        </NavItem>

                        <NavItem title="Resources">
                            <DropdownMenu>
                                <DropdownItem icon={<Newspaper className="w-5" />} title="Blog" />
                                <DropdownItem icon={<Newspaper className="w-5" />} title="Career Guides" />
                                <DropdownItem icon={<Newspaper className="w-5" />} title="Interview Prep" />
                            </DropdownMenu>
                        </NavItem>

                        <NavItem title="Company">
                            <DropdownMenu>
                                <DropdownItem icon={<Newspaper className="w-5" />} title="About Us" />
                                <DropdownItem icon={<Newspaper className="w-5" />} title="Careers" />
                                <DropdownItem icon={<Newspaper className="w-5" />} title="Contact" />
                            </DropdownMenu>
                        </NavItem>
                    </div>

                    {/* Wallet Icon */}
                    <div className="hidden md:flex gap-4 justify-center items-center">
                        <Wallet />
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-main focus:outline-none"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-20 left-0 w-full bg-black p-4 rounded-b-2xl md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            <NavItem title="Tools">
                                <DropdownMenu>
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="AI Resume Builder" />
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="Job Tracker" />
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="Cover Letter Generator" />
                                </DropdownMenu>
                            </NavItem>

                            <NavItem title="Resources">
                                <DropdownMenu>
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="Blog" />
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="Career Guides" />
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="Interview Prep" />
                                </DropdownMenu>
                            </NavItem>

                            <NavItem title="Company">
                                <DropdownMenu>
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="About Us" />
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="Careers" />
                                    <DropdownItem icon={<Newspaper className="w-5" />} title="Contact" />
                                </DropdownMenu>
                            </NavItem>

                            {/* Wallet Icon */}
                            <div className="flex justify-center">
                                <Wallet />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const NavItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative flex flex-col items-center w-full md:w-auto"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className="w-full text-center cursor-pointer">
                <FlipText>{title}</FlipText>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-1/2 -translate-x-1/2 top-11 bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/30 to-transparent rounded-xl text-main shadow-lg p-0.5 w-max"
                    >
                        <div className="h-full w-full bg-black rounded-xl">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex flex-col gap-2 p-2">{children}</div>;
};

const DropdownItem = ({ title, icon }: { title: string; icon: React.ReactNode }) => {
    return (
        <div className="px-2 py-2 hover:bg-white/15 hover:text-main rounded-md transition duration-200 cursor-pointer flex gap-2">
            {icon}
            {title}
        </div>
    );
};

export default Navbar;
