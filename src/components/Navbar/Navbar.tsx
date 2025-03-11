import React from 'react'
import { Wallet } from 'lucide-react';
import FlipText from '../ui/FlipText';
// import Button from '../ui/Button';
import * as motion from "motion/react-client"

const Navbar = () => (
    <motion.div
        className='w-2/3 h-16 fixed z-60 top-5 flex justify-between items-center rounded-2xl p-[1px] bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/50 to-transparent'
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className='w-full h-full flex justify-between items-center rounded-2xl bg-black px-6 py-4 text-main'>
            <img src={"/logo.png"} alt='logo' className='h-full' />
            <div className='flex gap-6'>
                <FlipText>Tools</FlipText>
                <FlipText>Resources</FlipText>
                <FlipText>Company</FlipText>
            </div>
            <div className='flex gap-4 justify-center items-center '>
                <Wallet />
                {/* <Button
            variant='solid'
            className='transition-all duration-1000 ease-in-out hover:scale-105'
        >
            Login
        </Button> */}
                {/* <Button variant='default'>
                    Log in
                </Button> */}
            </div>
        </div>
    </motion.div>
)

export default Navbar