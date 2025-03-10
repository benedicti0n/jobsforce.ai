import React, { ReactNode } from 'react'

interface IButton {
    variant: 'default' | 'outline' | 'ghost' | 'destructive',
    children: ReactNode,
}

const Button = ({ variant, children }: IButton) => {
    const variantStyles = {
        default: 'bg-gradient-to-b from-[#FFD700]/80 to-[#FFD700]/30 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 ease-in-out',
        outline: 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white',
        ghost: 'bg-transparent text-blue-500',
        destructive: 'bg-red-500 text-white',
    };

    const buttonClass = variantStyles[variant];

    return (
        <button className={buttonClass}>
            {children}
        </button>
    )
}

export default Button