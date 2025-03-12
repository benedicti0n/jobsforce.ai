import React from 'react'
import AccentButton from '../ui/AccentButton'
import ScrollSteps from '../ui/scroll-steps'

const ProcessPage = () => {
    return (
        <div className="w-full bg-black py-20 relative -top-10 z-30">
            <div className="w-full flex flex-col items-center">
                <AccentButton>Streamline Your Job Applying Process</AccentButton>
                <h1 className="text-4xl md:text-6xl 2xl:text-7xl text-main font-bold mt-3 md:mt-6 mb-6 md:mb-12 text-center flex md:flex-row flex-col md:gap-2">
                    Three Steps To{" "}
                    <span className="bg-gradient-to-r from-[#e4e4e4] via-[#efbf04] to-[#ff8c32] bg-clip-text text-transparent">
                        Success
                    </span>
                </h1>
                <p className="font-regular text-secondary text-base mb-16 md:w-1/2 px-4 md:px-0 text-center">
                    Experience a revolutionary job application process designed for the modern professional.
                </p>

                <ScrollSteps />

            </div>
        </div>
    )
}

export default ProcessPage