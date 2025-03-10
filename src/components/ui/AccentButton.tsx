import React, { ReactNode } from 'react'

interface IAccentButton {
    children: ReactNode
}

const AccentButton = ({ children }: IAccentButton) => {
    return (
        <div className='p-0.5 bg-gradient-to-br from-[#FF8C32] via-[#EFBF04]/50 to-transparent rounded-full'>
            <div className='text-secondary text-xs bg-black px-4 py-2 rounded-full'>
                {children}
            </div>
        </div>
    )
}

export default AccentButton