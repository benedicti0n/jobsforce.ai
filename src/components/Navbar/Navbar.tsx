import React from 'react'
import { Wallet } from 'lucide-react';
import FlipText from '../ui/FlipText';
// import { Button } from '@radix-ui/themes';
import Button from '../ui/Button';
import * as motion from "motion/react-client"

const Navbar = () => (
    <motion.div
        className='w-2/3 fixed z-50 top-5 flex justify-between items-center rounded-3xl p-[1px] bg-gradient-to-br from-[#FFD700]/70 to-[#FFD700]/20'
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className='w-full h-full flex justify-between items-center rounded-[1.4rem] bg-black px-6 py-4 text-main'>
            <img src={"/logo.png"} alt='logo' className='w-10' />
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
                <Button variant='default'>
                    Log in
                </Button>
            </div>
        </div>
    </motion.div>
)

export default Navbar