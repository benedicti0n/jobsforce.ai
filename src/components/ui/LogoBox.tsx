import React, { ReactNode } from 'react'
import * as motion from "motion/react-client"

interface ILogoBox {
    children: ReactNode,
    rotate: string;
    position: string;
}

const LogoBox = ({ children, rotate, position }: ILogoBox) => {
    return (
        <motion.div
            className={`p-0.5 bg-gradient-to-br from-[#EFBF04] via-[#EFBF04]/20 to-transparent rounded-xl ${rotate} relative ${position}`}
            animate={{ y: ["0%", "-10%", "0%"] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
        >
            <div className='md:p-4 p-3 bg-black rounded-lg'>
                {children}
            </div>
        </motion.div>
    )
}

export default LogoBox