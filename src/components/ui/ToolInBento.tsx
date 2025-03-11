import React, { ReactNode } from 'react';

interface IToolInBento {
    heading: string;
    description: string;
    demoVideoLink: string;
    icon: ReactNode;
}

const ToolInBento = ({ heading, description, demoVideoLink, icon }: IToolInBento) => {
    return (
        <div className='bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/30 to-transparent rounded-xl overflow-hidden p-0.5 h-96'>
            <div className='h-full rounded-xl relative flex items-center justify-center overflow-hidden bg-black'>
                {/* Radial fade inner shadow */}
                <div className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{
                        boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 1)',
                        background: 'radial-gradient(circle, rgba(0,0,0,0) 30%, rgba(0,0,0,0.6) 100%)'
                    }}>
                </div>

                {/* Video inside the shadowed div */}
                <video src={demoVideoLink} autoPlay loop muted className='object-cover w-full h-full rounded-xl'></video>

                {/* Heading & Description */}
                <div className='p-5 absolute z-10 bottom-0 w-full'>
                    {icon}
                    <h2 className='text-xl font-medium text-main text-left mb-1'>{heading}</h2>
                    <p className='text-sm font-light text-secondary'>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default ToolInBento;
