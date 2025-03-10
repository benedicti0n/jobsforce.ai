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
            className={`p-1 bg-gradient-to-br from-[#EFBF04] via-[#EFBF04]/20 to-transparent rounded-xl ${rotate} relative ${position}`}
        >
            <div className='p-4 bg-black rounded-lg'>
                {children}
            </div>
        </motion.div>
    )
}

export default LogoBox