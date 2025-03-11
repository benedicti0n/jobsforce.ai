import React from 'react';
import AccentButton from '../ui/AccentButton';
import ToolInBento from '../ui/ToolInBento';
import { Newspaper } from 'lucide-react';

const ToolsBentoPage = () => {
    return (
        <div className='min-h-screen w-full bg-black rounded-t-4xl border-t-1 border-[#EFBF04] px-32 py-20 relative -top-10 z-30'>
            <div className='w-full flex flex-col items-center'>
                <AccentButton>Streamline Your Job Applying Process</AccentButton>
                <h1 className='md:text-6xl text-main font-bold mt-6 mb-16'>
                    Explore Our <span className='bg-gradient-to-r from-[#e4e4e4] via-[#efbf04] to-[#ff8c32] bg-clip-text text-transparent'>Tools</span>
                </h1>

                {/* 🟢 GRID LAYOUT - Custom Row Structure */}
                <div className='grid grid-cols-5 gap-8 w-full'>
                    {/* First Row */}
                    <div className='col-span-3'>
                        <ToolInBento
                            heading='AI Resume Builder'
                            description='AI generates resumes for each job application, based on your skills and experience.'
                            demoVideoLink='/demo.mp4'
                            icon={<Newspaper className='text-main mb-2' />}
                        />
                    </div>
                    <div className='col-span-2'>
                        <ToolInBento
                            heading='Job Application Tracker'
                            description='Track the progress of your job applications with automated updates.'
                            demoVideoLink='/demo.mp4'
                            icon={<Newspaper />}
                        />
                    </div>

                    {/* Second Row */}
                    <div className='col-span-2'>
                        <ToolInBento
                            heading='Interview Prep Assistant'
                            description='Prepare for interviews with personalized tips and mock interview simulations.'
                            demoVideoLink='/demo.mp4'
                            icon={<Newspaper />}
                        />
                    </div>
                    <div className='col-span-3'>
                        <ToolInBento
                            heading='Cover Letter Generator'
                            description='Generate tailored cover letters based on job descriptions and your experience.'
                            demoVideoLink='/demo.mp4'
                            icon={<Newspaper />}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToolsBentoPage;
