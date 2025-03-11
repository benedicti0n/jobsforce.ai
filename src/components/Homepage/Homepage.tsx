import React from 'react'
import * as motion from "motion/react-client";
import { SparklesText } from '../ui/magicui/sparkles-text';
import { Particles } from '../ui/magicui/particles';
import { ShimmerButton } from '../ui/magicui/shimmer-button';
import { BriefcaseBusiness, Users } from 'lucide-react';
import { AvatarCircles } from '../ui/magicui/avatar-circles';
import LogoBox from '../ui/LogoBox';
import { avatars, rightLogos, leftLogos } from './data';
import Upload from '../ui/Upload';

const Homepage = () => {
    return (
        <motion.div className="h-screen w-full flex justify-center items-center relative overflow-hidden">
            <Particles
                className="absolute inset-0 z-30"
                quantity={100}
                ease={80}
                color={"#EFBF04"}
                refresh
            />

            <div className='w-full md:w-4/5 2xl:w-2/3 px-4 md:px-0 flex flex-col items-center justify-center z-50 text-main relative mt-8 md:mt-16'>
                {/* Logo boxes - scaled down on mobile */}
                <div className='h-full absolute left-0 space-y-10 md:space-y-20 scale-75 md:scale-100 -translate-x-2 md:translate-x-0'>
                    {rightLogos.map((logo) => (
                        <LogoBox key={logo.key} rotate={logo.rotate} position={logo.position}>
                            {logo.logo}
                        </LogoBox>
                    ))}
                </div>
                <div className='h-full absolute right-0 space-y-10 md:space-y-20 scale-75 md:scale-100 translate-x-2 md:translate-x-0'>
                    {leftLogos.map((logo) => (
                        <LogoBox key={logo.key} rotate={logo.rotate} position={logo.position}>
                            {logo.logo}
                        </LogoBox>
                    ))}
                </div>

                {/* Shimmer buttons - keep horizontal layout */}
                <div className='flex gap-4 md:gap-16 font-regular w-full justify-center'>
                    <ShimmerButton
                        className='text-secondary gap-1 md:gap-2 text-xs md:text-base px-3 md:px-6 py-2 md:py-3'
                        shimmerColor='#EFBF04'
                        shimmerDuration='5s'
                        background='#000'
                    >
                        <Users className='w-3 md:w-5 stroke-2' />
                        <span className="whitespace-nowrap md:text-base text-xs">900+ Job Seeker Helped</span>
                    </ShimmerButton>

                    <ShimmerButton
                        className='text-secondary gap-1 md:gap-2 hidden md:flex text-xs md:text-base px-3 md:px-6 py-2 md:py-3'
                        shimmerColor='#EFBF04'
                        shimmerDuration='5s'
                        background='#000'
                    >
                        <BriefcaseBusiness className='w-3 md:w-5 stroke-2' />
                        <span className="whitespace-nowrap md:text-base text-[10px]">500k+ Jobs Applied</span>
                    </ShimmerButton>
                </div>

                {/* Main heading section */}
                <div className='flex flex-col items-center justify-center mt-3 md:mt-8 w-full p-3 md:p-6'>
                    <h1 className='text-xl md:text-4xl 2xl:text-5xl font-regular'>We will cook up the</h1>
                    <h1 className='text-4xl md:text-6xl 2xl:text-7xl font-bold flex flex-col md:flex-row flex-wrap justify-center md:gap-4 gap-1 text-center mt-2'>
                        <SparklesText
                            text='Perfect recipe'
                            className='text-4xl md:text-6xl 2xl:text-7xl'
                            colors={{ first: "#FF8C32", second: "#EFBF04" }}
                            sparklesCount={6}
                        />
                        <span>for you</span>
                    </h1>
                </div>

                {/* Avatar circles section */}
                <div className='flex flex-col justify-center items-center gap-1 md:gap-2 mt-4 md:mt-10'>
                    <h1 className='text-xs md:text-base 2xl:text-lg font-regular text-main'>Loved By 100k+ People</h1>
                    <div className="scale-75 md:scale-100">
                        <AvatarCircles numPeople={99} avatarUrls={avatars} />
                    </div>
                </div>

                {/* Upload component */}
                <motion.div
                    className="md:w-auto mt-4 md:mt-8"
                    animate={{ y: ["0%", "-3%", "0%"] }}
                    transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                >
                    <Upload />
                </motion.div>
            </div>

            {/* Background gradients */}
            <div
                className="h-full w-full absolute bottom-0"
                style={{ background: "radial-gradient(70% 30% at 50% 110%, rgba(255, 255, 100, 1) 5%, #000 120%)" }}
            ></div>

            <div
                className="h-full w-full absolute bottom-0 z-10 mix-blend-overlay"
                style={{ background: "radial-gradient(120% 50% at 50% 100%, rgba(255, 140, 50, 1) 30%, #000 100%)" }}
            ></div>

            <div
                className="h-full w-full absolute bottom-0 z-20 mix-blend-overlay"
                style={{ background: "radial-gradient(60% 80% at 50% 130%, rgba(255, 255, 255, 1) 30%, #000 100%)" }}
            ></div>
        </motion.div>
    )
}

export default Homepage