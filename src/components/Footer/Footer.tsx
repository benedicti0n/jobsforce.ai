import { BookOpen, Briefcase, ChartArea, Github, Home, LinkedinIcon, Mail, Newspaper, Twitter } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <div className='w-full h-full flex flex-col justify-between border-t-1 border-[#EFBF04] rounded-4xl px-6 md:px-32 py-20 md:py-12'>
            <div className='w-full flex md:flex-row flex-col justify-between space-y-10 md:space-y-0'>
                <div className='flex flex-col justify-between text-secondary md:w-1/4 gap-6 md:gap-0'>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="footer logo" className='w-32' />
                    <p>Transforming the job application process with AI-powered tools and automation.</p>
                    <div className='flex gap-2'><LinkedinIcon /> <Twitter /> <Mail /> <Github /></div>
                </div>

                <div className='flex flex-col justify-between space-y-4'>
                    <h1 className='font-bold text-main text-xl mb-6'>Main Pages</h1>
                    <h1 className='font-regular text-secondary flex gap-2'><Home /> Home</h1>
                    <h1 className='font-regular text-secondary flex gap-2'><Newspaper /> Make Resume</h1>
                    <h1 className='font-regular text-secondary flex gap-2'><BookOpen /> Match with JD</h1>
                    <h1 className='font-regular text-secondary flex gap-2'><Briefcase /> Jobs</h1>
                    <h1 className='font-regular text-secondary flex gap-2'><ChartArea />About Us</h1>
                </div>

                <div className='flex flex-col justify-between space-y-4'>
                    <h1 className='font-bold text-main text-xl mb-6'>Resources</h1>
                    <h1 className='font-regular text-secondary gap-2'>Resume History</h1>
                    <h1 className='font-regular text-secondary gap-2'>Resume Enhance</h1>
                    <h1 className='font-regular text-secondary gap-2'>Buy Credits</h1>
                    <h1 className='font-regular text-secondary gap-2'>Contact Us</h1>
                    <h1 className='font-regular text-secondary gap-2'>Demo</h1>
                </div>

                <div className='flex flex-col h-full'>
                    <h1 className='font-bold text-main'>Contact Us</h1>
                    <p>Have questions? Reach out to us</p>
                    <h1 className='font-regular text-secondary flex gap-2'><Mail />support@jobsforce.ai</h1>
                </div>
            </div>

            <span className="h-[1px] w-full rounded-full bg-gradient-to-r from-[#ff8c32] via-[#efbf04] to-transparent block my-12"></span>

            <div className='flex justify-between items-center md:flex-row flex-col gap-4 md:gap-0'>
                <h1 className='font-regular text-secondary'>© 2024 JobsForce. All rights reserved.</h1>
                <div className='font-regular text-secondary flex gap-6'>
                    <h1>Privacy Policy</h1>
                    <h1>Terms of Service</h1>
                </div>
            </div>
        </div>
    )
}

export default Footer