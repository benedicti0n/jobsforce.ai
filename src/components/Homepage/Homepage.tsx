import React from 'react'
import * as motion from "motion/react-client";
import Navbar from "@/components/Navbar/Navbar";
import { SparklesText } from '../ui/magicui/sparkles-text';
import { Particles } from '../ui/magicui/particles';
import { ShimmerButton } from '../ui/magicui/shimmer-button';
import { BriefcaseBusiness, Users } from 'lucide-react';
import { AvatarCircles } from '../ui/magicui/avatar-circles';
import LogoBox from '../ui/LogoBox';
import { avatars, rightLogos, leftLogos } from './data';

const Homepage = () => {
    return (
        <motion.div className="h-screen w-full flex justify-center items-center relative">
            <Navbar />

            <Particles
                className="absolute inset-0 z-30"
                quantity={100}
                ease={80}
                color={"#EFBF04"}
                refresh
            />

            <div className='w-2/3 flex flex-col items-center justify-center z-50 text-main relative'>
                <div className='h-full absolute left-0 space-y-20'>
                    {rightLogos.map((logo) => (
                        <LogoBox key={logo.key} rotate={logo.rotate} position={logo.position}>
                            {logo.logo}
                        </LogoBox>
                    ))}
                </div>
                <div className='h-full absolute right-0 space-y-20'>
                    {leftLogos.map((logo) => (
                        <LogoBox key={logo.key} rotate={logo.rotate} position={logo.position}>
                            {logo.logo}
                        </LogoBox>
                    ))}
                </div>

                <div className='flex gap-16 font-thin'>
                    <ShimmerButton
                        className='text-secondary gap-2'
                        shimmerColor='#EFBF04'
                        shimmerDuration='3s'
                        background='#000'
                    >
                        <Users className='w-5 stroke-1' />
                        900+ Job Seeker Helped
                    </ShimmerButton>

                    <ShimmerButton
                        className='text-secondary gap-2'
                        shimmerColor='#EFBF04'
                        shimmerDuration='3s'
                        background='#000'
                    >
                        <BriefcaseBusiness className='w-5 stroke-1' />
                        500k+ Jobs Applied
                    </ShimmerButton>
                </div>
                <div className='flex flex-col items-center justify-center mt-8'>
                    <h1 className='text-5xl font-regular'>We will c🍳🧑‍🍳k up the</h1>
                    <h1 className='text-7xl font-bold flex gap-4'>
                        <SparklesText text='Perfect recipe' className=' text-7xl' colors={{ first: "#FF8C32", second: "#EFBF04" }} sparklesCount={6} />
                        for you
                    </h1>
                </div>
                <div className='flex flex-col justify-center items-center gap-2 mt-10'>
                    <h1 className='text-xl font-regular text-main'>Loved By 100k+ People</h1>
                    <AvatarCircles numPeople={99} avatarUrls={avatars} />;
                </div>
            </div>

            {/* orange */}
            <div
                className="h-full w-full absolute bottom-0"
                style={{ background: "radial-gradient(150% 100% at 50% 20%, #000 50%, rgba(255, 255, 100, 1) 100%)" }}
            ></div>

            {/* yellow */}
            <div
                className="h-full w-full absolute bottom-0 z-10 mix-blend-overlay"
                style={{ background: "radial-gradient(120% 100% at 50% 10%, #000 50%, rgba(255, 140, 50, 1) 100%)" }}
            ></div>

            {/* white */}
            <div
                className="h-full w-full absolute bottom-0 z-20 mix-blend-overlay"
                style={{ background: "radial-gradient(90% 100% at 50% 20%, #000 50%, rgba(255, 255, 255, 1) 100%)" }}
            ></div>
        </motion.div>
    )
}

export default Homepage